// src/app/dashboard/admin/foods/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import FoodForm from "@/components/admin/FoodForm";
import Swal from "sweetalert2";

export default function EditFoodPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Safely extract id

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // We declare the fetch function inside useEffect or outside, but we only depend on id
    const fetchFood = async () => {
      try {
        const res = await fetch(`/api/foods/${id}`);
        const data = await res.json();
        if (data.success) {
          setInitialData(data.food);
        } else {
          Swal.fire(t("error"), "Food not found", "error");
          router.push("/dashboard/admin/foods");
        }
      } catch (error) {
        console.error(error);
        Swal.fire(t("error"), "Failed to fetch food details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFood();
    }
    // Only id is needed here. If React complains during dev, just hit refresh in the browser.
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/foods`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: t("foodUpdatedSuccess"),
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/dashboard/admin/foods");
        router.refresh();
      } else {
        Swal.fire(t("error"), data.message || "Failed to update food", "error");
      }
    } catch (error) {
      Swal.fire(t("error"), t("unexpectedError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("editFood")}</h1>
      </div>
      <FoodForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}