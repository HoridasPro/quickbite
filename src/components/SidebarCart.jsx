"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartContent from "./CartContent";

export default function SidebarCart() {
  const { cartCount } = useCart();

  return (
    <div className="w-full md:w-80 bg-white shadow-md rounded-xl sticky top-24 h-auto md:h-[calc(100vh-6rem)] flex flex-col overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="text-orange-500 w-6 h-6" />
          Your Cart ({cartCount})
        </h2>
      </div>

      {/* Body & Footer via CartContent */}
      <div className="flex-1 overflow-hidden relative">
        <CartContent />
      </div>
    </div>
  );
}