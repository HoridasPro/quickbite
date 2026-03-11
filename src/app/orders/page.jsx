"use client";

import OrderHistoryCard from "@/components/orders/OrderHistoryCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.email) {
      fetch(`/api/orders?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch orders", err);
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status, router]);

  const activeOrders = orders
    .filter((o) => ["Pending", "Confirmed", "Cooking", "On the way"].includes(o.status))
    .map(formatOrderForCard);

  const pastOrders = orders
    .filter((o) => ["Delivered", "Cancelled"].includes(o.status))
    .map(formatOrderForCard);

  function formatOrderForCard(order) {
    return {
      id: order.orderId,
      image: order.items?.[0]?.image || "https://via.placeholder.com/80",
      restaurant: order.items?.[0]?.restaurant || "QuickBite",
      items: order.items?.map((i) => `${i.quantity}x ${i.title}`).join(", "),
      date: new Date(order.timestamp).toLocaleString(),
      status: order.status,
      price: order.totalAmount,
    };
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-[680px] mx-auto px-6 py-10">
        <OrdersSection
          title="Active orders"
          orders={activeOrders}
          emptyText="You have no active orders."
        />

        <OrdersSection
          title="Past orders"
          orders={pastOrders}
          emptyText="No past orders yet."
        />
      </div>
    </div>
  );
}

function OrdersSection({ title, orders, emptyText }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

      {orders?.length ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderHistoryCard key={index} {...order} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">{emptyText}</p>
      )}
    </div>
  );
}