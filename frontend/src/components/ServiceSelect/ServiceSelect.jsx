import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceSelect.css';

const ServiceSelect = () => {
  const services = [
    {
      id: 'repair',
      title: 'Repair',
      bgClass: 'bg-white',
      titleColor: 'text-[#1F1B2E]',
      shadowClass: 'shadow-[0_12px_32px_rgba(0,0,0,0.06)]',
      buttonText: 'Book Now',
      buttonHref: '/pages/repairs',
      icon: (
        <svg width="92" height="92" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 32 10 A 10 10 0 0 1 52 10 L 52 32 L 74 32 A 10 10 0 0 1 74 52 L 52 52 L 52 74 A 10 10 0 0 1 32 74 L 32 52 L 10 52 A 10 10 0 0 1 10 32 L 32 32 Z"
            fill="#FF6534"
            transform="rotate(45 42 42)"
          />
        </svg>
      )
    },
    {
      id: 'replace',
      title: 'Replace',
      bgClass: 'bg-[#FFF2EC]',
      titleColor: 'text-[#1F1B2E]',
      shadowClass: 'shadow-[0_12px_32px_rgba(0,0,0,0.06)]',
      buttonText: 'Learn More',
      buttonHref: '/collections/refurbished',
      icon: (
        <svg width="92" height="92" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dark Navy Diagonal Bar (Top-Left to Bottom-Right) */}
          <rect
            x="10"
            y="32"
            width="64"
            height="20"
            rx="10"
            fill="#1F1B2E"
            transform="rotate(45 42 42)"
          />
          {/* Primary #FF6534 Bar (Bottom-Left to Top-Right) */}
          <rect
            x="10"
            y="32"
            width="64"
            height="20"
            rx="10"
            fill="#FF6534"
            transform="rotate(-45 42 42)"
          />
        </svg>
      )
    },
    {
      id: 'protect',
      title: 'Protect',
      bgClass: 'bg-[#1B0B2A]',
      titleColor: 'text-white',
      shadowClass: 'shadow-[0_14px_36px_rgba(27,11,42,0.25)]',
      buttonText: 'Learn More',
      buttonHref: '/pages/protection-product',
      icon: (
        <svg width="92" height="92" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 32 10 A 10 10 0 0 1 52 10 L 52 32 L 74 32 A 10 10 0 0 1 74 52 L 52 52 L 52 74 A 10 10 0 0 1 32 74 L 32 52 L 10 52 A 10 10 0 0 1 10 32 L 32 32 Z"
            fill="none"
            stroke="#FF6534"
            strokeWidth="3.5"
            strokeLinejoin="round"
            transform="rotate(45 42 42)"
          />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#C5DCEE] py-20 sm:py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-8 items-center justify-items-center">
          {services.map((item) => (
            <div
              key={item.id}
              className={`w-full max-w-[280px] sm:max-w-[300px] h-[350px] sm:h-[370px] rounded-2xl ${item.bgClass} ${item.shadowClass} flex flex-col items-center justify-between pt-12 pb-14 px-6 relative transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer`}
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center pt-2 group-hover:scale-105 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Title Text */}
              <h3 className={`text-4xl sm:text-5xl font-extrabold ${item.titleColor} tracking-tight font-sans mb-4`}>
                {item.title}
              </h3>

              {/* Overlapping Pill Button at Bottom */}
              <Link
                to={item.buttonHref}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#FF6534] hover:bg-[#e05020] text-white font-bold text-sm sm:text-base px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap cursor-pointer z-10"
              >
                {item.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSelect;
