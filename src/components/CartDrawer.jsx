"use client";

import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartContent from "./CartContent";
import { useTranslation } from "@/hooks/useTranslation";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartCount } = useCart();
  const { t } = useTranslation();

  return (
    <>
      {/* Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />
      
      {/* Sliding Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-orange-500 w-6 h-6" />
            {t("yourCart")} ({cartCount})
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body & Footer */}
        <div className="flex-1 overflow-hidden">
          <CartContent onClose={onClose} isDrawer={true} />
        </div>
        
      </div>
    </>
  );
}