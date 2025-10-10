import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategorySection = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  
  const categories = [
    { _id: 1, name: "ghee-oil", label: "Ghee & Oil", icon: "🥜" },
    { _id: 2, name: "dry-fruits", label: "Dry Fruits", icon: "🌰" },
    { _id: 3, name: "spices", label: "Spices", icon: "🌶️" },
    { _id: 4, name: "sweets", label: "Sweets", icon: "🍬" },
    { _id: 5, name: "pulses-flour", label: "Pulses & Flour", icon: "🌾" },
    { _id: 6, name: "fruits-vegetables", label: "Fruit & Vegetables", icon: "🍎" },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (categoryName) => {
    console.log("🔄 Category clicked:", categoryName);
    const filterData = { category: [categoryName] };
    sessionStorage.setItem("filters", JSON.stringify(filterData));
    navigate(`/shop/listing?category=${categoryName}`, { replace: false });
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="relative group py-4 sm:py-6 lg:py-8">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md sm:shadow-lg rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-50 border border-yellow-200 sm:border-2"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md sm:shadow-lg rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-50 border border-yellow-200 sm:border-2"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
      </button>

      {/* Categories Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 md:px-8 py-4 sm:py-6 justify-start md:justify-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category.name)}
            className="flex-shrink-0 flex flex-col items-center gap-2 sm:gap-3 group/item focus:outline-none"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-full flex items-center justify-center shadow-md sm:shadow-lg group-hover/item:shadow-2xl transition-all transform group-hover/item:scale-110 group-hover/item:from-yellow-100 group-hover/item:to-orange-200 border border-yellow-200 sm:border-2">
              <span className="text-2xl sm:text-3xl md:text-4xl">{category.icon}</span>
            </div>
            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 group-hover/item:text-yellow-600 transition-colors text-center max-w-[80px] sm:max-w-[100px] truncate">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
