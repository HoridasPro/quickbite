"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";

export default function AdminFoodsPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["foods", page, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/foods?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Failed to fetch foods");
      return res.json();
    },
    keepPreviousData: true,
  });

  const foods = data?.foods || [];
  const totalPages = data?.totalPages || 1;

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/foods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete food");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire(t("deletedSuccessTitle"), t("foodDeletedSuccess"), "success");
        queryClient.invalidateQueries(["foods"]);
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
      text: t("deleteFoodConfirm"),
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

  const columns = [
    {
      id: "foodImg",
      header: t("foodImage"),
      meta: { widthClass: "w-[80px]", align: "align-top" },
      cell: ({ row }) => (
        <img
          src={row.original.foodImg || "https://via.placeholder.com/150"}
          alt={row.original.title || row.original.foodName}
          className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm"
        />
      ),
    },
    {
      id: "title",
      header: t("foodNameInput"),
      meta: { expandable: true, align: "align-top" },
      cell: ({ row }) => {
        const food = row.original;
        return <span className="font-bold text-gray-900">{isBn && food.titleBn ? food.titleBn : food.title || food.foodName}</span>;
      }
    },
    {
      id: "restaurant_name",
      header: t("restaurantNameInput"),
      meta: { widthClass: "w-[200px]", align: "align-top" },
      cell: ({ row }) => {
        const food = row.original;
        return <span className="text-gray-600 text-sm font-medium">{isBn && food.restaurant_nameBn ? food.restaurant_nameBn : food.restaurant_name || "N/A"}</span>;
      }
    },
    {
      id: "category",
      header: t("categoryLabel"),
      meta: { widthClass: "w-[150px]", align: "align-top" },
      cell: ({ row }) => {
        const food = row.original;
        return <span className="text-gray-500 text-sm bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{isBn && food.categoryBn ? food.categoryBn : food.category || food.categoryName}</span>;
      }
    },
    {
      id: "price",
      header: t("foodPrice"),
      meta: { widthClass: "w-[120px]", align: "align-top" },
      cell: ({ row }) => {
        const food = row.original;
        return <span className="font-bold text-orange-600">{isBn && food.priceBn ? food.priceBn : `Tk ${food.price}`}</span>;
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("tableActions")}</div>,
      meta: { widthClass: "w-[120px]", align: "align-top" },
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/admin/foods/${row.original.id}`}
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
          <h1 className="text-2xl font-bold text-gray-900">{t("foodManagement")}</h1>
        </div>
        <Link
          href="/dashboard/admin/foods/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-orange-100"
        >
          <Plus className="w-5 h-5" />
          <span>{t("addNewFood")}</span>
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
          data={foods} 
          isLoading={isLoading} 
          emptyMessage={`${t("foodsFound")}: 0`} 
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