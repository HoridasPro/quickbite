"use client";

import { ShoppingBag } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

const AuthButton = ({ isMobile = false }) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") return null;

  return (
    <div
      className={`relative flex ${isMobile ? "flex-col gap-2" : "gap-3"} items-center`}
      ref={dropdownRef}
    >
      {status === "authenticated" ? (
        <>
          {/* Profile Image */}
          <img
            src={session.user.image || "/default-avatar.png"}
            alt="profile"
            onClick={() => setOpen(!open)}
            className={`cursor-pointer rounded-full object-cover ${isMobile ? "w-12 h-12" : "w-10 h-10"}`}
          />

          {/* Dropdown */}
          {open && (
            <div
              className={`absolute -right-18 mt-45 w-40 bg-white shadow-lg rounded z-50 ${isMobile ? "static mt-2 w-full" : ""}`}
            >
              <div className="flex flex-col p-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  <FaRegUser className="w-5 h-5" /> Profile
                </Link>
                <Link
                  href="/vouchers"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition text-sm"
                >
                  <ShoppingBag className="w-5 h-5" /> Vouchers
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-xl transition  text-sm"
                >
                  <IoIosLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Link
          href="/login"
          className={`px-5 py-2 border rounded text-sm font-medium ${isMobile ? "w-full text-center" : ""}`}
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default AuthButton;
