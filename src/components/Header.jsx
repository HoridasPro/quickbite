"use client";

import { useSession, signOut } from "next-auth/react";
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
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-white shadow-sm">
      {/* Top Navbar */}
      <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="lg:hidden">
            <Menu className="w-6 h-6 text-gray-700 cursor-pointer" />
          </div>

          <Link
            href="/"
            className="text-orange-500 font-bold text-2xl cursor-pointer"
          >
            🍔QuickBite
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer">
          <MapPin className="w-4 h-4" />
          <span>New Address Road 71, Dhaka, Bangladesh</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {session ? (
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
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

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0  w-52 bg-white border rounded-xl shadow-lg p-4 z-50">
                  <p className="font-semibold text-sm">
                    {session.user?.name}
                  </p>
                  <p className="text-gray-500 text-xs mb-3">
                    {session.user?.email}
                  </p>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-2 rounded-md text-sm transition"
                  >
                    Logout
                  </button>
                </div>
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
            className="bg-gray-100 p-3 rounded-full cursor-not-allowed opacity-50"
          >
            <ShoppingCart className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Bottom Menu (unchanged) */}
      <div>
        <div className="max-w-[1380px] mx-auto py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-8 text-gray-700 text-sm">
            <Link href="/" className="flex items-center gap-2 hover:bg-gray-100 rounded-xl transition">
              <Bike className="w-5 h-5" />
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
  );
};

export default Header;