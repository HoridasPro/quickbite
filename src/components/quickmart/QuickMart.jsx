import React from "react";

const QuickMart = ({ food, onAdd }) => {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm border hover:shadow-md transition group">
      {/* Image */}
      <div className="h-32 w-full mb-3 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={food.strMealThumb}
          alt={food.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Title */}
      <h4 className="font-bold text-sm line-clamp-2">{food.strMeal}</h4>

      {/* Price + Button */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-orange-600 font-bold">
          Tk {Math.floor(Math.random() * 500) + 100}
        </span>

        <button
          onClick={onAdd}
          className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-700 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuickMart;
