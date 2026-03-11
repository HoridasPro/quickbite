"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

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

      {/* Desktop Sidebar (Sticky, matching foods/page.jsx) */}
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
          <button
            className="lg:hidden text-gray-700 text-2xl hover:bg-gray-100 p-1 rounded-md transition"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
            Dashboard
          </h1>

          <div className="text-sm font-medium text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full hidden sm:block">
            Admin Panel
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 min-h-[calc(100vh-250px)]">
          {children}
        </div>
        
      </div>
    </div>
  );
}