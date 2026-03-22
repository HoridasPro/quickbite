"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";

export default function AuditLogsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["auditLogs", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=15`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
    keepPreviousData: true,
  });

  const logs = data?.logs || [];
  const totalPages = data?.totalPages || 1;

  const columns = [
    {
      accessorKey: "action",
      header: t("tableActionType"),
      meta: { widthClass: "w-[160px]" },
      cell: ({ row }) => (
        <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap inline-block text-center mt-1">
          {row.original.action.replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "adminEmail",
      header: t("tableAdminEmail"),
      meta: { expandable: true },
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.adminEmail}</span>,
    },
    {
      id: "deletedContent",
      header: t("tableDeletedContent"),
      meta: { expandable: true },
      cell: ({ row }) => (
        <>
          <span className="italic">"{row.original.deletedContent}"</span>
          <span className="block text-[10px] text-gray-400 mt-1.5 font-mono">Item ID: {row.original.itemId}</span>
        </>
      ),
    },
    {
      accessorKey: "deletedAt",
      header: () => <div className="text-right">{t("tableDate")}</div>,
      meta: { widthClass: "w-[180px]" },
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 text-right">
          {new Date(row.original.deletedAt).toLocaleString()}
        </div>
      ),
    }
  ];

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("auditLogs")}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t("auditLogsDesc")}</p>
        </div>
      </div>

      <div className="mb-4">
        <DataTable 
          columns={columns} 
          data={logs} 
          isLoading={isLoading} 
          emptyMessage={t("noLogsFound")} 
        />
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer disabled:cursor-not-allowed"
          >
            {t("previous")}
          </button>
          <span className="text-sm font-medium text-gray-600">
            {t("pageText")} {page} {t("ofText")} {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer disabled:cursor-not-allowed"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}