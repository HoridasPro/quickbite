"use client";

import { CheckCircle2, ChefHat, Package, Bike, MapPin, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function OrderTracker({ status }) {
  const { t } = useTranslation();

  const stages = [
    { name: "Confirmed", label: t("statusConfirmed"), icon: CheckCircle2 },
    { name: "Cooking", label: t("statusCooking"), icon: ChefHat },
    { name: "Ready for Pickup", label: t("statusReady"), icon: Package },
    { name: "On the way", label: t("statusOnTheWay"), icon: Bike },
    { name: "Delivered", label: t("statusDelivered"), icon: MapPin },
  ];

  if (status === "Cancelled") {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center border border-red-100">
        <XCircle className="w-12 h-12 mb-2" />
        <h3 className="font-bold text-lg">{t("orderCancelledTitle")}</h3>
        <p className="text-sm text-red-500">{t("orderCancelledDesc")}</p>
      </div>
    );
  }

  const currentStageIndex = stages.findIndex((s) => s.name === status);
  const activeIndex = currentStageIndex === -1 && status !== "Pending" ? 4 : currentStageIndex;

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-orange-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: activeIndex >= 0 ? `${(activeIndex / (stages.length - 1)) * 100}%` : "0%" }}
        ></div>

        {stages.map((stage, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.name} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-300 border-4 shadow-sm
                  ${isCompleted ? "bg-orange-500 border-white text-white" : "bg-white border-gray-100 text-gray-300"}
                  ${isCurrent ? "ring-4 ring-orange-100 scale-110" : ""}
                `}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className={`absolute top-14 text-[10px] md:text-xs font-bold text-center w-20 md:w-24 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}