"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ImageUpload({ value, onChange, label }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t("invalidFileType") || "Please upload an image file.");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.data.display_url);
      } else {
        setError(t("uploadFailed") || "Image upload failed.");
      }
    } catch (err) {
      setError(t("uploadFailed") || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      
      {value ? (
        <div className="relative w-full h-40 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group">
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden ${
            isDragging 
              ? "border-orange-500 bg-orange-50 scale-[1.02]" 
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div className={`flex flex-col items-center justify-center pt-5 pb-6 transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}>
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
            ) : (
              <UploadCloud className={`w-8 h-8 mb-2 transition-colors duration-200 ${isDragging ? "text-orange-500" : "text-gray-400"}`} />
            )}
            <p className={`text-sm font-medium transition-colors duration-200 ${isDragging ? "text-orange-600" : "text-gray-500"}`}>
              {isUploading ? (t("uploading") || "Uploading...") : (t("clickToUpload") || "Click or drag to upload")}
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isUploading} 
          />
        </label>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}