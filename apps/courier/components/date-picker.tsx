"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";

interface IProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label: string;
  min?: string;
  max?: string;
}

export const DatePicker = ({ value, onChange, label, min, max }: IProps) => {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <div className="flex-1">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 font-normal"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            {selected ? dayjs(selected).format("DD.MM.YYYY") : "—"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => {
              if (d) {
                onChange(dayjs(d).format("YYYY-MM-DD"));
                setOpen(false);
              }
            }}
            disabled={(date) => {
              if (min && dayjs(date).isBefore(dayjs(min), "day")) return true;
              if (max && dayjs(date).isAfter(dayjs(max), "day")) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
