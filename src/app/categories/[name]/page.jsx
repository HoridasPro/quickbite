"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryPage = () => {
  const { name } = useParams();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch("https://taxi-kitchen-api.vercel.app/api/v1/foods/random")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.foods.filter(
          (food) => food.categoryName === name || food.category === name,
        );
        setFoods(filtered);
      });
  }, [name]);

  return (
    <div className="py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">
        {foods.length} {name} Foods
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foods.map((food) => (
          <div key={food.id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={food.foodImg}
              alt={food.foodName}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-sm font-semibold">{food.foodName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
