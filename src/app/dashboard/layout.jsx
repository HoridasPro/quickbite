"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { data: session } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. Determine the actual user role
  const actualRole = session?.user?.role || "user";

  // 2. Determine which dashboard view they are currently looking at based on the URL
  let currentView = actualRole;
  if (actualRole === "admin") {
    if (pathname?.startsWith("/dashboard/restaurant")) currentView = "restaurant";
    else if (pathname?.startsWith("/dashboard/rider")) currentView = "rider";
    else currentView = "admin";
  }

  const roleTitles = {
    admin: t("adminPanel"),
    restaurant: t("kitchenKds"),
    rider: t("riderApp")
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerElement = document.getElementById("main-header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    calculateHeaderHeight();
    window.addEventListener("resize", calculateHeaderHeight);

    return () => window.removeEventListener("resize", calculateHeaderHeight);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 mb-20 items-start px-4 lg:px-0">
      
      {/* Mobile Sidebar (Slide-in) */}
      <div
        className={`fixed z-50 bg-white shadow-xl h-screen transition-all duration-300 lg:hidden ${
          isOpen ? "left-0" : "-left-72"
        } top-0 w-72 border-r`}
      >
        <Sidebar closeSidebar={() => setIsOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:block lg:col-span-3 bg-white shadow-lg rounded-2xl sticky self-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          top: `${headerHeight + 20}px`,
          maxHeight: `calc(100vh - ${headerHeight + 40}px)`,
        }}
      >
        <Sidebar closeSidebar={() => setIsOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="col-span-1 lg:col-span-9 flex flex-col gap-5">
        
        {/* Dashboard Top Navbar */}
        <div className="bg-white shadow-md rounded-2xl px-6 py-4 flex justify-between items-center border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-700 text-2xl hover:bg-gray-100 p-1 rounded-md transition"
              onClick={() => setIsOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
              {t("dashboard")}
            </h1>
          </div>

          {/* ADMIN DROPDOWN SWITCHER */}
          {actualRole === "admin" ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 transition px-4 py-1.5 rounded-full cursor-pointer select-none"
              >
                {roleTitles[currentView]} 
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 py-1">
                  <button 
                    onClick={() => { router.push("/dashboard/admin"); setDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition cursor-pointer ${currentView === "admin" ? "font-bold text-orange-600 bg-orange-50" : "text-gray-700"}`}
                  >
                    {t("adminPanel")}
                  </button>
                  <button 
                    onClick={() => { router.push("/dashboard/restaurant"); setDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition cursor-pointer ${currentView === "restaurant" ? "font-bold text-orange-600 bg-orange-50" : "text-gray-700"}`}
                  >
                    {t("kitchenKds")}
                  </button>
                  <button 
                    onClick={() => { router.push("/dashboard/rider"); setDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition cursor-pointer ${currentView === "rider" ? "font-bold text-orange-600 bg-orange-50" : "text-gray-700"}`}
                  >
                    {t("riderApp")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm font-medium text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full hidden sm:block select-none">
              {roleTitles[actualRole] || t("dashboard")}
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 min-h-[calc(100vh-250px)]">
          {children}
        </div>
        
      </div>
    </div>
  );
}