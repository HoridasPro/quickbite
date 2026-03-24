// "use client";

// import { useSession, signOut } from "next-auth/react";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import {
//   MapPin,
//   ShoppingCart,
//   Bike,
//   Store,
//   Menu,
//   User,
//   Package,
//   LogOut,
//   ChevronDown,
//   X,
//   Ticket,
// } from "lucide-react";
// import { MdOutlineDashboardCustomize } from "react-icons/md";
// import { MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
// import Language from "./Language";
// import Translation from "./Translation";
// import Link from "next/link";
// import { useCart } from "@/contexts/CartContext";
// import CartDrawer from "./CartDrawer";
// import InputSearch from "./InputSearch";

// const Header = () => {
//   const { cartCount } = useCart();
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { data: session, status } = useSession();
//   const [deliveryAddress, setDeliveryAddress] = useState(
//     "Add Delivery Address",
//   );

//   const pathname = usePathname();

//   useEffect(() => {
//     const fetchDefaultAddress = () => {
//       if (session?.user?.email) {
//         fetch(`/api/user/addresses?email=${session.user.email}`)
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.success && data.addresses.length > 0) {
//               setDeliveryAddress(
//                 `${data.addresses[0].address}, ${data.addresses[0].city}`,
//               );
//             } else {
//               setDeliveryAddress("Add Delivery Address");
//             }
//           })
//           .catch((err) => console.error(err));
//       }
//     };

//     fetchDefaultAddress();

//     window.addEventListener("addressUpdated", fetchDefaultAddress);

//     return () => {
//       window.removeEventListener("addressUpdated", fetchDefaultAddress);
//     };
//   }, [session]);

//   return (
//     <>
//       <div
//         id="main-header"
//         className="w-full bg-white shadow-sm sticky top-0 z-40"
//       >
//         <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between px-4 xl:px-0">
//           <div className="flex items-center gap-4 md:gap-6">
//             <div className="lg:hidden">
//               <Menu
//                 onClick={() => setOpen(true)}
//                 className="w-6 h-6 text-gray-700 cursor-pointer"
//               />
//             </div>

//             <Link
//               href="/"
//               className="text-orange-500 font-bold text-xl sm:text-2xl cursor-pointer"
//             >
//               <Translation en="🍔QuickBite " bn="🍔কুইকবাইট" />
//             </Link>
//           </div>

//           <Link
//             href="/profile/addresses"
//             className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] transition"
//           >
//             <MapPin className="w-4 h-4 shrink-0" />

//             <span className="truncate">
//               {status === "authenticated" ? (
//                 <Translation
//                   en="Add Delivery Address"
//                   bn="ডেলিভারি ঠিকানা যোগ করুন"
//                 />
//               ) : (
//                 deliveryAddress
//               )}
//             </span>
//           </Link>

//           <div className="flex items-center gap-4 relative">
//             {status === "authenticated" && session?.user ? (
//               <div className="relative">
//                 <div
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <img
//                     src={session.user.image || "/default-avatar.png"}
//                     alt="User"
//                     width={40}
//                     height={40}
//                     className="rounded-full object-cover border"
//                   />
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${
//                       dropdownOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </div>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
//                     <Link
//                       href="/profile"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       <User className="w-4 h-4" />
//                       <Translation en="Profile" bn="প্রোফাইল" />
//                     </Link>

//                     {session.user.role === "admin" && (
//                       <Link
//                         href="/dashboard/admin"
//                         onClick={() => setDropdownOpen(false)}
//                         className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         <MdOutlineDashboardCustomize className="w-4 h-4" />
//                         <Translation en="Dashboard" bn="ড্যাশবোর্ড" />
//                       </Link>
//                     )}

//                     <Link
//                       href="/orders"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       <Package className="w-4 h-4" />
//                       <Translation en="Orders" bn="অর্ডারসমূহ" />
//                     </Link>

//                     <Link
//                       href="/vouchers"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       <Ticket className="w-4 h-4" />
//                       <Translation en="Vouchers" bn="ভাউচার" />
//                     </Link>

//                     <button
//                       onClick={() => signOut({ callbackUrl: "/" })}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       <Translation en="Logout" bn="লগ আউট" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="hidden md:block px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
//                 >
//                   <Translation en="Log in" bn="লগ ইন" />
//                 </Link>

//                 <Link
//                   href="/register"
//                   className="hidden md:block px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
//                 >
//                   <Translation
//                     en="Sign up for free delivery"
//                     bn="ফ্রি ডেলিভারির জন্য সাইন আপ করুন"
//                   />
//                 </Link>
//               </>
//             )}

//             <Language />

//             <button
//               onClick={() => setIsCartOpen(true)}
//               className="relative bg-gray-100 p-3 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
//             >
//               <ShoppingCart className="w-5 h-5 text-gray-800" />

//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="max-w-[1380px] mx-auto py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0 border-t border-gray-100 hidden md:flex">
//           <div className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">
//             <Link
//               href="/"
//               className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
//                 pathname === "/" || pathname.startsWith("/foods")
//                   ? "text-orange-500"
//                   : ""
//               }`}
//             >
//               <MdOutlineDeliveryDining className="w-5 h-5" />
//               <Translation en="Delivery" bn="ডেলিভারি" />
//             </Link>

//             <Link
//               href="/pick-up"
//               className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
//                 pathname === "/pick-up" ? "text-orange-500" : ""
//               }`}
//             >
//               <Bike className="w-5 h-5" />
//               <Translation en="Pick-up" bn="পিকআপ" />
//             </Link>

//             <Link
//               href="/vouchers"
//               className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
//                 pathname === "/vouchers" ? "text-orange-500" : ""
//               }`}
//             >
//               <Ticket className="w-5 h-5" />
//               <Translation en="Vouchers" bn="ভাউচার" />
//             </Link>

//             <Link
//               href="/quickmart"
//               className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition`}
//             >
//               <MdOutlineShoppingBag className="w-5 h-5" />
//               <Translation en="Quickmart" bn=" কুইকমার্ট" />
//             </Link>

//             <Link
//               href="/shops"
//               className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${
//                 pathname === "/shops" ? "text-orange-500" : ""
//               }`}
//             >
//               <Store className="w-5 h-5" />
//               <Translation en="Shops" bn="দোকান" />
//             </Link>
//           </div>

//           <div className="relative w-full lg:w-[400px]">
//             <InputSearch />
//           </div>
//         </div>
//       </div>

//       <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
//     </>
//   );
// };

// export default Header;

// "use client";

// import { useSession, signOut } from "next-auth/react";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import {
//   MapPin,
//   ShoppingCart,
//   Bike,
//   Store,
//   Menu,
//   User,
//   Package,
//   LogOut,
//   ChevronDown,
//   X,
//   Ticket,
// } from "lucide-react";
// import { MdOutlineDashboardCustomize } from "react-icons/md";
// import { MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
// import Language from "./Language";
// import Translation from "./Translation";
// import Link from "next/link";
// import { useCart } from "@/contexts/CartContext";
// import CartDrawer from "./CartDrawer";
// import InputSearch from "./InputSearch";

// const Header = () => {
//   const { cartCount } = useCart();
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [open, setOpen] = useState(false); // Mobile Menu State
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { data: session, status } = useSession();
//   const [deliveryAddress, setDeliveryAddress] = useState(
//     "Add Delivery Address",
//   );

//   const pathname = usePathname();

//   useEffect(() => {
//     const fetchDefaultAddress = () => {
//       if (session?.user?.email) {
//         fetch(`/api/user/addresses?email=${session.user.email}`)
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.success && data.addresses.length > 0) {
//               setDeliveryAddress(
//                 `${data.addresses[0].address}, ${data.addresses[0].city}`,
//               );
//             } else {
//               setDeliveryAddress("Add Delivery Address");
//             }
//           })
//           .catch((err) => console.error(err));
//       }
//     };

//     fetchDefaultAddress();
//     window.addEventListener("addressUpdated", fetchDefaultAddress);
//     return () => {
//       window.removeEventListener("addressUpdated", fetchDefaultAddress);
//     };
//   }, [session]);

//   // মেনু আইটেমগুলো বারবার ব্যবহারের জন্য একটি অ্যারে
//   const navLinks = [
//     {
//       href: "/",
//       icon: <MdOutlineDeliveryDining className="w-5 h-5" />,
//       en: "Delivery",
//       bn: "ডেলিভারি",
//       active: pathname === "/" || pathname.startsWith("/foods"),
//     },
//     {
//       href: "/pick-up",
//       icon: <Bike className="w-5 h-5" />,
//       en: "Pick-up",
//       bn: "পিকআপ",
//       active: pathname === "/pick-up",
//     },
//     {
//       href: "/vouchers",
//       icon: <Ticket className="w-5 h-5" />,
//       en: "Vouchers",
//       bn: "ভাউচার",
//       active: pathname === "/vouchers",
//     },
//     {
//       href: "/quickmart",
//       icon: <MdOutlineShoppingBag className="w-5 h-5" />,
//       en: "Quickmart",
//       bn: "কুইকমার্ট",
//       active: pathname === "/quickmart",
//     },
//     {
//       href: "/shops",
//       icon: <Store className="w-5 h-5" />,
//       en: "Shops",
//       bn: "দোকান",
//       active: pathname === "/shops",
//     },
//   ];

//   return (
//     <>
//       <div
//         id="main-header"
//         className="w-full bg-white shadow-sm sticky top-0 z-40"
//       >
//         <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between px-4 xl:px-0">
//           <div className="flex items-center gap-4 md:gap-6">
//             {/* Hamburger Icon for Mobile */}
//             <div className="lg:hidden">
//               <Menu
//                 onClick={() => setOpen(true)}
//                 className="w-6 h-6 text-gray-700 cursor-pointer hover:text-orange-500 transition"
//               />
//             </div>

//             <Link
//               href="/"
//               className="text-orange-500 font-bold text-xl sm:text-2xl cursor-pointer"
//             >
//               <Translation en="🍔QuickBite " bn="🍔কুইকবাইট" />
//             </Link>
//           </div>

//           <Link
//             href="/profile/addresses"
//             className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] transition"
//           >
//             <MapPin className="w-4 h-4 shrink-0" />
//             <span className="truncate">
//               {status === "authenticated" ? (
//                 <Translation
//                   en="Add Delivery Address"
//                   bn="ডেলিভারি ঠিকানা যোগ করুন"
//                 />
//               ) : (
//                 deliveryAddress
//               )}
//             </span>
//           </Link>

//           <div className="flex items-center gap-4 relative">
//             {status === "authenticated" && session?.user ? (
//               <div className="relative">
//                 <div
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <img
//                     src={session.user.image || "/default-avatar.png"}
//                     alt="User"
//                     width={40}
//                     height={40}
//                     className="rounded-full object-cover border"
//                   />
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </div>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
//                     <Link
//                       href="/profile"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       <User className="w-4 h-4" />
//                       <Translation en="Profile" bn="প্রোফাইল" />
//                     </Link>
//                     {session.user.role === "admin" && (
//                       <Link
//                         href="/dashboard/admin"
//                         onClick={() => setDropdownOpen(false)}
//                         className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                       >
//                         <MdOutlineDashboardCustomize className="w-4 h-4" />
//                         <Translation en="Dashboard" bn="ড্যাশবোর্ড" />
//                       </Link>
//                     )}
//                     <Link
//                       href="/orders"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       <Package className="w-4 h-4" />
//                       <Translation en="Orders" bn="অর্ডারসমূহ" />
//                     </Link>
//                     <Link
//                       href="/vouchers"
//                       onClick={() => setDropdownOpen(false)}
//                       className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       <Ticket className="w-4 h-4" />
//                       <Translation en="Vouchers" bn="ভাউচার" />
//                     </Link>
//                     <button
//                       onClick={() => signOut({ callbackUrl: "/" })}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       <Translation en="Logout" bn="লগ আউট" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="hidden md:block px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
//                 >
//                   <Translation en="Log in" bn="লগ ইন" />
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="hidden md:block px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
//                 >
//                   <Translation
//                     en="Sign up for free delivery"
//                     bn="ফ্রি ডেলিভারির জন্য সাইন আপ করুন"
//                   />
//                 </Link>
//               </>
//             )}

//             <div className="hidden lg:block">
//               <Language />
//             </div>

//             <button
//               onClick={() => setIsCartOpen(true)}
//               className="relative bg-gray-100 p-3 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
//             >
//               <ShoppingCart className="w-5 h-5 text-gray-800" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Desktop Bottom Header */}
//         <div className="max-w-[1380px] mx-auto py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0 border-t border-gray-100 hidden md:flex">
//           <div className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">
//             {navLinks.map((link, index) => (
//               <Link
//                 key={index}
//                 href={link.href}
//                 className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${link.active ? "text-orange-500" : ""}`}
//               >
//                 {link.icon}
//                 <Translation en={link.en} bn={link.bn} />
//               </Link>
//             ))}
//           </div>
//           <div className="relative w-full lg:w-[400px]">
//             <InputSearch />
//           </div>
//         </div>
//       </div>

//       {/* --- Mobile Left Side Menu (Drawer) --- */}
//       <div
//         className={`fixed inset-0 z-[100] transition-visibility ${open ? "visible" : "invisible"}`}
//       >
//         {/* Dark Overlay */}
//         <div
//           className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
//           onClick={() => setOpen(false)}
//         ></div>

//         {/* Sidebar Panel */}
//         <div
//           className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out p-6 ${open ? "translate-x-0" : "-translate-x-full"}`}
//         >
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-orange-500 font-bold text-xl italic">
//               QuickBite
//             </h2>
//             <X
//               className="w-6 h-6 text-gray-600 cursor-pointer"
//               onClick={() => setOpen(false)}
//             />
//           </div>

//           <div className="flex flex-col gap-6">
//             {/* Mobile Language Selector */}
//             <div className="border-b pb-4">
//               <p className="text-xs text-gray-400 mb-2 uppercase font-semibold">
//                 Language
//               </p>
//               <Language />
//             </div>

//             {/* Mobile Nav Links */}
//             <div className="flex flex-col gap-4">
//               {navLinks.map((link, index) => (
//                 <Link
//                   key={index}
//                   href={link.href}
//                   onClick={() => setOpen(false)}
//                   className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${link.active ? "bg-orange-50 text-orange-500" : "text-gray-700 hover:bg-gray-50"}`}
//                 >
//                   {link.icon}
//                   <Translation en={link.en} bn={link.bn} />
//                 </Link>
//               ))}
//             </div>

//             {/* Login/Register buttons for mobile if not authenticated */}
//             {status !== "authenticated" && (
//               <div className="mt-4 flex flex-col gap-3">
//                 <Link
//                   href="/login"
//                   onClick={() => setOpen(false)}
//                   className="w-full text-center py-2.5 border rounded-lg text-sm font-semibold"
//                 >
//                   <Translation en="Log in" bn="লগ ইন" />
//                 </Link>
//                 <Link
//                   href="/register"
//                   onClick={() => setOpen(false)}
//                   className="w-full text-center py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold shadow-md"
//                 >
//                   <Translation en="Sign up" bn="সাইন আপ করুন" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
//     </>
//   );
// };

// export default Header;

"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShoppingCart,
  Bike,
  Store,
  Menu,
  User,
  Package,
  LogOut,
  ChevronDown,
  X,
  Ticket,
} from "lucide-react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdOutlineDeliveryDining, MdOutlineShoppingBag } from "react-icons/md";
import Language from "./Language";
import Translation from "./Translation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import InputSearch from "./InputSearch";

const Header = () => {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [open, setOpen] = useState(false); // Mobile Menu State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const [deliveryAddress, setDeliveryAddress] = useState(
    "Add Delivery Address",
  );

  const pathname = usePathname();

  useEffect(() => {
    const fetchDefaultAddress = () => {
      if (session?.user?.email) {
        fetch(`/api/user/addresses?email=${session.user.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.addresses.length > 0) {
              setDeliveryAddress(
                `${data.addresses[0].address}, ${data.addresses[0].city}`,
              );
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

  const navLinks = [
    {
      href: "/",
      icon: <MdOutlineDeliveryDining className="w-5 h-5" />,
      en: "Delivery",
      bn: "ডেলিভারি",
      active: pathname === "/" || pathname.startsWith("/foods"),
    },
    {
      href: "/pick-up",
      icon: <Bike className="w-5 h-5" />,
      en: "Pick-up",
      bn: "পিকআপ",
      active: pathname === "/pick-up",
    },
    {
      href: "/vouchers",
      icon: <Ticket className="w-5 h-5" />,
      en: "Vouchers",
      bn: "ভাউচার",
      active: pathname === "/vouchers",
    },
    {
      href: "/quickmart",
      icon: <MdOutlineShoppingBag className="w-5 h-5" />,
      en: "Quickmart",
      bn: "কুইকমার্ট",
      active: pathname === "/quickmart",
    },
    {
      href: "/shops",
      icon: <Store className="w-5 h-5" />,
      en: "Shops",
      bn: "দোকান",
      active: pathname === "/shops",
    },
  ];

  return (
    <>
      <div
        id="main-header"
        className="w-full bg-white shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-[1380px] mx-auto py-3 flex items-center justify-between px-4 xl:px-0">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Hamburger Icon for Mobile */}
            <div className="lg:hidden">
              <Menu
                onClick={() => setOpen(true)}
                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-orange-500 transition"
              />
            </div>

            <Link
              href="/"
              className="text-orange-500 font-bold text-xl sm:text-2xl cursor-pointer"
            >
              <Translation en="🍔QuickBite " bn="🍔কুইকবাইট" />
            </Link>
          </div>

          <Link
            href="/profile/addresses"
            className="hidden lg:flex items-center gap-2 text-gray-900 text-sm hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer max-w-[400px] transition"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {status === "authenticated" ? (
                <Translation
                  en="Add Delivery Address"
                  bn="ডেলিভারি ঠিকানা যোগ করুন"
                />
              ) : (
                deliveryAddress
              )}
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* Language Selector (Visible on both PC and Mobile next to Profile) */}
            <div className="flex items-center">
              <Language />
            </div>

            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 md:gap-2 cursor-pointer"
                >
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt="User"
                    width={35}
                    height={35}
                    className="rounded-full object-cover border w-8 h-8 md:w-10 md:h-10"
                  />
                  <ChevronDown
                    className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      <Translation en="Profile" bn="প্রোফাইল" />
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <MdOutlineDashboardCustomize className="w-4 h-4" />
                        <Translation en="Dashboard" bn="ড্যাশবোর্ড" />
                      </Link>
                    )}
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Package className="w-4 h-4" />
                      <Translation en="Orders" bn="অর্ডারসমূহ" />
                    </Link>
                    <Link
                      href="/vouchers"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Ticket className="w-4 h-4" />
                      <Translation en="Vouchers" bn="ভাউচার" />
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <Translation en="Logout" bn="লগ আউট" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden md:block px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
                >
                  <Translation en="Log in" bn="লগ ইন" />
                </Link>
                <Link
                  href="/register"
                  className="hidden md:block px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
                >
                  <Translation en="Sign up" bn="সাইন আপ" />
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gray-100 p-2 md:p-3 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Bottom Header */}
        <div className="max-w-[1380px] mx-auto py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 xl:px-0 border-t border-gray-100 hidden md:flex">
          <div className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition ${link.active ? "text-orange-500" : ""}`}
              >
                {link.icon}
                <Translation en={link.en} bn={link.bn} />
              </Link>
            ))}
          </div>
          <div className="relative w-full lg:w-[400px]">
            <InputSearch />
          </div>
        </div>
      </div>

      {/* --- Mobile Left Side Menu (Drawer) --- */}
      <div
        className={`fixed inset-0 z-[100] transition-visibility ${open ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        ></div>

        <div
          className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out p-6 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-orange-500 font-bold text-xl italic">
              QuickBite
            </h2>
            <X
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${link.active ? "bg-orange-50 text-orange-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {link.icon}
                  <Translation en={link.en} bn={link.bn} />
                </Link>
              ))}
            </div>

            {status !== "authenticated" && (
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-2.5 border rounded-lg text-sm font-semibold"
                >
                  <Translation en="Log in" bn="লগ ইন" />
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold shadow-md"
                >
                  <Translation en="Sign up" bn="সাইন আপ করুন" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
