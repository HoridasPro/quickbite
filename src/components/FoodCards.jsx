"use client";

const FoodCards = ({ food }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border-2 border-red-500 hover:border-orange-400 p-2">
      {/* Image */}
      <figure className="">
        <img
          className="h-[200px] w-full flex object-cover hover:scale-110 transition duration-500 rounded-xl"
          src={food.foodImg}
          alt={food.title}
        />
      </figure>

      {/* Content */}

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {food.title}
        </h2>

        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">Category:</span>
          {food.category}
        </p>

        <p className="mt-3 text-xl font-bold text-orange-500">${food.price}</p>
      </div>

      <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition duration-300 cursor-pointer">
        View Details
      </button>
    </div>
  );
};

export default FoodCards;
