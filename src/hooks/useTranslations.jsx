 

import { useLanguage } from "@/contexts/LanguageProvider";
import { useState, useEffect } from "react";
 

const useTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Correct: process.env.NEXT_PUBLIC_BASE_URL use korte hobe
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/translations?lang=${language}`,
        );
        const data = await res.json();
        setTranslations(data);
      } catch (err) {
        console.error("Failed to fetch translations", err);
      }
    };

    fetchTranslations();
  }, [language]);

  return translations;
};

export default useTranslations;
