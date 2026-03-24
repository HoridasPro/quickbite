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
  Bike,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Ticket
} from "lucide-react";
import NavLink from "./NavLink";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePathname } from "next/navigation";

export default function Sidebar({ closeSidebar }) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  
  const actualRole = session?.user?.role || "user";
  const accountStatus = session?.user?.accountStatus || "Active";
  const isRestricted = accountStatus !== "Active";

  // Dynamically determine the viewed panel based on URL
  let currentView = actualRole;
  if (actualRole === "admin") {
    if (pathname?.startsWith("/dashboard/restaurant")) currentView = "restaurant";
    else if (pathname?.startsWith("/dashboard/rider")) currentView = "rider";
    else currentView = "admin";
  }

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

  const badgeColor = accountStatus === "Suspended" 
    ? "bg-yellow-100 text-yellow-800 border-yellow-300" 
    : "bg-red-100 text-red-800 border-red-300";
    
  const statusKey = accountStatus === "Suspended" ? "statusSuspended" : "statusBanned";

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
          {roleTitles[currentView]}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-gray-400 font-medium capitalize">
            {t("quickBite")} {roleNames[currentView]}
          </p>
          
          {isRestricted && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 uppercase tracking-wider ${badgeColor}`}>
              <AlertTriangle size={10} />
              {t(statusKey) || accountStatus}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {/* ADMIN LINKS */}
        {currentView === "admin" && (
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
              <NavLink href="/dashboard/admin/vouchers" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <Ticket size={20} /> {t("vouchers") || "Vouchers"}
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
            <li>
              <NavLink href="/dashboard/admin/reviews" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <MessageSquare size={20} /> {t("reviewModeration")}
              </NavLink>
            </li>
            <li>
              <NavLink href="/dashboard/admin/audit-logs" className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
                <ShieldCheck size={20} /> {t("auditLogs")}
              </NavLink>
            </li>
          </>
        )}

        {/* RESTAURANT LINKS */}
        {currentView === "restaurant" && (
          <li>
            <NavLink href="/dashboard/restaurant" exact={true} className={baseClass} activeClassName={activeClass} inactiveClassName={inactiveClass} onClick={closeSidebar}>
              <ChefHat size={20} /> {t("menuKitchenDisplay")}
            </NavLink>
          </li>
        )}

        {/* RIDER LINKS */}
        {currentView === "rider" && (
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