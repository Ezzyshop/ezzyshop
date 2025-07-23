import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("messages.welcome")}</h1>
    </div>
  );
}
