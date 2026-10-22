import React from 'react';
import './WhySAMZ.css';

const WhySAMZ = () => {
  const features = [
    {
      id: 'express-repairs',
      titleLine1: 'Express',
      titleLine2: 'Repairs',
      icon: (
        <svg className="w-12 h-12 text-[#FF6534]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Speed lines */}
          <path d="M6 18H20" stroke="#FF6534" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M10 28H18" stroke="#FF6534" strokeWidth="4.5" strokeLinecap="round" />
          {/* Stylized Cross / X */}
          <path d="M26 14L38 34" stroke="#FF6534" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M38 14L26 34" stroke="#FF6534" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'lifetime-warranty',
      titleLine1: 'Lifetime',
      titleLine2: 'Warranty',
      icon: (
        <svg className="w-12 h-12 text-[#FF6534]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield */}
          <path
            d="M24 4L8 10V22C8 32.5 14.8 41.8 24 44C33.2 41.8 40 32.5 40 22V10L24 4Z"
            fill="#FF6534"
          />
          {/* Checkmark inside */}
          <path
            d="M17 23.5L22 28.5L31 18.5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'quality-parts',
      titleLine1: 'Quality',
      titleLine2: 'Parts',
      icon: (
        <svg className="w-12 h-12 text-[#FF6534]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Diamond */}
          <path
            d="M24 5L8 18L24 43L40 18L24 5Z"
            fill="#FF6534"
          />
          {/* Facet lines */}
          <path d="M8 18H40" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 18L24 43L32 18" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 18L24 5L32 18" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'qualified-experts',
      titleLine1: 'Qualified',
      titleLine2: 'Experts',
      icon: (
        <svg className="w-12 h-12 text-[#FF6534]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wrench */}
          <path
            d="M26.5 12.5C28.2 10.8 28.6 8.2 27.6 6.1C26.6 4 24.3 2.8 22 3.1C19.7 3.4 17.8 5 17.2 7.3C16.6 9.6 17.3 12 19 13.7L7 25.7C5.8 26.9 5.8 28.8 7 30L9 32C10.2 33.2 12.1 33.2 13.3 32L25.3 20C27 21.7 29.4 22.4 31.7 21.8C34 21.2 35.6 19.3 35.9 17C36.2 14.7 35 12.4 32.9 11.4C30.8 10.4 28.2 10.8 26.5 12.5Z"
            fill="#FF6534"
          />
          {/* Checkmark alongside wrench */}
          <path
            d="M27 30L34 37L44 23"
            stroke="#FF6534"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'happy-customers',
      titleLine1: 'Over 1M Happy',
      titleLine2: 'Customers',
      icon: (
        <svg className="w-12 h-12 text-[#FF6534]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Smiley Head */}
          <circle cx="24" cy="24" r="20" fill="#FF6534" />
          {/* Left Star/Cross Eye */}
          <path d="M14 16L20 22M20 16L14 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right Star/Cross Eye */}
          <path d="M28 16L34 22M34 16L28 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          {/* Happy Smile */}
          <path
            d="M15 28C17.5 33 30.5 33 33 28"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 'eco-friendly',
      titleLine1: 'Eco',
      titleLine2: 'Friendly',
      icon: (
        <svg className="w-12 h-12 text-[#FF6534]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tag / Leaf background */}
          <path
            d="M10 8C10 5.8 11.8 4 14 4H34C38.4 4 42 7.6 42 12V24C42 28.4 38.4 32 34 32H18L8 42V10C8 8.9 8.9 8 10 8Z"
            fill="#FF6534"
          />
          {/* Leaf vein inner icon */}
          <path
            d="M20 24C20 16 28 12 32 10C30 15 28 22 20 24Z"
            fill="white"
          />
          <path
            d="M20 24L27 17"
            stroke="#FF6534"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="why-SAMZ-container py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto text-center">

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-[#FF6534] tracking-tight leading-tight mb-5 sm:mb-6">
          Why SAMZ?
        </h2>

        {/* Section Description Paragraph */}
        <p className="max-w-4xl mx-auto text-[#4A4556] text-sm sm:text-base leading-relaxed font-normal mb-12 sm:mb-16">
          SAMZ specialises in offering an express repair service for smartphones, tablets and computers along with a wide range of mobile accessories and refurbished devices. Since launching in 2013, SAMZ has grown to 30 repair shops across the UK and counting! We pride ourselves on offering an express repair service powered by our SAMZ accredited technicians, on-site at each of our shops, and all our screen repairs are backed by a lifetime warranty*
        </p>

        {/* 6 Feature Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center justify-start group cursor-pointer"
            >
              {/* Icon Container */}
              <div className="why-SAMZ-icon-wrapper mb-3 sm:mb-4 flex items-center justify-center h-14 sm:h-16">
                {feature.icon}
              </div>

              {/* Title Lines */}
              <div className="text-[#1F1B2E] font-bold text-sm sm:text-base leading-tight tracking-tight text-center">
                <div>{feature.titleLine1}</div>
                <div>{feature.titleLine2}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Klarna Payment Banner Box */}
        {/* <div className="inline-block">
          <div className="why-SAMZ-klarna-box bg-white border border-[#CBD5E1] rounded-lg px-6 sm:px-10 py-3.5 sm:py-4 shadow-sm flex flex-wrap items-center justify-center gap-3 text-center">
            Klarna Badge with Orange-Red Brand Accent
            <span className="bg-[#FF6534] text-white font-extrabold text-xs sm:text-sm px-3 py-1 rounded tracking-tight font-sans">
              Klarna.
            </span>

            Buy now, pay later text
            <span className="text-[#1F1B2E] font-bold text-sm sm:text-base">
              Buy now, pay later.
            </span>

            Learn more link
            <a
              href="#klarna-learn-more"
              className="text-[#1F1B2E] underline font-medium text-sm sm:text-base hover:text-[#FF6534] transition-colors cursor-pointer"
            >
              Learn more
            </a>
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default WhySAMZ;
