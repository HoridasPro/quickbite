"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, MapPin, Store } from "lucide-react";
import Swal from "sweetalert2";
import CustomDropdown from "@/components/admin/CustomDropdown";
import StatusDropdown from "@/components/orders/StatusDropdown";

export default function AdminDeliveryPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all orders
      const orderRes = await fetch("/api/orders");
      const orderData = await orderRes.json();
      
      // Fetch available riders
      const riderRes = await fetch("/api/admin/riders");
      const riderData = await riderRes.json();

      if (orderData.success) {
        // Only care about deliveries that are in progress or done
        const deliveryOrders = orderData.orders.filter(o => 
          ["Ready for Pickup", "On the way", "Delivered"].includes(o.status)
        );
        setOrders(deliveryOrders);
      }
      if (riderData.success) {
        setRiders(riderData.riders);
      }
    } catch (error) {
      console.error("Failed to fetch delivery data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    const data = await res.json();
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: t("statusUpdated"),
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
    }
  };

  const handleAssignRider = async (orderId, riderEmail) => {
    if (!riderEmail) return;
    
    const selectedRider = riders.find(r => r.email === riderEmail);

    const payload = {
      orderId,
      status: "On the way", // Force status to on the way when assigning
      riderEmail: selectedRider.email,
      riderName: selectedRider.name,
    };

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
          title: t("riderAssignedSuccess"),
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchData();
      } else {
        Swal.fire(t("error"), data.message || t("failedAssignRider"), "error");
      }
    } catch (error) {
      Swal.fire(t("error"), t("unexpectedError"), "error");
    }
  };

  const riderOptions = riders.map(r => ({
    id: r.email,
    label: `${r.name} (${r.email})`
  }));

  // FIX: Formatted the status options for CustomDropdown
  const statusOptions = [
    { id: "All", label: t("statusFilterAll") },
    { id: "Ready for Pickup", label: t("statusReady") },
    { id: "On the way", label: t("statusOnTheWay") },
    { id: "Delivered", label: t("statusDelivered") }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerInfo?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.riderName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {t("deliveryManagement")}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t("manageDeliveriesDesc")}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* FIX: Replaced native select with CustomDropdown */}
          <div className="w-full sm:w-48">
            <CustomDropdown 
              value={statusFilter}
              onChange={(val) => setStatusFilter(val || "All")}
              options={statusOptions}
              placeholder={t("statusFilterAll")}
            />
          </div>

          <div className="relative w-full sm:w-64 z-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto sm:overflow-visible min-h-[400px] bg-white border border-gray-100 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm w-32">{t("tableOrderId")}</th>
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm">{t("deliveryDetails")}</th>
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm w-64">{t("tableRider")}</th>
              <th className="py-4 px-5 font-semibold text-gray-600 text-sm w-48 text-right">{t("tableStatusAction")}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
               <tr>
                <td colSpan="4" className="py-16 text-center text-gray-400">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  {t("loading")}
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-16 text-gray-500 font-medium">
                  {t("noActiveDeliveriesPool")}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const restaurantName = order.items[0]?.restaurant || t("quickBite");
                return (
                  <tr key={order._id} className="hover:bg-gray-50/80 transition duration-200">
                    <td className="py-4 px-5 align-top">
                      <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">
                        {order.orderId}
                      </span>
                    </td>

                    <td className="py-4 px-5 align-top">
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Store size={16} className="text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("pickupFrom")}</p>
                            <p className="text-sm font-semibold text-gray-900">{restaurantName}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{t("deliverTo")}</p>
                            <p className="text-sm font-semibold text-gray-900">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                            <p className="text-xs text-gray-500">{order.customerInfo?.street}, {order.customerInfo?.city}</p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 align-middle">
                      {order.riderEmail ? (
                        <div>
                          <p className="font-bold text-gray-900">{order.riderName}</p>
                          <p className="text-xs text-gray-500">{order.riderEmail}</p>
                        </div>
                      ) : (
                         <CustomDropdown 
                            value={order.riderEmail || ""}
                            onChange={(val) => handleAssignRider(order.orderId, val)}
                            options={riderOptions}
                            placeholder={t("assignRiderBtn")}
                         />
                      )}
                    </td>

                    <td className="py-4 px-5 text-right align-middle">
                      <div className="flex justify-end">
                        <StatusDropdown 
                          currentStatus={order.status} 
                          orderId={order.orderId} 
                          onStatusChange={handleStatusChange} 
                          paymentStatus={order.paymentStatus}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}