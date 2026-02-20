"use client";
import CategoriesFoods from "@/components/CategoriesFoods";
import FoodCards from "@/components/FoodCards";
import HeroSection from "@/components/HeroSection";
import React, { useState, useEffect } from "react";

const getFoods = async () => {
  const res = await fetch(
    "https://taxi-kitchen-api.vercel.app/api/v1/foods/random",
  );
  const data = await res.json();
  return data.foods || [];
};

const FoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");

  useEffect(() => {
    const loadFoods = async () => {
      const data = await getFoods();
      setFoods(data);
    };
    loadFoods();
  }, []);

  const sortOptions = [
    "Relevance",
    "Delivery Time",
    "Rating",
    "Price: Low to High",
    "Price: High to Low",
  ];

  const offerOptions = ["Discount", "Free Delivery", "Buy 1 Get 1", "Cashback"];

  return (
    <div className="grid grid-cols-12 gap-5 h-screen px-10 mt-5">
      {/* 🔥 Sidebar */}
      <div className="col-span-3 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl">Filters</h2>
          <button
            onClick={() => {
              setSelectedSort("");
              setSelectedOffer("");
            }}
            className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-xl cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">Sort By</h4>
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <div
                key={option}
                onClick={() => setSelectedSort(option)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition
                  ${
                    selectedSort === option
                      ? "bg-black border-black"
                      : "border-gray-400"
                  }`}
                >
                  {selectedSort === option && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span
                  className={`transition ${selectedSort === option ? "" : ""}`}
                >
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Offers */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Offers</h4>
          <div className="space-y-3">
            {offerOptions.map((option) => (
              <div
                key={option}
                onClick={() => setSelectedOffer(option)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition
                  ${
                    selectedOffer === option
                      ? "bg-black border-black"
                      : "border-gray-400"
                  }`}
                >
                  {selectedOffer === option && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <span
                  className={`transition ${selectedOffer === option ? "" : ""}`}
                >
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 Right Side Products Section */}
      <div className="col-span-9 overflow-y-auto px-6">
        <HeroSection />
        <CategoriesFoods></CategoriesFoods>
        <h2 className="font-bold text-2xl mt-10 mb-5">
          {foods.length} Restaurants Found
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-20">
          {foods.map((food) => (
            <FoodCards key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodsPage;
