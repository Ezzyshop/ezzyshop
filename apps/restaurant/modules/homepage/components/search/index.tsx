import { SearchIcon } from "@repo/ui/components/icons/index";
import { Input } from "@repo/ui/components/ui/input";
import { useTranslations } from "next-intl";

export const Search = () => {
  const t = useTranslations("homepage.search");
  return (
    <div className="flex items-center gap-2 px-4 relative">
      <Input
        type="text"
        placeholder={t("placeholder")}
        className="bg-secondary pl-8"
        startIcon={SearchIcon}
      />
    </div>
  );
};
