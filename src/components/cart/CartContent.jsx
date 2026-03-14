"use client";

import React from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function CartContent({ onClose, isDrawer = false }) {
  const { cartItems, removeFromCart } = useCart();
  const { t, language } = useTranslation();
  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const isBn = language === "bn";

  // EMPTY STATE
  if (cartItems.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center text-gray-500 space-y-4 py-10 ${isDrawer ? "h-full" : "h-64"}`}>
        <ShoppingBag className="w-20 h-20 text-gray-300" />
        <p className="text-lg font-medium">{t("cartEmpty")}</p>
        {isDrawer && onClose && (
          <button 
            onClick={onClose} 
            className="text-orange-500 font-bold hover:underline cursor-pointer"
          >
            {t("startBrowsing")}
          </button>
        )}
      </div>
    );
  }

  // POPULATED STATE
  return (
    <div className={`flex flex-col ${isDrawer ? "h-full w-full" : "w-full"}`}>
      {/* Items Section */}
      <div className={`bg-gray-50 ${isDrawer ? "flex-1 overflow-y-auto p-5" : "p-4"}`}>
        <div className="space-y-4">
          {cartItems.map((item) => {
            const displayTitle = isBn && item.titleBn ? item.titleBn : item.title;

            return (
              <div key={item.cartItemId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3 relative group">
                <div className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg h-fit text-sm">
                  {item.quantity}x
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 pr-6 leading-tight">{displayTitle}</h3>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)} 
                      className="absolute right-4 top-4 text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title={t("removeItem")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Render selected variations */}
                  <div className="mt-1">
                    {item.selectedVariations && Object.values(item.selectedVariations).map((variant, i) => {
                      if (Array.isArray(variant)) {
                        return variant.map((v, j) => {
                          const vName = isBn && v.nameBn ? v.nameBn : v.name;
                          return <p key={`${i}-${j}`} className="text-xs text-gray-500">+ {vName}</p>;
                        });
                      } else if (variant) {
                        const vName = isBn && variant.nameBn ? variant.nameBn : variant.name;
                        return <p key={i} className="text-xs text-gray-500">+ {vName}</p>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <div className="mt-3 font-extrabold text-orange-500">
                    Tk {item.totalPrice}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className={`bg-white border-t border-gray-100 ${isDrawer ? "p-5 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] shrink-0" : "p-4"}`}>
        <div className="flex justify-between items-center mb-4 text-lg font-extrabold text-gray-900">
          <span>{t("total")}</span>
          <span className="text-orange-600">Tk {totalAmount}</span>
        </div>
        <Link 
          href="/checkout" 
          onClick={onClose} 
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-orange-700 transition shadow-lg shadow-orange-200 cursor-pointer text-center"
        >
          {t("reviewPaymentCheckout")}
        </Link>
      </div>
    </div>
  );
}