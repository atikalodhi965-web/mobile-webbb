import React from 'react';
import heroImage from '../../../assets/images/SAMZ-hero2.png';

const RefurbishedBanner = () => {
  const handleScrollToCatalog = (e) => {
    e.preventDefault();
    const headingElement = document.getElementById('refurbished-heading');
    if (headingElement) {
      headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full h-[29vw] bg-rose-300 text-white py-8 lg:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">

        {/* Left Side: Photo Card */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg aspect-4/3 bg-white/10 rounded-2xl p-2 sm:p-3 shadow-2xl border border-white/20">
            <img
              src={heroImage}
              alt="Refurbished Phones Guarantee"
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Right Side: Copy & Guarantees */}
        <div className="w-full lg:w-1/2 text-center lg:text-left relative py-4 space-y-4">

          {/* Sparkle Arrow Icons Overlay */}
          <div className="hidden sm:block absolute top-0 right-10 animate-bounce">
            <svg className="w-8 h-8 text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3L16.29 6.29L10 12.59L11.41 14L17.71 7.71L21 11V3H13Z" />
            </svg>
          </div>

          {/* Guarantees Text */}
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm">
              2 year warranty
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm">
              3 year battery guarantee
            </h2>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-caveat italic text-white/90 font-bold tracking-wide pt-1">
              so chill
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <a
              href="#refurbished-heading"
              onClick={handleScrollToCatalog}
              className="inline-block bg-[#1C0D2A] hover:bg-[#2a133f] text-white font-extrabold text-base sm:text-lg px-8 py-3.5 rounded-xl shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              View phones
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default RefurbishedBanner;
