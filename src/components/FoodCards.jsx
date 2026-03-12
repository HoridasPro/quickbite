"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageProvider";

const FoodCards = ({ food }) => {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <div
      onClick={() => router.push(`/foods/${food.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border-2 border-gray-100 p-2 cursor-pointer"
    >
      {/* Image */}
      <figure className="overflow-hidden rounded-xl">
        <img
          className="h-[150px] w-full flex object-cover hover:scale-110 transition duration-500"
          src={food.foodImg || "https://via.placeholder.com/150"}
          alt={food.title || "Foods"}
          width={400}
          height={150}
        />
      </figure>

      {/* Content */}
      <div className="mt-2">
        {/* Title */}
        <h2 className="font-semibold text-gray-800 mb-2">
          {language === "bn" ? food.titleBn || food.title : food.title}
        </h2>

        {/* Category */}
        <p className="text-gray-600">
          <span className="font-medium text-gray-700"></span>
          {language === "bn" ? food.categoryBn : food.category}
        </p>

        {/* Price */}
        <p className="mt-3 font-bold text-orange-500">
          {language === "bn" ? ` ${food.priceBn}` : `${food.price}`}
        </p>

        {/* Optional Description */}
        {food.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {language === "bn"
              ? food.descriptionBn || "সুস্বাদু ও সতেজ খাবার।"
              : food.description || "Delicious, freshly prepared food."}
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodCards;
