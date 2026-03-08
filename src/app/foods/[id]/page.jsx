"use client";

import React, { useEffect, useState, useRef } from "react";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import { useParams } from "next/navigation";
import FoodsModal from "@/models/FoodsModal";
import CartSideBar from "@/components/CartSideBar";
// import ProductPage from "@/components/ProductPage";

const getFoods = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`);
  const data = await res.json();
  return data || [];
};

const getCategories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
  const data = await res.json();
  console.log(data);
  return data || [];
};

// Category Card Component
const CategoryCard = ({ name, count, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex-shrink-0 w-36 sm:w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
      active ? "border-2 border-orange-500" : ""
    }`}
  >
    <span className="text-sm font-medium text-gray-800 text-center truncate">
      {name} ({count})
    </span>
  </div>
);

// Food Card Component
const FoodCard = ({ food, onClick }) => (
  <div
    className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-col md:flex-row-reverse"
    onClick={onClick}
  >
    <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 overflow-hidden rounded-r-lg">
      <img
        src={food.foodImg}
        alt={food.title || food.foodName || "Food Item"}
        width={150}
        height={150}
        className="w-full h-full object-cover hover:scale-110 transition duration-500"
      />
    </div>
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <p className="text-gray-600 text-sm font-bold line-clamp-2">
          {food.title}
        </p>
        <p className="mt-2 text-orange-500 font-bold text-lg">
          Tk {food.price}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2">
          {food.description ||
            "Delicious, freshly prepared food made with premium ingredients."}
        </p>
      </div>
    </div>
  </div>
);

// Sidebar Component
// const Sidebar = () => (
//   <div className="w-full md:w-80 bg-white shadow-md rounded-xl p-4 sticky top-24 h-auto md:h-[calc(100vh-6rem)] overflow-y-auto">
//     <h3 className="text-xl font-bold mb-4">Your Cart</h3>
//     <p className="text-gray-500 text-sm">Add items to see your cart.</p>
//     <div className="mt-6 border-t border-gray-200 pt-4">
//       <p className="text-gray-700 font-medium">Total: Tk 0</p>
//       <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300">
//         Review Payment
//       </button>
//     </div>
//   </div>
// );

// Food Modal Component
// const FoodModal = ({ food, quantity, setQuantity, onClose }) => {
//   const price = food?.price || 0;
//   const increaseQty = () => setQuantity((prev) => prev + 1);
//   const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-3xl rounded-lg overflow-hidden shadow-xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-red-600 cursor-pointer text-2xl font-bold z-20"
//         >
//           ✕
//         </button>

//         <div className="relative">
//           <img
//             src={
//               food?.foodImg ||
//               "https://images.unsplash.com/photo-1604908554165-2e0c15e36d1a"
//             }
//             alt={food?.title || "Food Item"}
//             className="object-cover rounded-t-lg w-full h-50"
//           />
//         </div>

//         <div className="p-6 space-y-4">
//           <h2 className="text-xl font-bold">{food?.title || "Food Item"}</h2>
//           <p className="text-lg font-bold">Tk {price}</p>
//           <p className="text-gray-500 text-sm leading-relaxed">
//             {food?.description ||
//               "Delicious, freshly prepared food made with premium ingredients."}
//           </p>
//           <hr />
//           <div>
//             <h3 className="font-semibold text-lg">Special instructions</h3>
//             <p className="text-sm text-gray-500 mb-2">
//               Special requests are subject to the restaurant's approval.
//             </p>
//             <textarea
//               placeholder="e.g. No mayo"
//               className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500"
//               rows={3}
//             ></textarea>
//           </div>
//         </div>

//         <div className="border-t p-4 flex items-center gap-4">
//           <div className="flex items-center border rounded-full px-3 py-2">
//             <button
//               onClick={decreaseQty}
//               className="text-lg px-2 text-gray-600"
//             >
//               −
//             </button>
//             <span className="px-3 font-medium">{quantity}</span>
//             <button
//               onClick={increaseQty}
//               className="text-lg px-2 text-gray-600"
//             >
//               +
//             </button>
//           </div>
//           <button className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer">
//             Add to cart • Tk {price * quantity}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//  <FoodsModal></FoodsModal>;

// Product Page
const ProductPage = () => {
  const params = useParams();
  const { id } = params || {};

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [mainFood, setMainFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fds = await getFoods();
        setFoods(fds);

        if (fds.length > 0) {
          const currentItem = fds.find((f) => f.id.toString() === id);
          setMainFood(currentItem || fds[0]);
        }

        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch page data", err);
      }
    };
    fetchData();
  }, [id]);

  const filteredFoods = selectedCategory
    ? foods.filter(
        (f) =>
          f.category === selectedCategory ||
          f.categoryName === selectedCategory,
      )
    : foods;

  const categoryCounts = categories.reduce((acc, cat) => {
    const name = cat.categoryName || cat.name;
    acc[name] = foods.filter(
      (f) => f.category === name || f.categoryName === name,
    ).length;
    return acc;
  }, {});

  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 900, behavior: "smooth" });
  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -900, behavior: "smooth" });

  return (
    <div className="pb-20 px-2 sm:px-4">
      <div className="bg-[#FCFCFC] pt-4">
        {mainFood && (
          <RestaurantHero foodImg={mainFood.foodImg} title={mainFood.title} />
        )}
      </div>

      <div className="py-5 relative max-w-[1380px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {categories.length} Food Categories Find
        </h2>

        <button
          onClick={scrollLeft}
          className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex"
        >
          {"<"}
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide mb-10"
        >
          {categories.map((cat, index) => {
            const name = cat.categoryName || cat.name;
            return (
              <CategoryCard
                key={cat.id || index}
                name={name}
                count={categoryCounts[name] || 0}
                active={selectedCategory === name}
                onClick={() => setSelectedCategory(name)}
              />
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex"
        >
          {">"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id || food._id}
                  food={food}
                  onClick={() => {
                    setSelectedFood(food);
                    setQuantity(1);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <CartSideBar></CartSideBar>;
          </div>
        </div>
      </div>

      {selectedFood && (
        <FoodsModal
          food={selectedFood}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;
