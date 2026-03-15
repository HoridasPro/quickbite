"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Users, Pizza, ShoppingBag, DollarSign } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, prefix = "" }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const themes = {
    blue: { bg: "bg-blue-50", text: "text-blue-500", hover: "text-blue-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-500", hover: "text-orange-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", hover: "text-purple-600" },
    green: { bg: "bg-green-50", text: "text-green-500", hover: "text-green-600" },
  };

  const theme = themes[color];

  return (
    <div className="group bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 border border-gray-100 flex items-center gap-4 cursor-default">
      <div className={`w-14 h-14 rounded-full ${theme.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
        <Icon className={`w-7 h-7 ${theme.text}`} />
      </div>
      <div className="overflow-hidden">
        <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
        <div className="relative h-8 flex items-center">
          <p className="text-2xl font-black text-gray-900 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4">
            {prefix}{formatNumber(value)}
          </p>
          <p className={`absolute text-xl font-black ${theme.hover} opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap`}>
            {prefix}{value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {t("welcomeAdmin")}
        </h1>
        <p className="text-gray-500 mt-1">{t("adminDashboardSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label={t("totalUsers")}
          value={stats.totalUsers}
          color="blue"
        />
        <StatCard
          icon={Pizza}
          label={t("totalFoods")}
          value={stats.totalFoods}
          color="orange"
        />
        <StatCard
          icon={ShoppingBag}
          label={t("totalOrders")}
          value={stats.totalOrders}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          label={t("totalRevenue")}
          value={stats.totalRevenue}
          color="green"
          prefix="Tk "
        />
      </div>
    </div>
  );
}