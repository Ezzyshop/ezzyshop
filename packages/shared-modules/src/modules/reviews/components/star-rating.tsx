"use client";
import { Star } from "@repo/ui/components/icons/index";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const StarRating = ({ value, onChange, size = "md", readonly = false }: IProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn("transition-transform", !readonly && "hover:scale-110 active:scale-95")}
        >
          <Star
            className={cn(
              sizeMap[size],
              star <= value ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
};
