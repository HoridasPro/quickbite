"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useCart } from "@/contexts/CartContext";

const CartButton = ({ food, quantity = 1, price }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd2Card = (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    const itemPrice = price || food.price || 0;

    const orderPayload = {
      cartItemId: Date.now(),
      itemId: String(food.id || food._id), // WRONG: Was passing potential ObjectId object
      title: food.title || food.foodName,
      restaurant: food.restaurant || food.restaurant_name || "QuickBite", // WRONG: Missing restaurant field
      image: food.foodImg || food.image || "https://via.placeholder.com/150",
      basePrice: itemPrice,
      selectedVariations: {}, 
      quantity: quantity,
      totalPrice: itemPrice * quantity,
    };

    addToCart(orderPayload);
    
    Swal.fire({
      icon: "success",
      title: "Added to cart",
      text: food?.title || food?.foodName,
      showConfirmButton: false,
      timer: 1500
    });
    
    setIsLoading(false);
  };

  return (
    <div className="p-4 flex items-center gap-4 w-full">
      <button
        disabled={isLoading}
        onClick={handleAdd2Card}
        className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer disabled:bg-gray-400"
      >
        Add to cart
      </button>
    </div>
  );
};

export default CartButton;