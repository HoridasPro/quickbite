"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { MdOutlineDashboardCustomize, MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
import Language from "./Language";
import Link from "next/link";
import NavLink from "./NavLink";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import InputSearch from "./InputSearch";

const Header = () => {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const [deliveryAddress, setDeliveryAddress] = useState("Add Delivery Address");

  useEffect(() => {
    const fetchDefaultAddress = () => {
      if (session?.user?.email) {
        fetch(`/api/users/addresses?email=${session.user.email}`)
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
    return () => window.removeEventListener("addressUpdated", fetchDefaultAddress);
  }, [session]);

  // Determine if the user has access to any dashboard
  const userRole = session?.user?.role || "user";
  const hasDashboard = ["admin", "restaurant", "rider"].includes(userRole);

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

            <Link href="/" className="text-orange-500 font-bold text-xl sm:text-2xl cursor-pointer">
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
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
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
                      <User className="w-4 h-4" /> Profile
                    </NavLink>

                    {/* ROLE-AWARE DASHBOARD LINK */}
                    {hasDashboard && (
                      <NavLink
                        href={`/dashboard/${userRole}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        activeClassName="text-orange-600 bg-orange-50 font-medium"
                        inactiveClassName="text-gray-700 hover:bg-gray-50"
                      >
                        <MdOutlineDashboardCustomize className="w-4 h-4" /> Dashboard
                      </NavLink>
                    )}

                    <NavLink
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      activeClassName="text-orange-600 bg-orange-50 font-medium"
                      inactiveClassName="text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" /> Orders
                    </NavLink>

                    <NavLink
                      href="/vouchers"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      activeClassName="text-orange-600 bg-orange-50 font-medium"
                      inactiveClassName="text-gray-700 hover:bg-gray-50"
                    >
                      <Ticket className="w-4 h-4" /> Vouchers
                    </NavLink>

                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden md:block px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition">
                  Log in
                </Link>
                <Link href="/register" className="hidden md:block px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition cursor-pointer">
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

        <div className="max-w-[1380px] mx-auto py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0 border-t border-gray-100 hidden md:flex">
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <NavLink
              href="/"
              aliases={["/foods"]}
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <MdOutlineDeliveryDining className="w-5 h-5" /> Delivery
            </NavLink>
            <NavLink
              href="/pick-up"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <Bike className="w-5 h-5" /> Pick-up
            </NavLink>
            <NavLink
              href="/vouchers"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <Ticket className="w-5 h-5" /> Vouchers
            </NavLink>
            <NavLink
              href="/pandamart"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <MdOutlineShoppingBag className="w-5 h-5" /> Pandamart
            </NavLink>
            <NavLink
              href="/shops"
              className="flex items-center gap-2 p-2 rounded-xl transition"
              activeClassName="text-orange-500"
              inactiveClassName="text-gray-700 hover:bg-gray-100"
            >
              <Store className="w-5 h-5" /> Shops
            </NavLink>
          </div>

          <div className="relative w-full lg:w-[400px]">
            <Suspense fallback={<div className="h-10 bg-gray-100 rounded-full w-full"></div>}>
              <InputSearch />
            </Suspense>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
          <div className="relative w-64 bg-white h-full shadow-lg flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4 pb-4 border-b">
              <span className="text-orange-500 font-bold text-xl">🍔QuickBite</span>
              <X className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            
            <div className="flex flex-col gap-2 p-4 font-medium text-sm">
              <NavLink
                href="/"
                aliases={["/foods"]}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition"
                activeClassName="text-orange-600 bg-orange-50"
                inactiveClassName="text-gray-700 hover:bg-gray-50"
              >
                <MdOutlineDeliveryDining className="w-5 h-5" /> Delivery
              </NavLink>
              
              <NavLink
                href="/pick-up"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition"
                activeClassName="text-orange-600 bg-orange-50"
                inactiveClassName="text-gray-700 hover:bg-gray-50"
              >
                <Bike className="w-5 h-5" /> Pick-up
              </NavLink>
              
              <NavLink
                href="/vouchers"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition"
                activeClassName="text-orange-600 bg-orange-50"
                inactiveClassName="text-gray-700 hover:bg-gray-50"
              >
                <Ticket className="w-5 h-5" /> Vouchers
              </NavLink>
              
              <NavLink
                href="/pandamart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition"
                activeClassName="text-orange-600 bg-orange-50"
                inactiveClassName="text-gray-700 hover:bg-gray-50"
              >
                <MdOutlineShoppingBag className="w-5 h-5" /> Pandamart
              </NavLink>
              
              <NavLink
                href="/shops"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition"
                activeClassName="text-orange-600 bg-orange-50"
                inactiveClassName="text-gray-700 hover:bg-gray-50"
              >
                <Store className="w-5 h-5" /> Shops
              </NavLink>

              <hr className="my-2 border-gray-100" />
              
              {status === "authenticated" && session?.user ? (
                <>
                  <NavLink
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl transition"
                    activeClassName="text-orange-600 bg-orange-50"
                    inactiveClassName="text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" /> Profile
                  </NavLink>
                  
                  {/* ROLE-AWARE DASHBOARD LINK (MOBILE) */}
                  {hasDashboard && (
                    <NavLink
                      href={`/dashboard/${userRole}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl transition"
                      activeClassName="text-orange-600 bg-orange-50"
                      inactiveClassName="text-gray-700 hover:bg-gray-50"
                    >
                      <MdOutlineDashboardCustomize className="w-5 h-5" /> Dashboard
                    </NavLink>
                  )}
                  
                  <NavLink
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl transition"
                    activeClassName="text-orange-600 bg-orange-50"
                    inactiveClassName="text-gray-700 hover:bg-gray-50"
                  >
                    <Package className="w-5 h-5" /> Orders
                  </NavLink>
                  
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 text-left w-full cursor-pointer transition"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;