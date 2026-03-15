"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import FoodForm from "@/components/admin/FoodForm";
import Swal from "sweetalert2";

export default function AddFoodPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: t("foodAddedSuccess"),
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/dashboard/admin/foods");
        router.refresh();
      } else {
        Swal.fire(t("error"), data.message || "Failed to add food", "error");
      }
    } catch (error) {
      Swal.fire(t("error"), t("unexpectedError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("addNewFood")}</h1>
      </div>
      <FoodForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}