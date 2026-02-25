"use client";

import React, { useState } from "react";
import {
  MapPin,
  ShoppingCart,
  Search,
  Bike,
  Store,
  ShoppingBag,
  Menu,
} from "lucide-react";
import Language from "./Language";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext"; 
import CartDrawer from "./CartDrawer"; // ✅ Import the new drawer

const Header = () => {
  const { cartCount } = useCart(); 
  const [isCartOpen, setIsCartOpen] = useState(false); // ✅ State to manage drawer visibility

  return (
    <>
      <div className="w-full bg-white shadow-sm sticky top-0 z-40">
        {/* Top Navbar */}
        <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between px-4 xl:px-0">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-700 cursor-pointer" />
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="text-orange-500 font-bold text-2xl cursor-pointer"
            >
              🍔QuickBite
            </Link>
          </div>

          {/* Address - Hidden on small screens */}
          <div className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer">
            <MapPin className="w-4 h-4" />
            <span>New Address Road 71, Dhaka, Bangladesh</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="hidden md:block px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
            >
              Sign up for free delivery
            </Link>

            <Language />

            {/* ✅ Cart Button that triggers the Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gray-100 p-3 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-100 hidden md:block">
          <div className="max-w-[1380px] mx-auto py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0">
            <div className="flex items-center gap-8 text-gray-700 text-sm font-medium">
              <Link href="/" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition">
                <Bike className="w-5 h-5 text-orange-500" />
                Delivery
              </Link>
              <Link href="/pick-up" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition">
                <ShoppingBag className="w-5 h-5" />
                Pick-up
              </Link>
              <Link href="/vouchers" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition">
                <ShoppingBag className="w-5 h-5" />
                Vouchers
              </Link>
              <Link href="/pandamart" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition">
                <Store className="w-5 h-5" />
                Pandamart
              </Link>
              <Link href="/shops" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition">
                <Store className="w-5 h-5" />
                Shops
              </Link>
            </div>

            <div className="relative w-full lg:w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, and dishes"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ The Global Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;