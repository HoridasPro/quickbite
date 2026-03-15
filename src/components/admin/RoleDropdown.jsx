"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function RoleDropdown({ currentRole, userId, onRoleChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin": return "bg-orange-500";
      case "restaurant": return "bg-purple-500";
      case "rider": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleBgStyle = (role) => {
    switch (role) {
      case "admin": return "bg-orange-100";
      case "restaurant": return "bg-purple-100";
      case "rider": return "bg-blue-100";
      default: return "bg-gray-100";
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: t("roleAdmin") || "Admin",
      restaurant: t("roleRestaurant") || "Restaurant",
      rider: t("roleRider") || "Rider",
      user: t("roleUser") || "User"
    };
    return labels[role] || role;
  };

  const availableRoles = ["user", "admin", "restaurant", "rider"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeCurrentRole = currentRole || "user";

  return (
    <div className="relative w-full min-w-[150px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50/50" : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getRoleBgStyle(safeCurrentRole)}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${getRoleStyle(safeCurrentRole)}`}></div>
          </div>
          <span className="text-sm font-bold text-gray-900 truncate capitalize">
            {getRoleLabel(safeCurrentRole)}
          </span>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-full min-w-[180px] origin-top-right bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-2 max-h-60 overflow-y-auto">
            {availableRoles.map((role) => {
              const isActive = safeCurrentRole === role;
              return (
                <div
                  key={role}
                  onClick={() => {
                    if (!isActive) onRoleChange(userId, role);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getRoleStyle(role)}`}></span>
                    <span className={`text-sm capitalize ${isActive ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                      {getRoleLabel(role)}
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