"use client";

import React from 'react';
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";

const CartActions = ({ quantity, setQuantity, onAdd }) => {
    const { t } = useTranslation();
    const { data: session } = useSession();

    // ENFORCEMENT: Check if the user is suspended/restricted
    const isRestricted = session?.user?.accountStatus && session.user.accountStatus !== "Active";

    return (
        <div className="flex gap-3 h-12">
            <div className={`flex items-center border rounded-lg w-28 md:w-32 justify-between px-1 ${isRestricted ? "border-gray-200 bg-gray-100 opacity-70" : "border-gray-300"}`}>
                <button 
                    disabled={isRestricted}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className={`w-8 md:w-10 h-full text-xl font-medium ${isRestricted ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-orange-500"}`}
                >
                    −
                </button>
                <span className={`font-bold ${isRestricted ? "text-gray-500" : "text-gray-900"}`}>{quantity}</span>
                <button 
                    disabled={isRestricted}
                    onClick={() => setQuantity(quantity + 1)} 
                    className={`w-8 md:w-10 h-full text-xl font-medium ${isRestricted ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-orange-500"}`}
                >
                    +
                </button>
            </div>

            <button 
                disabled={isRestricted}
                onClick={onAdd}
                className={`flex-1 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isRestricted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100"
                }`}
            >
                {isRestricted ? (t("accountRestricted") || "Account Restricted") : t("addToCart")}
            </button>
        </div>
    );
};

export default CartActions;