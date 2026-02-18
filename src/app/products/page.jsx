import RestaurantHero from "@/components/restaurant/RestaurantHero";
import CategoryNav from "@/components/restaurant/CategoryNav";
import MenuSearchBar from "@/components/restaurant/MenuSearchBar";

/**
 * Product Listing Page Component
 * Connects the Hero section, Sticky Search, and Category Navigation.
 */
export default function ProductPage() {
  return (
    <div className="pb-20">

      {/* Sticky upper section  */}
      <div className="bg-[#FCFCFC] pt-4">
        {/* Restaurant Header Information */}
        <section className="">
          <div className="w-full mx-auto px-4">
            <RestaurantHero />
          </div>
        </section>

        {/* Sticky Navigation & Search Wrapper */}
        <div className="sticky top-0 z-40  shadow-[0_4px_12px_-10px_rgba(0,0,0,0.3)]  max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 ">
          <div className="w-full mx-auto px-4 flex items-center gap-8">

            {/* Left: Search Bar (Fixed Width) */}
            <div className="w-72 shrink-0 py-2">
              <MenuSearchBar />
            </div>

            {/* Right: Category Navigation (Takes remaining space) */}
            <div className="flex-1 overflow-hidden">
              <CategoryNav />
            </div>

          </div>
        </div>
      </div>


      {/* Main Content Area Placeholder */}
      <main className="max-w-[1280px] mx-auto mt-10 px-4 md:px-8 lg:px-10">
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400 italic">Menu items will be displayed here.</p>
        </div>
      </main>
    </div>
  );
}