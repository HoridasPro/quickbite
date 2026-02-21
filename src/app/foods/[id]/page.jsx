"use client";

import React, { useEffect, useState, useRef } from "react";
import RestaurantHero from "@/components/restaurant/RestaurantHero";

// 🔹 Fetch all foods
const getFoods = async () => {
  const res = await fetch(
    `https://taxi-kitchen-api.vercel.app/api/v1/foods/random`,
  );
  const data = await res.json();
  return data.foods || [];
};

// 🔹 Fetch categories
const getCategories = async () => {
  const res = await fetch(
    `https://taxi-kitchen-api.vercel.app/api/v1/categories`,
  );
  const data = await res.json();
  return data.categories || [];
};

// 🔹 Category Card Component
const CategoryCard = ({ name, count, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex-shrink-0 w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
      active ? "border-2 border-orange-500" : ""
    }`}
  >
    <span className="text-sm font-medium text-gray-800 text-center">
      {name} ({count})
    </span>
  </div>
);

// 🔹 Food Card Component
const FoodCard = ({ food, onClick }) => (
  <div
    className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-row-reverse"
    onClick={onClick}
  >
    <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 overflow-hidden rounded-r-lg">
      <img
        src={food.foodImg}
        alt={food.foodName}
        className="w-full h-full object-cover hover:scale-110 transition duration-500"
      />
    </div>

    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <p className="text-gray-600 text-sm font-bold line-clamp-2">
          {food.title}
        </p>
        <p className="mt-2 text-orange-500 font-bold text-lg">
          Tk {food.price}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2">
          {food.description ||
            "Delicious, freshly prepared food made with premium ingredients and authentic flavors to satisfy."}
        </p>
      </div>
    </div>
  </div>
);

// 🔹 Sidebar Component
const Sidebar = () => (
  <div className="w-full md:w-80 bg-white shadow-md rounded-xl p-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
    <h3 className="text-xl font-bold mb-4">Your Cart</h3>
    <p className="text-gray-500 text-sm">Add items to see your cart.</p>
    <div className="mt-6 border-t border-gray-200 pt-4">
      <p className="text-gray-700 font-medium">Total: Tk 0</p>
      <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300">
        Review Payment
      </button>
    </div>
  </div>
);

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCategories();
      setCategories(cats);
      const fds = await getFoods();
      setFoods(fds);
    };
    fetchData();
  }, []);

  const filteredFoods = selectedCategory
    ? foods.filter(
        (f) =>
          f.category === selectedCategory ||
          f.categoryName === selectedCategory,
      )
    : foods;

  // Count foods per category
  const categoryCounts = categories.reduce((acc, cat) => {
    const name = cat.categoryName || cat.name;
    acc[name] = foods.filter(
      (f) => f.category === name || f.categoryName === name,
    ).length;
    return acc;
  }, {});

  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 900, behavior: "smooth" });
  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -900, behavior: "smooth" });

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-[#FCFCFC] pt-4">
        {foods[0] && (
          <RestaurantHero foodImg={foods[0].foodImg} title={foods[0].title} />
        )}
      </div>

      {/* Categories */}
      <div className="py-5 relative max-w-[1380px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {categories.length} Food Categories
        </h2>

        <button
          onClick={scrollLeft}
          className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          {"<"}
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide mb-10"
        >
          {categories.map((cat) => {
            const name = cat.categoryName || cat.name;
            return (
              <CategoryCard
                key={cat.id}
                name={name}
                count={categoryCounts[name] || 0}
                active={selectedCategory === name}
                onClick={() => setSelectedCategory(name)}
              />
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          {">"}
        </button>

        {selectedCategory && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory}
          </h2>
        )}

        {/* Foods + Sidebar */}
        <div className="grid grid-cols-12 gap-6">
          <div className="md:col-span-9 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onClick={() => console.log("Clicked food:", food.foodName)}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
