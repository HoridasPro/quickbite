// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import RestaurantHero from "@/components/restaurant/RestaurantHero";
// import { useParams } from "next/navigation";
// import SidebarCart from "@/components/SidebarCart";
// import Translation from "@/components/Translation";
// import FoodCardsSkeleton from "@/components/FoodCardsSkeleton";
// import AddToCardModal from "@/models/AddToCardModal";

// const getFoodById = async (id) => {
//   const res = await fetch(`/api/foods/${id}`);
//   const data = await res.json();
//   return data.success ? data.food : null;
// };

// const getFoods = async () => {
//   const res = await fetch(`/api/foods?limit=50`);
//   const data = await res.json();
//   return data.foods || [];
// };

// const getCategories = async () => {
//   const res = await fetch(`/api/categories`);
//   const data = await res.json();
//   return data || [];
// };

// const CategoryCard = ({ nameEn, nameBn, count, onClick, active }) => (
//   <div
//     onClick={onClick}
//     className={`flex-shrink-0 w-36 sm:w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
//       active
//         ? "border-2 border-orange-500 ring-2 ring-orange-100"
//         : "border border-gray-100"
//     }`}
//   >
//     <span className="text-sm font-medium text-gray-800 text-center truncate">
//       <Translation en={`${nameEn} (${count})`} bn={`${nameBn} (${count})`} />
//     </span>
//   </div>
// );

// const FoodCard = ({ food, onClick }) => (
//   <div
//     className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-col md:flex-row-reverse"
//     onClick={onClick}
//   >
//     <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 overflow-hidden rounded-r-lg">
//       <img
//         src={food.foodImg || food.image || "https://via.placeholder.com/150"}
//         alt={food.title || food.foodName || "Food Item"}
//         width={150}
//         height={150}
//         className="w-full h-full object-cover hover:scale-110 transition duration-500"
//       />
//     </div>
//     <div className="flex-1 p-4 flex flex-col justify-between">
//       <div>
//         <p className="text-gray-900 text-base font-bold line-clamp-2">
//           <Translation en={food.title} bn={food.titleBn} />
//         </p>
//         <p className="mt-2 text-orange-500 font-bold text-lg">
//           <Translation en={`Tk ${food.price}`} bn={`${food.priceBn}`} />
//         </p>
//         <p className="text-gray-500 text-xs mt-2 line-clamp-2">
//           <Translation en={food.description} bn={food.descriptionBn} />
//         </p>
//       </div>
//     </div>
//   </div>
// );
// const ProductPage = () => {
//   const params = useParams();
//   const { id } = params || {};

//   const [categories, setCategories] = useState([]);
//   const [foods, setFoods] = useState([]);
//   const [mainFood, setMainFood] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedFood, setSelectedFood] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const item = await getFoodById(id);
//         setMainFood(item);

//         const fds = await getFoods();
//         setFoods(fds);

//         const cats = await getCategories();
//         setCategories(cats);
//       } catch (err) {
//         console.error("Failed to fetch page data", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

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
//     scrollRef.current?.scrollBy({ left: 900, behavior: "smooth" });

//   const scrollLeft = () =>
//     scrollRef.current?.scrollBy({ left: -900, behavior: "smooth" });

//   if (loading)
//     return (
//       <div className="mt-10">
//         <FoodCardsSkeleton type="grid" count={9} />
//       </div>
//     );

//   if (!mainFood)
//     return (
//       <div className="p-10 text-center text-red-500 min-h-screen flex items-center justify-center">
//         Restaurant not found.
//       </div>
//     );

//   return (
//     <div className="pb-20 px-2 sm:px-4">
//       <div className="bg-[#FCFCFC] pt-4">
//         <RestaurantHero
//           foodImg={mainFood.foodImg || mainFood.image}
//           title={mainFood.title || mainFood.foodName}
//           titleBn={mainFood.titleBn || mainFood.foodNameBn}
//           id={mainFood.id || mainFood._id}
//         />
//       </div>

//       <div className="py-5 relative max-w-[1380px] mx-auto">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           {categories.length}{" "}
//           <Translation en="Food Categories" bn="খাদ্য বিভাগ" />
//         </h2>

//         <button
//           onClick={scrollLeft}
//           className="absolute left-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex hover:bg-gray-100 cursor-pointer"
//         >
//           {"<"}
//         </button>

//         <div
//           ref={scrollRef}
//           className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-10 pb-4"
//         >
//           {categories.map((cat, index) => {
//             const nameEn = cat.categoryName || cat.name;
//             const nameBn = cat.categoryBn || cat.nameBn;

//             return (
//               <CategoryCard
//                 key={cat.id || index}
//                 nameEn={nameEn}
//                 nameBn={nameBn}
//                 count={categoryCounts[nameEn] || 0}
//                 active={selectedCategory === nameEn}
//                 onClick={() =>
//                   setSelectedCategory(
//                     nameEn === selectedCategory ? null : nameEn,
//                   )
//                 }
//               />
//             );
//           })}
//         </div>

//         <button
//           onClick={scrollRight}
//           className="absolute right-0 top-20 bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex hover:bg-gray-100 cursor-pointer"
//         >
//           {">"}
//         </button>

//         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
//           <div className="md:col-span-8 lg:col-span-9">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {filteredFoods.map((food) => (
//                 <FoodCard
//                   key={food.id || food._id}
//                   food={food}
//                   onClick={() => {
//                     setSelectedFood(food);
//                     setQuantity(1);
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="md:col-span-4 lg:col-span-3">
//             <SidebarCart />
//           </div>
//         </div>
//       </div>

//       {selectedFood && (
//         <AddToCardModal
//           food={selectedFood}
//           quantity={quantity}
//           setQuantity={setQuantity}
//           onClose={() => setSelectedFood(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductPage;
"use client";

import React, { useEffect, useState, useRef } from "react";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import { useParams } from "next/navigation";
import SidebarCart from "@/components/SidebarCart";
import Translation from "@/components/Translation";
import FoodCardsSkeleton from "@/components/FoodCardsSkeleton";
import AddToCardModal from "@/models/AddToCardModal"; // নিশ্চিত করুন এই পাথটি সঠিক

const getFoodById = async (id) => {
  const res = await fetch(`/api/foods/${id}`);
  const data = await res.json();
  return data.success ? data.food : null;
};

const getFoods = async () => {
  const res = await fetch(`/api/foods?limit=50`);
  const data = await res.json();
  return data.foods || [];
};

const getCategories = async () => {
  const res = await fetch(`/api/categories`);
  const data = await res.json();
  return data || [];
};

const CategoryCard = ({ nameEn, nameBn, count, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex-shrink-0 w-36 sm:w-40 h-20 flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-xl ${
      active
        ? "border-2 border-orange-500 ring-2 ring-orange-100"
        : "border border-gray-100"
    }`}
  >
    <span className="text-sm font-medium text-gray-800 text-center truncate">
      <Translation en={`${nameEn} (${count})`} bn={`${nameBn} (${count})`} />
    </span>
  </div>
);

const FoodCard = ({ food, onClick }) => (
  <div
    className="flex bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition duration-300 flex-col"
    onClick={onClick}
  >
    <div className="w-full h-40 flex-shrink-0 overflow-hidden">
      <img
        src={food.foodImg || food.image || "https://via.placeholder.com/150"}
        alt={food.title || food.foodName || "Food Item"}
        className="w-full h-full object-cover hover:scale-110 transition duration-500"
      />
    </div>
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <p className="text-gray-900 text-base font-bold line-clamp-1">
          <Translation en={food.title} bn={food.titleBn} />
        </p>
        <p className="mt-1 text-orange-500 font-bold text-lg">
          <Translation en={`Tk ${food.price}`} bn={`${food.priceBn} টাকা`} />
        </p>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          <Translation en={food.description} bn={food.descriptionBn} />
        </p>
      </div>
    </div>
  </div>
);

const ProductPage = () => {
  const params = useParams();
  const { id } = params || {};

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [mainFood, setMainFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null); // মোডালের জন্য
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const item = await getFoodById(id);
        setMainFood(item);
        const fds = await getFoods();
        setFoods(fds);
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredFoods = selectedCategory
    ? foods.filter((f) => f.category === selectedCategory || f.categoryName === selectedCategory)
    : foods;

  const categoryCounts = categories.reduce((acc, cat) => {
    const name = cat.categoryName || cat.name;
    acc[name] = foods.filter((f) => f.category === name || f.categoryName === name).length;
    return acc;
  }, {});

  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });

  if (loading) return <div className="mt-10"><FoodCardsSkeleton type="grid" count={9} /></div>;
  if (!mainFood) return <div className="p-10 text-center text-red-500">Restaurant not found.</div>;

  return (
    <div className="pb-20 px-2 sm:px-4 max-w-[1380px] mx-auto">
      <div className="bg-[#FCFCFC] pt-4">
        <RestaurantHero
          foodImg={mainFood.foodImg || mainFood.image}
          title={mainFood.title || mainFood.foodName}
          titleBn={mainFood.titleBn || mainFood.foodNameBn}
          id={mainFood.id || mainFood._id}
        />
      </div>

      <div className="py-5 relative">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          <Translation en="Food Categories" bn="খাদ্য বিভাগ" /> ({categories.length})
        </h2>

        <div className="flex items-center">
            <button onClick={scrollLeft} className="bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex hover:bg-gray-100 mr-2">{"<"}</button>
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar mb-10 pb-4">
            {categories.map((cat, index) => (
                <CategoryCard
                key={cat.id || index}
                nameEn={cat.categoryName || cat.name}
                nameBn={cat.categoryBn || cat.nameBn}
                count={categoryCounts[cat.categoryName || cat.name] || 0}
                active={selectedCategory === (cat.categoryName || cat.name)}
                onClick={() => setSelectedCategory(selectedCategory === (cat.categoryName || cat.name) ? null : (cat.categoryName || cat.name))}
                />
            ))}
            </div>
            <button onClick={scrollRight} className="bg-white shadow-md p-2 rounded-full z-10 hidden sm:flex hover:bg-gray-100 ml-2">{">"}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id || food._id}
                  food={food}
                  onClick={() => setSelectedFood(food)} // এখানে ডাটা সেট হচ্ছে
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-3">
            <SidebarCart />
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {selectedFood && (
        <AddToCardModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;