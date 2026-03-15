"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import RestaurantForm from "@/components/admin/RestaurantForm";
import Swal from "sweetalert2";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function EditRestaurantPage({ params }) {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setRestaurantData(data.restaurant);
        } else {
          Swal.fire(t("error") || "Error", data.message || "Failed to load restaurant", "error");
          router.push("/dashboard/admin/restaurants");
        }
      } catch (error) {
        Swal.fire(t("error") || "Error", "Server error", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
    // Fixed: Removed router and t from dependencies to prevent infinite loop resetting
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: t("restaurantUpdatedSuccess") || "Restaurant updated successfully",
          icon: "success",
          confirmButtonColor: "#f97316",
        }).then(() => {
          router.push("/dashboard/admin/restaurants");
          router.refresh();
        });
      } else {
        Swal.fire(t("error") || "Error", data.message || "Failed to update restaurant", "error");
      }
    } catch (error) {
      Swal.fire(t("error") || "Error", "Something went wrong!", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{t("editRestaurant") || "Edit Restaurant"}</h1>
        </div>
      </div>

      <RestaurantForm 
        initialData={restaurantData} 
        onSubmit={handleSubmit} 
        isLoading={saving} 
      />
    </div>
  );
}