import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const RefurbishedFilters = ({
  filteredCount,
  selectedPrice,
  setSelectedPrice,
  selectedBrands,
  toggleBrand,
  selectedCapacities,
  toggleCapacity,
  selectedConditions,
  toggleCondition,
  clearFilters,
}) => {
  return (
    <aside className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans w-full sticky top-28">
      {/* Header */}
      <div className="flex items-center space-x-2 text-[#1C0D2A]">
        <SlidersHorizontal className="w-8 h-8 text-[#1C0D2A]" />
        <h2 className="text-3xl font-black">Filters</h2>
      </div>

      {/* Products Count */}
      <p className="text-sm font-bold text-[#FF6534] mt-1 mb-6">
        {filteredCount} Products found
      </p>

      {/* 1. Price Filter */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#FF6534] mb-3">Price</h3>
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
          <span>£0</span>
          <span>£{selectedPrice}.00</span>
        </div>
        <input
          type="range"
          min="0"
          max="600"
          step="10"
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6534]"
        />
      </div>

      {/* 2. Brand Filter */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#FF6534] mb-3">Brand</h3>
        <div className="space-y-2.5">
          {['Apple', 'Google', 'Samsung'].map((brand) => (
            <label
              key={brand}
              className="flex items-center space-x-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:text-[#FF6534] transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6534] focus:ring-[#FF6534] cursor-pointer accent-[#FF6534]"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Capacity Filter */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#FF6534] mb-3">Capacity</h3>
        <div className="space-y-2.5">
          {['64GB', '128GB', '256GB', '512GB', '1TB'].map((cap) => (
            <label
              key={cap}
              className="flex items-center space-x-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:text-[#FF6534] transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCapacities.includes(cap)}
                onChange={() => toggleCapacity(cap)}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6534] focus:ring-[#FF6534] cursor-pointer accent-[#FF6534]"
              />
              <span>{cap}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Condition Filter */}
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold text-[#FF6534] mb-3">Condition</h3>
        <div className="space-y-2.5">
          {['Fair', 'Fair+', 'Good', 'Excellent'].map((cond) => (
            <label
              key={cond}
              className="flex items-center space-x-3 text-sm font-semibold text-gray-700 cursor-pointer select-none hover:text-[#FF6534] transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedConditions.includes(cond)}
                onChange={() => toggleCondition(cond)}
                className="w-4 h-4 rounded border-gray-300 text-[#FF6534] focus:ring-[#FF6534] cursor-pointer accent-[#FF6534]"
              />
              <span>{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full bg-[#1C0D2A] hover:bg-[#2c164a] text-white font-bold text-sm py-2.5 rounded-xl transition-colors duration-200 cursor-pointer shadow-xs"
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
};

export default RefurbishedFilters;
