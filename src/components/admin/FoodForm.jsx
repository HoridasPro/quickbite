"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Save, Loader2, Layers } from "lucide-react";
import VariationsBuilder from "./VariationsBuilder";

export default function FoodForm({ initialData = null, onSubmit, isLoading = false }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    category: "",
    categoryBn: "",
    price: "",
    priceBn: "",
    description: "",
    descriptionBn: "",
    foodImg: "",
    restaurant_name: "",
    variations: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || initialData.foodName || "",
        titleBn: initialData.titleBn || "",
        category: initialData.category || "",
        categoryBn: initialData.categoryBn || "",
        price: initialData.price || "",
        priceBn: initialData.priceBn || "",
        description: initialData.description || "",
        descriptionBn: initialData.descriptionBn || "",
        foodImg: initialData.foodImg || "",
        restaurant_name: initialData.restaurant_name || "",
        variations: initialData.variations || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariationsChange = (newVariations) => {
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
          <Layers className="w-5 h-5 text-orange-500" />
          Basic Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodNameInput")} *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodNameBnInput")} *</label>
            <input type="text" name="titleBn" required value={formData.titleBn} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("categoryLabel")} *</label>
            <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("categoryBnLabel")} *</label>
            <input type="text" name="categoryBn" required value={formData.categoryBn} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodPrice")} (Tk) *</label>
            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodPriceBn")} *</label>
            <input type="text" name="priceBn" required placeholder="যেমন: ৬০০ টাকা" value={formData.priceBn} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantNameInput")} *</label>
            <input type="text" name="restaurant_name" required value={formData.restaurant_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodImage")} URL *</label>
            <input type="url" name="foodImg" required value={formData.foodImg} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodDescription")} *</label>
            <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("foodDescriptionBn")} *</label>
            <textarea name="descriptionBn" required rows="3" value={formData.descriptionBn} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" />
          </div>
        </div>
      </div>

      <VariationsBuilder 
        variations={formData.variations} 
        onChange={handleVariationsChange} 
      />

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-2xl font-black shadow-xl shadow-orange-100 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-70">
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {t("saveFood")}
        </button>
      </div>
    </form>
  );
}