"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { ChevronLeft, Save, Ticket } from "lucide-react";
import CustomDropdown from "@/components/admin/CustomDropdown";

export default function EditVoucherPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id;

  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    subtitle: "",
    subtitleBn: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minOrderValue: "",
    applicableTo: "all",
    restaurantIds: [],
    expiryDate: "",
    usageLimit: "",
    status: "Active",
  });

  const { data: voucherData, isLoading } = useQuery({
    queryKey: ["admin-voucher", id],
    queryFn: async () => {
      const res = await fetch(`/api/vouchers/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch voucher");
      return data.voucher;
    },
  });

  const { data: restaurantsData } = useQuery({
    queryKey: ["admin-restaurants-list"],
    queryFn: async () => {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      return data.data || [];
    },
  });

  const restaurants = restaurantsData || [];

  useEffect(() => {
    if (voucherData) {
      const formattedDate = voucherData.expiryDate 
        ? new Date(voucherData.expiryDate).toISOString().slice(0, 16) 
        : "";

      setFormData({
        title: voucherData.title || "",
        titleBn: voucherData.titleBn || "",
        subtitle: voucherData.subtitle || "",
        subtitleBn: voucherData.subtitleBn || "",
        code: voucherData.code || "",
        discountType: voucherData.discountType || "percentage",
        discountValue: voucherData.discountValue || "",
        maxDiscount: voucherData.maxDiscount || "",
        minOrderValue: voucherData.minOrderValue || "",
        applicableTo: voucherData.applicableTo || "all",
        restaurantIds: voucherData.restaurantIds || [],
        usageLimit: voucherData.usageLimit || "",
        status: voucherData.status || "Active",
        expiryDate: formattedDate,
      });
    }
  }, [voucherData]);

  const updateMutation = useMutation({
    mutationFn: async (updatedVoucher) => {
      const res = await fetch(`/api/vouchers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVoucher),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update voucher");
      return data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: t("success"),
        text: t("voucherUpdatedSuccess"),
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["admin-vouchers"]);
      queryClient.invalidateQueries(["admin-voucher", id]);
      router.push("/dashboard/admin/vouchers");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: error.message || t("unexpectedError"),
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
  };

  const handleRestaurantToggle = (restId) => {
    setFormData((prev) => {
      const isSelected = prev.restaurantIds.includes(restId);
      return {
        ...prev,
        restaurantIds: isSelected
          ? prev.restaurantIds.filter((id) => id !== restId)
          : [...prev.restaurantIds, restId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.discountValue || !formData.expiryDate) {
      Swal.fire(t("error"), t("fillRequiredFields"), "error");
      return;
    }

    if (formData.applicableTo === "restaurant" && formData.restaurantIds.length === 0) {
      Swal.fire(t("error"), "Please select at least one restaurant", "error");
      return;
    }

    updateMutation.mutate({
      ...formData,
      discountValue: Number(formData.discountValue),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      minOrderValue: Number(formData.minOrderValue) || 0,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      restaurantIds: formData.applicableTo === "all" ? [] : formData.restaurantIds,
    });
  };

  const discountTypeOptions = [
    { id: "percentage", label: t("typePercentage") || "Percentage (%)" },
    { id: "fixed", label: t("typeFixed") || "Fixed Amount (Tk)" },
    { id: "free_delivery", label: t("typeFreeDelivery") || "Free Delivery" }
  ];

  const applicableOptions = [
    { id: "all", label: t("applyAll") || "All Orders" },
    { id: "restaurant", label: t("applyRestaurant") || "Specific Restaurant" }
  ];

  const statusOptions = [
    { id: "Active", label: t("statusActive") },
    { id: "Inactive", label: t("statusInactive") },
    { id: "Expired", label: t("statusExpired") || "Expired" },
    { id: "Fully Claimed", label: t("statusClaimed") || "Fully Claimed" }
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/admin/vouchers"
          className="p-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-orange-500" />
            {t("editVoucher")}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {t("editVoucherDesc")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t("basicDetails") || "Basic Details"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("voucherTitle")} (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t("voucherTitlePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("voucherTitleBn") || "Voucher Title (Bengali)"}
                </label>
                <input
                  type="text"
                  name="titleBn"
                  value={formData.titleBn}
                  onChange={handleChange}
                  placeholder={t("voucherTitleBnPlaceholder") || "ভাউচারের নাম"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("voucherSubtitle")} (English)
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder={t("voucherSubtitlePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("voucherSubtitleBn") || "Voucher Subtitle (Bengali)"}
                </label>
                <input
                  type="text"
                  name="subtitleBn"
                  value={formData.subtitleBn}
                  onChange={handleChange}
                  placeholder={t("voucherSubtitleBnPlaceholder") || "ভাউচারের সাবটাইটেল"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("voucherCode")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder={t("voucherCodePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow uppercase font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t("discountRules") || "Discount Rules"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("discountType") || "Discount Type"} <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={formData.discountType}
                  onChange={(val) => setFormData((prev) => ({ ...prev, discountType: val }))}
                  options={discountTypeOptions}
                  placeholder={t("discountType") || "Select type"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("discountValue") || "Discount Value"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("maxDiscount") || "Maximum Discount (Tk)"}
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  placeholder={t("optional")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("minOrderValue")}
                </label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleChange}
                  placeholder="e.g. 299"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="pb-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t("limitations") || "Limitations & Expiry"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("applicableTo") || "Applicable To"} <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={formData.applicableTo}
                  onChange={(val) => setFormData((prev) => ({ ...prev, applicableTo: val }))}
                  options={applicableOptions}
                  placeholder={t("applicableTo") || "Applicable To"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("usageLimit") || "Usage Limit (Total uses)"}
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder={t("optional")}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              {formData.applicableTo === "restaurant" && (
                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("selectRestaurants") || "Select Restaurants"} <span className="text-red-500">*</span>
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50">
                    {restaurants.map((restaurant) => (
                      <label
                        key={restaurant._id}
                        className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.restaurantIds.includes(restaurant._id)}
                          onChange={() => handleRestaurantToggle(restaurant._id)}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 font-medium truncate">
                          {restaurant.name}
                        </span>
                      </label>
                    ))}
                    {restaurants.length === 0 && (
                      <p className="text-sm text-gray-500 col-span-full text-center py-2">
                        {t("noRestaurantsFound") || "No restaurants available"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("expiryDate")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("voucherStatus")} <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={formData.status}
                  onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                  options={statusOptions}
                  placeholder={t("voucherStatus")}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            <Link
              href="/dashboard/admin/vouchers"
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t("cancelBtn")}
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-100"
            >
              <Save className="w-5 h-5" />
              {updateMutation.isPending ? t("saving") : t("saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}