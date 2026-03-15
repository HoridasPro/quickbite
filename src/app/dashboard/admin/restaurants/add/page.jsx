"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import RestaurantForm from "@/components/admin/RestaurantForm";
import Swal from "sweetalert2";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddRestaurantPage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: t("restaurantAddedSuccess") || "Restaurant added successfully",
          icon: "success",
          confirmButtonColor: "#f97316",
        }).then(() => {
          router.push("/dashboard/admin/restaurants");
          router.refresh();
        });
      } else {
        Swal.fire(t("error") || "Error", data.message || "Failed to add restaurant", "error");
      }
    } catch (error) {
      Swal.fire(t("error") || "Error", "Something went wrong!", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/admin/restaurants" 
          className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("addNewRestaurant") || "Add New Restaurant"}</h1>
        </div>
      </div>

      <RestaurantForm 
        onSubmit={handleSubmit} 
        isLoading={saving} 
      />
    </div>
  );
}