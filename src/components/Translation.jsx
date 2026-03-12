"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

const Translation = ({ tid }) => {
  const { language } = useLanguage();
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/translations?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setText(data[tid]);
      });
  }, [language, tid]);

  return text || tid;
};

export default Translation;
