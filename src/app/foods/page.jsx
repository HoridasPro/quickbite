 
"use client";

import React, { useEffect, useState } from "react";
import CategoriesFoods from "@/components/CategoriesFoods";
import FoodCards from "@/components/FoodCards";
import { useSearchParams } from "next/navigation";
import Translation from "@/components/Translation";
import FoodCardsSkeleton from "@/components/FoodCardsSkeleton";
import HeroSection from "@/components/HeroSection";

const FoodsPageContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";

  const [foods, setFoods] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  // Header Height calculation
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.getElementById("main-header");
      if (header) setHeaderHeight(header.offsetHeight);
    };
    calculateHeaderHeight();
    window.addEventListener("resize", calculateHeaderHeight);
    return () => window.removeEventListener("resize", calculateHeaderHeight);
  }, []);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSort, selectedOffer, selectedCategory, searchQuery]);

  // Fetch foods
  useEffect(() => {
    const loadFoods = async () => {
      setLoading(true);
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
        if (!res.ok) throw new Error("Failed to fetch foods");
        const data = await res.json();

        setFoods(data.foods || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setFoods([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, [currentPage, selectedSort, selectedOffer, selectedCategory, searchQuery]);

  const sortOptions = [
    { en: "Relevance", bn: "প্রাসঙ্গিকতা" },
    { en: "Delivery Time", bn: "ডেলিভারি সময়" },
    { en: "Rating", bn: "রেটিং" },
    { en: "Price: Low to High", bn: "মূল্য: কম থেকে বেশি" },
    { en: "Price: High to Low", bn: "মূল্য: বেশি থেকে কম" },
  ];

  const offerOptions = [
    { en: "Discount", bn: "ছাড়" },
    { en: "Free Delivery", bn: "ফ্রি ডেলিভারি" },
    { en: "Buy 1 Get 1", bn: "এক কিনলে এক ফ্রি" },
    { en: "Cashback", bn: "ক্যাশব্যাক" },
  ];

  if (loading) {
    return (
      <div className="mt-10">
        <FoodCardsSkeleton type="grid" count={9} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 mb-20 items-start">
      {/* Filters */}
      <div
        className="hidden lg:block lg:col-span-3 bg-white shadow-lg rounded-2xl p-6 sticky self-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          top: `${headerHeight + 20}px`,
          maxHeight: `calc(100vh - ${headerHeight + 40}px)`,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl">
            <Translation en="Filters" bn="ফিল্টার" />
          </h2>
          <button
            onClick={() => {
              setSelectedSort("");
              setSelectedOffer("");
              setSelectedCategory("");
            }}
            className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-xl cursor-pointer"
          >
            <Translation en="Clear All" bn="সব ক্লিয়ার করুন" />
          </button>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">
            <Translation en="Sort By" bn="সর্ট করুন" />
          </h4>
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <div
                key={option.en}
                onClick={() =>
                  setSelectedSort(option.en === selectedSort ? "" : option.en)
                }
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                    selectedSort === option.en
                      ? "bg-black border-black"
                      : "border-gray-400"
                  }`}
                >
                  {selectedSort === option.en && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span>
                  <Translation en={option.en} bn={option.bn} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Options */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">
            <Translation en="Offers" bn="অফার" />
          </h4>
          <div className="space-y-3">
            {offerOptions.map((option) => (
              <div
                key={option.en}
                onClick={() =>
                  setSelectedOffer(option.en === selectedOffer ? "" : option.en)
                }
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                    selectedOffer === option.en
                      ? "bg-black border-black"
                      : "border-gray-400"
                  }`}
                >
                  {selectedOffer === option.en && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span>
                  <Translation en={option.en} bn={option.bn} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-9 px-4 lg:px-6">
        <HeroSection />
        <CategoriesFoods
          onCategorySelect={setSelectedCategory}
          hideFoods={true}
        />

        <h2 className="font-bold text-2xl mt-10 mb-5">
          {foods.length}{" "}
          <Translation en="Restaurants Found" bn="রেস্তোরাঁ পাওয়া গেছে" />
          {selectedCategory && ` for "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCards key={food.id || food._id} food={food} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10 pb-20">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-300 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="font-bold text-gray-900 bg-orange-100 px-4 py-2 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-300 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodsPageContent;
