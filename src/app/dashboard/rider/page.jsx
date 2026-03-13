"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { MapPin, Bike, CheckCircle, Package, Phone, Navigation, Store } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function RiderDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
          title: newStatus === "On the way" ? t("deliveryAcceptedToast") : t("orderDeliveredToast"),
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchOrders();
      }
    } catch (error) {
      Swal.fire(t("error"), t("failedUpdateOrder"), "error");
    }
  };

  const availableOrders = orders.filter(
    (o) => o.status === "Ready for Pickup" && !o.riderEmail
  );

  const myActiveOrders = orders.filter(
    (o) => o.status === "On the way" && o.riderEmail === session?.user?.email
  );

  if (loading) return <div className="p-10 text-center text-gray-500">{t("loadingDeliveryPool")}</div>;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-10">
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bike className="text-orange-500" /> {t("myActiveDelivery")}
        </h2>
        
        {myActiveOrders.length === 0 ? (
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 text-center text-orange-600 font-medium">
            {t("noActiveDeliveries")}
          </div>
        ) : (
          <div className="space-y-4">
            {myActiveOrders.map((order) => (
              <div key={order.orderId} className="bg-white border-2 border-orange-400 shadow-md rounded-2xl overflow-hidden">
                <div className="bg-orange-500 text-white px-4 py-2 flex justify-between items-center font-bold text-sm">
                  <span>{t("orderPrefix")}: {order.orderId}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded">Tk {order.totalAmount}</span>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex gap-3">
                    <Store className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t("pickupFrom")}</p>
                      <p className="font-semibold text-gray-900">{order.items[0]?.restaurant || t("quickBite")}</p>
                      <p className="text-sm text-gray-600">{order.items.length} {t("itemsToCollect")}</p>
                    </div>
                  </div>

                  <div className="border-l-2 border-dashed border-gray-200 ml-2.5 h-6 my-1"></div>

                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">{t("deliverTo")}</p>
                      <p className="font-semibold text-gray-900">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                      <p className="text-sm text-gray-600">{order.customerInfo?.street}, {order.customerInfo?.city}</p>
                      {order.customerInfo?.apartment && <p className="text-sm text-gray-600">{t("aptPrefix")} {order.customerInfo.apartment}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <a 
                      href={`tel:${order.customerInfo?.mobile}`}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition"
                    >
                      <Phone size={18} /> {t("callBtn")}
                    </a>
                    <button 
                      onClick={() => handleUpdateOrder(order.orderId, "Delivered")}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition cursor-pointer shadow-sm shadow-green-200"
                    >
                      <CheckCircle size={18} /> {t("deliveredBtn")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="text-gray-500" /> {t("availableForPickup")}
          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm">{availableOrders.length}</span>
        </h2>

        {availableOrders.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 text-center text-gray-500">
            {t("noOrdersReadyPickup")}
          </div>
        ) : (
          <div className="space-y-4">
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

    </div>
  );
}