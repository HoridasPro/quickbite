"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function AddressDropdown({ savedAddresses, selectedAddressId, onSelect }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">{t("selectSavedAddress")}</label>
      
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-full p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
          isDropdownOpen ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50/50" : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <MapPin size={18} />
          </div>
          <div>
            {selectedAddressId ? (
              (() => {
                const selected = savedAddresses.find((a) => a._id === selectedAddressId);
                return selected ? (
                  <>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      {selected.label}
                      {selected.isDefault && (
                        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">{t("defaultText")}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">
                      {selected.address}, {selected.city}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">{t("chooseAddress")}</p>
                );
              })()
            ) : (
              <p className="text-sm text-gray-500">{t("chooseAddress")}</p>
            )}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto p-2">
            {savedAddresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => {
                  onSelect(addr);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAddressId === addr._id ? "bg-orange-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">{t("defaultText")}</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">{addr.address}, {addr.city}</span>
                </div>
                {selectedAddressId === addr._id && (
                  <Check size={18} className="text-orange-500 shrink-0 ml-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}