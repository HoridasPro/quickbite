"use client";

import React, { useEffect, useState, useRef } from "react";

import RestaurantHero from "@/components/restaurant/RestaurantHero";
import { useParams } from "next/navigation";
import SidebarCart from "@/components/SidebarCart";
import { useCart } from "@/contexts/CartContext";
import Translation from "@/components/Translation";
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

const CategoryCard = ({ nameEn, nameBn, count, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex-shrink-0 w-36 sm:w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
      active
        ? "border-2 border-orange-500 ring-2 ring-orange-100"
        : "border border-gray-100"
    }`}
  >
    <span className="text-sm font-medium text-gray-800 text-center truncate">
      <Translation en={`${nameEn} (${count})`} bn={`${nameBn} (${count})`} />
    </span>
  </div>
);

const FoodCard = ({ food, onClick }) => (
  <div
    className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-col md:flex-row-reverse"
    onClick={onClick}
  >
    <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 overflow-hidden rounded-r-lg">
      <img
        src={food.foodImg || food.image || "https://via.placeholder.com/150"}
        alt={food.title || food.foodName}
        className="w-full h-full object-cover hover:scale-110 transition duration-500"
      />
    </div>

    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <p className="text-gray-900 text-base font-bold line-clamp-2">
          <Translation en={food.title} bn={food.titleBn} />
        </p>

        <p className="mt-2 text-orange-500 font-bold text-lg">
          <Translation
            en={`Tk ${food.price}`}
            bn={`৳ ${food.priceBn || food.price}`}
          />
        </p>

        <p className="text-gray-500 text-xs mt-2 line-clamp-2">
          <Translation
            en={
              food.description ||
              "Delicious, freshly prepared food made with premium ingredients."
            }
            bn={food.descriptionBn || "তাজা উপকরণ দিয়ে তৈরি সুস্বাদু খাবার।"}
          />
        </p>
      </div>
    </div>
  </div>
);

const FoodModal = ({ food, quantity, setQuantity, onClose }) => {
  const { addToCart } = useCart();
  const price = food?.price || 0;

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart({
      cartItemId: Date.now(),
      itemId: food._id || food.id,
      title: food.title || food.foodName,
      image: food.foodImg || food.image,
      price: food.price,
      quantity,
      totalPrice: food.price * quantity,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-800 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
        >
          ✕
        </button>

        <img
          src={food?.foodImg || food?.image}
          alt={food?.title}
          className="w-full h-48 md:h-64 object-cover"
        />

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {food?.title || food?.foodName}
          </h2>

          <p className="text-xl font-bold text-orange-500">
            <Translation en={`Tk ${price}`} bn={`৳ ${price}`} />
          </p>

          <p className="text-gray-600 text-sm">
            <Translation
              en={food?.description || "Delicious freshly prepared food."}
              bn={food?.descriptionBn || "সুস্বাদু তাজা খাবার।"}
            />
          </p>

          <hr />

          <div>
            <h3 className="font-semibold text-lg">
              <Translation en="Special instructions" bn="বিশেষ নির্দেশনা" />
            </h3>

            <p className="text-xs text-gray-500 mb-3">
              <Translation
                en="Special requests are subject to restaurant approval."
                bn="বিশেষ অনুরোধ রেস্টুরেন্টের অনুমতির উপর নির্ভরশীল।"
              />
            </p>

            <textarea
              placeholder="No mayo, extra spicy..."
              className="w-full border rounded-xl p-3"
            />
          </div>
        </div>

        <div className="border-t p-5 flex items-center gap-4 bg-gray-50">
          <div className="flex items-center border rounded-xl px-2 py-2">
            <button onClick={decreaseQty} className="px-4 text-xl">
              -
            </button>

            <span className="px-4 font-bold">{quantity}</span>

            <button onClick={increaseQty} className="px-4 text-xl">
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl"
          >
            <Translation
              en={`Add to cart • Tk ${price * quantity}`}
              bn={`কার্টে যোগ করুন • ৳ ${price * quantity}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();

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

      try {
        const item = await getFoodById(id);
        const fds = await getFoods();
        const cats = await getCategories();

        setMainFood(item);
        setFoods(fds);
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

  // // Arrow scroll handlers
  // const scrollLeft = () => {
  //   scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
  // };
  // const scrollRight = () => {
  //   scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
  // };

  if (loading)
    return (
      <div className="p-10 text-center">
        <Translation en="Loading details..." bn="ডেটা লোড হচ্ছে..." />
      </div>
    );

  if (!mainFood)
    return (
      <div className="p-10 text-center text-red-500">
        <Translation en="Restaurant not found." bn="রেস্টুরেন্ট পাওয়া যায়নি।" />
      </div>
    );

  return (
    <div className="pb-20 px-2 sm:px-4">
      <RestaurantHero
        foodImg={mainFood.foodImg || mainFood.image}
        titleBn={mainFood.titleBn || mainFood.foodName}
        title={mainFood.title || mainFood.foodName}
        id={mainFood.id || mainFood._id}
      />

      <div className="py-5 max-w-[1380px] mx-auto relative">
        <h2 className="text-2xl font-bold mb-6">
          <Translation
            en={`${categories.length} Food Categories`}
            bn={`${categories.length} টি খাবারের ক্যাটাগরি`}
          />
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto mb-10 pb-4 scroll-smooth"
        >
          {categories.map((cat, index) => {
            const nameEn = cat.categoryName || cat.category;
            const nameBn = cat.categoryNameBn || cat.categoryBn || nameEn;

            return (
              <CategoryCard
                key={cat.id || index}
                nameEn={nameEn}
                nameBn={nameBn}
                count={categoryCounts[nameEn] || 0}
                active={selectedCategory === nameEn}
                onClick={() =>
                  setSelectedCategory(
                    nameEn === selectedCategory ? null : nameEn,
                  )
                }
              />
            );
          })}
        </div>

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
            <SidebarCart />
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
