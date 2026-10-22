import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ipadHeroImg from '../../assets/images/ipad-hero-device.png';
import {
  ipadTrustFeatures,
  ipadCategories,
  ipadModelsData,
} from './data/ipadRepairsData';

const IPadRepairs = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showANumberHelp, setShowANumberHelp] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToChooseiPad = () => {
    const el = document.getElementById('choose-ipad');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModelClick = (modelId) => {
    navigate(`/pages/repairs/select-repair/${modelId}`);
  };

  // Combine models based on active tab
  const getModelsForActiveTab = () => {
    if (activeTab === 'all') {
      return [
        ...ipadModelsData.ipad,
        ...ipadModelsData.ipadAir,
        ...ipadModelsData.ipadMini,
        ...ipadModelsData.ipadPro,
      ];
    }
    return ipadModelsData[activeTab] || [];
  };

  // Filter models based on search query
  const filteredModels = getModelsForActiveTab().filter((model) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      model.name.toLowerCase().includes(query) ||
      model.modelNumber.toLowerCase().includes(query)
    );
  });

  const renderTrustIcon = (icon) => {
    switch (icon) {
      case 'chart':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'lightning':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'wrench':
      default:
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 012-2h8zM4 14h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14 w-full">

        {/* SECTION 1: HERO SECTION (Matches Image 1) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/70 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-6">
              <span className="text-xs font-bold text-[#FF6534] uppercase tracking-wider">
                iPad Screen & Device Repairs
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1F1035] tracking-tight leading-tight">
                iPad <span className="text-[#FF6534]">Repairs</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-xl">
                Screen, battery and other repairs across iPad, iPad Air, iPad Mini and iPad Pro, with support available wherever you are in the UK. Find your model by name or A-number, than check repair availability with SAMZ.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={scrollToChooseiPad}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Find your iPad</span>
                  <span>→</span>
                </button>

                <button
                  onClick={scrollToChooseiPad}
                  className="bg-white hover:bg-gray-50 text-[#1F1035] border border-gray-200 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>iPad, Air, Mini, Pro</span>
                  <span>→</span>
                </button>

                <button
                  onClick={scrollToChooseiPad}
                  className="bg-white hover:bg-gray-50 text-[#1F1035] border border-gray-200 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Stores Nationwide</span>
                  <span>→</span>
                </button>

                <button
                  onClick={scrollToChooseiPad}
                  className="bg-white hover:bg-gray-50 text-[#1F1035] border border-gray-200 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Mail-In Repair Service</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50/40 rounded-3xl p-6 w-full max-w-md flex flex-col items-center justify-center relative min-h-[300px]">
                <img
                  src={ipadHeroImg}
                  alt="iPad Repairs"
                  className="w-full max-h-[260px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />

                {/* Search by A-number Floating Badge Overlay */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg text-left max-w-[210px] space-y-1">
                  <p className="text-[11px] font-semibold text-gray-500">Find your exact model</p>
                  <p className="text-xs sm:text-sm font-extrabold text-[#1F1035]">Search by A-number</p>
                  <span className="inline-block text-[10px] font-bold text-[#FF6534] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                    Example: A2602
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 2: TRUST FEATURES ROW (Matches Image 2 - Top) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ipadTrustFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col items-start text-left space-y-3 hover:shadow-md transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-10 h-10 rounded-full bg-orange-100/70 flex items-center justify-center">
                {renderTrustIcon(feature.icon)}
              </div>

              <h3 className="text-base font-extrabold text-[#1F1035] tracking-tight">
                {feature.title}
              </h3>

              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>


        {/* SECTION 3: MODEL SELECTION MAIN CONTAINER (Matches Image 2 & 3) */}
        <section id="choose-ipad" className="bg-[#F6F4FA] rounded-3xl p-6 sm:p-10 border border-gray-200/60 shadow-sm space-y-8">

          {/* Section Header */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              CHOOSE YOUR DEVICE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F1035] tracking-tight">
              Which iPad do you have?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Search using the model name or the A-number printed on the back of your iPad.
            </p>
          </div>

          {/* Search Input & Where is my A-number button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model or A-number — e.g. A2602"
                className="w-full bg-white border border-gray-200 rounded-full py-3.5 px-6 text-sm font-medium text-[#1F1035] placeholder-gray-400 focus:outline-none focus:border-[#FF6534] focus:ring-2 focus:ring-[#FF6534]/20 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowANumberHelp(!showANumberHelp)}
              className="whitespace-nowrap bg-white hover:bg-gray-50 text-[#1F1035] border border-gray-300 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              Where is my A-number?
            </button>
          </div>

          {/* A-Number Help Info Box */}
          {showANumberHelp && (
            <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm text-xs text-gray-600 space-y-2 animate-fadeIn">
              <p className="font-bold text-[#FF6534]">How to find your iPad's A-number:</p>
              <p>1. Look at the back of your iPad. Near the bottom, you'll see small engraved text containing <strong>Model A****</strong> (e.g. Model A2602).</p>
              <p>2. Alternatively, open <strong>Settings &gt; General &gt; About</strong> on your iPad and tap Model Number to show the A-number.</p>
            </div>
          )}

          {/* Filter Tabs Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {ipadCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${isActive
                    ? 'bg-[#1F1035] text-white shadow-md'
                    : 'bg-white text-[#1F1035] border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Models Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleModelClick(model.id)}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-transparent hover:border-[#FF6534]/40 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Model Name */}
                  <span className="font-extrabold text-sm sm:text-base text-[#1F1035] group-hover:text-[#FF6534] transition-colors">
                    {model.name}
                  </span>

                  {/* A-number badge and right arrow */}
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F0EDF5] text-gray-600 font-bold text-xs px-2.5 py-1 rounded-md tracking-wider">
                      {model.modelNumber}
                    </span>
                    <span className="text-[#FF6534] font-bold group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl p-8 text-center text-gray-500 font-medium">
                No iPad model found matching "{searchQuery}".
              </div>
            )}
          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default IPadRepairs;
