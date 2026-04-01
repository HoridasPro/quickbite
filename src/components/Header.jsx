"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect, Suspense } from "react";
import {
  MapPin,
  ShoppingCart,
  Bike,
  Store,
  Menu,
  User,
  Package,
  Ticket,
  LogOut,
  ChevronDown,
  X,
  Heart, // Heart icon import করা হয়েছে
} from "lucide-react";
import {
  MdOutlineDashboardCustomize,
  MdOutlineDeliveryDining,
  MdOutlineShoppingBag,
} from "react-icons/md";
import Language from "./Language";
import Link from "next/link";
import NavLink from "./NavLink";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import InputSearch from "./InputSearch";
import { useTranslation } from "@/hooks/useTranslation";

const Header = () => {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  // Wishlist Count State
  const [wishlistCount, setWishlistCount] = useState(0);

  const { t } = useTranslation();

  // LocalStorage থেকে উইশলিস্টের সংখ্যা আপডেট করার ফাংশন
  const updateWishlistCount = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        const list = JSON.parse(saved);
        setWishlistCount(list.length);
      } else {
        setWishlistCount(0);
      }
    }
  };

  useEffect(() => {
    updateWishlistCount(); // মাউন্ট হওয়ার সময় চেক করবে

    // Custom Event শোনা (যখন অন্য ফাইল থেকে উইশলিস্ট আপডেট হবে)
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    return () =>
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
  }, []);

  useEffect(() => {
    const fetchDefaultAddress = () => {
      if (session?.user?.email) {
        fetch(`/api/users/addresses?email=${session.user.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.addresses.length > 0) {
              setDeliveryAddress(
                `${data.addresses[0].address}, ${data.addresses[0].city}`,
              );
            } else {
              setDeliveryAddress(null);
            }
          })
          .catch((err) => console.error(err));
      }
    };

    fetchDefaultAddress();
    window.addEventListener("addressUpdated", fetchDefaultAddress);
    return () =>
      window.removeEventListener("addressUpdated", fetchDefaultAddress);
  }, [session]);

  const userRole = session?.user?.role || "user";
  const hasDashboard = ["admin", "restaurant", "rider"].includes(userRole);

  return (
    <>
      <div
        id="main-header"
        className="w-full bg-white shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between px-4 xl:px-0">
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

          <Link
            href="/profile/addresses"
            className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] transition"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {status === "authenticated" && deliveryAddress
                ? deliveryAddress
                : t("addDeliveryAddress")}
            </span>
          </Link>

          <div className="flex items-center gap-3 relative">
            {/* User Dropdown */}
            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 z-50 overflow-hidden py-1">
                    <NavLink
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      activeClassName="text-orange-600 bg-orange-50 font-medium"
                      inactiveClassName="text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" /> {t("profile")}
                    </NavLink>
                    {hasDashboard && (
                      <NavLink
                        href={`/dashboard/${userRole}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        activeClassName="text-orange-600 bg-orange-50 font-medium"
                        inactiveClassName="text-gray-700 hover:bg-gray-50"
                      >
                        <MdOutlineDashboardCustomize className="w-4 h-4" />{" "}
                        {t("dashboard")}
                      </NavLink>
                    )}
                    <NavLink
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      activeClassName="text-orange-600 bg-orange-50 font-medium"
                      inactiveClassName="text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" /> {t("orders")}
                    </NavLink>
                    <NavLink
                      href="/vouchers"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      activeClassName="text-orange-600 bg-orange-50 font-medium"
                      inactiveClassName="text-gray-700 hover:bg-gray-50"
                    >
                      <Ticket className="w-4 h-4" /> {t("vouchers")}
                    </NavLink>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
                >
                  {t("signup")}
                </Link>
              </div>
            )}

            <Language />
            {/* --- Wishlist Button --- */}
            <Link
              href="/wishlist"
              className="relative bg-gray-100 p-2.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${wishlistCount > 0 ? "text-red-500 fill-red-500" : "text-gray-800"}`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gray-100 p-2.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* --- Sub Header (Desktop) --- */}
        <div className="max-w-[1380px] mx-auto py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0 border-t border-gray-100 hidden md:flex">
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <NavLink
              href="/"
              aliases={["/foods"]}
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <MdOutlineDeliveryDining className="w-5 h-5" /> {t("delivery")}
            </NavLink>
            <NavLink
              href="/pick-up"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <Bike className="w-5 h-5" /> {t("pickup")}
            </NavLink>
            <NavLink
              href="/quickmart"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <MdOutlineShoppingBag className="w-5 h-5" /> {t("quickmart")}
            </NavLink>
            <NavLink
              href="/shops"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <Store className="w-5 h-5" /> {t("shops")}
            </NavLink>
          </div>
          <div className="relative w-full lg:w-[400px]">
            <Suspense
              fallback={
                <div className="h-10 bg-gray-100 rounded-full w-full"></div>
              }
            >
              <InputSearch />
            </Suspense>
          </div>
        </div>
      </div>

      {/* --- Sidebar Mobile Menu --- */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          ></div>
          <div className="relative w-64 bg-white h-full shadow-lg flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4 pb-4 border-b">
              <span className="text-orange-500 font-bold text-xl">
                🍔QuickBite
              </span>
              <X
                className="w-6 h-6 text-gray-700 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="flex flex-col gap-2 p-4 font-medium text-sm">
              <NavLink
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition"
                activeClassName="text-orange-600 bg-orange-50"
                inactiveClassName="text-gray-700 hover:bg-gray-50"
              >
                <MdOutlineDeliveryDining className="w-5 h-5" /> {t("delivery")}
              </NavLink>
              {/* Add other mobile links here similar to desktop */}
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
