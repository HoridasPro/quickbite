"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import FoodForm from "@/components/admin/FoodForm";
import Swal from "sweetalert2";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EditFoodPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id; 

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
  }, [id, router]);

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
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/admin/foods" 
          className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("editFood")}</h1>
        </div>
      </div>
      <FoodForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}