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
        <h1 className="text-2xl font-bold text-orange-500">
          Food Delivery Platform
        </h1>

        <div className="space-x-6 hidden md:block">
          <Link href="/" className={activeLink("/")}>
            Home
          </Link>

          <Link href="/restaurants" className={activeLink("/restaurants")}>
            Restaurants
          </Link>

          <Link href="/offers" className={activeLink("/offers")}>
            Offers
          </Link>

          <Link href="/about-us" className={activeLink("/about-us")}>
            About Us
          </Link>

          <Link href="/contact" className={activeLink("/contact")}>
            Contact
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

      {/* <section className="text-center py-20 px-6 bg-orange-100">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Order Your Favorite Food Anytime
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Fast, reliable and smart food delivery platform connecting users with
          their favorite local restaurants.
        </p>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
          Explore Restaurants
        </button>
      </section> */}

      {/* <section className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose QuickBite?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h4 className="text-xl font-semibold mb-3">Real-Time Tracking</h4>
            <p className="text-gray-600">
              Track your order live from restaurant to your doorstep.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h4 className="text-xl font-semibold mb-3">
              Smart Recommendations
            </h4>
            <p className="text-gray-600">
              Get personalized food suggestions based on your taste.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h4 className="text-xl font-semibold mb-3">Fast Delivery</h4>
            <p className="text-gray-600">
              Quick and reliable delivery service from local restaurants.
            </p>
          </div>
        </div>
      </section> */}

      {/* <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <p>© 2026 QuickBite. All rights reserved.</p>
      </footer> */}
    </header>
  );
};

export default Header;
