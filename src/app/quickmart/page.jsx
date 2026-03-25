"use client";
import QuickMart from "@/components/quickmart/QuickMart";
import React, { useState, useEffect } from "react";

const QuickMartPage = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalFood, setModalFood] = useState(null);
  const [cart, setCart] = useState([]);

  // নতুন স্টেট: মোবাইলে সাইডবার ওপেন/ক্লোজ করার জন্য
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.idMeal !== id));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    // FIX 1: Changed h-screen to h-[calc(100vh-76px)] to fit under the header without scrolling the whole page
    <div className="flex flex-col lg:flex-row h-[calc(100vh-76px)] overflow-hidden bg-white font-sans text-gray-800 shadow-lg relative">
      {/* --- 1. Left Sidebar --- */}
      {/* মোবাইলে এটি একটি ওভারলে হিসেবে কাজ করবে */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 lg:z-30 w-64 bg-white p-5 border-r transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* FIX 2: Added lg:z-30 above so it sits beneath the z-40 global header on desktop */}
        <div className="flex justify-between items-center mb-6 lg:block shrink-0">
          <h1 className="text-2xl font-bold text-orange-600 italic">
            Quickmart
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.idCategory}
                onClick={() => {
                  setSelectedCategory(cat.strCategory);
                  setIsSidebarOpen(false); // ক্লিক করলে মোবাইলে মেনু বন্ধ হবে
                }}
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

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        ></div>
      )}

      {/* --- 2. Main Content Area --- */}
      {/* FIX 3: Changed h-screen to h-full to fit within the new parent wrapper height */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 bg-gray-50/30 custom-scrollbar shadow-lg">
        {/* Header with Hamburger Menu for Mobile */}
        <div className="flex items-center gap-4 mb-4 lg:hidden sticky top-0 z-20 bg-white/90 p-2 rounded-lg shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl p-1"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-orange-600 italic">
            Quickmart
          </h1>
        </div>

        <div className="sticky top-0 lg:top-2 z-10 bg-white/80 backdrop-blur-md pb-4 pt-2 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in ${selectedCategory}`}
              className="w-full bg-gray-100 rounded-full h-10 md:h-12 pl-6 pr-28 outline-none border focus:border-orange-500 transition shadow-sm text-sm"
            />
            <button className="absolute top-0 right-0 h-full bg-orange-500 text-white px-4 md:px-6 rounded-r-full cursor-pointer font-bold text-sm">
              Search
            </button>
          </div>
        </div>

        {/* Hero Banners */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <div className="h-32 md:h-40 rounded-2xl bg-gradient-to-r from-orange-100 to-orange-200 flex items-center p-6 relative overflow-hidden shadow-sm">
            <div className="z-10">
              <h2 className="text-lg md:text-2xl font-black text-orange-700 leading-tight">
                Eid Bazar Deals
              </h2>
              <p className="text-orange-600 font-bold text-sm">up to 60% off</p>
            </div>
          </div>
          <div className="md:flex h-32 md:h-40 rounded-2xl bg-gradient-to-r from-red-100 to-orange-200 p-6 items-center shadow-sm relative overflow-hidden">
            <div className="z-10">
              <h2 className="text-2xl font-black text-orange-700 leading-tight">
                Fresh Picks
              </h2>
              <p className="text-orange-600 font-bold">up to 30% off</p>
            </div>
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <h3 className="text-lg md:text-xl font-bold mb-6">
          {selectedCategory} Items
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
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
        <div className="h-40 lg:hidden"></div>
      </main>

      {/* --- 3. Right Cart Sidebar (Desktop/Mobile Footer) --- */}
      {/* FIX 4: Changed lg:h-screen to lg:h-full */}
      <aside
        className={`
        w-full lg:w-80 flex flex-col fixed bottom-0 lg:static bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] lg:shadow-none border-l z-30
        h-[40vh] lg:h-full rounded-t-3xl lg:rounded-none
      `}
      >
        <div className="p-4 lg:p-6 border-b shrink-0">
          <h2 className="text-center font-bold text-lg lg:text-xl">
            Your cart ({cart.length})
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <div className="text-4xl mb-2 opacity-20">🛒</div>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.idMeal}
                  className="flex gap-3 items-center border-b pb-3"
                >
                  <img
                    src={item.strMealThumb}
                    className="w-10 h-10 rounded-lg object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <h4 className="text-xs lg:text-sm font-bold line-clamp-1">
                      {item.strMeal}
                    </h4>
                    <p className="text-[10px] lg:text-xs text-gray-500">
                      {item.quantity} x Tk {item.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => removeFromCart(item.idMeal)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      ✕
                    </button>
                    <p className="text-xs lg:text-sm font-bold text-orange-600">
                      Tk {item.quantity * item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 lg:p-6 border-t bg-white shrink-0 mb-safe">
          <div className="flex justify-between font-bold text-base lg:text-lg">
            <span>Total</span>
            <span>Tk {totalPrice}</span>
          </div>
          <button
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-xl mt-3 font-bold transition ${cart.length > 0 ? "bg-orange-600 text-white cursor-pointer" : "bg-gray-200 text-gray-400"}`}
          >
            Checkout
          </button>
        </div>
      </aside>

      {/* Modal */}
      {modalFood && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-3xl relative flex flex-col md:flex-row gap-4 md:gap-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalFood(null)}
              className="absolute top-2 right-4 text-gray-500 font-bold text-2xl cursor-pointer z-10"
            >
              ✕
            </button>
            <div className="w-full md:w-1/2 h-48 md:h-64 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={modalFood.strMealThumb}
                alt={modalFood.strMeal}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl md:text-2xl mb-2">
                  {modalFood.strMeal}
                </h3>
                <p className="text-orange-600 font-bold text-lg mb-4">Tk 250</p>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-full text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 bg-gray-200 rounded-full text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => addToCart(modalFood, quantity)}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700"
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