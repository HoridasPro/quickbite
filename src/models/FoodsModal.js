// import React, { useState } from "react";

// const FoodsModal = () => {
//   const [quantity, setQuantity] = useState(1);
//   const [modalFood, setModalFood] = useState(null);
//   return (
//     <div>
//       {/* Modal */}
//       {modalFood && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-80 relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setModalFood(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
//             >
//               ✕
//             </button>

//             {/* Food Image */}
//             <div className="h-40 w-full mb-4 rounded-xl overflow-hidden bg-gray-100">
//               <img
//                 src={modalFood.strMealThumb}
//                 alt={modalFood.strMeal}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Title */}
//             <h3 className="font-bold text-lg mb-2">{modalFood.strMeal}</h3>

//             {/* Price */}
//             <p className="text-orange-600 font-bold mb-4">
//               Tk {Math.floor(Math.random() * 500) + 100}
//             </p>

//             {/* Quantity Selector */}
//             <div className="flex items-center justify-between mb-4">
//               <button
//                 onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                 className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold"
//               >
//                 -
//               </button>
//               <span className="text-lg font-bold">{quantity}</span>
//               <button
//                 onClick={() => setQuantity((q) => q + 1)}
//                 className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold"
//               >
//                 +
//               </button>
//             </div>

//             {/* Add to Cart Button */}
//             <button
//               onClick={() => {
//                 alert(`Added ${quantity} x ${modalFood.strMeal} to cart!`);
//                 setModalFood(null);
//               }}
//               className="w-full bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FoodsModal;
