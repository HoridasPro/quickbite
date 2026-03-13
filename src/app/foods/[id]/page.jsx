"use client";

import React, { useEffect, useState, useRef } from "react";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import CartSideBar from "@/components/CartSideBar";

const getFoodById = async (id) => {
  const res = await fetch(`/api/foods/${id}`);
  const data = await res.json();
  return data.success ? data.food : null;
};

const getFoods = async () => {
  const res = await fetch(`/api/foods?limit=50`);
  const data = await res.json();
  return data.foods || [];  
};

const getCategories = async () => {
  const res = await fetch(`/api/categories`);
  const data = await res.json();
  return data || [];
};

const CategoryCard = ({ name, count, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-36 sm:w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
        active ? "border-2 border-orange-500 ring-2 ring-orange-100" : "border border-gray-100"
      }`}
    >
      <span className="text-sm font-medium text-gray-800 text-center truncate">
        {name} ({count})
      </span>
    </div>
  );
};

const FoodCard = ({ food, onClick }) => {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  
  const displayTitle = isBn && (food.titleBn || food.foodNameBn) ? (food.titleBn || food.foodNameBn) : (food.title || food.foodName);
  const displayDesc = isBn && food.descriptionBn ? food.descriptionBn : (food.description || t("defaultDescription"));
  const displayPrice = isBn && food.priceBn ? food.priceBn : `Tk ${food.price}`;

  return (
    <div
      className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-col md:flex-row-reverse"
      onClick={onClick}
    >
      <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 overflow-hidden rounded-r-lg">
        <img
          src={food.foodImg || food.image || "https://via.placeholder.com/150"}
          alt={displayTitle || "Food Item"}
          width={150} 
          height={150} 
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <p className="text-gray-900 text-base font-bold line-clamp-2">
            {displayTitle}
          </p>
          <p className="mt-2 text-orange-500 font-bold text-lg">
            {displayPrice}
          </p>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
            {displayDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

const FoodModal = ({ food, quantity, setQuantity, onClose }) => {
  const { t, language } = useTranslation();
  const { addToCart } = useCart();
  const price = food?.price || 0;
  
  const isBn = language === "bn";
  const displayTitle = isBn && (food.titleBn || food.foodNameBn) ? (food.titleBn || food.foodNameBn) : (food.title || food.foodName);
  const displayDesc = isBn && food.descriptionBn ? food.descriptionBn : (food.description || t("defaultDescription"));
  const displayPrice = isBn && food.priceBn ? food.priceBn : `Tk ${price}`;
  
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart({
      cartItemId: Date.now(),
      itemId: food._id || food.id,
      title: food.title || food.foodName,
      titleBn: food.titleBn || food.foodNameBn,
      image: food.foodImg || food.image,
      price: price,
      quantity,
      totalPrice: price * quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-800 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-xl font-bold z-20 shadow-sm"
        >
          ✕
        </button>

        <div className="relative shrink-0">
          <img
            src={food?.foodImg || food?.image || "https://images.unsplash.com/photo-1604908554165-2e0c15e36d1a"}
            alt={displayTitle || "Food Item"}
            className="object-cover w-full h-48 md:h-64"
          />
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <h2 className="text-2xl font-extrabold text-gray-900">{displayTitle}</h2>
          <p className="text-xl font-bold text-orange-500">{displayPrice}</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {displayDesc}
          </p>
          <hr className="border-gray-100 my-4" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{t("specialInstructions")}</h3>
            <p className="text-xs text-gray-500 mb-3">
              {t("specialRequestsText")}
            </p>
            <textarea
              placeholder={t("specialInstructionsPlaceholder")}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm text-gray-800"
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="border-t border-gray-100 p-5 flex items-center gap-4 bg-gray-50 shrink-0">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl px-2 py-2 shadow-sm">
            <button onClick={decreaseQty} className="text-xl px-4 text-gray-600 hover:text-orange-500 cursor-pointer font-medium transition">
              −
            </button>
            <span className="px-2 font-bold text-gray-900 w-6 text-center">{quantity}</span>
            <button onClick={increaseQty} className="text-xl px-4 text-gray-600 hover:text-orange-500 cursor-pointer font-medium transition">
              +
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition cursor-pointer shadow-lg shadow-orange-200"
          >
            {t("addToCart")} • Tk {price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const params = useParams();
  const { id } = params || {};
  const { t, language } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [mainFood, setMainFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const item = await getFoodById(id);
        setMainFood(item); 

        const fds = await getFoods();
        setFoods(fds);

        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredFoods = selectedCategory
    ? foods.filter(
        (f) =>
          f.category === selectedCategory ||
          f.categoryName === selectedCategory,
      )
    : foods;

  const categoryCounts = categories.reduce((acc, cat) => {
    const name = cat.categoryName || cat.name;
    acc[name] = foods.filter(
      (f) => f.category === name || f.categoryName === name,
    ).length;
    return acc;
  }, {});

  const scrollRight = () => scrollRef.current?.scrollBy({ left: 900, behavior: "smooth" });
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -900, behavior: "smooth" });

  if (loading) return <div className="p-10 text-center text-gray-500 min-h-screen flex items-center justify-center">{t("loadingDetails")}</div>;
  if (!mainFood) return <div className="p-10 text-center text-red-500 min-h-screen flex items-center justify-center">{t("restaurantNotFound")}</div>;

  return (
    <div className="pb-20 px-2 sm:px-4">
      <div className="bg-[#FCFCFC] pt-4">
        <RestaurantHero foodImg={mainFood.foodImg || mainFood.image} title={language === 'bn' && (mainFood.titleBn || mainFood.foodNameBn) ? (mainFood.titleBn || mainFood.foodNameBn) : (mainFood.title || mainFood.foodName)} id={mainFood.id || mainFood._id} />
      </div>

      <div className="py-5 relative max-w-[1380px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {categories.length} {t("foodCategories")}
        </h2>

        <button
          onClick={scrollLeft}
          className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex hover:bg-gray-100 cursor-pointer"
        >
          {"<"}
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-10 pb-4"
        >
          {categories.map((cat, index) => {
            const name = cat.categoryName || cat.name;
            const displayName = language === 'bn' && cat.nameBn ? cat.nameBn : name; 
            
            return (
              <CategoryCard
                key={cat.id || index}
                name={displayName}
                count={categoryCounts[name] || 0}
                active={selectedCategory === name}
                onClick={() => setSelectedCategory(name === selectedCategory ? null : name)}
              />
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex hover:bg-gray-100 cursor-pointer"
        >
          {">"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id || food._id}
                  food={food}
                  onClick={() => {
                    setSelectedFood(food);
                    setQuantity(1);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-3">
            <CartSideBar />
          </div>
        </div>
      </div>

      {selectedFood && (
        <FoodModal
          food={selectedFood}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;