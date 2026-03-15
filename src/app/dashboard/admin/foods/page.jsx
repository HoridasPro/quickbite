"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminFoodsPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/foods?page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      setFoods(data.foods || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFoods();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

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
      try {
        const res = await fetch("/api/foods", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (data.success) {
          Swal.fire(t("deletedSuccessTitle"), t("foodDeletedSuccess"), "success");
          fetchFoods();
        } else {
          Swal.fire(t("error"), data.message || "Failed to delete", "error");
        }
      } catch (error) {
        Swal.fire(t("error"), t("unexpectedError"), "error");
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("foodManagement")}</h1>
        </div>
        <Link
          href="/dashboard/admin/foods/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t("addNewFood")}</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-medium">{t("foodImage")}</th>
                <th className="p-4 font-medium">{t("foodNameInput")}</th>
                <th className="p-4 font-medium">{t("restaurantNameInput")}</th>
                <th className="p-4 font-medium">{t("categoryLabel")}</th>
                <th className="p-4 font-medium">{t("foodPrice")}</th>
                <th className="p-4 font-medium">{t("tableActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      {t("loading")}
                    </div>
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    {t("foodsFound")}: 0
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <img
                        src={food.foodImg}
                        alt={food.title || food.foodName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {isBn && food.titleBn ? food.titleBn : food.title || food.foodName}
                    </td>
                    <td className="p-4 text-gray-700">
                      {isBn && food.restaurant_nameBn ? food.restaurant_nameBn : food.restaurant_name || "N/A"}
                    </td>
                    <td className="p-4 text-gray-500">
                      {isBn && food.categoryBn ? food.categoryBn : food.category || food.categoryName}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {isBn && food.priceBn ? food.priceBn : `Tk ${food.price}`}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/foods/${food.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t("actionEdit")}
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("actionDelete")}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              {t("previous")}
            </button>
            <span className="text-sm text-gray-500">
              {t("pageText")} {page} {t("ofText")} {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              {t("next")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}