"use client";

import OrderHistoryCard from "@/components/orders/OrderHistoryCard";

export default function OrdersPage() {
  const activeOrders = [
    {
      image: "https://i.ibb.co.com/qL2pycTr/Hot-Honey-Pimento-Cheese-Fried-Chicken-Sandwich.jpg",
      restaurant: "KFC",
      items: "Zinger Burger, Wings",
      date: "Arriving in 20 mins",
      status: "On the way",
      price: 620,
    },
    {
      image: "https://i.ibb.co.com/5X5FFwvH/download.jpg",
      restaurant: "Pizza Hut",
      items: "Cheese Pizza, Garlic Bread",
      date: "Preparing your order",
      status: "Pending",
      price: 890,
    },
  ];

  const pastOrders = [
    {
      image: "https://i.ibb.co.com/qL2pycTr/Hot-Honey-Pimento-Cheese-Fried-Chicken-Sandwich.jpg",
      restaurant: "Burger King",
      items: "Chicken Burger, Fries",
      date: "18 Feb 2026 • 8:30 PM",
      status: "Delivered",
      price: 450,
    },
    {
      image: "https://i.ibb.co.com/5X5FFwvH/download.jpg",
      restaurant: "Pizza Hut",
      items: "Cheese Pizza, Coke",
      date: "16 Feb 2026 • 9:10 PM",
      status: "Cancelled",
      price: 890,
    },
    {
      image: "https://i.ibb.co.com/TMWkCf20/image.jpg",
      restaurant: "Sultan Dine",
      items: "Kacchi, Borhani",
      date: "14 Feb 2026 • 2:00 PM",
      status: "Delivered",
      price: 750,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-[680px] mx-auto px-6 py-10">

        {/* Active Orders */}
        <OrdersSection
          title="Active orders"
          orders={activeOrders}
          emptyText="You have no active orders."
        />

        {/* Past Orders */}
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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {title}
      </h2>

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
