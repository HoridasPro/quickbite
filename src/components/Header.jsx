"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  ShoppingCart,
  Search,
  Bike,
  Store,
  Menu,
  User,
  Package,
  Ticket,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import { MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
import Language from "./Language";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";

const Header = () => {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const [deliveryAddress, setDeliveryAddress] = useState("Add Delivery Address");
  
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchDefaultAddress = () => {
      if (session?.user?.email) {
        fetch(`/api/user/addresses?email=${session.user.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.addresses.length > 0) {
              setDeliveryAddress(`${data.addresses[0].address}, ${data.addresses[0].city}`);
            } else {
              setDeliveryAddress("Add Delivery Address");
            }
          })
          .catch((err) => console.error(err));
      }
    };

    fetchDefaultAddress();

    window.addEventListener("addressUpdated", fetchDefaultAddress);

    return () => {
      window.removeEventListener("addressUpdated", fetchDefaultAddress);
    };
  }, [session]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        router.push(`/foods?search=${encodeURIComponent(searchQuery.trim())}`);
      } else if (searchQuery === "" && pathname.startsWith("/foods")) {
        router.push(`/foods`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <div id="main-header" className="w-full bg-white shadow-sm sticky top-0 z-40">
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

          <Link href="/profile/addresses" className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] transition">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {status === "authenticated" ? deliveryAddress : "Add Delivery Address"}
            </span>
          </Link>

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
                  Sign up for free delivery
                </Link>
              </>
            )}

            <Language />

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

        <div className="max-w-[1380px] mx-auto py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0 border-t border-gray-100 hidden md:flex">
          <div className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">
            <Link
              href="/"
              className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
                pathname === "/" || pathname.startsWith("/foods") ? "text-orange-500" : ""
              }`}
            >
              <MdOutlineDeliveryDining className="w-5 h-5" /> Delivery
            </Link>
            <Link
              href="/pick-up"
              className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
                pathname === "/pick-up" ? "text-orange-500" : ""
              }`}
            >
              <Bike className="w-5 h-5" /> Pick-up
            </Link>
            <Link
              href="/vouchers"
              className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
                pathname === "/vouchers" ? "text-orange-500" : ""
              }`}
            >
              <Ticket className="w-5 h-5" /> Vouchers
            </Link>
            <Link
              href="/pandamart"
              className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
                pathname === "/pandamart" ? "text-orange-500" : ""
              }`}
            >
              <MdOutlineShoppingBag className="w-5 h-5" /> Pandamart
            </Link>
            <Link
              href="/shops"
              className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
                pathname === "/shops" ? "text-orange-500" : ""
              }`}
            >
              <Store className="w-5 h-5" /> Shops
            </Link>
          </div>

          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, and dishes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
            />
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setOpen(false)}
          ></div>
          <div className="relative w-64 bg-white h-full shadow-lg flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4 pb-4 border-b">
              <span className="text-orange-500 font-bold text-xl">🍔QuickBite</span>
              <X
                className="w-6 h-6 text-gray-700 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="flex flex-col gap-2 p-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl transition ${
                  pathname === "/" || pathname.startsWith("/foods") ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MdOutlineDeliveryDining className="w-5 h-5" /> Delivery
              </Link>
              <Link
                href="/pick-up"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl transition ${
                  pathname === "/pick-up" ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bike className="w-5 h-5" /> Pick-up
              </Link>
              <Link
                href="/vouchers"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl transition ${
                  pathname === "/vouchers" ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Ticket className="w-5 h-5" /> Vouchers
              </Link>
              <Link
                href="/pandamart"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl transition ${
                  pathname === "/pandamart" ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MdOutlineShoppingBag className="w-5 h-5" /> Pandamart
              </Link>
              <Link
                href="/shops"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl transition ${
                  pathname === "/shops" ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Store className="w-5 h-5" /> Shops
              </Link>
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;