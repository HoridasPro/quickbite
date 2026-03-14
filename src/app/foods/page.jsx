"use client";

import CategoriesFoods from "@/components/CategoriesFoods";
import FoodCards from "@/components/FoodCards";
import HeroSection from "@/components/HeroSection";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

const FoodsPageContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerElement = document.getElementById('main-header');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  // Fetch categories to match Bangla names later
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSort, selectedOffer, selectedCategory, searchQuery]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: 9,
        });
        
        if (selectedSort) params.append("sort", selectedSort);
        if (selectedOffer) params.append("offer", selectedOffer);
        if (selectedCategory) params.append("category", selectedCategory);
        if (searchQuery) params.append("search", searchQuery);

        const res = await fetch(`/api/foods?${params.toString()}`);
        const data = await res.json();
        setFoods(data.foods || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      } catch (error) {
        console.error(error);
      }
    };
    loadFoods();
  }, [currentPage, selectedSort, selectedOffer, selectedCategory, searchQuery]);

  const sortOptions = [
    { id: "Relevance", label: t("sortRelevance") },
    { id: "Delivery Time", label: t("sortDeliveryTime") },
    { id: "Rating", label: t("sortRating") },
    { id: "Price: Low to High", label: t("sortPriceLowHigh") },
    { id: "Price: High to Low", label: t("sortPriceHighLow") },
  ];

  const offerOptions = [
    { id: "Discount", label: t("offerDiscount") },
    { id: "Free Delivery", label: t("offerFreeDelivery") },
    { id: "Buy 1 Get 1", label: t("offerBogo") },
    { id: "Cashback", label: t("offerCashback") },
  ];

  // Helper to safely translate the category name for the header
  const getDisplayCategoryName = (engName) => {
    if (!engName) return "";
    const match = categories.find(c => c.categoryName === engName || c.name === engName);
    return isBn ? (match?.categoryBn || engName) : engName;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 mb-20 items-start">
      <div 
        className="hidden lg:block lg:col-span-3 bg-white shadow-lg rounded-2xl p-6 sticky self-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          top: `${headerHeight + 20}px`,
          maxHeight: `calc(100vh - ${headerHeight + 40}px)`
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl">{t("filters")}</h2>
          <button
            onClick={() => {
              setSelectedSort("");
              setSelectedOffer("");
              setSelectedCategory("");
            }}
            className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-xl cursor-pointer"
          >
            {t("clearAll")}
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">{t("sortBy")}</h4>
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedSort(option.id === selectedSort ? "" : option.id)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                    selectedSort === option.id ? "bg-black border-black" : "border-gray-400"
                  }`}
                >
                  {selectedSort === option.id && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-700">{t("offers")}</h4>
          <div className="space-y-3">
            {offerOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedOffer(option.id === selectedOffer ? "" : option.id)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                    selectedOffer === option.id ? "bg-black border-black" : "border-gray-400"
                  }`}
                >
                  {selectedOffer === option.id && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-9 px-4 lg:px-6">
        <HeroSection />
        
        <CategoriesFoods 
          onCategorySelect={setSelectedCategory} 
          hideFoods={true} 
        />
        
        <h2 className="font-bold text-2xl mt-10 mb-5">
         {totalItems} {t("foodsFound")} {selectedCategory && (
            <> {t("forText")} "{getDisplayCategoryName(selectedCategory)}"</>
          )} {searchQuery && ` ${t("matchingText")} "${searchQuery}"`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCards key={food.id || food._id} food={food} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-10 pb-20">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-300 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
          >
            {t("previous")}
          </button>
          <span className="font-bold text-gray-900 bg-orange-100 px-4 py-2 rounded-lg">
            {t("pageText")} {currentPage} {t("ofText")} {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-300 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
          >
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FoodsPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div className="flex justify-center mt-10 text-gray-500">{t("loading")}</div>}>
      <FoodsPageContent />
    </Suspense>
  );
}