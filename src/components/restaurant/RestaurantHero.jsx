import React from 'react';
import { Star, Info, Heart, Bike, ShoppingBag } from 'lucide-react';

const RestaurantHero = () => {
    return (
        <div className="w-full ">
            {/* Breadcrumbs */}
            <nav className="text-sm text-gray-500 py-4 flex items-center gap-2 pb-4 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
                <span className="text-secondary font-medium hover:text-primary cursor-pointer underline underline-offset-4">Dhaka</span>
                <span>&gt;</span>
                <span className="text-secondary font-medium hover:text-primary cursor-pointer underline underline-offset-4">Restaurant List</span>
                <span>&gt;</span>
                <span className="text-secondary font-medium">New Dhansiri Biryani House</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-6 items-start pb-7 mt-2  border-gray-100 pb-4 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
                {/* Restaurant Image */}
                <div className="w-full md:w-40 h-40 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                    <img
                        src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop"
                        alt="Restaurant Logo"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Restaurant Details */}
                <div className="flex-1 w-full">
                    <p className="text-xs text-gray-500 mb-1">Asian • Indian • Rice Dishes • Biryani</p>

                    <div className="flex justify-between items-start gap-4 mt-3">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">
                            New Dhansiri Biryani House
                        </h1>

                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded-md text-sm font-bold">
                            <ShoppingBag size={14} />
                            Super Restaurant
                        </div>

                        <div className="flex items-center gap-1 text-sm font-medium">
                            <Bike size={18} className="text-primary" />
                            <span className="text-primary">Free delivery for first order</span>
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
                                <span className="text-gray-400 text-sm">(1000+) See reviews</span>
                            </div>

                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 text-secondary font-bold">
                                <Info size={18} className="text-primary" />
                                <span>More info</span>
                            </div>
                        </div>

                        {/* Right Side: Favourite Button */}
                        <button className="btn btn-outline btn-sm rounded-lg gap-2 border-black border-[1px] hover:bg-gray-50 hover:text-secondary normal-case px-8 py-6 text-sm">
                            <Heart size={22} />
                            Add to favourites
                        </button>
                    </div>
                </div>
            </div>

            {/* horizontal line */}
            <div className="border-t border-gray-200 my-4 "></div>

            {/* Available Deals Section */}
            <div className="mt-8 mb-8 pb-4 max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
                <h3 className="text-2xl font-bold text-secondary mb-4">Available deals</h3>
                <div className="bg-secondary text-white pt-4 pb-16 px-4 rounded-2xl max-w-sm relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-primary p-1 rounded">
                                <ShoppingBag size={14} />
                            </div>
                            <span className="font-bold">App-only deals</span>
                        </div>
                        <p className="text-sm text-gray-300">Download the app to unlock more discounts</p>
                    </div>
                    {/* Subtle background icon for design */}
                    <ShoppingBag size={100} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
                </div>
            </div>
        </div>
    );
};

export default RestaurantHero;