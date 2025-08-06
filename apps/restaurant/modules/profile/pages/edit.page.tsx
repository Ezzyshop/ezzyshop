"use client";

import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { ProfileForm } from "../components/profile-form";

export const ProfileEditPage = () => {
  const t = useTranslations("profile");

  return (
    <div>
      <PageHeader title={t("edit_profile")} />
      <div className="px-4">
        <ProfileForm />
      </div>
    </div>
  );
};
