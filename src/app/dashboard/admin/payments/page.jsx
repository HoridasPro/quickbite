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
      header: () => <div className="flex items-center gap-2">{t("tableTransactionId")}</div>,
      meta: { widthClass: "w-[25%]" }, // Added width control
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold bg-gray-100 px-2.5 py-1.5 rounded text-gray-600 uppercase tracking-wider">
          {row.original.orderId}
        </span>
      ),
    },
    {
      id: "customer",
      header: () => <div className="flex items-center gap-2">{t("tableCustomer")}</div>,
      meta: { expandable: true }, // Allows email to truncate/expand gracefully
      cell: ({ row }) => (
        <div className="flex flex-col">
          {row.original.customerInfo?.firstName && (
            <span className="font-bold text-gray-900 text-sm">
              {row.original.customerInfo.firstName} {row.original.customerInfo.lastName}
            </span>
          )}
          <span className="text-sm text-gray-500">
            {row.original.customerInfo?.email || row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: t("tableAmount"),
      meta: { widthClass: "w-[20%]" }, // Added width control
      cell: ({ row }) => (
        <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
          Tk {row.original.totalAmount}
        </span>
      ),
    },
    {
      accessorKey: "timestamp",
      header: () => <div className="flex items-center gap-2">{t("tableDate")}</div>,
      meta: { widthClass: "w-[25%]" }, // Added width control
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 font-medium">
          {new Date(row.original.timestamp).toLocaleString()} {/* Changed to localeString to show time of payment */}
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