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
import NavLink from "./NavLink";

export default function Sidebar({ closeSidebar }) {
  const baseClass = "flex items-center gap-3 p-3 rounded-xl transition-all font-medium";
  const activeClass = "text-orange-500 bg-orange-50";
  const inactiveClass = "text-gray-700 hover:bg-gray-100";

  return (
    <div className="h-full text-gray-800 p-6 relative">
      <button
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        onClick={closeSidebar}
      >
        <X size={22} />
      </button>

      <div className="mb-10 mt-8 md:mt-0">
        <h2 className="text-3xl font-extrabold text-orange-500">
          Admin Panel
        </h2>
        <p className="text-sm text-gray-400 mt-1 font-medium">
          QuickBite Dashboard
        </p>
      </div>

      <ul className="space-y-2">
        <li>
          <NavLink
            href="/dashboard/admin"
            exact={true}
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            href="/dashboard/admin/users"
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <Users size={20} />
            Users
          </NavLink>
        </li>

        <li>
          <NavLink
            href="/dashboard/admin/products"
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <ShoppingBag size={20} />
            Foods
          </NavLink>
        </li>

        <li>
          <NavLink
            href="/dashboard/admin/orders"
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <Package size={20} />
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            href="/dashboard/admin/restaurants"
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <Store size={20} />
            Restaurants
          </NavLink>
        </li>

        <li>
          <NavLink
            href="/dashboard/admin/payments"
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <CreditCard size={20} />
            Payment
          </NavLink>
        </li>

        <li>
          <NavLink
            href="/dashboard/admin/delivery"
            className={baseClass}
            activeClassName={activeClass}
            inactiveClassName={inactiveClass}
            onClick={closeSidebar}
          >
            <Truck size={20} />
            Delivery
          </NavLink>
        </li>
      </ul>
    </div>
  );
}