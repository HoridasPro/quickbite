import React from "react";
import { Star, Info, Bike, ShoppingBag } from "lucide-react";
import Link from "next/link";

const RestaurantHero = ({ foodImg, title }) => {
  return (
    <div className="max-w-[1380px] mx-auto">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 py-4 flex items-center gap-2 pb-4 ">
        <span className="text-secondary font-medium hover:text-primary cursor-pointer underline underline-offset-4">
          Dhaka
        </span>
        <span>&gt;</span>
        <span className="text-secondary font-medium hover:text-primary cursor-pointer underline underline-offset-4">
          Restaurant List
        </span>
        <span>&gt;</span>
        <span className="text-secondary font-medium">
           {title}
        </span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6 items-start pb-7 mt-2  border-gray-100 pb-4 max-w-[1380px] mx-auto">
        {/* Restaurant Image */}
        <div className="w-full md:w-40 h-40 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
          <img
            src={foodImg}
            alt="Restaurant Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Restaurant Details */}
        <div className="flex-1 w-full">
          <p className="text-xs text-gray-500 mb-1">
            Asian • Indian • Rice Dishes • Biryani
          </p>

          <div className="flex justify-between items-start gap-4 mt-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">
              {title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <Link href="/delivery" className="flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded-md text-sm font-bold">
              <ShoppingBag size={14} />
              Super Restaurant
            </Link>

            <div className="flex items-center gap-1 text-sm font-medium">
              <Bike size={18} className="text-primary" />
              <span className="text-primary">
                Free delivery for first order
              </span>
              <span className="text-gray-400 line-through ml-1">Tk 40</span>
            </div>

            <div className="text-sm text-secondary font-medium">
              • Min. order Tk 50
            </div>
          </div>

          {/* info section  */}
          <div className="flex items-center justify-between gap-6 mt-4 pt-4 w-full">
            {/* Left Side: Rating and Info Group */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                <Star size={18} className="text-primary fill-primary" />
                <span className="font-bold text-secondary">4.1/5</span>
                <span className="text-gray-400 text-sm">
                  (1000+) See reviews
                </span>
              </div>

              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 text-secondary font-bold">
                <Info size={18} className="text-primary" />
                <span>More info</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* horizontal line */}
      <div className="border-t border-gray-200 my-4 "></div>

      <h2 className="font-bold text-2xl">Abailable deals</h2>
      <div className="flex flex-col md:flex-row gap-4 w-[700px] mt-5 mb-10">
        {/* Card 1: App-only deals */}
        <div className="flex-1 bg-gray-800 text-white rounded-xl p-6 flex items-center gap-4 shadow-md hover:shadow-xl transition">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">App-only deals</h3>
            <p className="text-gray-300 text-sm">
              Download the app to unlock more discounts
            </p>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center opacity-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v8m4-4H8"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: 15% off */}
        <div className="flex-1 bg-pink-100 text-pink-700 rounded-xl p-6 flex items-center gap-4 shadow-md hover:shadow-xl transition">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">15% off</h3>
            <p className="text-pink-600 text-sm">
              Min. order Tk 50. Valid for all items. Auto applied.
            </p>
          </div>
          <div className=" h-10 bg-pink-200 rounded-full flex items-center justify-center opacity-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v8m4-4H8"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHero;
