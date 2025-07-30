import { SearchIcon } from "@repo/ui/components/icons/index";
import { Input } from "@repo/ui/components/ui/input";
import { cn } from "@repo/ui/lib/utils";
import { useTranslations } from "next-intl";
import { InputHTMLAttributes } from "react";

export const SearchInput = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  const t = useTranslations("homepage.search");
  return (
    <Input
      type="text"
      placeholder={t("placeholder")}
      className={cn("bg-secondary pl-12 py-6 rounded-2xl border-0", className)}
      startIcon={SearchIcon}
      {...props}
    />
  );
};
