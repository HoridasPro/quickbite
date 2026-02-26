"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";``
import {
  MapPin,
  ShoppingCart,
  Search,
  Bike,
  Store,
  Menu,
  X,
} from "lucide-react";
import { MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
import Language from "./Language";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <div className="w-full bg-white shadow-sm">
      {/* Top Navbar */}
      <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="lg:hidden">
            <Menu
              onClick={() => setOpen(true)}
              className="w-6 h-6 text-gray-700 cursor-pointer"
            />
          </div>

          <Link
            href="/"
            className="text-orange-500 font-bold text-xl sm:text-2xl cursor-pointer"
          >
            🍔QuickBite
          </Link>
        </div>

        {/* Address - Desktop Only */}
        <div className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] truncate">
          <MapPin className="w-4 h-4" />
          <span className="truncate">
            New Address Road 71, Dhaka, Bangladesh
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {session ? (
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              // onMouseLeave={() => setOpen(false)}
            >
              
              {/* Profile Image */}
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full bg-gray-300 cursor-pointer border"
                />
              )}
            </div>
          ) : (
            <>
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
            </>
          )}

          <Language />

          <button
            disabled
            className="bg-gray-100 p-2 sm:p-3 rounded-full cursor-not-allowed opacity-50"
          >
            <ShoppingCart className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <div className="max-w-[1380px] mx-auto py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="hidden lg:flex items-center gap-8 text-gray-700 text-sm">
            <Link
              href="/"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition"
            >
              <MdOutlineDeliveryDining className="w-5 h-5" /> Delivery
            </Link>
            <Link
              href="/pick-up"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition"
            >
              <Bike className="w-5 h-5" /> Pick-up
            </Link>
            <Link
              href="/pandamart"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition"
            >
              <MdOutlineShoppingBag className="w-5 h-5" /> Pandamart
            </Link>
            <Link
              href="/shops"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition"
            >
              <Store className="w-5 h-5" /> Shops
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

      {/* Mobile Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-72 h-full bg-white shadow-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Menu</h2>
              <X
                onClick={() => setOpen(false)}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>New Address Road 71, Dhaka</span>
            </div>

            {/* Auth Buttons - Mobile */}
            <AuthButton isMobile={true} />

            {/* Register only if not logged in */}
            {status !== "authenticated" && (
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block mb-5 bg-orange-500 text-white text-center py-2 rounded-lg text-sm"
              >
                Sign up for free delivery
              </Link>
            )}

            {/* Menu Links */}
            <div className="flex flex-col gap-4 text-gray-700 text-sm border-t pt-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <MdOutlineDeliveryDining className="w-5 h-5" /> Delivery
              </Link>
              <Link
                href="/pick-up"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <Bike className="w-5 h-5" /> Pick-up
              </Link>
              <Link
                href="/pandamart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <MdOutlineShoppingBag className="w-5 h-5" /> Pandamart
              </Link>
              <Link
                href="/shops"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <Store className="w-5 h-5" /> Shops
              </Link>
            </div>

            {/* Language */}
            <div className="mt-6 border-t pt-4">
              <Language />
            </div>

            {status === "authenticated" && (
  <button
    onClick={() => signOut({ callbackUrl: "/" })}
    className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-2 rounded-md text-sm transition"
  >
    Logout
  </button>
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;