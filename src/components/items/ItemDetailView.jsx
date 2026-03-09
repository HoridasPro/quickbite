"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import ReviewSection from "@/components/items/ReviewSection";
import CartActions from "@/components/items/CartActions";
import CustomizeOrder from "@/components/items/CustomizeOrder";

const ItemDetailView = ({ item }) => {
  const cart = useCart(); // safer
  const addToCart = cart?.addToCart;

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const [selections, setSelections] = useState(() => {
    const defaults = {};
    if (item?.variations) {
      item.variations.forEach((variant) => {
        if (variant.required && variant.options.length > 0) {
          defaults[variant.id] = variant.options[0];
        }
      });
    }
    return defaults;
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?itemId=${item?.id || item?._id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        if (data.reviews.length > 0) {
          const avg = data.reviews.reduce((acc, curr) => acc + curr.rating, 0) / data.reviews.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (item?.id || item?._id) {
      fetchReviews();
    }
  }, [item]);

  const handleOptionSelect = (variationId, type, option) => {
    setSelections((prev) => {
      if (type === "radio") {
        return { ...prev, [variationId]: option };
      }

      if (type === "checkbox") {
        const currentList = prev[variationId] || [];
        const exists = currentList.find((opt) => opt.name === option.name);

        if (exists) {
          return {
            ...prev,
            [variationId]: currentList.filter(
              (opt) => opt.name !== option.name,
            ),
          };
        } else {
          return {
            ...prev,
            [variationId]: [...currentList, option],
          };
        }
      }
      return prev;
    });
  };

  const calculateTotal = () => {
    let total = item?.price || 0;

    Object.values(selections).forEach((selection) => {
      if (Array.isArray(selection)) {
        selection.forEach((opt) => (total += opt.price));
      } else if (selection) {
        total += selection.price;
      }
    });

    return total * quantity;
  };

  const isSelected = (variationId, optionName) => {
    const selection = selections[variationId];
    if (!selection) return false;
    if (Array.isArray(selection)) {
      return selection.some((opt) => opt.name === optionName);
    }
    return selection.name === optionName;
  };

  const handleAddToCart = () => {
    if (!addToCart) {
      console.error("Cart context not found");
      return;
    }

    const missingRequirements = item?.variations?.filter((variant) => {
      if (!variant.required) return false;

      const selection = selections[variant.id];
      return !selection || (Array.isArray(selection) && selection.length === 0);
    });

    if (missingRequirements?.length > 0) {
      alert(
        `Please select: ${missingRequirements.map((v) => v.title).join(", ")}`,
      );
      return;
    }

    const orderPayload = {
      cartItemId: Date.now(),
      itemId: item?._id || item?.id, // 🔥 FIXED
      title: item?.title,
      restaurant: item?.restaurant_name,
      image: item?.image,
      basePrice: item?.price,
      selectedVariations: selections,
      quantity,
      totalPrice: calculateTotal(),
    };

    addToCart(orderPayload);
    alert(`Added to Cart! Total: Tk ${orderPayload.totalPrice}`);
  };

  if (!item) return null;

  return (
    <div className="bg-white min-h-screen pb-32 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Item Details & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{item.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-700">{averageRating > 0 ? averageRating : "New"}</span>
                <span className="text-gray-400 text-sm">({reviews.length} Reviews)</span>
              </div>

              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="mt-6">
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="text-orange-500 font-bold text-2xl">
                    Tk {item.price}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Base Price</span>
                </div>
              </div>

              <div className="mt-10">
                <ReviewSection itemId={item?._id || item?.id} reviews={reviews} onReviewAdded={fetchReviews} />
              </div>
            </div>
          </div>

          {/* Right Column - Customize Order (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-6 pb-3 border-b border-gray-100">
                Customize your Order
              </h3>

              <CustomizeOrder 
                variations={item.variations}
                handleOptionSelect={handleOptionSelect}
                isSelected={isSelected}
              />

              <div className="hidden md:block space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">Tk {calculateTotal()}</span>
                </div>

                <CartActions
                  quantity={quantity}
                  setQuantity={setQuantity}
                  onAdd={handleAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-orange-500 text-xl">
            Tk {calculateTotal()}
          </span>
        </div>

        <CartActions
          quantity={quantity}
          setQuantity={setQuantity}
          onAdd={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ItemDetailView;