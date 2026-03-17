"use client";

import { ShieldAlert, ArrowLeft, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { signOut } from "next-auth/react";

export default function BannedPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-red-100 text-center max-w-lg w-full animate-in fade-in duration-500 zoom-in-95">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{t("accountBannedTitle")}</h1>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">{t("accountBannedDesc")}</p>
        <div className="flex flex-col gap-3">
          <a href="mailto:support@quickbite.com" className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-red-200/50 cursor-pointer">
            <Mail className="w-5 h-5" /> {t("contactSupportBtn")}
          </a>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3.5 rounded-xl font-bold transition-all cursor-pointer">
            <ArrowLeft className="w-5 h-5" /> {t("logout")} & {t("backToHomeBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}