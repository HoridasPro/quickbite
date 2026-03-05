"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CategoryCard = ({ img, name, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-40 flex flex-col items-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
        active ? "border-2 border-orange-500" : ""
      }`}
    >
      <Image
        src={img}
        alt={name}
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-full mb-2"
      />
      <span className="text-sm font-medium text-gray-800 text-center">
        {name}
      </span>
    </div>
  );
};

const FoodCard = ({ food }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/foods/${food.id || food._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 p-3 cursor-pointer"
    >
      <div className="overflow-hidden rounded-xl">
        <Image
          src={food.foodImg || food.image}
          alt={food.title || food.foodName}
          width={400}
          height={160}
          className="h-[160px] w-full object-cover hover:scale-110 transition duration-500"
        />
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-gray-800 text-lg">
          {food.title || food.foodName}
        </h3>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Category:</span>{" "}
          {food.category || food.categoryName || (food.tags && food.tags[0])}
        </p>

        <p className="text-orange-500 font-bold text-lg mt-2">Tk {food.price}</p>
      </div>
    </div>
  );
};

const CategoriesFoods = ({ onCategorySelect, hideFoods = false }) => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (hideFoods) return;
    const url = selectedCategory
      ? `/api/foods?category=${encodeURIComponent(selectedCategory)}&limit=50`
      : "/api/foods?limit=50";

    fetch(url)
      .then((res) => res.json())
      .then((data) => setFoods(data.foods || []))
      .catch((err) => console.error(err));
  }, [selectedCategory, hideFoods]);

  const handleCategoryClick = (name) => {
    const newCategory = selectedCategory === name ? null : name;
    setSelectedCategory(newCategory);
    if (onCategorySelect) {
      onCategorySelect(newCategory || "");
    }
  };

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
    <div className="py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {categories.length} Food Categories
      </h2>

      <div className="relative flex items-center">
        <button
          onClick={scrollLeft}
          className="absolute -left-4 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 top-1/2 -translate-y-1/2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 py-4"
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id || cat._id}
              img={cat.categoryImg}
              name={cat.categoryName}
              active={selectedCategory === cat.categoryName}
              onClick={() => handleCategoryClick(cat.categoryName)}
            />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-4 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 top-1/2 -translate-y-1/2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {!hideFoods && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">
            {selectedCategory ? `${selectedCategory} Foods` : "All Foods"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {foods.map((food) => (
              <FoodCard key={food.id || food._id} food={food} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesFoods;