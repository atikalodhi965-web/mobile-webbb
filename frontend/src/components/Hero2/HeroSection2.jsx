import React from 'react';
import { Link } from 'react-router-dom';
import hero2Image from '../../assets/images/SAMZ-hero2.png';
import './HeroSection2.css';

const HeroSection2 = () => {
  return (
    <section className="relative overflow-hidden SAMZ-hero2-bg h-[29vw] flex items-center justify-center py-10 lg:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex items-center justify-center">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-14 w-full max-w-5xl">

          {/* Left Column: Photo Card with Overlay Text */}
          <div className="lg:col-span-6 flex flex-col items-start lg:items-end">
            <div className="w-full max-w-[270px]">
              <div className="relative aspect-square w-full bg-[#ea4139] rounded-xl overflow-visible shadow-2xl group border-2 border-white/10">

                {/* Image Container */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <img
                    src={hero2Image}
                    alt="Cheeky Refurbished Phones"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlaid Bottom Bold Typography */}
                <div className="absolute bottom-2 left-0 right-0 text-center z-10 select-none">
                  <h2 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tight drop-shadow-md">
                    cheeky
                  </h2>
                  <p className="text-3xl sm:text-4xl font-black text-[#FF6534] leading-none tracking-tight drop-shadow-md -mt-1 pb-2">
                    refurb?
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Copy & Button */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6 lg:pl-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-snug tracking-tight">
              Only our finest make the cut. <br className="hidden sm:inline" />
              No hidden dents, dings or <br className="hidden sm:inline" />
              dodgy bits.
            </h2>

            <div className="pt-2">
              <Link
                to="/collections/refurbished"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#FF6534] hover:bg-[#e05020] text-white font-bold text-lg rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                View phones
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection2;
