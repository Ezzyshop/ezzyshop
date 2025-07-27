import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500">
        {t("messages.welcome")}
      </h1>
    </div>
  );
}
