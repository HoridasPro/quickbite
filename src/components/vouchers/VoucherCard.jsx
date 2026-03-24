"use client";

import { Ticket, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function VoucherCard({ voucher }) {
  const { t, language } = useTranslation();

  const formatDiscount = () => {
    if (language === "bn" && voucher.subtitleBn) return voucher.subtitleBn;
    if (voucher.subtitle) return voucher.subtitle;
    if (voucher.discountType === "percentage") return `${voucher.discountValue}% OFF`;
    if (voucher.discountType === "fixed") return `Tk ${voucher.discountValue} OFF`;
    if (voucher.discountType === "free_delivery") return t("typeFreeDelivery") || "Free Delivery";
    return "";
  };

  const formatExpiry = () => {
    if (!voucher.expiryDate) return "";
    const date = new Date(voucher.expiryDate);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const displayTitle = language === "bn" && voucher.titleBn ? voucher.titleBn : voucher.title;

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-4 overflow-hidden hover:shadow-md transition-shadow">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#ffffff] rounded-full border-r border-gray-200"></div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#ffffff] rounded-full border-l border-gray-200"></div>

      <div className="flex gap-3 pl-2">
        <div className="mt-0.5">
          <Ticket className="text-orange-500 w-6 h-6" />
        </div>

        <div className="flex-1 pr-2">
          <h3 className="text-[15px] font-bold text-gray-800 leading-tight">
            {displayTitle}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-sm">
            <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
              {formatDiscount()}
            </span>
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-mono text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded uppercase tracking-wider">
              {voucher.code}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-200 my-4"></div>

          <div className="flex items-center justify-between">
            <div className="text-[11px] bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 font-medium">
              {voucher.minOrderValue > 0 
                ? `Min. Tk ${voucher.minOrderValue}` 
                : "No min. order"} 
              {voucher.expiryDate && ` • Exp: ${formatExpiry()}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}