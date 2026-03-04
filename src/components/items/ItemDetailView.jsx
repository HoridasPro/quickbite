"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import ReviewSection from "@/components/items/ReviewSection";
import CartActions from "@/components/items/CartActions";

const ItemDetailView = ({ item }) => {
  const cart = useCart(); // safer
  const addToCart = cart?.addToCart;

  const [quantity, setQuantity] = useState(1);

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
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>

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
          <p className="text-xl font-bold text-[#D70F64]">
            Tk {calculateTotal()}
          </p>
        </div>

        <div className="mt-6">
          <CartActions
            quantity={quantity}
            setQuantity={setQuantity}
            onAdd={handleAddToCart}
          />
        </div>

        <div className="mt-10">
          <ReviewSection itemId={item?._id || item?.id} />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;
