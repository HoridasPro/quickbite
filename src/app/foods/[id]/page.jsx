// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import RestaurantHero from "@/components/restaurant/RestaurantHero";

// //Fetch all foods
// const getFoods = async () => {
//   const res = await fetch(`http://localhost:3000/api/feedback`);
//   const data = await res.json();
//   return data || [];
// };

// //Fetch categories
// const getCategories = async () => {
//   const res = await fetch(
//     `https://taxi-kitchen-api.vercel.app/api/v1/categories`,
//   );
//   const data = await res.json();
//   return data.categories || [];
// };

// //Category Card Component
// const CategoryCard = ({ name, count, onClick, active }) => (
//   <div
//     onClick={onClick}
//     className={`flex-shrink-0 w-36 sm:w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
//       active ? "border-2 border-orange-500" : ""
//     }`}
//   >
//     <span className="text-sm font-medium text-gray-800 text-center truncate">
//       {name} ({count})
//     </span>
//   </div>
// );

// //Food Card Component
// const FoodCard = ({ food, onClick }) => (
//   <div
//     className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-col md:flex-row-reverse"
//     onClick={onClick}
//   >
//     <div className="w-full md:w-32 h-32 md:h-36 flex-shrink-0 overflow-hidden">
//       <img
//         src={food.foodImg}
//         alt={food.title}
//         className="w-full h-full object-cover hover:scale-110 transition duration-500"
//       />
//     </div>

//     <div className="flex-1 p-4 flex flex-col justify-between">
//       <div>
//         <p className="text-gray-600 text-sm font-bold line-clamp-2">
//           {food.title}
//         </p>
//         <p className="mt-2 text-orange-500 font-bold text-lg">
//           Tk {food.price}
//         </p>
//         <p className="text-gray-600 text-sm line-clamp-2">
//           {food.description ||
//             "Delicious, freshly prepared food made with premium ingredients."}
//         </p>
//       </div>
//     </div>
//   </div>
// );

// //Sidebar Component
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

// const ProductPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [foods, setFoods] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // 🔥 Modal States
//   const [selectedFood, setSelectedFood] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const cats = await getCategories();
//       setCategories(cats);
//       const fds = await getFoods();
//       setFoods(fds);
//     };
//     fetchData();
//   }, []);

//   const filteredFoods = selectedCategory
//     ? foods.filter(
//         (f) =>
//           f.category === selectedCategory ||
//           f.categoryName === selectedCategory,
//       )
//     : foods;

//   const categoryCounts = categories.reduce((acc, cat) => {
//     const name = cat.categoryName || cat.name;
//     acc[name] = foods.filter(
//       (f) => f.category === name || f.categoryName === name,
//     ).length;
//     return acc;
//   }, {});

//   const scrollRight = () =>
//     scrollRef.current.scrollBy({ left: 900, behavior: "smooth" });
//   const scrollLeft = () =>
//     scrollRef.current.scrollBy({ left: -900, behavior: "smooth" });

//   return (
//     <div className="pb-20 px-2 sm:px-4">
//       {/* Hero */}
//       <div className="bg-[#FCFCFC] pt-4">
//         {foods[0] && (
//           <RestaurantHero foodImg={foods[0].foodImg} title={foods[0].title} />
//         )}
//       </div>

//       {/* Categories */}
//       <div className="py-5 relative max-w-[1380px] mx-auto">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           {categories.length} Food Cat
//         </h2>

//         <button
//           onClick={scrollLeft}
//           className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex"
//         >
//           {"<"}
//         </button>

//         <div
//           ref={scrollRef}
//           className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide mb-10"
//         >
//           {categories.map((cat) => {
//             const name = cat.categoryName || cat.name;
//             return (
//               <CategoryCard
//                 key={cat.id}
//                 name={name}
//                 count={categoryCounts[name] || 0}
//                 active={selectedCategory === name}
//                 onClick={() => setSelectedCategory(name)}
//               />
//             );
//           })}
//         </div>

//         <button
//           onClick={scrollRight}
//           className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex"
//         >
//           {">"}
//         </button>

//         {/* Foods + Sidebar */}
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//           <div className="md:col-span-9">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {filteredFoods.map((food) => (
//                 <FoodCard
//                   key={food.id}
//                   food={food}
//                   onClick={() => {
//                     setSelectedFood(food);
//                     setQuantity(1);
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="md:col-span-3">
//             <Sidebar />
//           </div>
//         </div>
//       </div>

//       {/* 🔥 Modal */}
//       {selectedFood && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-xl relative">
//             <button
//               onClick={() => setSelectedFood(null)}
//               className="absolute top-4 right-4 text-gray-500 text-xl"
//             >
//               ✕
//             </button>

//             <div className="w-full h-56 overflow-hidden">
//               <img
//                 src={selectedFood.foodImg}
//                 alt={selectedFood.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div className="p-6 space-y-3">
//               <h2 className="text-xl font-bold">{selectedFood.title}</h2>
//               <p className="text-orange-500 font-bold text-lg">
//                 Tk {selectedFood.price}
//               </p>
//               <p className="text-gray-600 text-sm">
//                 {selectedFood.description}
//               </p>
//             </div>

//             <div className="border-t p-4 flex items-center gap-4">
//               <div className="flex items-center border rounded-full px-3 py-2">
//                 <button
//                   onClick={() =>
//                     setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
//                   }
//                 >
//                   −
//                 </button>
//                 <span className="px-3 font-medium">{quantity}</span>
//                 <button onClick={() => setQuantity((prev) => prev + 1)}>
//                   +
//                 </button>
//               </div>

//               <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
//                 Add to cart • Tk {selectedFood.price * quantity}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPage;

"use client";

import React, { useEffect, useState, useRef } from "react";
import RestaurantHero from "@/components/restaurant/RestaurantHero";

// Fetch all foods
const getFoods = async () => {
  const res = await fetch(`http://localhost:3000/api/feedback`);
  const data = await res.json();
  return data || [];
};

//Fetch categories
const getCategories = async () => {
  const res = await fetch(
    `https://taxi-kitchen-api.vercel.app/api/v1/categories`,
  );
  const data = await res.json();
  return data.categories || [];
};

//Category Card Component
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
    <div className="w-full md:w-32 h-32 md:h-36 flex-shrink-0 overflow-hidden">
      <img
        src={food.foodImg}
        alt={food.title}
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
const Sidebar = () => (
  <div className="w-full md:w-80 bg-white shadow-md rounded-xl p-4 sticky top-24 h-auto md:h-[calc(100vh-6rem)] overflow-y-auto">
    <h3 className="text-xl font-bold mb-4">Your Cart</h3>
    <p className="text-gray-500 text-sm">Add items to see your cart.</p>
    <div className="mt-6 border-t border-gray-200 pt-4">
      <p className="text-gray-700 font-medium">Total: Tk 0</p>
      <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300">
        Review Payment
      </button>
    </div>
  </div>
);

//Food Modal Component
const FoodModal = ({ food, quantity, setQuantity, onClose }) => {
  const price = food?.price || 0;

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg overflow-hidden shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 cursor-pointer text-2xl font-bold z-20"
        >
          ✕
        </button>
        {/* Image Section */}
        <div className="relative">
          <img
            src={
              food?.foodImg ||
              "https://images.unsplash.com/photo-1604908554165-2e0c15e36d1a"
            }
            alt={food?.title || "Food Item"}
            fill
            className="object-cover rounded-t-lg w-full h-50"
          />
        </div>
        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">{food?.title || "Food Item"}</h2>
          <p className="text-lg font-bold">Tk {price}</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            {food?.description ||
              "Delicious, freshly prepared food made with premium ingredients."}
          </p>
          <hr />
          {/* Special Instructions */}
          <div>
            <h3 className="font-semibold text-lg">Special instructions</h3>
            <p className="text-sm text-gray-500 mb-2">
              Special requests are subject to the restaurants approval. Tell us
              here!
            </p>
            <textarea
              placeholder="e.g. No mayo"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500"
              rows={3}
            ></textarea>
          </div>

          {/* If Not Available */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              If this item is not available
            </h3>
            <select className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500">
              <option>Remove it from my order</option>
              <option>Cancel the entire order</option>
              <option>Call me</option>
            </select>
          </div>
        </div>

        {/* Bottom Fixed Section */}
        <div className="border-t p-4 flex items-center gap-4">
          {/* Quantity */}
          <div className="flex items-center border rounded-full px-3 py-2">
            <button
              onClick={decreaseQty}
              className="text-lg px-2 text-gray-600"
            >
              −
            </button>
            <span className="px-3 font-medium">{quantity}</span>
            <button
              onClick={increaseQty}
              className="text-lg px-2 text-gray-600"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer">
            Add to cart • Tk {price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Page
const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCategories();
      setCategories(cats);
      const fds = await getFoods();
      setFoods(fds);
    };
    fetchData();
  }, []);

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
    scrollRef.current.scrollBy({ left: 900, behavior: "smooth" });
  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -900, behavior: "smooth" });

  return (
    <div className="pb-20 px-2 sm:px-4">
      {/* Hero */}
      <div className="bg-[#FCFCFC] pt-4">
        {foods[0] && (
          <RestaurantHero foodImg={foods[0].foodImg} title={foods[0].title} />
        )}
      </div>

      {/* Categories */}
      <div className="py-5 relative max-w-[1380px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {categories.length} Food Cat
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
          {categories.map((cat) => {
            const name = cat.categoryName || cat.name;
            return (
              <CategoryCard
                key={cat.id}
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

        {/* Foods + Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
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
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Food Modal */}
      {selectedFood && (
        <FoodModal
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
