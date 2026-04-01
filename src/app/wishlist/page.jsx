"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  // লোড করার সময় লোকাল স্টোরেজ থেকে ডাটা নেওয়া
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // উইশলিস্ট থেকে আইটেম ডিলিট করার ফাংশন
  const removeItem = (id) => {
    const updatedList = items.filter((item) => item.id !== id);
    setItems(updatedList);
    localStorage.setItem("wishlist", JSON.stringify(updatedList));

    // হেডার কাউন্ট আপডেট করার জন্য ইভেন্ট পাঠানো
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
            <p className="text-gray-500 mt-1">Items you've saved for later</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-orange-600 font-semibold hover:underline"
          >
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-dashed border-gray-300">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-orange-500" size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-700">
              Your wishlist is empty!
            </h2>
            <p className="text-gray-500 mb-6">
              Explore our stores and save your favorites.
            </p>
            <Link
              href="/"
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Browse Stores
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-md hover:bg-red-50 transition-all"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-xs font-bold">
                      Tk {item.fee} Fee
                    </span>
                    {item.time && <span>• {item.time} min</span>}
                  </div>

                  <Link
                    href={`/shop/${item.id}`} // আপনার শপ ডিটেইলস পেজের লিঙ্ক অনুযায়ী ঠিক করুন
                    className="mt-4 block w-full text-center py-2.5 bg-gray-50 hover:bg-orange-500 hover:text-white text-gray-700 font-bold rounded-xl transition-all border border-gray-100"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
