"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// ১. ডাটা ফেচ করার ফাংশন (themealdb API ব্যবহার করে)
const getFoodById = async (id) => {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );
    const data = await res.json();

    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        description:
          meal.strInstructions || "Delicious food prepared with care.",
        location: "Gulshan Banani",
        fee: Math.floor(Math.random() * 20 + 40),
        time: Math.floor(Math.random() * 30 + 15),
      };
    }
    return null;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

const ShopDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [mainFood, setMainFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved && id) {
      const list = JSON.parse(saved);
      setIsWishlisted(
        list.some((item) => String(item.id || item) === String(id)),
      );
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const item = await getFoodById(id);
      setMainFood(item);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const toggleWishlist = (food) => {
    if (!food) return;
    const saved = localStorage.getItem("wishlist");
    let list = saved ? JSON.parse(saved) : [];
    const foodId = String(id);

    const isExist = list.find((item) => String(item.id || item) === foodId);

    if (isExist) {
      list = list.filter((item) => String(item.id || item) !== foodId);
      setIsWishlisted(false);
    } else {
      const itemToSave = {
        id: foodId,
        name: food.name,
        image: food.image,
        location: food.location,
        fee: food.fee,
        time: food.time,
      };
      list.push(itemToSave);
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(list));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading Store Details...</div>
    );
  if (!mainFood)
    return (
      <div className="p-10 text-center">No data found for this store.</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      {/* Container: Flex row for Image and Content */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Image Section */}
        <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden shadow-lg bg-gray-100">
          <img
            src={mainFood.image}
            alt={mainFood.name}
            className="w-full h-80 md:h-[450px] object-cover"
          />
          <button
            onClick={() => toggleWishlist(mainFood)}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <svg
              className={`h-6 w-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Right Side: Text Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {mainFood.name}
          </h1>
          <p className="text-gray-500 flex items-center gap-1 mt-2 text-lg">
            📍 {mainFood.location}
          </p>

          <div className="flex gap-4 mt-6">
            <div className="bg-orange-50 px-5 py-3 rounded-2xl border border-orange-100">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">
                Delivery Fee
              </p>
              <p className="font-bold text-xl">Tk {mainFood.fee}</p>
            </div>
            <div className="bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                Estimated Time
              </p>
              <p className="font-bold text-xl">{mainFood.time} mins</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-3 text-gray-800 border-b pb-2">
              About this store
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {mainFood.description}
            </p>
          </div>

          <button className="mt-8 w-full md:w-auto bg-orange-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
