import FoodCards from "@/components/FoodCards";
import React from "react";

const getFoods = async () => {
  const res = await fetch(
    "https://taxi-kitchen-api.vercel.app/api/v1/foods/random",
    { cache: "no-store" },
  );
  const data = await res.json();
  return data.foods || [];
};

const FoodsPage = async () => {
  const foods = await getFoods();

  return (
    <div className="mx-auto px-6 py-10 mt-5">
      <h2 className="font-bold text-2xl mb-5">
        {foods.length} Restaurants Found
      </h2>

      {/* ✅ Responsive & Clean Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foods.map((food) => (
          <FoodCards key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FoodsPage;
