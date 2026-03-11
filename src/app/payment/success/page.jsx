"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Swal from "sweetalert2";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [verifying, setVerifying] = useState(true);
  const [verificationFailed, setVerificationFailed] = useState(false);
  
  const hasVerified = useRef(false);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  const verifyPayment = useCallback(async () => {
    setVerifying(true);
    setVerificationFailed(false);
    
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, orderId }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: `Your order ${orderId} is confirmed.`,
          confirmButtonColor: "#f97316",
        }).then(() => {
          router.push("/orders");
        });
      } else {
        Swal.fire("Verification Failed", data.message || "Could not verify payment.", "error");
        setVerificationFailed(true);
        setVerifying(false);
      }
    } catch (error) {
      Swal.fire("Error", "A network error occurred during verification.", "error");
      setVerificationFailed(true);
      setVerifying(false);
    }
  }, [sessionId, orderId, clearCart, router]);

  useEffect(() => {
    if (!sessionId || !orderId) {
      setVerifying(false);
      setVerificationFailed(true);
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyPayment();
  }, [sessionId, orderId, verifyPayment]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md w-full">
        {verifying ? (
          <>
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
            <p className="text-gray-500">Please do not close this window.</p>
          </>
        ) : verificationFailed ? (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">!</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Incomplete</h2>
            <p className="text-gray-500 mb-6">We could not confirm your transaction. If you were charged, please retry.</p>
            <div className="space-y-3">
              {sessionId && orderId && (
                <button 
                  onClick={verifyPayment} 
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition cursor-pointer"
                >
                  Retry Verification
                </button>
              )}
              <button 
                onClick={() => router.push("/")} 
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}