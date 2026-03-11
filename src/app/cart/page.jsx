"use client";

import React from "react";
import CartContent from "@/components/CartContent";

const CartPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f7] py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-extrabold text-gray-900">Your Cart</h1>
        </div>
        
        {/* Reusing your existing, fully functional Cart UI */}
        <CartContent isDrawer={false} />
      </div>
    </div>
  );
};

export default CartPage;