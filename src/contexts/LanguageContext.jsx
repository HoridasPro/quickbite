"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage on initial load
    const savedLang = localStorage.getItem("quickbite_lang") || "en";
    setLanguage(savedLang);
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("quickbite_lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}