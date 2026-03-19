"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Edit, Trash2, Plus, Search, Store } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";

export default function AdminRestaurantsPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Sync search input to debouncedSearch with a 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 1. Fetch Data with React Query
  const { data, isLoading } = useQuery({
    queryKey: ["restaurants", page, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/restaurants?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      return res.json();
    },
    keepPreviousData: true, 
  });

  const restaurants = data?.restaurants || [];
  const totalPages = data?.totalPages || 1;

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete restaurant");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire(t("deletedSuccessTitle"), t("restaurantDeletedSuccess"), "success");
        queryClient.invalidateQueries(["restaurants"]);
      } else {
        Swal.fire(t("error"), data.message || "Failed to delete", "error");
      }
    },
    onError: () => {
      Swal.fire(t("error"), t("unexpectedError"), "error");
    }
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("areYouSure"),
      text: t("cannotRevert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("confirmDeleteBtn"),
      cancelButtonText: t("cancelBtn"),
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  // 3. Define Table Columns
  const columns = [
    {
      id: "logo",
      header: t("foodImage"),
      cell: ({ row }) => {
        const item = row.original;
        return item.logo ? (
          <img
            src={item.logo}
            alt={item.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Store className="w-6 h-6" />
          </div>
        );
      },
    },
    {
      id: "name",
      header: t("restaurantName"),
      cell: ({ row }) => {
        const item = row.original;
        return <span className="font-medium text-gray-900">{isBn && item.nameBn ? item.nameBn : item.name}</span>;
      }
    },
    {
      id: "address",
      header: t("restaurantAddress"),
      cell: ({ row }) => (
        <div className="text-gray-600 text-sm max-w-xs truncate" title={row.original.address}>
          {row.original.address}
        </div>
      ),
    },
    {
      id: "contact",
      header: t("restaurantContact"),
      cell: ({ row }) => <span className="text-gray-600 text-sm">{row.original.contact}</span>,
    },
    {
      id: "status",
      header: t("restaurantStatus"),
      cell: ({ row }) => {
        const status = row.original.status || 'Active';
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {status}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: t("tableActions"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/admin/restaurants/${row.original.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t("actionEdit")}
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDelete(row.original.id)}
            disabled={deleteMutation.isPending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title={t("actionDelete")}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("restaurantManagement")}</h1>
        </div>
        <Link
          href="/dashboard/admin/restaurants/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-orange-100"
        >
          <Plus className="w-5 h-5" />
          <span>{t("addNewRestaurant")}</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={restaurants} 
          isLoading={isLoading} 
          emptyMessage={t("noUsersFound")} 
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
          <span className="text-sm text-gray-500">
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