"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SessionGuard({ children }) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isChecking = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const checkStatus = async () => {
      if (isChecking.current) return;
      isChecking.current = true;

      try {
        // Force fresh fetch bypassing browser cache
        const res = await fetch("/api/users/status", { cache: "no-store" });
        const data = await res.json();

        if (data.success) {
          const currentStatus = session.user.accountStatus;
          const dbStatus = data.accountStatus;
          const dbRole = data.role;

          // If database status changed, force token update immediately
          if (currentStatus !== dbStatus || session.user.role !== dbRole) {
            await update({ accountStatus: dbStatus, role: dbRole });
          }

          // Instant Routing Enforcement
          if (dbStatus === "Banned" && !pathname.startsWith("/banned")) {
            router.replace("/banned");
          } else if (dbStatus === "Suspended" && !pathname.startsWith("/suspended")) {

            // Admins lose dashboard access entirely during investigation
            if (dbRole === "admin" && pathname.startsWith("/dashboard/admin")) {
              router.replace("/suspended");
            }

            // Customers are blocked from checkout
            if (pathname.startsWith("/checkout")) {
              router.replace("/suspended");
            }

            // Note: Restaurants and Riders are intentionally NOT redirected 
            // away from their dashboards here so they can finish active orders.

          } else if (dbStatus === "Active" && (pathname.startsWith("/banned") || pathname.startsWith("/suspended"))) {
            router.replace("/");
          }
        } else if (res.status === 404) {
          // IF USER NOT FOUND IN DB -> KICK IMMEDIATELY
          signOut({ callbackUrl: "/login" });
        }
      } catch (error) {
        console.error("Status check failed", error);
      } finally {
        isChecking.current = false;
      }
    };

    checkStatus(); // Run immediately on route change

    // Poll every 5 seconds for rapid kicking while idle
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);

  }, [status, pathname, session?.user?.email, router, update]);

  return <>{children}</>;
}