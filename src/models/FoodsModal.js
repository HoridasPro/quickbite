"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import CustomizeOrder from "@/components/items/CustomizeOrder";
import CartActions from "@/components/items/CartActions";
import Swal from "sweetalert2";

const FoodsModal = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const { t, language } = useTranslation();
  
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const isBn = language === "bn";
  const displayTitle = isBn && food?.titleBn ? food.titleBn : (food?.title || food?.foodName || "Food Item");
  const displayDesc = isBn && food?.descriptionBn ? food.descriptionBn : (food?.description || t("defaultDescription"));
  
  const basePrice = food?.price || 0;
  const displayPrice = isBn && food?.priceBn ? food.priceBn : `Tk ${basePrice}`;

  const [selections, setSelections] = useState(() => {
    const defaults = {};
    if (food?.variations) {
      food.variations.forEach((variant) => {
        if (variant.required && variant.options?.length > 0) {
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
            [variationId]: currentList.filter((opt) => opt.name !== option.name),
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
    let total = basePrice;
    Object.values(selections).forEach((selection) => {
      if (Array.isArray(selection)) {
        selection.forEach((opt) => (total += (opt.price || 0)));
      } else if (selection) {
        total += (selection.price || 0);
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
    if (!addToCart) return;

    const missingRequirements = food?.variations?.filter((variant) => {
      if (!variant.required) return false;
      const selection = selections[variant.id];
      return !selection || (Array.isArray(selection) && selection.length === 0);
    });

    if (missingRequirements?.length > 0) {
      Swal.fire({
        icon: "warning",
        title: t("error"),
        text: `${t("pleaseSelect")} ${missingRequirements.map((v) => v.title).join(", ")}`,
        confirmButtonColor: "#f97316"
      });
      return;
    }

    const orderPayload = {
      cartItemId: Date.now(),
      itemId: String(food.id || food._id),
      title: food.title || food.foodName,
      titleBn: food.titleBn || food.foodNameBn,
      restaurant: food.restaurant_name || food.restaurant || "QuickBite",
      image: food.foodImg || food.image || "https://via.placeholder.com/150",
      basePrice: basePrice,
      selectedVariations: selections,
      quantity,
      totalPrice: calculateTotal(),
      note: specialInstructions 
    };

    addToCart(orderPayload);
    
    Swal.fire({
      icon: "success",
      title: t("addedToCartSuccess"),
      text: `${displayTitle} (Tk ${orderPayload.totalPrice})`,
      showConfirmButton: false,
      timer: 1500
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
            alt={displayTitle}
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
          
          <CustomizeOrder 
            variations={food?.variations}
            handleOptionSelect={handleOptionSelect}
            isSelected={isSelected}
          />

          {food?.variations?.length > 0 && <hr className="border-gray-100 my-4" />}

          <div>
            <h3 className="font-semibold text-lg text-gray-900">{t("specialInstructions")}</h3>
            <p className="text-xs text-gray-500 mb-3">
              {t("specialRequestsText")}
            </p>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t("specialInstructionsPlaceholder")}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm text-gray-800"
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50 shrink-0">
          <div className="flex items-center justify-between font-bold text-gray-900 text-lg mb-3">
            <span>{t("total")}</span>
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
  );
};

export default FoodsModal;