"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, MapPin, Store } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomDropdown from "@/components/admin/CustomDropdown";
import StatusDropdown from "@/components/orders/StatusDropdown";
import DataTable from "@/components/admin/DataTable";

export default function AdminDeliveryPage() {
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();
  const isBn = language === "bn";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 1. Fetch Orders and Riders in parallel
  const { data: allOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      return data.success ? data.orders : [];
    }
  });

  const { data: riders = [], isLoading: isLoadingRiders } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/riders");
      const data = await res.json();
      return data.success ? data.riders : [];
    }
  });

  const isLoading = isLoadingOrders || isLoadingRiders;

  // 2. Unified Mutation for both Status Updates and Rider Assignment
  const updateOrderMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      Swal.fire({
        icon: "success",
        title: variables.riderEmail ? t("riderAssignedSuccess") : t("statusUpdated"),
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      Swal.fire(t("error"), error.message || t("failedUpdateStatus"), "error");
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderMutation.mutate({ orderId, status: newStatus });
  };

  const handleAssignRider = (orderId, riderEmail) => {
    if (!riderEmail) return;
    const selectedRider = riders.find(r => r.email === riderEmail);
    
    updateOrderMutation.mutate({
      orderId,
      status: "On the way", // Force status to 'on the way' when assigning
      riderEmail: selectedRider.email,
      riderName: selectedRider.name,
    });
  };

  // 3. Prepare Dropdown Options
  const riderOptions = riders.map(r => ({
    id: r.email,
    label: `${r.name} (${r.email})`
  }));

  const statusOptions = [
    { id: "All", label: t("statusFilterAll") },
    { id: "Ready for Pickup", label: t("statusReady") },
    { id: "On the way", label: t("statusOnTheWay") },
    { id: "Delivered", label: t("statusDelivered") }
  ];

  // 4. Define Table Columns
  const columns = [
    {
      accessorKey: "orderId",
      header: () => <div className="w-24">{t("tableOrderId")}</div>,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase align-top">
          {row.original.orderId}
        </span>
      ),
    },
    {
      id: "deliveryDetails",
      header: t("deliveryDetails"),
      cell: ({ row }) => {
        const order = row.original;
        const restaurantName = order.items[0]?.restaurant || t("quickBite");
        return (
          <div className="space-y-3 align-top">
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
        );
      },
    },
    {
      id: "rider",
      header: () => <div className="w-56">{t("tableRider")}</div>,
      cell: ({ row }) => {
        const order = row.original;
        return order.riderEmail ? (
          <div className="align-middle">
            <p className="font-bold text-gray-900">{order.riderName}</p>
            <p className="text-xs text-gray-500">{order.riderEmail}</p>
          </div>
        ) : (
          <div className="align-middle">
            <CustomDropdown 
              value={order.riderEmail || ""}
              onChange={(val) => handleAssignRider(order.orderId, val)}
              options={riderOptions}
              placeholder={t("assignRiderBtn")}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right w-40">{t("tableStatusAction")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-end align-middle">
          <StatusDropdown 
            currentStatus={row.original.status} 
            orderId={row.original.orderId} 
            onStatusChange={handleStatusChange} 
            paymentStatus={row.original.paymentStatus}
          />
        </div>
      ),
    }
  ];

  // 5. Client-Side Filtering
  const filteredOrders = allOrders
    .filter(o => ["Ready for Pickup", "On the way", "Delivered"].includes(o.status))
    .filter(order => {
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

      <DataTable 
        columns={columns} 
        data={filteredOrders} 
        isLoading={isLoading} 
        emptyMessage={t("noActiveDeliveriesPool")} 
      />
    </div>
  );
}