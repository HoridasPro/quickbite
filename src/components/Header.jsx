"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoLocation, IoMenu, IoClose } from "react-icons/io5";
import React, { useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeLink = (path) =>
    pathname === path
      ? "text-orange-500 font-semibold border-b-2 border-orange-500 pb-1"
      : "hover:text-orange-500 transition";

  return (
    <header className="bg-gray-50">
      <nav className="flex flex-wrap md:flex-nowrap justify-between items-center px-4 md:px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500 mb-2 md:mb-0"
        >
          🍔FDP
        </Link>

        {/* Location Input (Same for all devices) */}
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <span className="px-2 text-gray-500">
              <IoLocation />
            </span>
            <input
              type="text"
              placeholder="Enter your delivery location"
              className="flex-1 px-2 py-3 outline-none"
            />
            <button className="bg-orange-500 text-white px-6 py-3 hover:bg-orange-600 transition">
              Search
            </button>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className={activeLink("/")}>
            🚚 Delivery
          </Link>
          <Link href="/pick-up" className={activeLink("/pick-up")}>
            🛍 Pick-up
          </Link>
          <Link href="/pandamart" className={activeLink("/pandamart")}>
            🛒 Foodamart
          </Link>
          <Link href="/shops" className={activeLink("/shops")}>
            🏬 Shops
          </Link>
        </div>

        {/* Desktop Cart + Login */}
        <div className="hidden md:flex space-x-4">
          <span className="hover:text-orange-500 cursor-pointer">🛒 Cart</span>
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-4 rounded-lg transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 space-y-4 shadow-md">
            <Link href="/" className={activeLink("/")}>
              🚚 Delivery
            </Link>
            <Link href="/pick-up" className={activeLink("/pick-up")}>
              🛍 Pick-up
            </Link>
            <Link href="/pandamart" className={activeLink("/pandamart")}>
              🛒 Foodamart
            </Link>
            <Link href="/shops" className={activeLink("/shops")}>
              🏬 Shops
            </Link>

            <div className="flex flex-col gap-2 mt-2">
              <span className="hover:text-orange-500 cursor-pointer">
                🛒 Cart
              </span>
              <Link
                href="/login"
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-center"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
