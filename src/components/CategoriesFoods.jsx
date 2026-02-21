"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// 🔹 Category Card
const CategoryCard = ({ img, name, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-40 flex flex-col items-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
        active ? "border-2 border-orange-500" : ""
      }`}
    >
      <img
        src={img}
        alt={name}
        className="w-20 h-20 object-cover rounded-full mb-2"
      />
      <span className="text-sm font-medium text-gray-800 text-center">
        {name}
      </span>
    </div>
  );
};

// 🔥 Updated Food Card (With Title Added Properly)
const FoodCard = ({ food }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/foods/${food.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 p-3 cursor-pointer"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={food.foodImg}
          alt={food.title || food.foodName}
          className="h-[160px] w-full object-cover hover:scale-110 transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="mt-3 space-y-1">
        {/* ✅ Title */}
        <h3 className="font-semibold text-gray-800 text-lg">
          {food.title || food.foodName}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Category:</span>{" "}
          {food.category || food.categoryName}
        </p>

        {/* Price */}
        <p className="text-orange-500 font-bold text-lg mt-2">${food.price}</p>
      </div>
    </div>
  );
};

const CategoriesFoods = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollRef = useRef(null);

  // 🔹 Load Categories
  useEffect(() => {
    fetch("https://taxi-kitchen-api.vercel.app/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Load Foods
  useEffect(() => {
    fetch("https://taxi-kitchen-api.vercel.app/api/v1/foods/random")
      .then((res) => res.json())
      .then((data) => setFoods(data.foods))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 Filter Foods by Selected Category
  const filteredFoods = selectedCategory
    ? foods.filter(
        (food) =>
          food.category === selectedCategory ||
          food.categoryName === selectedCategory,
      )
    : foods;

  // 🔹 Scroll Functions
  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 900,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -900,
      behavior: "smooth",
    });
  };

  return (
    <div className="py-10 relative">
      {/* ===== Categories Section ===== */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {categories.length} Food Categories
      </h2>

      <button
        onClick={scrollLeft}
        className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            img={cat.categoryImg}
            name={cat.categoryName}
            active={selectedCategory === cat.categoryName}
            onClick={() => setSelectedCategory(cat.categoryName)}
          />
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ===== Foods Section ===== */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">
          {selectedCategory ? `${selectedCategory} Foods` : "All Foods"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesFoods;
