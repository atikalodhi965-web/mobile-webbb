import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { samsungCategories } from './data/samsungRepairsData';

const SamsungRepairs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for active category selection (default to first category: 'flip-fold')
  const [activeCategoryId, setActiveCategoryId] = useState(samsungCategories[0].id);

  // Active category object
  const activeCategory = samsungCategories.find((cat) => cat.id === activeCategoryId) || samsungCategories[0];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        
        {/* Main Title: Select your Samsung */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-10 sm:mb-14 tracking-tight">
          Select your Samsung
        </h1>

        {/* 2-Column Layout: Left Vertical Sidebar (Categories) + Right Main Display (Height Equal to Left Side with Scrollbar) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE: Smaller Width Vertical Categories List */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Samsung Categories
            </h2>

            {samsungCategories.map((category) => {
              const isActive = activeCategoryId === category.id;

              return (
                <div
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`group rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-between ${
                    isActive
                      ? 'border-2 border-[#FF6534] bg-white shadow-lg scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-[#FF6534]/50 shadow-2xs hover:shadow-md'
                  }`}
                >
                  {/* Category Phone Icon Outline */}
                  <div className="w-12 h-16 sm:w-14 sm:h-20 border-2 border-[#1F1B2E] rounded-xl flex items-center justify-center p-1 mb-3 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#FF6534] rounded-full"></div>
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1F1B2E] mb-4 leading-snug">
                    {category.name}
                  </h3>

                  {/* Select Device Pill Button */}
                  <button
                    className={`w-full py-2.5 rounded-full font-extrabold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#FF6534] text-white shadow-sm'
                        : 'bg-white border border-[#FF6534] text-[#FF6534] hover:bg-[#FF6534] hover:text-white'
                    }`}
                  >
                    Select device
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE: Wider Width Sub-Categories Display with Height Equal to Left Side & Scrollbar */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col">
            <div className="bg-[#EBF4FA] border border-blue-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col h-full min-h-[660px] md:min-h-[760px] max-h-[820px]">
              
              {/* Category Heading in Right Box */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-200/60 flex-shrink-0">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B2E] tracking-tight">
                  {activeCategory.name}
                </h2>
                <span className="text-xs sm:text-sm font-semibold text-[#FF6534] bg-white px-4 py-1.5 rounded-full shadow-2xs border border-orange-100">
                  {activeCategory.subCategories.length} Models
                </span>
              </div>

              {/* Sub-Categories Container: Flex-Wrap with Stretch Height & Scrollbar */}
              <div className="flex-grow overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8 items-stretch py-2">
                  {activeCategory.subCategories.map((model) => (
                    <Link
                      key={model.id}
                      to={model.href}
                      className="group flex flex-col items-center bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer w-full max-w-[170px] sm:max-w-[190px] justify-between"
                    >
                      {/* Sub-category Device Image */}
                      <div className="w-24 sm:w-28 h-36 sm:h-44 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="max-h-full max-w-full object-contain drop-shadow-md"
                        />
                      </div>

                      {/* Sub-category Model Name Label in #FF6534 */}
                      <h4 className="text-base sm:text-lg font-extrabold text-[#FF6534] group-hover:text-[#e05020] text-center tracking-tight transition-colors">
                        {model.name}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SamsungRepairs;
