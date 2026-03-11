"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OrderTracker from "@/components/orders/OrderTracker";
import { ArrowLeft, Store, MapPin, Bike } from "lucide-react";
import Link from "next/link";

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { status } = useSession();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await res.json();
      if (data.success && data.orders.length > 0) {
        setOrder(data.orders[0]);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchOrder();
      // Poll for live updates every 10 seconds
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [status, orderId, router]);

  if (loading || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Connecting to live tracker...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Order not found or access denied.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/orders" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.orderId}</h1>
            <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
          </div>
        </div>

        {/* Live Tracker */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 pb-16 md:pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">Live Status</h2>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {order.status}
            </span>
          </div>
          <OrderTracker status={order.status} />
        </div>

        {/* Rider Info (If assigned) */}
        {order.riderName && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Bike className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Rider</p>
              <p className="font-bold text-gray-900 text-lg">{order.riderName}</p>
            </div>
          </div>
        )}

        {/* Order Details & Addresses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Store className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pickup</p>
                <p className="font-semibold text-gray-900">{order.items[0]?.restaurant || "QuickBite Hub"}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Delivery</p>
                <p className="font-semibold text-gray-900">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                <p className="text-sm text-gray-600">{order.customerInfo?.street}, {order.customerInfo?.city}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded text-sm h-fit">{item.quantity}x</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-600">Tk {item.totalPrice}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-orange-600">Tk {order.totalAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}