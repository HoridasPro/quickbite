"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Language = () => {
  const [open, setOpen] = useState(false);
  const { language, changeLanguage, mounted } = useLanguage();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Avoid rendering mismatched language on server vs client
  if (!mounted) return <div className="w-16 h-8 hidden md:block"></div>;

  return (
    <div ref={dropdownRef} className="relative hidden md:block z-50">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 px-3 py-2 rounded-xl transition uppercase font-medium"
      >
        <Globe className="w-4 h-4" />
        {language}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-lg border text-sm transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        }`}
      >
        <div
          onClick={() => {
            changeLanguage("en");
            setOpen(false);
          }}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-lg ${language === "en" ? "font-bold text-orange-500" : "text-gray-700"}`}
        >
          English
        </div>
        <div
          onClick={() => {
            changeLanguage("bn");
            setOpen(false);
          }}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-b-lg ${language === "bn" ? "font-bold text-orange-500" : "text-gray-700"}`}
        >
          Bangla
        </div>
      </div>
    </div>
  );
};

export default Language;