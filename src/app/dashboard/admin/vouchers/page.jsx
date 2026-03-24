"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Search, Plus, Trash2, Pencil, Clock, Store, Globe } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

export default function AdminVouchersPage() {
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vouchers"],
    queryFn: async () => {
      const res = await fetch("/api/vouchers");
      if (!res.ok) throw new Error("Failed to fetch vouchers");
      return res.json();
    }
  });

  const vouchers = data?.vouchers || [];

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/vouchers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete voucher");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire(t("deletedSuccessTitle") || "Deleted!", "Voucher has been deleted.", "success");
        queryClient.invalidateQueries(["admin-vouchers"]);
      } else {
        Swal.fire(t("error") || "Error", data.message || "Failed to delete", "error");
      }
    },
    onError: () => {
      Swal.fire(t("error") || "Error", t("unexpectedError") || "An unexpected error occurred", "error");
    }
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("areYouSure") || "Are you sure?",
      text: t("cannotRevert") || "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("confirmDeleteBtn") || "Yes, delete it!"
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const formatDiscount = (type, value) => {
    if (type === "percentage") return `${value}% OFF`;
    if (type === "fixed") return `Tk ${value} OFF`;
    if (type === "free_delivery") return `Free Delivery`;
    return `${value}`;
  };

  const columns = [
    {
      id: "details",
      header: t("voucherDetails") || "Voucher Details",
      meta: { expandable: true, align: "align-top" },
      cell: ({ row }) => {
        const title = language === "bn" && row.original.titleBn ? row.original.titleBn : row.original.title;
        const subtitle = language === "bn" && row.original.subtitleBn ? row.original.subtitleBn : row.original.subtitle;

        return (
          <div className="pt-1">
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{subtitle}</p>
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-500 font-medium">
              {row.original.applicableTo === "restaurant" ? (
                <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                  <Store className="w-3 h-3" /> Specific Restaurants
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                  <Globe className="w-3 h-3" /> All Orders
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "code",
      header: t("voucherCode") || "Code",
      meta: { widthClass: "w-[15%]", align: "align-top" },
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold bg-gray-100 text-gray-800 px-2.5 py-1.5 rounded uppercase tracking-wider mt-1 inline-block border border-gray-200">
          {row.original.code}
        </span>
      )
    },
    {
      id: "discount",
      header: t("discountValue") || "Discount",
      meta: { widthClass: "w-[15%]", align: "align-top" },
      cell: ({ row }) => (
        <span className="text-sm font-bold text-gray-800 mt-1 inline-block">
          {formatDiscount(row.original.discountType, row.original.discountValue)}
        </span>
      )
    },
    {
      id: "usage",
      header: t("usageLimit") || "Usage",
      meta: { widthClass: "w-[15%]", align: "align-top" },
      cell: ({ row }) => {
        const used = row.original.usedCount || 0;
        const limit = row.original.usageLimit || "∞";
        return (
          <span className="text-sm font-medium text-gray-600 mt-1 inline-block">
            {used} / {limit}
          </span>
        );
      }
    },
    {
      id: "status",
      header: t("voucherStatus") || "Status",
      meta: { widthClass: "w-[15%]", align: "align-top" },
      cell: ({ row }) => {
        const status = row.original.status;
        let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
        
        if (status === "Active") colorClass = "bg-green-50 text-green-700 border-green-200";
        if (status === "Expired") colorClass = "bg-red-50 text-red-700 border-red-200";
        if (status === "Fully Claimed") colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";

        return (
          <div className="flex flex-col items-start gap-1 mt-1">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
              {status}
            </span>
            {row.original.expiryDate && (
              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {new Date(row.original.expiryDate).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("tableActions") || "Actions"}</div>,
      meta: { widthClass: "w-[120px]", align: "align-top" },
      cell: ({ row }) => (
        <div className="flex justify-end gap-1 pt-1">
          <Link
            href={`/dashboard/admin/vouchers/${row.original._id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t("actionEdit") || "Edit"}
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.original._id)}
            disabled={deleteMutation.isPending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title={t("actionDelete") || "Delete"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredVouchers = vouchers.filter(v => 
    v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.titleBn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {t("voucherManagement") || "Vouchers"}
          </h2>
          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-1.5 rounded-full mt-2 inline-block">
            {t("total") || "Total"}: {filteredVouchers.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder") || "Search vouchers..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <Link
            href="/dashboard/admin/vouchers/add"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-100 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold text-sm">{t("addNewVoucher") || "Add Voucher"}</span>
          </Link>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredVouchers} 
        isLoading={isLoading} 
        emptyMessage={t("noVouchersFound") || "No vouchers found"} 
      />
    </div>
  );
}