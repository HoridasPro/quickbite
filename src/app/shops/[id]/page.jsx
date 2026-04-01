// "use client";

// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const getFoodById = async (id) => {
//   try {
//     const res = await fetch(`/api/shops/${id}`);
//     const data = await res.json();

//     // ডাটা যদি অ্যারে হয় তবে প্রথমটি নিবে, নাহলে সরাসরি অবজেক্ট নিবে
//     if (data.success && data.meals) {
//       return Array.isArray(data.meals) ? data.meals[0] : data.meals;
//     }
//     return null;
//   } catch (error) {
//     console.error("API Error:", error);
//     return null;
//   }
// };

// const ShopDetails = () => {
//   const params = useParams();
//   const id = params?.id;
//   const [mainFood, setMainFood] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   // ১. উইশলিস্টে আছে কি না চেক করা (ID match fixing)
//   useEffect(() => {
//     const saved = localStorage.getItem("wishlist");
//     if (saved && id) {
//       const list = JSON.parse(saved);
//       // String এ কনভার্ট করে চেক করা নিরাপদ
//       setIsWishlisted(list.some((item) => String(item.id) === String(id)));
//     }
//   }, [id]);

//   // ২. ডাটা ফেচ করা
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       setLoading(true);
//       const item = await getFoodById(id);
//       console.log("Fetched Item:", item); // কনসোলে দেখুন ডাটা আসছে কি না
//       setMainFood(item);
//       setLoading(false);
//     };
//     fetchData();
//   }, [id]);

//   // ৩. উইশলিস্টে সেভ করার ফাংশন (Data Mapping Fix)
//   const toggleWishlist = (food) => {
//     if (!food) return;

//     const saved = localStorage.getItem("wishlist");
//     let list = saved ? JSON.parse(saved) : [];

//     const foodId = String(id); // URL থেকে আসা ID ব্যবহার করা সবচেয়ে নিরাপদ
//     const isExist = list.find((item) => String(item.id) === foodId);

//     if (isExist) {
//       list = list.filter((item) => String(item.id) !== foodId);
//       setIsWishlisted(false);
//     } else {
//       // এই অবজেক্টটি ঠিকমতো সেভ না হলে Wishlist পেজে কিছু দেখাবে না
//       const itemToSave = {
//         id: foodId,
//         name: food.name || "No Name",
//         image: food.image || "/placeholder.jpg",
//         location: food.location || "N/A",
//         fee: food.fee || 0,
//         time: food.time || 0,
//       };
//       list.push(itemToSave);
//       setIsWishlisted(true);
//     }

//     localStorage.setItem("wishlist", JSON.stringify(list));
//     window.dispatchEvent(new Event("wishlistUpdated"));
//     console.log("Updated Wishlist:", list); // চেক করুন স্টোরেজ আপডেট হচ্ছে কি না
//   };

//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   if (!mainFood)
//     return <div className="p-4 text-center">No Data Found for ID: {id}</div>;

//   return (
//     <div className="max-w-sm mx-auto p-4 border rounded-2xl shadow-sm">
//       <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-gray-100">
//         <img
//           src={mainFood.image || "/placeholder.jpg"}
//           alt={mainFood.name}
//           className="w-full h-full object-cover"
//         />

//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             toggleWishlist(mainFood);
//           }}
//           className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
//         >
//           <svg
//             className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
//             viewBox="0 0 24 24"
//             fill={isWishlisted ? "currentColor" : "none"}
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//           </svg>
//         </button>
//       </div>

//       <div className="px-1">
//         <h3 className="font-bold text-gray-800 text-lg">{mainFood.name}</h3>
//         <p className="text-sm text-gray-500">{mainFood.location}</p>
//         <p className="font-bold text-orange-600 mt-1">Tk {mainFood.fee}</p>
//       </div>
//     </div>
//   );
// };

// export default ShopDetails;


