"use client";

import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Store, 
  CreditCard, 
  Truck, 
  X,
  ChefHat,
  Bike
} from "lucide-react";
import NavLink from "./NavLink";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Sidebar({ closeSidebar }) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const role = session?.user?.role || "user";

  const baseClass = "flex items-center gap-3 p-3 rounded-xl transition-all font-medium";
  const activeClass = "text-orange-500 bg-orange-50";
  const inactiveClass = "text-gray-700 hover:bg-gray-100";

  // Dynamic label helpers
  const roleTitles = {
    admin: t("adminPanel"),
    restaurant: t("kitchenKds"),
    rider: t("riderApp")
  };

  const roleNames = {
    admin: t("roleAdmin"),
    restaurant: t("roleRestaurant"),
    rider: t("roleRider")
  };

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
          {roleTitles[role]}
        </h2>
        <p className="text-sm text-gray-400 mt-1 font-medium capitalize">
          {t("quickBite")} {roleNames[role]}
        </p>
      </div>

      <ul className="space-y-2">
        {/* ADMIN LINKS */}
        {role === "admin" && (
          <>
            <li>
              <NavLink href="/dashboard/admin" exact={true} className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <LayoutDashboard size={20} /> {t("dashboard")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/users" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <Users size={20} /> {t("menuUsers")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/foods" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <ShoppingBag size={20} /> {t("foodsLabel")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/orders" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <Package size={20} /> {t("orders")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/restaurants" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <Store size={20} /> {t("menuRestaurants")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/payments" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <CreditCard size={20} /> {t("paymentHeader")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/delivery" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <Truck size={20} /> {t("delivery")}
              </NavLink>
            </li>
          </>
        )}

        {/* RESTAURANT LINKS */}
        {role === "restaurant" && (
          <li>
            <NavLink href="/dashboard/restaurant" exact={true} className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
              <ChefHat size={20} /> {t("menuKitchenDisplay")}
            </NavLink>
          </li>
        )}

        {/* RIDER LINKS */}
        {role === "rider" && (
          <li>
            <NavLink href="/dashboard/rider" exact={true} className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
              <Bike size={20} /> {t("menuDeliveryPool")}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}