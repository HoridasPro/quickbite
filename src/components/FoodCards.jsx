"use client";

import { useRouter } from "next/navigation";

const FoodCards = ({ food }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/foods/${food.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border-2 border-gray-100 p-2 cursor-pointer"
    >
      {/* Image */}
      <figure className="">
        <img
          className="h-[150px] w-full flex object-cover hover:scale-110 transition duration-500 rounded-xl"
          src={food.foodImg}
          alt={food.title}
          b
        />
      </figure>

      {/* Content */}

      <div className="mt-2">
        <h2 className="font-semibold text-gray-800 mb-2">{food.title}</h2>

        <p className="text-gray-600">
          <span className="font-medium text-gray-700">Category:</span>
          {food.category}
        </p>

        <p className="mt-3 font-bold text-orange-500">${food.price}</p>
      </div>
    </div>
  );
};

export default FoodCards;
