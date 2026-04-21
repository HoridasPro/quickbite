"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";

const CartButton = ({ food, quantity = 1, price }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useTranslation();
  const { data: session } = useSession();
  const isBn = language === "bn";

  // ENFORCEMENT: Check if the user is suspended/restricted
  const isRestricted =
    session?.user?.accountStatus && session.user.accountStatus !== "Active";

  const handleAdd2Card = (e) => {
    e.preventDefault();
    if (isRestricted) return; // Failsafe guard
    setIsLoading(true);

    const itemPrice = price || food.price || 0;

    const orderPayload = {
      cartItemId: Date.now(),
      itemId: String(food.id || food._id),
      title: food.title || food.foodName,
      titleBn: food.titleBn || food.foodNameBn,
      restaurant: food.restaurant || food.restaurant_name || "QuickBite",
      restaurantBn: food.restaurant_nameBn || food.restaurantBn || null,
      image: food.foodImg || food.image || "https://via.placeholder.com/150",
      basePrice: itemPrice,
      selectedVariations: {},
      quantity: quantity,
      totalPrice: itemPrice * quantity,
    };

    addToCart(orderPayload);

    const displayTitle =
      isBn && orderPayload.titleBn ? orderPayload.titleBn : orderPayload.title;

    Swal.fire({
      icon: "success",
      title: t("addedToCartSuccess"),
      text: displayTitle,
      showConfirmButton: false,
      timer: 1500,
    });

    setIsLoading(false);
  };

  return (
    <div className="p-4 flex items-center gap-4 w-full">
      <button
        disabled={isLoading || isRestricted}
        onClick={handleAdd2Card}
        className={`flex-1 font-semibold py-3 rounded-lg transition ${
          isRestricted
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer disabled:bg-gray-400"
        }`}
      >
        {isRestricted
          ? t("accountRestricted") || "Account Restricted"
          : t("addToCart")}
      </button>
    </div>
  );
};

export default CartButton;
