"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { dictionaries } from "@/locales/dictionaries";

export function useTranslation() {
  const { language, mounted } = useLanguage();
  
  // Default to English during SSR to prevent hydration errors
  const activeLang = mounted ? language : "en";
  const dict = dictionaries[activeLang] || dictionaries.en;

  const t = (key) => {
    // Return the translated text, or the key itself if not found
    return dict[key] || key;
  };

  return { t, language, mounted };
}