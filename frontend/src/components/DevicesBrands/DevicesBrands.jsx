import React from 'react';
import { Link } from 'react-router-dom';
import phoneImg from '../../assets/images/phone.png';
import tabletsImg from '../../assets/images/tablets.png';
import laptopsImg from '../../assets/images/laptops.png';
import './DevicesBrands.css';

const DevicesBrands = () => {
  const devices = [
    {
      id: 'phones',
      title: 'Phones',
      badge: 'Most Popular',
      price: 'From £29',
      image: phoneImg,
      description: 'iPhone, Samsung Galaxy, Google Pixel, OnePlus & all major models.',
      repairTime: '30 mins',
      warranty: 'Lifetime',
      buttonText: 'Book Now',
      buttonHref: '/pages/mobile-repairs',
    },
    {
      id: 'tablets',
      title: 'Tablets',
      badge: 'Same Day Repair',
      price: 'From £49',
      image: tabletsImg,
      description: 'iPad Pro, iPad Air, Samsung Galaxy Tab, Surface & Android tablets.',
      repairTime: 'Same Day',
      warranty: 'Lifetime',
      buttonText: 'Book Now',
      buttonHref: '/pages/repairs/ipad',
    },
    {
      id: 'laptops',
      title: 'Laptops',
      badge: 'Express Service',
      price: 'From £69',
      image: laptopsImg,
      description: 'MacBook Pro, MacBook Air, Dell, HP, Lenovo, Asus & Windows PCs.',
      repairTime: '24 Hours',
      warranty: '1 Year',
      buttonText: 'Book Now',
      buttonHref: '/pages/repairs/macbook',
    },
  ];

  return (
    <section className="bg-[#F8F9FA] py-20 sm:py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-5 h-[2px] bg-[#FF6534] inline-block rounded-full"></span>
            <span className="text-[#FF6534] font-bold text-xs sm:text-sm tracking-wider uppercase">
              WE FIX ALL DEVICES
            </span>
            <span className="w-5 h-[2px] bg-[#FF6534] inline-block rounded-full"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B2E] tracking-tight leading-tight">
            Devices and <span className="text-[#FF6534]">brands we repair</span>
          </h2>

          <p className="text-[#6E6B7B] font-medium text-sm sm:text-base mt-3">
            Select your device type below to explore fast, reliable repair options with genuine parts.
          </p>
        </div>

        {/* 3 Devices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Banner Image Container */}
              <div className="bg-gradient-to-b from-[#FAF8F9] to-[#F3F4F8] p-6 flex justify-center items-center relative h-[220px] sm:h-[240px] overflow-hidden">
                {/* Badge Tag at Top-Left */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#1F1B2E] font-bold text-xs px-3.5 py-1.5 rounded-full border border-gray-200/70 shadow-sm z-10">
                  {device.badge}
                </span>

                {/* Device Image */}
                <img
                  src={device.image}
                  alt={`${device.title} repair`}
                  className="max-h-[170px] max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  {/* Title & Price Row */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B2E] tracking-tight">
                      {device.title}
                    </h3>
                    <span className="text-sm font-bold text-[#FF6534] bg-[#FF6534]/10 px-3 py-1 rounded-full">
                      {device.price}
                    </span>
                  </div>

                  {/* Sub-description */}
                  <p className="text-[#6E6B7B] text-xs sm:text-sm font-normal leading-relaxed mb-4">
                    {device.description}
                  </p>
                </div>

                <div>
                  {/* Card Action Button */}
                  <Link
                    to={device.buttonHref}
                    className="w-full py-3.5 rounded-xl bg-white border-2 border-[#FF6534] text-[#FF6534] font-bold text-sm sm:text-base hover:bg-[#FF6534] hover:text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{device.buttonText}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brands Section (Apple, Samsung, Google) */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center">
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#8E8A9C] mb-8">
            TRUSTED BRAND SPECIALISTS
          </h4>

          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-24 opacity-90">
            {/* Apple Logo & Text */}
            <Link
              to="/pages/repairs/apple"
              className="flex items-center gap-2.5 text-[#1F1B2E] hover:opacity-100 hover:scale-105 transition-all cursor-pointer"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.36-6.1-3.37-2.73-7.25-7.38-11.64-13.94-6.43-9.61-11.53-20.04-15.3-31.28-3.77-11.25-5.65-22.14-5.65-32.68 0-14.45 3.65-26.31 10.96-35.58 7.31-9.27 16.4-13.99 27.27-14.16 4.79 0 9.87 1.15 15.24 3.44 5.37 2.29 9.17 3.44 11.4 3.44 1.9 0 5.72-1.2 11.47-3.6 5.75-2.4 10.65-3.5 14.7-3.3 11.16.63 20.31 4.96 27.44 12.99-9.82 5.95-14.63 14.16-14.43 24.63.2 8.35 3.4 15.42 9.6 21.2 6.2 5.78 13.62 9.07 22.26 9.87-2.15 6.42-4.99 13.1-8.52 20.04zM119.22 34.64c0-7.24 2.66-14.1 7.98-20.58 5.32-6.48 11.95-10.45 19.89-11.91.43 2.15.54 3.79.34 4.93-.41 7.37-3.1 14.3-8.08 20.78-4.99 6.48-11.61 10.4-19.86 11.75-.12-1.42-.27-3.08-.27-4.97z"/>
              </svg>
              <span className="font-extrabold text-2xl tracking-tight text-[#1F1B2E]">Apple</span>
            </Link>

            {/* SAMSUNG Text Logo */}
            <Link
              to="/pages/repairs/samsung"
              className="text-[#1F1B2E] font-black text-2xl tracking-[0.18em] uppercase hover:opacity-100 hover:scale-105 transition-all cursor-pointer font-sans"
            >
              SAMSUNG
            </Link>

            {/* Google Colorful Logo */}
            <Link
              to="/pages/repairs/google"
              className="flex items-center gap-2 hover:opacity-100 hover:scale-105 transition-all cursor-pointer"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="font-bold text-2xl text-[#1F1B2E] tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DevicesBrands;
