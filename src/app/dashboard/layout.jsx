"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 bg-white shadow-xl h-full transition-all duration-300 ${
          isOpen ? "left-0" : "-left-64"
        } md:left-0 w-64 border-r`}
      >
        <Sidebar closeSidebar={() => setIsOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
            Dashboard
          </h1>

          <div className="text-sm text-gray-500 hidden sm:block">
            Admin Panel
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[80vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
