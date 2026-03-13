"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ChefHat, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders for kitchen:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: newStatus === "Cooking" ? t("startedCookingToast") : t("orderReadyToast"),
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchOrders();
      }
    } catch (error) {
      Swal.fire(t("error"), t("failedUpdateStatus"), "error");
    }
  };

  const newOrders = orders.filter((o) => o.status === "Confirmed" && o.paymentStatus === "Paid");
  const cookingOrders = orders.filter((o) => o.status === "Cooking");

  const OrderTicket = ({ order, type }) => (
    <div className={`bg-white rounded-xl shadow-sm border-t-4 p-5 flex flex-col ${type === 'new' ? 'border-blue-500' : 'border-yellow-500'}`}>
      <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{order.orderId}</span>
          <h3 className="font-bold text-gray-900 mt-1">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</h3>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
          <Clock size={14} />
          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {order.items.map((item, idx) => {
          const displayTitle = isBn && item.titleBn ? item.titleBn : item.title;
          
          return (
            <div key={idx} className="flex gap-3">
              <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded h-fit">{item.quantity}x</span>
              <div>
                <p className="font-semibold text-gray-900">{displayTitle}</p>
                {item.selectedVariations && Object.values(item.selectedVariations).map((variant, i) => {
                  if (Array.isArray(variant)) return variant.map((v, j) => {
                    const vName = isBn && v.nameBn ? v.nameBn : v.name;
                    return <p key={`${i}-${j}`} className="text-xs text-gray-500">+ {vName}</p>;
                  });
                  else if (variant) {
                    const vName = isBn && variant.nameBn ? variant.nameBn : variant.name;
                    return <p key={i} className="text-xs text-gray-500">+ {vName}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
        {order.customerInfo?.note && (
          <div className="bg-red-50 text-red-700 p-2 rounded-lg text-xs font-medium border border-red-100 mt-2">
            <span className="font-bold">{t("noteLabel")}</span> {order.customerInfo.note}
          </div>
        )}
      </div>

      {type === 'new' ? (
        <button 
          onClick={() => updateOrderStatus(order.orderId, "Cooking")}
          className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors py-3 rounded-lg font-bold flex justify-center items-center gap-2 cursor-pointer"
        >
          <ChefHat size={18} /> {t("btnStartCooking")}
        </button>
      ) : (
        <button 
          onClick={() => updateOrderStatus(order.orderId, "Ready for Pickup")}
          className="w-full bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white border border-yellow-200 transition-colors py-3 rounded-lg font-bold flex justify-center items-center gap-2 cursor-pointer"
        >
          <CheckCircle size={18} /> {t("btnMarkReady")}
        </button>
      )}
    </div>
  );

  if (loading) return <div className="p-10 text-center text-gray-500">{t("loadingKitchenDisplay")}</div>;

  return (
    <div className="w-full h-full flex flex-col min-h-[70vh]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("kitchenDisplaySystem")}</h2>
          <p className="text-gray-500 text-sm">{t("manageIncomingOrders")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start">
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 min-h-[500px]">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
            <span>{t("newOrders")}</span>
            <span className="bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full text-xs">{newOrders.length}</span>
          </h3>
          <div className="space-y-4">
            {newOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">{t("noNewOrders")}</div>
            ) : (
              newOrders.map(order => <OrderTicket key={order.orderId} order={order} type="new" />)
            )}
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 min-h-[500px]">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
            <span>{t("cookingNow")}</span>
            <span className="bg-yellow-100 text-yellow-700 py-0.5 px-2.5 rounded-full text-xs">{cookingOrders.length}</span>
          </h3>
          <div className="space-y-4">
            {cookingOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">{t("kitchenClear")}</div>
            ) : (
              cookingOrders.map(order => <OrderTicket key={order.orderId} order={order} type="cooking" />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}