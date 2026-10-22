import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { applePhonesData } from './data/appleRepairsData';

const AppleRepairs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Page Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-12 sm:mb-16 tracking-tight">
          Select Your iPhone
        </h1>

        {/* iPhone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-x-10 lg:gap-y-16 items-center justify-items-center mb-16">
          {applePhonesData.map((phone) => (
            <Link
              key={phone.id}
              to={phone.href || '#'}
              className="group flex flex-col items-center cursor-pointer w-full max-w-[240px] transition-all duration-300"
            >
              {/* Diamond/Cross Background Container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4">
                {/* Light Blue Diamond Shape (Matching reference screenshot) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#C5DCEE]/70 rounded-3xl transform rotate-45 group-hover:bg-[#B3D2E9] group-hover:scale-105 transition-all duration-300 shadow-xs"></div>
                </div>

                {/* iPhone Image */}
                <div className="relative z-10 w-28 sm:w-32 h-40 sm:h-44 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                </div>
              </div>

              {/* iPhone Title Label */}
              <h3 className="text-lg sm:text-xl font-extrabold text-[#FF6534] group-hover:text-[#e05020] tracking-tight text-center transition-colors">
                {phone.name}
              </h3>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppleRepairs;
