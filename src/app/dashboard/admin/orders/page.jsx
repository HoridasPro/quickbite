"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Search } from "lucide-react";
import StatusDropdown from "@/components/orders/StatusDropdown";
import DataTable from "@/components/admin/DataTable";

export default function OrdersManagementPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      return data.success ? data.orders : [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: t("statusUpdated"),
          text: `${t("orderPrefix")} ${variables.orderId} - ${variables.status}`,
          timer: 1500,
          showConfirmButton: false,
        });
        queryClient.invalidateQueries(["orders"]);
      }
    }
  });

  const handleStatusChange = (orderId, status) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const columns = [
    {
      accessorKey: "orderId",
      header: t("tableOrderId"),
      cell: ({ row }) => <span className="font-medium text-gray-700">{row.original.orderId}</span>,
    },
    {
      id: "customer",
      header: t("tableCustomer"),
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-gray-900">
            {row.original.customerInfo?.firstName} {row.original.customerInfo?.lastName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: t("tableAmount"),
      cell: ({ row }) => <span className="font-bold text-orange-600">Tk {row.original.totalAmount}</span>,
    },
    {
      accessorKey: "paymentStatus",
      header: () => <div className="text-center">{t("tablePayment")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-md ${
              row.original.paymentStatus === "Paid"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.original.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("tableStatusAction")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
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

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${order.customerInfo?.firstName || ""} ${order.customerInfo?.lastName || ""}`.toLowerCase();
    
    return (
      order.orderId?.toLowerCase().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("orderManagement")}
          </h2>
          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full mt-2 inline-block">
            {t("totalOrders")}: {filteredOrders.length}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
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
        emptyMessage={t("noOrdersFoundPlatform")} 
      />
    </div>
  );
}