import React from 'react';

/**
 * List of menu categories with their respective item counts.
 * This can be replaced with dynamic data from an API in the future.
 */
const categories = [
  { id: 'popular', name: 'Popular', count: 4 },
  { id: 'rice', name: 'Rice', count: 7 },
  { id: 'sides', name: 'Sides', count: 3 },
  { id: 'drinks', name: 'Drinks', count: 5 },
];

/**
 * Renders a horizontal, scrollable navigation bar for restaurant menu categories.
 */
const CategoryNav = () => {
  return (
    <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1 " aria-label="Menu categories">
      {categories.map((cat, index) => (
        <button
          key={cat.id}
          type="button"
          className={`py-4 px-1 text-sm font-bold whitespace-nowrap transition-all relative group
            ${index === 0 ? 'text-secondary border-b-4 border-secondary' : 'text-gray-400 hover:text-secondary'}`}
        >
          {/* Category Label and Count */}
          {cat.name} ({cat.count})

          {/* Active/Hover Indicator Line */}
          <span 
            className={`absolute bottom-0 left-0 w-full h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${index === 0 ? 'hidden' : ''}`}
            aria-hidden="true"
          ></span>
        </button>
      ))}
    </nav>
  );
};

export default CategoryNav;