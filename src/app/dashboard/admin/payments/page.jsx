"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";

export default function AdminPaymentsPage() {
  const { t } = useTranslation();

  // 1. Fetch Data with React Query
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("/api/admin/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      return data.success ? data.payments : [];
    }
  });

  // 2. Define Table Columns
  const columns = [
    {
      accessorKey: "orderId",
      header: () => (
        <div className="flex items-center gap-2">
          {t("tableTransactionId")}
        </div>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
          {row.original.orderId}
        </span>
      ),
    },
    {
      id: "customer",
      header: () => (
        <div className="flex items-center gap-2">
          {t("tableCustomer")}
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.original.customerInfo?.email || row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: t("tableAmount"),
      cell: ({ row }) => (
        <span className="font-bold text-green-600">
          Tk {row.original.totalAmount}
        </span>
      ),
    },
    {
      accessorKey: "timestamp",
      header: () => (
        <div className="flex items-center gap-2">
          {t("tableDate")}
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {new Date(row.original.timestamp).toLocaleDateString()}
        </span>
      ),
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {t("paymentsManagement")}
        </h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full">
          {t("total")}: {payments.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={payments} 
          isLoading={isLoading} 
          emptyMessage={t("noPaymentsFound")} 
        />
      </div>
    </div>
  );
}