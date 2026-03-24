"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomDropdown from "@/components/admin/CustomDropdown";
import VoucherCard from "@/components/vouchers/VoucherCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function VouchersPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  const { data, isLoading } = useQuery({
    queryKey: ["public-vouchers"],
    queryFn: async () => {
      const res = await fetch("/api/vouchers?type=public");
      if (!res.ok) throw new Error("Failed to fetch vouchers");
      return res.json();
    }
  });

  const vouchers = data?.vouchers || [];

  let displayedVouchers = vouchers.filter((v) => {
    if (activeTab === "All") return true;
    if (activeTab === "Restaurants") return v.applicableTo === "restaurant" || v.applicableTo === "all";
    if (activeTab === "Shops") return v.applicableTo === "shop" || v.applicableTo === "all";
    return true;
  });

  if (sortBy === "Lowest minimum order value") {
    displayedVouchers.sort((a, b) => (a.minOrderValue || 0) - (b.minOrderValue || 0));
  }

  const tabs = [
    { id: "All", label: t("tabAll") || "All" },
    { id: "Restaurants", label: t("tabRestaurants") || "Restaurants" },
    { id: "Shops", label: t("tabShops") || "Shops" }
  ];

  const sortOptions = [
    { id: "Default", label: t("defaultText") || "Default" },
    { id: "Lowest minimum order value", label: t("sortLowestMinOrder") || "Lowest minimum order value" }
  ];

  return (
    <div className="bg-[#ffffff] px-8 min-h-screen">
      <div className="max-w-6xl mx-auto pt-10 pb-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            {t("vouchersAndOffers") || "Vouchers & offers"}
          </h1>
        </div>

        <div className="flex gap-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-2">
          <div className="w-full md:w-64">
            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              placeholder={t("sortBy") || "Sort by"}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayedVouchers.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
            {t("noActiveVouchers") || "No active vouchers found."}
          </div>
        ) : (
          displayedVouchers.map((v) => (
            <VoucherCard key={v._id} voucher={v} />
          ))
        )}
      </div>
    </div>
  );
}