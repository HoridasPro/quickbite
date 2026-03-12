"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ 
  href, 
  exact = false, 
  aliases = [], // Added to support multiple active paths (like /foods mapping to /)
  activeClassName = "", 
  inactiveClassName = "", 
  className = "", 
  children, 
  ...props 
}) {
  const pathname = usePathname();
  
  // Root path "/" requires exact matching otherwise it matches every route
  const isRoot = href === "/";
  const isMatch = exact || isRoot 
    ? pathname === href 
    : pathname?.startsWith(href);

  // Check if current path matches any of the provided aliases
  const matchesAlias = aliases.some(alias => pathname?.startsWith(alias));

  const isActive = isMatch || matchesAlias;

  return (
    <Link 
      href={href} 
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`} 
      {...props}
    >
      {children}
    </Link>
  );
}