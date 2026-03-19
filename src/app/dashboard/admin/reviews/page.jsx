"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, Trash2, Star } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/admin/DataTable";

export default function AdminReviewsPage() {
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Sync search input to debouncedSearch with a 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch Data with React Query
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", page, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/admin/reviews?page=${page}&limit=15&search=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    keepPreviousData: true,
  });

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 1;

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire(t("deletedSuccessTitle"), t("reviewDeletedSuccess"), "success");
        queryClient.invalidateQueries(["reviews"]);
      } else {
        Swal.fire(t("error"), data.message || t("failedDeleteReview"), "error");
      }
    },
    onError: () => {
      Swal.fire(t("error"), t("unexpectedError"), "error");
    }
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("areYouSure"),
      text: t("deleteReviewConfirm"),
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
      id: "item",
      header: t("tableItem"),
      cell: ({ row }) => {
        const review = row.original;
        const displayTitle = language === "bn" && review.itemInfo?.titleBn 
          ? review.itemInfo.titleBn 
          : (review.itemInfo?.title || review.itemId);
        
        return (
          <div className="align-top">
            <p className="font-bold text-gray-900 leading-tight">{displayTitle}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {review.itemId}</p>
          </div>
        );
      },
    },
    {
      id: "user",
      header: t("tableUser"),
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className="align-top">
            <p className="font-bold text-gray-900">{review.user}</p>
            <p className="text-xs text-orange-500 font-medium lowercase">{review.userEmail || "N/A"}</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {review.date ? new Date(review.date).toLocaleDateString() : t("recent")}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: t("tableRating"),
      cell: ({ row }) => (
        <div className="flex items-center align-top">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < row.original.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
            />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: t("tableReview"),
      cell: ({ row }) => (
        <div className="align-top">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
            {row.original.comment}
          </p>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("tableActions")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-end align-top">
          <button
            onClick={() => handleDelete(row.original._id)}
            disabled={deleteMutation.isPending}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title={t("actionDelete")}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {t("reviewModeration")}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t("manageReviewsDesc")}</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <DataTable 
          columns={columns} 
          data={reviews} 
          isLoading={isLoading} 
          emptyMessage={t("noReviewsFound")} 
        />
      </div>

      {/* Pagination Controls */}
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