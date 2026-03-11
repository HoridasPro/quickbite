"use client";

import CategoriesFoods from "@/components/CategoriesFoods";
import FoodCards from "@/components/FoodCards";
import HeroSection from "@/components/HeroSection";
import { useSearchParams } from "next/navigation";

const getFoods = async (search = "") => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback?search=${search}`,
  );
  const data = await res.json();
  return data || [];
};

const FoodsPageContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [foods, setFoods] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerElement = document.getElementById('main-header');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSort, selectedOffer, selectedCategory, searchQuery]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: 9,
        });
        
        if (selectedSort) params.append("sort", selectedSort);
        if (selectedOffer) params.append("offer", selectedOffer);
        if (selectedCategory) params.append("category", selectedCategory);
        if (searchQuery) params.append("search", searchQuery);

        const res = await fetch(`/api/foods?${params.toString()}`);
        const data = await res.json();
        setFoods(data.foods || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
      }
    };
    loadFoods();
  }, [currentPage, selectedSort, selectedOffer, selectedCategory, searchQuery]);

  const sortOptions = [
    "Relevance",
    "Delivery Time",
    "Rating",
    "Price: Low to High",
    "Price: High to Low",
  ];

  const offerOptions = ["Discount", "Free Delivery", "Buy 1 Get 1", "Cashback"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5 mb-20 items-start">
      {/* Sidebar Filter - Hidden on mobile, shown on large screens */}
      <div 
        className="hidden lg:block lg:col-span-3 bg-white shadow-lg rounded-2xl p-6 sticky self-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          top: `${headerHeight + 20}px`,
          maxHeight: `calc(100vh - ${headerHeight + 40}px)`
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl">Filters</h2>
          <button
            onClick={() => {
              setSelectedSort("");
              setSelectedOffer("");
              setSelectedCategory("");
            }}
            className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-xl cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">Sort By</h4>
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <div
                key={option}
                onClick={() => setSelectedSort(option === selectedSort ? "" : option)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                    selectedSort === option ? "bg-black border-black" : "border-gray-400"
                  }`}
                >
                  {selectedSort === option && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Offers</h4>
          <div className="space-y-3">
            {offerOptions.map((option) => (
              <div
                key={option}
                onClick={() => setSelectedOffer(option === selectedOffer ? "" : option)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-100 p-1 rounded-xl"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                    selectedOffer === option ? "bg-black border-black" : "border-gray-400"
                  }`}
                >
                  {selectedOffer === option && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product section for the right side*/}
      <div className="col-span-9 overflow-y-auto px-6">
        <HeroSection></HeroSection>
        <CategoriesFoods></CategoriesFoods>

        <h2 className="font-bold text-2xl mt-10 mb-5">
          {foods.length} Restaurants Found {selectedCategory && `for "${selectedCategory}"`} {searchQuery && `matching "${searchQuery}"`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCards key={food.id || food._id} food={food} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-10 pb-20">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-300 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="font-bold text-gray-900 bg-orange-100 px-4 py-2 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-300 font-semibold transition cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FoodsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-10 text-gray-500">Loading...</div>}>
      <FoodsPageContent />
    </Suspense>
  );
}