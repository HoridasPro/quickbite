"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartContent from "./CartContent";
import { useTranslation } from "@/hooks/useTranslation";

export default function CartSideBar() {
  const { cartCount } = useCart();
  const { t } = useTranslation();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerElement = document.getElementById("main-header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    calculateHeaderHeight();
    window.addEventListener("resize", calculateHeaderHeight);

    return () => window.removeEventListener("resize", calculateHeaderHeight);
  }, []);

  return (
    <div 
      className="w-full bg-white shadow-md rounded-xl sticky flex flex-col overflow-hidden border border-gray-100 self-start"
      style={{
        top: `${headerHeight + 20}px`,
        maxHeight: `calc(100vh - ${headerHeight + 40}px)`,
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="text-orange-500 w-5 h-5" />
          {t("yourCart")} ({cartCount})
        </h2>
      </div>

      {/* Body & Footer via CartContent */}
      {/* Added scrollbar hiding classes to match your other sidebars */}
      <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <CartContent isDrawer={false} />
      </div>
    </div>
  );
}