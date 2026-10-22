import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/SAMZ-hero.png';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden SAMZ-hero-bg h-[29vw] flex items-center">
      {/* Subtle Chevron Pattern SVG Background Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="chevron-pattern" width="120" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 0 40 L 60 80 L 120 40 M 0 0 L 60 40 L 120 0"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chevron-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">

          {/* Left Column Text & CTA */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left pl-2 lg:pl-6">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#282338] tracking-tight leading-[1.12]">
              Fixes in a <span className="text-[#FF6534] inline-block font-black">flash</span>, repair your device today!
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl font-medium text-[#443e54] tracking-tight">
              Phones. Tablets. Computers.
            </p>

            {/* Call to Action Button */}
            <div className="pt-1">
              <Link
                to="/pages/repairs"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#FF6534] hover:bg-[#e05020] text-white font-bold text-lg rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Book a repair
              </Link>
            </div>

          </div>

          {/* Right Column Visual Graphic */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end items-center relative">
            <div className="relative w-full max-w-lg lg:max-w-xl group">
              {/* Soft glow highlight behind graphic */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-100/40 to-indigo-100/40 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Product Image */}
              <img
                src={heroImage}
                alt="Hands touching a smartphone with a cracked screen for tech repair service"
                className="relative z-10 w-full h-100 object-contain rounded-2xl drop-shadow-xl transform transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
