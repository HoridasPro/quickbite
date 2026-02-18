"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const pathname = usePathname();

  const activeLink = (path) =>
    pathname === path
      ? "text-orange-500 font-semibold border-b-2 border-orange-500 pb-1"
      : "hover:text-orange-500 transition";

  return (
    <header className="bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          🍔FDP
        </Link>

        <div className="space-x-6 hidden md:block">
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

        <div className="space-x-6 hidden md:block">
          <span className="hover:text-orange-500 cursor-pointer">
            🔍 Search
          </span>
          <span className="hover:text-orange-500 cursor-pointer">🛒 Cart</span>
          <span className="hover:text-orange-500 cursor-pointer">Login</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
