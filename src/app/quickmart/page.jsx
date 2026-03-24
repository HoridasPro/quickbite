"use client";
import QuickMart from "@/components/QuickMart/QuickMart";
import React, { useState, useEffect } from "react";

const QuickMartPage = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalFood, setModalFood] = useState(null);

  // কার্টের আইটেম রাখার জন্য স্টেট
  const [cart, setCart] = useState([]);

  // ১. এপিআই থেকে ক্যাটাগরি লোড করা
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].strCategory);
        }
      });
  }, []);

  // ২. সিলেক্ট করা ক্যাটাগরি অনুযায়ী খাবার লোড করা
  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setFoods(data.meals || []);
        setLoading(false);
      });
  }, [selectedCategory]);

  // ৩. কার্টে খাবার যুক্ত করার ফাংশন
  const addToCart = (food, qty) => {
    const price = 250;
    const existingItem = cart.find((item) => item.idMeal === food.idMeal);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.idMeal === food.idMeal
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...food, quantity: qty, price: price }]);
    }
    setModalFood(null);
  };

  // ৪. কার্ট থেকে খাবার ডিলিট করার ফাংশন
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.idMeal !== id);
    setCart(updatedCart);
  };

  // ৫. টোটাল প্রাইস ক্যালকুলেশন
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-gray-800 shadow-lg">
      {/* --- 1. Left Sidebar --- */}
      <aside className="w-64 p-5 hidden md:flex flex-col h-screen overflow-y-auto custom-scrollbar bg-white shrink-0">
        <div className="mb-6 shrink-0">
          <h1 className="text-2xl font-bold text-orange-600 italic">
            Quickmart
          </h1>
          <button className="mt-4 w-full border border-gray-300 rounded-lg py-2 text-sm font-semibold hover:bg-gray-50 transition">
            Shop Information
          </button>
        </div>

        <nav className="flex-1">
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.idCategory}
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`flex justify-between items-center cursor-pointer p-2 rounded-lg transition ${
                  selectedCategory === cat.strCategory
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-[14px]">{cat.strCategory}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* --- 2. Main Content Area --- */}
      <main className="flex-1 h-screen overflow-y-auto p-6 bg-gray-50/30 custom-scrollbar shadow-lg">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md pb-4 pt-2 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in ${selectedCategory}`}
              className="w-full bg-gray-100 rounded-full h-12 pl-6 pr-28 outline-none border focus:border-orange-500 transition shadow-sm"
            />
            <button className="absolute top-0 right-0 h-full bg-orange-500 text-white px-6 rounded-r-full cursor-pointer">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="h-40 rounded-2xl bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center relative overflow-hidden shadow-sm">
            <div className="p-6 z-10">
              <h2 className="text-2xl font-black text-orange-700 leading-tight">
                Eid Bazar Deals
              </h2>
              <p className="text-orange-600 font-bold">up to 60% off</p>
            </div>
          </div>
          <div className="h-40 rounded-2xl bg-gradient-to-r from-red-100 to-orange-200 p-6 flex items-center shadow-sm relative overflow-hidden">
            <div className="z-10">
              <h2 className="text-2xl font-black text-orange-700 leading-tight">
                Fresh Picks
              </h2>
              <p className="text-orange-600 font-bold">up to 30% off</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-6">{selectedCategory} Items</h3>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {foods.map((food) => (
              <QuickMart
                key={food.idMeal}
                food={food}
                onAdd={() => {
                  setModalFood(food);
                  setQuantity(1);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* --- 3. Right Cart Sidebar --- */}
      <aside className="w-80 flex flex-col h-screen overflow-hidden bg-white shrink-0 shadow-lg">
        <div className="p-6 border-b shrink-0">
          <h2 className="text-center font-bold text-lg">Your cart</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <div className="text-5xl mb-4 opacity-20">🛒</div>
              <p className="text-sm font-medium">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.idMeal}
                  className="flex gap-3 items-center border-b pb-3 relative group"
                >
                  <img
                    src={item.strMealThumb}
                    className="w-12 h-12 rounded-lg object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold line-clamp-1 pr-6">
                      {item.strMeal}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x Tk {item.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    {/* ডিলিট বাটন */}
                    <button
                      onClick={() => removeFromCart(item.idMeal)}
                      className="text-gray-400 hover:text-red-500 transition-colors mb-1 cursor-pointer"
                      title="Remove item"
                    >
                      ✕
                    </button>
                    <p className="text-sm font-bold text-orange-600">
                      Tk {item.quantity * item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-white shrink-0">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Tk {totalPrice}</span>
          </div>
          <button
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-xl mt-4 font-bold transition ${
              cart.length > 0
                ? "bg-orange-600 text-white cursor-pointer hover:bg-orange-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Checkout
          </button>
        </div>
      </aside>

      {/* Modal */}
      {modalFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-3xl relative flex gap-6">
            <button
              onClick={() => setModalFood(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl cursor-pointer"
            >
              ✕
            </button>
            <div className="w-1/2 h-64 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={modalFood.strMealThumb}
                alt={modalFood.strMeal}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-2xl mb-2">{modalFood.strMeal}</h3>
                <p className="text-orange-600 font-bold text-lg mb-4">Tk 250</p>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => addToCart(modalFood, quantity)}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default QuickMartPage;
