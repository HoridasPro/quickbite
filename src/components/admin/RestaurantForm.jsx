"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Save, Loader2, Store, Image as ImageIcon, MapPin, Phone } from "lucide-react";

export default function RestaurantForm({ initialData = null, onSubmit, isLoading = false }) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: "",
    nameBn: "",
    description: "",
    descriptionBn: "",
    address: "",
    contact: "",
    logo: "",
    cover: "",
    status: "Active"
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        nameBn: initialData.nameBn || "",
        description: initialData.description || "",
        descriptionBn: initialData.descriptionBn || "",
        address: initialData.address || "",
        contact: initialData.contact || "",
        logo: initialData.logo || "",
        cover: initialData.cover || "",
        status: initialData.status || "Active"
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      {/* basic info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
          <Store className="w-5 h-5 text-orange-500" />
          {t("restaurantManagement")}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantName")} *</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantNameBn")} *</label>
            <input 
              type="text" 
              name="nameBn" 
              required 
              value={formData.nameBn} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {t("restaurantAddress")} *
            </label>
            <input 
              type="text" 
              name="address" 
              required 
              value={formData.address} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Phone className="w-4 h-4" /> {t("restaurantContact")} *
            </label>
            <input 
              type="text" 
              name="contact" 
              required 
              value={formData.contact} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantDescription")} *</label>
            <textarea 
              name="description" 
              required 
              rows="3" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantDescriptionBn")} *</label>
            <textarea 
              name="descriptionBn" 
              required 
              rows="3" 
              value={formData.descriptionBn} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" 
            />
          </div>
        </div>
      </div>

      {/* media section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
          <ImageIcon className="w-5 h-5 text-orange-500" />
          Media & Branding
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantLogo")} URL *</label>
            <input 
              type="url" 
              name="logo" 
              required 
              value={formData.logo} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
            />
            {formData.logo && (
              <img src={formData.logo} alt="Logo Preview" className="mt-2 w-20 h-20 object-cover rounded-full border border-gray-100 shadow-sm" />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("restaurantCover")} URL *</label>
            <input 
              type="url" 
              name="cover" 
              required 
              value={formData.cover} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
            />
            {formData.cover && (
              <img src={formData.cover} alt="Cover Preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-100 shadow-sm" />
            )}
          </div>
        </div>
      </div>

      {/* action bar */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isLoading} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-2xl font-black shadow-xl shadow-orange-100 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {t("saveRestaurant")}
        </button>
      </div>
    </form>
  );
}