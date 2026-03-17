"use client";

import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiInfo } from "react-icons/fi";
import { MapPin, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfileSection() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t } = useTranslation();

    // ENFORCEMENT: Check if the user is suspended
    const isRestricted = session?.user?.accountStatus && session.user.accountStatus !== "Active";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">{t("loadingProfile")}</div>;
    }

    return (
        <div className="bg-white pt-12 pb-20">
            <div className="max-w-[650px] mx-auto px-6">
                
                {/* ENFORCEMENT UI: Warning Banner */}
                {isRestricted && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded-xl flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm text-yellow-800 font-bold mb-1">
                                {t("accountRestricted")}
                            </p>
                            <p className="text-sm text-yellow-700">
                                {t("profileReadOnlyDesc")}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex py-5 items-center gap-3">
                    <h1 className="text-[28px] font-semibold text-gray-900">
                        {t("myProfile")}
                    </h1>
                    <FiInfo className="text-gray-400 text-lg" />
                </div>
                
                <div className="space-y-6">
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                            {t("firstNameLabel")}
                        </label>
                        <input
                            type="text"
                            disabled={isRestricted}
                            defaultValue={session?.user?.name?.split(" ")[0] || ""}
                            className="w-full h-[56px] border border-gray-300 rounded-xl px-4 text-gray-900 focus:outline-none focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                            {t("lastNameLabel")}
                        </label>
                        <input
                            type="text"
                            disabled={isRestricted}
                            defaultValue={session?.user?.name?.split(" ").slice(1).join(" ") || ""}
                            className="w-full h-[56px] font-thin border border-gray-300 rounded-xl px-4 text-gray-900 focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="">
                        <label className="">
                            <input
                                type="text"
                                disabled={isRestricted}
                                placeholder={t("mobileNumber")}
                                className="w-full h-[56px] border border-gray-300 rounded-xl px-4 text-gray-900 focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                            />
                        </label>
                    </div>

                    <button disabled={isRestricted} className={`px-6 py-2 rounded-md text-sm font-medium ${isRestricted ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        {t("saveBtn")}
                    </button>
                </div>

                <div className="border-t my-12"></div>

                <h2 className="text-[22px] font-semibold text-gray-900 mb-5">
                    {t("emailLabel")}
                </h2>

                <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                        {t("emailLabel")}
                    </label>
                    <input
                        type="text"
                        defaultValue={session?.user?.email || ""}
                        readOnly
                        className="w-full h-[56px] border border-gray-300 rounded-xl px-4 text-gray-500 bg-gray-50 focus:outline-none cursor-not-allowed"
                    />
                </div>

                <div className="mt-3">
                    <span className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full font-medium">
                        {t("verified")}
                    </span>
                </div>

                <div className="border-t my-12"></div>

                <h2 className="text-[22px] font-semibold text-gray-900 mb-5">
                    {t("passwordLabel")}
                </h2>

                <div className="space-y-5">
                    <input
                        type="password"
                        disabled={isRestricted}
                        placeholder={t("currentPassword")}
                        className="w-full h-[52px] border text-gray-900 border-gray-300 rounded-lg px-4 focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />

                    <input
                        type="password"
                        disabled={isRestricted}
                        placeholder={t("newPassword")}
                        className="w-full h-[52px] border text-gray-900 border-gray-300 rounded-lg px-4 focus:outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />

                    <button disabled={isRestricted} className={`px-6 py-2 rounded-md text-sm font-medium ${isRestricted ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-500"}`}>
                        {t("saveBtn")}
                    </button>
                </div>

                <div className="border-t my-12"></div>

                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[22px] font-semibold text-gray-900">
                        {t("deliveryAddressesHeader")}
                    </h2>
                    <Link href="/profile/addresses" className="text-orange-500 font-medium text-sm hover:underline">
                        {t("manage")}
                    </Link>
                </div>
                
                <Link href="/profile/addresses">
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition cursor-pointer">
                        <div className="bg-orange-100 p-2 rounded-full">
                            <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{t("viewEditAddresses")}</p>
                            <p className="text-sm text-gray-500">{t("makeCheckoutFaster")}</p>
                        </div>
                    </div>
                </Link>

                <div className="border-t my-12"></div>

                <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
                    {t("myPayments")}
                </h2>

                <p className="text-gray-500 text-[15px]">
                    {t("noSavedPayments")}
                </p>

                <div className="border-t my-12"></div>

                <h2 className="text-[22px] font-semibold text-gray-900 mb-6">
                    {t("connectedAccounts")}
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* ... Existing connected accounts UI (No changes needed here) ... */}
                    <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-3">
                            <FaFacebookF className="text-blue-600 text-lg" />
                            <span className="font-medium text-gray-800">Facebook</span>
                        </div>
                        <button disabled={isRestricted} className="text-black font-semibold text-sm disabled:text-gray-400">{t("connectBtn")}</button>
                    </div>

                    <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-3">
                            <FcGoogle className="text-lg" />
                            <span className="font-medium text-gray-800">Google</span>
                        </div>
                        <span className="text-gray-900 font-semibold text-sm">{t("connectedStatus")}</span>
                    </div>

                    <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-3">
                            <FaApple className="text-black text-lg" />
                            <span className="font-medium text-gray-800">Apple</span>
                        </div>
                        <button disabled={isRestricted} className="text-black font-semibold text-sm disabled:text-gray-400">{t("connectBtn")}</button>
                    </div>
                </div>

                <div className="border-t my-14"></div>

                <div>
                    <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
                        {t("accountManagement")}
                    </h2>
                    <p className="text-gray-600 max-w-md mb-5">
                        {t("deleteAccountDesc")}
                    </p>
                    <button 
                        disabled={isRestricted}
                        className={`border rounded-lg p-2 text-sm font-medium transition ${
                            isRestricted 
                                ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed" 
                                : "border-gray-500 text-gray-800 bg-white hover:bg-gray-50 cursor-pointer"
                        }`}
                    >
                        {t("deleteAccountBtn")}
                    </button>
                </div>
            </div>
        </div>
    );
}