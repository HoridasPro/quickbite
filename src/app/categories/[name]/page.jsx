"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const CategoryPage = () => {
  const { name } = useParams();
  const [foods, setFoods] = useState([]);
  const decodedName = decodeURIComponent(name);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/feedback`)
      .then((res) => res.json())
      .then((data) => {
        // Safely handle the response whether it's an array or an object
        const items = Array.isArray(data) ? data : data.foods || [];
        
        const filtered = items.filter(
          (food) => food.categoryName === decodedName || food.category === decodedName,
        );
        setFoods(filtered);
      })
      .catch((error) => console.error("Error fetching category foods:", error));
  }, [decodedName]);

  return (
    <div className="py-10 px-6 max-w-[1380px] mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 capitalize">
        {foods.length} {decodedName} Foods
      </h1>

      {foods.length === 0 ? (
        <p className="text-gray-500">No items found for this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <Link href={`/foods/${food._id || food.id}`} key={food._id || food.id}>
              <div className="bg-white shadow-md rounded-lg p-4 transition hover:shadow-xl cursor-pointer border border-gray-100 h-full flex flex-col">
                <img
                  src={food.foodImg || food.image || "https://via.placeholder.com/150"}
                  alt={food.foodName || food.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {food.foodName || food.title}
                </h3>
                <div className="mt-auto pt-2">
                  <p className="text-orange-500 font-bold">Tk {food.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;