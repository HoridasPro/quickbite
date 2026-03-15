"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
        
        {/* Big 404 Header */}
        <h1 className="text-8xl font-black text-orange-500 mb-2 drop-shadow-sm">
          {t("pageNotFoundTitle")}
        </h1>
        
        <div className="w-16 h-1 bg-orange-200 mx-auto rounded-full mb-6"></div>

        {/* Text content */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
          {t("pageNotFoundHeading")}
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {t("pageNotFoundDesc")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex flex-1 items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("goBackBtn")}
          </button>

          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-md shadow-orange-200/50 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            {t("goHomeBtn")}
          </Link>
        </div>
        
      </div>
    </div>
  );
}