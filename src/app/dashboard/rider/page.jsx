"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { MapPin, Bike, CheckCircle, Package, Phone, Navigation, Store, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function RiderDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // ENFORCEMENT: Check if the rider is suspended
  const isRestricted = session?.user?.accountStatus && session.user.accountStatus !== "Active";

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrder = async (orderId, newStatus) => {
    // ENFORCEMENT: Frontend block to prevent suspended riders from accepting new deliveries
    if (newStatus === "On the way" && isRestricted) {
      Swal.fire(t("accountRestricted"), t("cannotAcceptNewOrders"), "error");
      return;
    }

    const payload = {
      orderId,
      status: newStatus,
    };

    if (newStatus === "On the way") {
      payload.riderEmail = session?.user?.email;
      payload.riderName = session?.user?.name;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: newStatus === "Delivered" ? t("deliveryCompletedToast") : t("deliveryAcceptedToast"),
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchOrders();
      } else {
        Swal.fire(t("error"), data.message || t("failedUpdateStatus"), "error");
      }
    } catch (error) {
      Swal.fire(t("error"), t("failedUpdateStatus"), "error");
    }
  };

  const availableOrders = orders.filter(o => o.status === "Ready for Pickup" && !o.riderEmail);
  const myActiveOrders = orders.filter(o => o.riderEmail === session?.user?.email && o.status === "On the way");

  if (loading) return <div className="p-10 text-center text-gray-500">{t("loadingRiderDashboard")}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col min-h-[70vh]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("riderDashboard")}</h2>
          <p className="text-gray-500 text-sm">{t("manageDeliveries")}</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
          <Bike size={18} className="text-orange-500" />
          <span className="font-bold text-gray-800">{myActiveOrders.length} {t("activeDeliveries")}</span>
        </div>
      </div>

      {/* ENFORCEMENT UI: Warning Banner for Suspended Riders */}
      {isRestricted && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-yellow-800 font-bold mb-1">{t("accountSuspendedBannerTitle")}</h3>
            <p className="text-yellow-700 text-sm leading-relaxed">
              {t("riderSuspendedBannerDesc")}
            </p>
          </div>
        </div>
      )}

      {myActiveOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <Package size={20} /> {t("myActiveDelivery")}
          </h2>
          <div className="space-y-4">
            {myActiveOrders.map((order) => (
              <div key={order.orderId} className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4 border-b border-orange-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{order.orderId}</span>
                    <h3 className="font-bold text-gray-900 text-lg">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</h3>
                  </div>
                  <span className="font-extrabold text-orange-600 text-xl">Tk {order.totalAmount}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase">{t("pickupFrom")}</p>
                    <div className="flex gap-2 text-gray-800 font-medium">
                      <Store size={18} className="text-gray-400 shrink-0" />
                      {order.items[0]?.restaurant || t("quickBite")}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase">{t("deliverTo")}</p>
                    <div className="flex gap-2 text-gray-800 font-medium">
                      <MapPin size={18} className="text-red-400 shrink-0" />
                      {order.customerInfo?.street}, {order.customerInfo?.city}
                    </div>
                    <div className="flex gap-2 text-gray-800 font-medium">
                      <Phone size={18} className="text-green-500 shrink-0" />
                      {order.customerInfo?.mobile}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateOrder(order.orderId, "Delivered")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-orange-200 flex justify-center items-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={22} /> {t("markAsDelivered")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENFORCEMENT UI: Hide the available pool if the rider is restricted */}
      {!isRestricted && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Navigation size={20} className="text-blue-500" /> {t("availableDeliveries")}
          </h2>
          
          {availableOrders.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
              <Bike size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">{t("noOrdersWaiting")}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {availableOrders.map((order) => (
                <div key={order.orderId} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-lg">Tk {order.totalAmount}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded">{order.orderId}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Store size={14} /> {order.items[0]?.restaurant || t("quickBite")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Navigation size={14} /> {order.customerInfo?.city}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateOrder(order.orderId, "On the way")}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition cursor-pointer whitespace-nowrap"
                  >
                    {t("acceptDeliveryBtn")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}