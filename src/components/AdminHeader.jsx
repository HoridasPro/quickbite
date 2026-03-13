"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function AdminHeader({ userName }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-orange-500">
        {t("adminDashboardTitle")}
      </h2>
      <p className="text-gray-500">
        {t("welcomePrefix")} {userName}
      </p>
    </div>
  );
}