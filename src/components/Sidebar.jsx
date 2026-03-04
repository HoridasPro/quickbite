"use client";

import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Store, 
  CreditCard, 
  Truck, 
  X 
} from "lucide-react";
import Link from "next/link";

export default function Sidebar({ closeSidebar }) {
  return (
    <div className="h-full text-gray-800 p-6 relative">

      {/* Close Button (Mobile only) */}
      <button
        className="md:hidden absolute top-4 right-4"
        onClick={closeSidebar}
      >
        <X size={22} />
      </button>

      {/* Title */}
      <div className="mb-10 mt-8 md:mt-0">
        <h2 className="text-3xl font-extrabold text-orange-500">
          Admin Panel
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          QuickBite Dashboard
        </p>
      </div>

      {/* Menu */}
      <ul className="space-y-4">

        <li>
          <Link
            href="/dashboard/admin"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/admin/users"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <Users size={20} />
            Users
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/admin/products"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <ShoppingBag size={20} />
            Foods
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/admin/orders"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <Package size={20} />
            Orders
          </Link>
        </li>

        {/* NEW ITEMS */}

        <li>
          <Link
            href="/dashboard/admin/restaurants"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <Store size={20} />
            Restaurants
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/admin/payments"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <CreditCard size={20} />
            Payment
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/admin/delivery"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            <Truck size={20} />
            Delivery
          </Link>
        </li>

      </ul>
    </div>
  );
}