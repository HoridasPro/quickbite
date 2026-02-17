import { Search } from 'lucide-react';

/**
 * Provides an input field for users to search for specific items within the restaurant menu.
 */
const MenuSearchBar = () => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={18} 
      />
      
      {/* Search Input Field */}
      <input 
        type="text" 
        placeholder="Search in menu..." 
        className="w-full py-2.5 pl-10 pr-4 bg-gray-100 border-none rounded-full focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none text-secondary text-sm"
      />
    </div>
  );
};

export default MenuSearchBar;