"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

const Language = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languageNames = {
    en: "English",
    bn: "বাংলা",
    hi: "हिन्दी",
    zh: "中文",
    ja: "日本語",
  };

  return (
    <div ref={dropdownRef} className="relative hidden md:block z-50">
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 px-3 py-2 rounded-xl transition"
      >
        <Globe className="w-4 h-4" />
        {languageNames[language] || "EN"}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border text-sm transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        {Object.entries(languageNames).map(([key, name], idx, arr) => (
          <div
            key={key}
            onClick={() => {
              setLanguage(key);
              setOpen(false);
            }}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
              idx === 0
                ? "rounded-t-lg"
                : idx === arr.length - 1
                  ? "rounded-b-lg"
                  : ""
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Language;
