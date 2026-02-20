"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const CategoryCard = ({ img, name }) => {
  return (
    <Link href={`/categories/${name}`}>
      <div className="flex-shrink-0 w-40 flex flex-col items-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl hover:scale-105">
        <img
          src={img}
          alt={name}
          className="w-20 h-20 object-cover rounded-full mb-2"
        />
        <span className="text-sm font-medium text-gray-800 text-center">
          {name}
        </span>
      </div>
    </Link>
  );
};

const CategoriesFoods = () => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("https://taxi-kitchen-api.vercel.app/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error(err));
  }, []);

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 900, behavior: "smooth" });
  };
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -900, behavior: "smooth" });
  };

  return (
    <div className="py-10 relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-10">
        {categories.length} Foods Categories
      </h2>

      <button
        onClick={scrollLeft}
        className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 cursor-pointer"
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
          />
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CategoriesFoods;
