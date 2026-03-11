"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import StatusDropdown from "@/components/orders/StatusDropdown";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (data.success) {
      setOrders(data.orders);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });

    const data = await res.json();
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Order ${orderId} is now ${status}`,
        timer: 1500,
        showConfirmButton: false,
      });
      fetchOrders();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Order Management
        </h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* Removed pb-32. Used sm:overflow-visible so dropdowns aren't clipped on desktop */}
      <div className="w-full overflow-x-auto sm:overflow-visible min-h-[400px]"> 
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-4 font-semibold text-gray-600 rounded-tl-xl">Order ID</th>
              <th className="py-4 px-4 font-semibold text-gray-600">Customer</th>
              <th className="py-4 px-4 font-semibold text-gray-600">Amount</th>
              <th className="py-4 px-4 font-semibold text-gray-600 text-center">Payment</th>
              <th className="py-4 px-4 font-semibold text-gray-600 text-center rounded-tr-xl">Status Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-50 hover:bg-gray-50/80 transition duration-200"
              >
                <td className="py-4 px-4 text-gray-700 font-medium">
                  {order.orderId}
                </td>

                <td className="py-4 px-4 text-gray-600">
                  <p className="font-bold text-gray-900">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                  <p className="text-xs mt-0.5">{order.email}</p>
                </td>

                <td className="py-4 px-4 text-orange-600 font-bold">
                  Tk {order.totalAmount}
                </td>

                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="py-4 px-4 text-center align-middle">
                  <div className="flex justify-center">
                    <StatusDropdown 
                      currentStatus={order.status} 
                      orderId={order.orderId} 
                      onStatusChange={handleStatusChange} 
                      paymentStatus={order.paymentStatus}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-12 text-gray-500 font-medium"
                >
                  No orders found on the platform yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}