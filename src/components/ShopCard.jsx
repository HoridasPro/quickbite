import React from "react";

const ShopCard = ({ store, toggleWishlist, isWishlisted }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ad Tag */}
        {store.isAd && (
          <div className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            Ad
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            toggleWishlist(store);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:scale-110 transition-all z-10"
        >
          <svg
            className={`h-4 w-4 ${isWishlisted ? "fill-orange-500 text-orange-500" : "text-gray-500"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isWishlisted ? 0 : 2}
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="px-1">
        <h3 className="font-bold text-[15px] text-gray-800 truncate">
          {store.name}

          <span className="font-normal text-gray-500">({store.location})</span>
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 font-medium">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {store.time} min
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-700">
          <svg
            className="w-3.5 h-3.5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
          Tk {store.fee}
          <span className="text-[10px] text-orange-600">▼</span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
