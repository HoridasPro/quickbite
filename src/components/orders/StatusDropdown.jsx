"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

// Outer ring and inner dot colors
const getStatusStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-gray-500";
    case "Confirmed": return "bg-blue-500";
    case "Cooking": return "bg-yellow-500";
    case "On the way": return "bg-orange-500";
    case "Delivered": return "bg-green-500";
    case "Cancelled": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

// Pale background wrapper colors
const getStatusBgStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-gray-100";
    case "Confirmed": return "bg-blue-100";
    case "Cooking": return "bg-yellow-100";
    case "On the way": return "bg-orange-100";
    case "Delivered": return "bg-green-100";
    case "Cancelled": return "bg-red-100";
    default: return "bg-gray-100";
  }
};

export default function StatusDropdown({ currentStatus, orderId, onStatusChange, paymentStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableStatuses = paymentStatus === "Paid" 
    ? ["Pending", "Confirmed", "Cooking", "On the way", "Delivered", "Cancelled"]
    : ["Pending", "Cancelled"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full min-w-[170px]" ref={dropdownRef}>
      {/* The main button styled exactly like AddressDropdown */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50/50" : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mimics the bg-orange-100 rounded-full container from the address UI */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getStatusBgStyle(currentStatus)}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${getStatusStyle(currentStatus)}`}></div>
          </div>
          <span className="text-sm font-bold text-gray-900 truncate">
            {currentStatus}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-full min-w-[200px] origin-top-right bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-2 max-h-60 overflow-y-auto">
            
            {paymentStatus !== "Paid" && (
              <div className="px-2 py-1.5 mb-2 bg-red-50 text-[10px] uppercase font-bold text-red-600 tracking-wider text-center rounded-lg border border-red-100">
                Unpaid Order
              </div>
            )}

            {availableStatuses.map((status) => {
              const isActive = currentStatus === status;
              return (
                <div
                  key={status}
                  onClick={() => {
                    if (!isActive) onStatusChange(orderId, status);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusStyle(status)}`}></span>
                    <span className={`text-sm ${isActive ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                      {status}
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