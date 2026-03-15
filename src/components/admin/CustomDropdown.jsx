"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomDropdown({ value, onChange, options, placeholder = "Select an option", allowClear = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = options.find(o => o.id === value);
  const displayLabel = currentOption ? currentOption.label : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border rounded-xl bg-white cursor-pointer flex justify-between items-center transition-all ${
          isOpen ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={`text-sm ${currentOption ? "font-medium text-gray-900" : "text-gray-500"}`}>
          {displayLabel}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
          <div className="p-2">
            {allowClear && (
              <div
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                  !value ? "bg-orange-50" : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-sm ${!value ? "font-bold text-gray-900" : "font-medium text-gray-500"}`}>
                  {placeholder}
                </span>
                {!value && <Check size={16} className="text-orange-500 shrink-0" />}
              </div>
            )}

            {options.map((opt) => {
              const isActive = value === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm ${isActive ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                    {opt.label}
                  </span>
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