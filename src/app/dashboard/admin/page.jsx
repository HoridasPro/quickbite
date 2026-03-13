"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <p>{t("loading")}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {t("welcomeAdmin")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">{t("totalUsers")}</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">{t("totalFoods")}</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalFoods}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">{t("totalOrders")}</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-gray-500 text-sm">{t("totalRevenue")}</h3>
          <p className="text-2xl font-bold mt-2">
            Tk {stats.totalRevenue}
          </p>
        </div>

      </div>
    </div>
  );
}