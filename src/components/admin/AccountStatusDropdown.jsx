"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function AccountStatusDropdown({ currentStatus, userId, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Suspended": return "bg-yellow-500";
      case "Banned": return "bg-red-500";
      default: return "bg-green-500";
    }
  };

  const getStatusBgStyle = (status) => {
    switch (status) {
      case "Active": return "bg-green-100";
      case "Suspended": return "bg-yellow-100";
      case "Banned": return "bg-red-100";
      default: return "bg-green-100";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      Active: t("statusActive") || "Active",
      Suspended: t("statusSuspended") || "Suspended",
      Banned: t("statusBanned") || "Banned"
    };
    return labels[status] || status;
  };

  const availableStatuses = ["Active", "Suspended", "Banned"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeCurrentStatus = currentStatus || "Active";

  return (
    <div className="relative w-full min-w-[150px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50/50" : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getStatusBgStyle(safeCurrentStatus)}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${getStatusStyle(safeCurrentStatus)}`}></div>
          </div>
          <span className="text-sm font-bold text-gray-900 truncate">
            {getStatusLabel(safeCurrentStatus)}
          </span>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-full min-w-[180px] origin-top-right bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-2 max-h-60 overflow-y-auto">
            {availableStatuses.map((status) => {
              const isActive = safeCurrentStatus === status;
              return (
                <div
                  key={status}
                  onClick={() => {
                    if (!isActive) onStatusChange(userId, status);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusStyle(status)}`}></span>
                    <span className={`text-sm ${isActive ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                      {getStatusLabel(status)}
                    </span>
                  </div>
                  {isActive && <Check size={16} className="text-orange-500 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}