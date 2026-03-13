"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

const FoodCards = ({ food }) => {
  const router = useRouter();
  const { language } = useTranslation();

  const isBn = language === "bn";
  const displayTitle = isBn && food.titleBn ? food.titleBn : food.title;
  const displayCategory = isBn && food.categoryBn ? food.categoryBn : food.category;
  const displayPrice = isBn && food.priceBn ? food.priceBn : `Tk ${food.price}`;

  return (
    <div
      onClick={() => router.push(`/foods/${food.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border-2 border-gray-100 p-2 cursor-pointer"
    >
      <figure className="overflow-hidden rounded-xl">
        <img
          className="h-[150px] w-full flex object-cover hover:scale-110 transition duration-500"
          src={food.foodImg || "https://via.placeholder.com/150"}
          alt={displayTitle || "Foods"}
          width={400}
          height={150}
        />
      </figure>

      <div className="mt-2">
        <h2 className="font-semibold text-gray-800 mb-2">{displayTitle}</h2>
        <p className="text-gray-600">
          <span className="font-medium text-gray-700"></span>
          {displayCategory}
        </p>

        <p className="mt-3 font-bold text-orange-500">{displayPrice}</p>
      </div>
    </div>
  );
};

export default FoodCards;