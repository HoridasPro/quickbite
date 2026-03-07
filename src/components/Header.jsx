"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";
import {
  MapPin,
  ShoppingCart,
  Search,
  Bike,
  Store,
  Menu,
  X,
  User,
  Package,
  Ticket,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
import Language from "./Language";
import Link from "next/link";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const value = form.search.value;
    console.log(value);
  };

  return (
    <div className="w-full bg-white shadow-sm">
      {/* Top Navbar */}
      <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between px-4">
        {/* Left */}
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

        {/* Address Desktop */}
        <a
          href="https://www.google.com/maps/search/?api=1&query=New+Address+Road+71,+Dhaka,+Bangladesh"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] truncate"
        >
          <MapPin className="w-4 h-4" />
          <span className="truncate">
            New Address Road 71, Dhaka, Bangladesh
          </span>
        </a>

        {/* Right */}
        <div className="flex items-center gap-4 relative">
          {status === "authenticated" && session?.user ? (
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={session.user.image || "/default-avatar.png"}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border"
                />
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <MdOutlineDashboardCustomize className="w-4 h-4" />{" "}
                    Dashboard
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <Package className="w-4 h-4" /> Orders
                  </Link>

                  <Link
                    href="/vouchers"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <Ticket className="w-4 h-4" /> Vouchers
                  </Link>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
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
                foods for delivery
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
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="search"
                type="text"
                placeholder="Search for restaurants, cuisines, and dishes"
                className="w-full pl-10 pr-24 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-orange-600 transition"
              >
                Search
              </button>
            </form>
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
            {/* Mobile menu content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
