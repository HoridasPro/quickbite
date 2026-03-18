"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, Trash2, Star } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminReviewsPage() {
  const { t, language } = useTranslation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?page=${page}&limit=15&search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReviews();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

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
      try {
        const res = await fetch("/api/admin/reviews", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (data.success) {
          Swal.fire(t("deletedSuccessTitle"), t("reviewDeletedSuccess"), "success");
          fetchReviews();
        } else {
          Swal.fire(t("error"), data.message || t("failedDeleteReview"), "error");
        }
      } catch (error) {
        Swal.fire(t("error"), t("unexpectedError"), "error");
      }
    }
  };

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-600">
                <th className="p-4 font-semibold w-32">{t("tableItem")}</th>
                <th className="p-4 font-semibold w-48">{t("tableUser")}</th>
                <th className="p-4 font-semibold w-32">{t("tableRating")}</th>
                <th className="p-4 font-semibold">{t("tableReview")}</th>
                <th className="p-4 font-semibold text-right w-24">{t("tableActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    {t("loading")}
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500 font-medium">
                    {t("noReviewsFound")}
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 align-top">
                      <p className="font-bold text-gray-900 leading-tight">
                        {language === "bn" && review.itemInfo?.titleBn ? review.itemInfo.titleBn : (review.itemInfo?.title || review.itemId)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {review.itemId}</p>
                    </td>
                    <td className="p-4 align-top">
                      <p className="font-bold text-gray-900">{review.user}</p>
                      <p className="text-xs text-orange-500 font-medium lowercase">{review.userEmail || "N/A"}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
                        {review.comment}
                      </p>
                    </td>
                    <td className="p-4 align-top text-right">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={t("actionDelete")}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
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
    </div>
  );
}