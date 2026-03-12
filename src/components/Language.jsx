// "use client";

// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, Globe } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageProvider";
// // import { useLanguage } from "@/contexts/LanguageProvider";

// const Language = () => {
//   const { language, toggleLanguage } = useLanguage();
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const { language, setLanguage } = useLanguage();

//   // Load language from localStorage when component mounts
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const savedLang = localStorage.getItem("language");
//       if (savedLang && savedLang !== language) {
//         toggleLanguage(savedLang); // set context language from localStorage
//       }
//     }
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleChangeLanguage = (lang) => {
//     if (language !== lang) {
//       toggleLanguage(lang);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("language", lang); // save selection
//       }
//     }
//     setOpen(false);
//   };

//   return (
//     <div ref={dropdownRef} className="relative hidden md:block z-50">
//       {/* Button */}
//       <div
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 px-3 py-2 rounded-xl transition"
//       >
//         <Globe className="w-4 h-4" />
//         {language === "en" ? "EN" : "বাং"}
//         <ChevronDown
//           className={`w-4 h-4 transition-transform duration-300 ${
//             open ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {/* Dropdown */}
//       <div
//         className={`absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border text-sm transition-all duration-200 origin-top ${
//           open
//             ? "opacity-100 scale-100 visible"
//             : "opacity-0 scale-95 invisible"
//         }`}
//       >
//         <div
//           onClick={() => handleChangeLanguage("en")}
//           className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-lg"
//         >
//           English
//         </div>

//         <div
//           onClick={() => handleChangeLanguage("bn")}
//           className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-b-lg"
//         >
//           বাংলা
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Language;

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

const Language = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load language from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language");
      if (savedLang && savedLang !== language) {
        setLanguage(savedLang);
      }
    }
  }, [language, setLanguage]);

  // Close dropdown when clicking outside
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

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);

    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }

    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative hidden md:block z-50">
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 px-3 py-2 rounded-xl transition"
      >
        <Globe className="w-4 h-4" />
        {language === "en" ? "EN" : "বাং"}
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
        <div
          onClick={() => handleChangeLanguage("en")}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-lg"
        >
          English
        </div>

        <div
          onClick={() => handleChangeLanguage("bn")}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-b-lg"
        >
          বাংলা
        </div>
      </div>
    </div>
  );
};

export default Language;
