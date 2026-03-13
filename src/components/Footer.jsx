"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
          <h3 className="text-white font-bold mb-4">{t("helpCenter")}</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                {t("faq")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("support")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("contactUs")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">{t("legal")}</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                {t("termsConditions")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("privacyPolicy")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">{t("followUs")}</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Facebook className="w-5 h-5 stroke-1.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Twitter className="w-5 h-5 stroke-1.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Instagram className="w-5 h-5 stroke-1.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Linkedin className="w-5 h-5 stroke-1.5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">{t("newsletter")}</h3>
          <p className="text-gray-400 mb-2">{t("subscribeNewsletter")}</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder={t("yourEmailPlaceholder")}
              className="px-3 py-2 rounded-md w-full text-gray-900"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md cursor-pointer">
              {t("subscribeBtn")}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} {t("allRightsReserved")}
      </div>
    </footer>
  );
}