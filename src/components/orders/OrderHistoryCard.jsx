"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function OrderHistoryCard({
  id,
  image,
  restaurant,
  items,
  date,
  status,
  price,
}) {
  const { t } = useTranslation();

  const getStatusStyle = () => {
    // Logic uses the raw English strings from the DB
    if (status === "Delivered") return "bg-green-100 text-green-600";
    if (status === "Cancelled") return "bg-red-100 text-red-600";
    if (status === "On the way") return "bg-orange-100 text-orange-600";
    if (status === "Ready for Pickup") return "bg-blue-100 text-blue-600";
    return "bg-gray-100 text-gray-600";
  };

  const getStatusLabel = (s) => {
    const labels = {
      "Pending": t("statusPending"),
      "Confirmed": t("statusConfirmed"),
      "Cooking": t("statusCooking"),
      "Ready for Pickup": t("statusReady"),
      "On the way": t("statusOnTheWay"),
      "Delivered": t("statusDelivered"),
      "Cancelled": t("statusCancelled")
    };
    return labels[s] || s;
  };

  return (
    <Link href={`/orders/${id}`} className="block">
      <div className="bg-white rounded-2xl p-5 flex gap-4 items-center border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-orange-200">
        <div className="w-20 h-20 shrink-0">
          <Image
            src={image || "https://via.placeholder.com/80"}
            alt={restaurant || "Restaurant"}
            width={80}
            height={80}
            className="w-full h-full rounded-xl object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base">{restaurant}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{items}</p>
          <p className="text-xs text-gray-400 mt-2">{date}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900 text-base">Tk {price}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full ${getStatusStyle()}`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      </div>
    </Link>
  );
}