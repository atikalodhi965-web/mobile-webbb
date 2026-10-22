import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import smartphonesImg from '../../assets/images/smartphones.png';
import appleImg from '../../assets/images/apple-iphone.png';
import samsungImg from '../../assets/images/samsung-phone.png';
import googleImg from '../../assets/images/google-phone.png';

const MobileRepairs = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSelect = () => {
    const el = document.getElementById('select-mobile');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mobileBrands = [
    {
      id: 'apple',
      name: 'Apple',
      href: '/pages/repairs/apple',
      image: appleImg,
    },
    {
      id: 'samsung',
      name: 'Samsung',
      href: '/pages/repairs/samsung',
      image: samsungImg,
    },
    {
      id: 'google',
      name: 'Google',
      href: '/pages/repairs/google',
      image: googleImg,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">

        {/* Hero Section: Express Mobile Phone Repairs */}
        <section className="bg-[#EBF3FA] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-b border-slate-200/60">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1B2E] tracking-tight mb-1">
                Express
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FF6534] tracking-tight mb-8">
                Mobile Phone Repairs
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                {/* Select Your Device Pill Button */}
                <button
                  onClick={scrollToSelect}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  Select your device
                </button>
              </div>

              {/* Trustpilot Badge */}
              {/* <div className="inline-flex items-center gap-2 bg-white border border-gray-300/80 px-4 py-2 rounded-xl shadow-xs">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Review us on</span>
                <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-gray-900">
                  <span className="text-[#00B67A] text-base">★</span>
                  <span>Trustpilot</span>
                </div>
              </div> */}
            </div>

            {/* Right Column: Single Smartphones Showcase Image */}
            <div className="lg:col-span-6 flex justify-center items-center relative">
              <div className="relative flex items-center justify-center py-4 max-w-md w-full">
                <img
                  src={smartphonesImg}
                  alt="Express Mobile Phone Repairs"
                  className="w-full max-h-[320px] sm:max-h-[380px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Intro Text Section */}
        {/* <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-3">
            SAMZ is your one stop shop for all your mobile phone needs. We provide expert advice, fast turnaround times, competitive pricing and quality workmanship. With our team of highly skilled professionals, we can help you with any smart phone repairs.
          </p>

          {isExpanded && (
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-3 animate-fadeIn">
              Whether you need an iPhone screen replacement, Samsung battery repair, or Google Pixel camera fix, our certified technicians use high quality parts backed by our lifetime warranty options. Visit any of our conveniently located UK repair stores today.
            </p>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#FF6534] hover:text-[#e05020] font-bold text-xs sm:text-sm underline cursor-pointer inline-flex items-center gap-1"
          >
            {isExpanded ? 'Read Less -' : 'Read More +'}
          </button>
        </section> */}

        {/* Select Your Mobile Section */}
        <section id="select-mobile" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-14 tracking-tight">
            Select Your Mobile
          </h2>

          {/* 3 Brand Cards Grid with Diamond/Cross Badge Background */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 items-center justify-items-center mb-12">
            {mobileBrands.map((brand) => (
              brand.href.startsWith('/') ? (
                <Link
                  key={brand.id}
                  to={brand.href}
                  className="group flex flex-col items-center cursor-pointer w-full max-w-[260px]"
                >
                  {/* Diamond/Cross Light Blue Background Container */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-6">
                    {/* Light Blue Diamond / Cross Badge (Matching attached picture) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-44 h-44 sm:w-48 sm:h-48 bg-[#C5DCEE]/70 rounded-3xl transform rotate-45 group-hover:bg-[#B3D2E9] group-hover:scale-105 transition-all duration-300 shadow-sm"></div>
                    </div>
                    {/* Mobile Device Image */}
                    <div className="relative z-10 w-32 sm:w-36 h-44 sm:h-48 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                      <img
                        src={brand.image}
                        alt={`${brand.name} Repair`}
                        className="max-h-full max-w-full object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                  {/* Brand Title Label in #FF6534 */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] group-hover:text-[#e05020] tracking-tight transition-colors">
                    {brand.name}
                  </h3>
                </Link>
              ) : (
                <a
                  key={brand.id}
                  href={brand.href}
                  className="group flex flex-col items-center cursor-pointer w-full max-w-[260px]"
                >
                  {/* Diamond/Cross Light Blue Background Container */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-6">
                    {/* Light Blue Diamond / Cross Badge (Matching attached picture) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-44 h-44 sm:w-48 sm:h-48 bg-[#C5DCEE]/70 rounded-3xl transform rotate-45 group-hover:bg-[#B3D2E9] group-hover:scale-105 transition-all duration-300 shadow-sm"></div>
                    </div>
                    {/* Mobile Device Image */}
                    <div className="relative z-10 w-32 sm:w-36 h-44 sm:h-48 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                      <img
                        src={brand.image}
                        alt={`${brand.name} Repair`}
                        className="max-h-full max-w-full object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                  {/* Brand Title Label in #FF6534 */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] group-hover:text-[#e05020] tracking-tight transition-colors">
                    {brand.name}
                  </h3>
                </a>
              )
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MobileRepairs;
