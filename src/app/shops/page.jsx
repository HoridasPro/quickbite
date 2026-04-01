"use client";
import ShopCard from "@/components/ShopCard";
import ShopCardsSkeleton from "@/components/ShopCardsSkeleton";
import React, { useEffect, useState } from "react";

export default function FoodDeliveryPlatform() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  const shopTypes = [
    "Bakery & Desserts",
    "Beauty",
    "Beverages",
    "Butchery & Fishery",
    "Convenience",
    "Electronics",
    "Fishery",
    "Flowers & Plants",
    "Fruits & Vegetables",
    "Games",
  ];

  const offers = ["Accepts vouchers", "Deals"];

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      setWishlistedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const categoryToFetch = activeCategory || "Seafood";
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryToFetch}`,
        );
        const data = await response.json();

        if (data.meals) {
          const formattedData = data.meals.map((item, index) => ({
            id: item.idMeal,
            name: item.strMeal,
            location: "Gulshan " + (index % 2 === 0 ? "Banani" : "02"),
            time: Math.floor(Math.random() * 30 + 15),
            fee: Math.floor(Math.random() * 20 + 40),
            image: item.strMealThumb,
            isAd: index === 1 || index === 3,
          }));
          setStores(formattedData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchStores();
  }, [activeCategory]);

  const toggleWishlist = (id) => {
    const newWishlist = new Set(wishlistedIds);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    const wishlistArray = Array.from(newWishlist);
    setWishlistedIds(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#333]">
      <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* --- Sidebar Filters (Sticky) --- */}
        <aside className="w-full md:w-60 shrink-0 sticky top-8">
          <h2 className="text-xl font-bold mb-6">Filters</h2>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-600">Offers</h3>
            <div className="space-y-3">
              {offers.map((offer) => (
                <label
                  key={offer}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-orange-600"
                  />
                  <span className="text-sm">{offer}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-600">
              Shop types
            </h3>
            <div className="space-y-3">
              {shopTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeCategory === type}
                    onChange={() =>
                      setActiveCategory(activeCategory === type ? null : type)
                    }
                    className="h-4 w-4 rounded border-gray-300 accent-orange-600"
                  />
                  <span
                    className={`text-sm ${activeCategory === type ? "text-orange-600 font-medium" : "text-gray-700"}`}
                  >
                    {type}
                  </span>
                </label>
              ))}
              <button className="text-orange-600 text-xs font-bold flex items-center gap-1 mt-2">
                Show more <span className="text-[10px]">▼</span>
              </button>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 min-w-0">
          {/* Section 1: Daily Deals (Banners) */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Your daily deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-100 rounded-2xl p-4 h-32 flex justify-between relative overflow-hidden cursor-pointer">
                <div className="z-10">
                  <h4 className="font-bold text-lg leading-tight">
                    Win a<br />
                    gift box
                  </h4>
                  <p className="text-[10px] mt-2 bg-orange-500 text-white px-2 py-0.5 rounded-full inline-block">
                    Ramadan special
                  </p>
                </div>
                <div className="w-20 h-20 bg-orange-300/30 rounded-lg absolute -right-2 bottom-2 rotate-12"></div>
              </div>
              <div className="bg-orange-100 rounded-2xl p-4 h-32 flex justify-between relative overflow-hidden cursor-pointer">
                <div className="z-10">
                  <h4 className="font-bold text-lg leading-tight">
                    Up to 80%
                    <br />
                    Off
                  </h4>
                  <p className="text-[10px] mt-2 text-orange-600 font-bold uppercase">
                    on beauty essentials
                  </p>
                </div>
                <div className="w-16 h-24 bg-orange-400/20 absolute right-4 bottom-0 rounded-t-full"></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 h-32 flex justify-between relative overflow-hidden cursor-pointer">
                <div className="z-10">
                  <h4 className="font-bold text-lg leading-tight">
                    Get up to
                    <br />
                    10% off
                  </h4>
                  <p className="text-[10px] mt-2 text-orange-600 font-bold uppercase">
                    on dairy & more
                  </p>
                </div>
                <div className="w-20 h-20 bg-orange-200/40 absolute right-2 bottom-2 rounded-full"></div>
              </div>
            </div>
          </section>

          {/* Section 3: Shop by store */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Shop by store</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading
                ? // স্কেলিটন এখন সরাসরি মেইন গ্রিডে থাকবে, তাই এটি ফুল সাইজ দেখাবে
                  [...Array(8)].map((_, index) => (
                    <ShopCardsSkeleton key={index} />
                  ))
                : stores.map((store) => (
                    <ShopCard
                      key={store.id}
                      store={store}
                      toggleWishlist={toggleWishlist}
                      isWishlisted={wishlistedIds.has(store.id)}
                    />
                  ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
