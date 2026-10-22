import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import macbookHeroImg from '../../assets/images/macbook-hero-device.png';
import { macbookCategories } from './data/macbookRepairsData';

const MacbookRepairs = () => {
  const navigate = useNavigate();
  const [showModelHelp, setShowModelHelp] = useState(false);
  const [openFaq, setOpenFaq] = useState({ 0: false, 1: false });

  const toggleFaq = (index) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSelectMacbook = () => {
    const el = document.getElementById('select-macbook');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModelClick = (modelId) => {
    navigate(`/pages/repairs/select-repair/${modelId}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 w-full">

        {/* SECTION 1: HERO SECTION (Matches Image 1) */}
        <section className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-orange-50/40 rounded-3xl p-8 sm:p-12 border border-slate-200/70 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-6">
              <span className="text-lg font-semibold text-[#1F1035] tracking-tight">
                Express
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1F1035] tracking-tight leading-tight">
                MacBook <span className="text-[#FF6534]">Repairs</span>
              </h1>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={scrollToSelectMacbook}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Select your device
                </button>
              </div>

              {/* Trustpilot Badge */}
              {/* <div className="pt-1">
                <div className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs text-gray-700">
                  <span>Review us on</span>
                  <span className="text-[#00B67A] font-extrabold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    Trustpilot
                  </span>
                </div>
              </div> */}
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="p-2 max-w-md w-full">
                <img
                  src={macbookHeroImg}
                  alt="Express MacBook Repairs"
                  className="w-full h-auto object-contain max-h-[280px] drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 2: SELECT YOUR MACBOOK HEADER & INTRO (Matches Image 1 bottom & Image 2 top) */}
        <section id="select-macbook" className="space-y-8">

          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FF6534] tracking-tight">
              Select Your MacBook
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Whether you have got an Apple Mac, iMac, MacBook, Macbook Pro or Macbook Air, we know how important your iMac is to you, and no matter what the damage to it, we understand you will want this fixed as soon as possible. At SAMZ, we provide our customers with express and high-quality repair services.
            </p>
          </div>

          {/* Apple Mac and iMac Battery Replacement Notice Box (Matches Image 2 middle) */}
          <div className="bg-[#EDF4FD] rounded-3xl p-6 sm:p-10 border border-blue-100/80 text-center max-w-3xl mx-auto space-y-4 shadow-2xs">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F1035]">
              Apple Mac and iMac Battery replacement
            </h3>

            <p className="text-xs sm:text-sm font-bold italic text-[#FF6534] max-w-xl mx-auto leading-normal">
              At the moment, Battery Replacement is the only repair we can carry out on the Apple MacBook models listed below.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              We are working hard in order to provide you with a wider repair range very soon.
            </p>

            {/* Laptop Battery Replacement Graphic Box */}
            <div className="pt-2 flex justify-center items-center">
              <div className="bg-white border-2 border-[#1F1035] rounded-2xl p-4 w-48 sm:w-56 shadow-sm flex flex-col items-center justify-center space-y-2 relative">
                {/* Screen frame mock */}
                <div className="w-full bg-[#1F1035] rounded-lg p-4 flex justify-center items-center">
                  <div className="bg-[#FF6534] text-white p-3 rounded-xl flex items-center justify-center shadow-inner">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                {/* Base bar */}
                <div className="w-full h-1.5 bg-[#1F1035] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Model Number Accordion / Dropdown Bar (Matches Image 2 bottom) */}
          <div className="max-w-3xl mx-auto space-y-2">
            <button
              onClick={() => setShowModelHelp(!showModelHelp)}
              className="bg-[#D3E4F6] hover:bg-[#C2D9F2] text-[#1F1035] font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl w-full flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
            >
              <span>How to find your Apple MacBook Model Number?</span>
              <span className="text-lg font-bold">{showModelHelp ? '−' : '+'}</span>
            </button>

            {showModelHelp && (
              <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm text-xs sm:text-sm text-gray-600 space-y-2 animate-fadeIn max-w-3xl mx-auto">
                <p className="font-bold text-[#1F1035]">Finding your MacBook Model Number:</p>
                <p>1. Look on the underside of your MacBook, near the regulatory markings. You will see <strong>"Model A****"</strong> (e.g. Model A1398, A1502, A1708).</p>
                <p>2. Alternatively, click the <strong>Apple menu ()</strong> in the top-left corner &gt; <strong>About This Mac</strong> to view your model description and serial number.</p>
              </div>
            )}
          </div>

        </section>


        {/* SECTION 3: MACBOOK MODELS GRID SECTIONS (Matches Images 3 & 4) */}
        <section className="space-y-12 pt-4">
          {macbookCategories.map((category, index) => (
            <div key={category.categoryTitle} className="space-y-8">

              {/* Category Header */}
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1035] tracking-tight">
                  {category.categoryTitle}
                </h3>
              </div>

              {/* Models Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 justify-center">
                {category.models.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => handleModelClick(model.id)}
                    className="bg-white rounded-2xl p-6 border border-transparent hover:border-[#FF6534]/30 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer group"
                  >
                    {/* Laptop Illustration Mock */}
                    <div className="w-full h-32 flex items-center justify-center relative p-2">
                      <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-xl w-36 h-24 p-2 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center overflow-hidden border border-slate-600">
                          {/* Screen backdrop artwork */}
                          <div className="w-full h-full bg-gradient-to-tr from-amber-500/20 via-orange-500/30 to-slate-900"></div>
                        </div>
                      </div>
                      {/* Laptop base bar */}
                      <div className="absolute bottom-2 w-44 h-2 bg-gray-300 rounded-b-md shadow-xs"></div>
                    </div>

                    {/* Model Title */}
                    <h4 className="text-sm sm:text-base font-extrabold text-[#FF6534] group-hover:text-[#e05020] transition-colors leading-tight">
                      {model.title}
                    </h4>

                    {/* Model Number */}
                    <p className="text-xs sm:text-sm font-bold text-[#1F1035]">
                      Model number: {model.modelNumber}
                    </p>

                    {/* Release Year */}
                    <p className="text-xs text-gray-500 font-medium">
                      {model.year}
                    </p>
                  </div>
                ))}
              </div>

              {/* Category Divider Line (if not last) */}
              {index < macbookCategories.length - 1 && (
                <div className="w-full h-[1px] bg-slate-300 my-10 max-w-4xl mx-auto"></div>
              )}

            </div>
          ))}
        </section>

        {/* SECTION 4: FAQ ACCORDION SECTION (Matches attached picture) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/70 shadow-sm max-w-4xl mx-auto w-full space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1035] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Find answers to common questions about MacBook and iMac repairs.
            </p>
          </div>

          <div className="space-y-4">
            {/* Question 1 Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full flex items-center justify-between p-5 bg-[#FAF9FC] hover:bg-[#F3F0F8] text-left transition-colors cursor-pointer"
              >
                <h3 className="text-base sm:text-lg font-extrabold text-[#FF6534] tracking-tight pr-4">
                  How do I know if I need an Apple Mac repair?
                </h3>
                <span className="text-lg font-black text-[#FF6534] shrink-0">
                  {openFaq[0] ? '−' : '+'}
                </span>
              </button>

              {openFaq[0] && (
                <div className="p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-gray-600 font-medium space-y-3 leading-relaxed animate-fadeIn">
                  <p>
                    There are plenty of ways to indicate whether your are in need of any iMac repairs.
                  </p>
                  <p>
                    Your device may be drained of its battery life fairly quickly throughout the day, or you may find yourself needing to charge it more frequently. Not only this but your Apple Mac may be running slower than usual despite having a good storage capacity.
                  </p>
                  <p>
                    All of the cases above indicate that you may benefit from our Apple Mac repairs. We can also fix cracked or damaged screens and other repair services if there is physical damage to your Apple Mac device.
                  </p>
                </div>
              )}
            </div>

            {/* Question 2 Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full flex items-center justify-between p-5 bg-[#FAF9FC] hover:bg-[#F3F0F8] text-left transition-colors cursor-pointer"
              >
                <h3 className="text-base sm:text-lg font-extrabold text-[#FF6534] tracking-tight pr-4">
                  How much do iMac repairs cost?
                </h3>
                <span className="text-lg font-black text-[#FF6534] shrink-0">
                  {openFaq[1] ? '−' : '+'}
                </span>
              </button>

              {openFaq[1] && (
                <div className="p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-gray-600 font-medium space-y-3 leading-relaxed animate-fadeIn">
                  <p>
                    The cost of iMac repairs can vary depending on the type of repair, the age of the device, the device model and the overall damage done to the computer itself. At SAMZ we offer a variety of Apple Mac repairs including iMac battery replacement and Apple Mac screen repair.
                  </p>
                  <p>
                    We will ask you a series of questions about your device and the damages when booking your repair appointment with us so that we can determine the total costs of the repairs.
                  </p>
                  <p>
                    We offer plenty of offers to our customers to ensure that they can find the best possible prices for their repair service. Please take a look at our FAQ page for additional queries and information about the repair services that we offer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MacbookRepairs;
