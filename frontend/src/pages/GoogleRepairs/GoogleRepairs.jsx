import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import googlePixelHeroImg from '../../assets/images/google-pixel-hero.png';
import googleAuthorisedDevicesImg from '../../assets/images/google-authorised-devices.png';
import {
  googleRepairServices,
  googleTrustFeatures,
  googlePixelModels,
  googlePixelFoldModels,
} from './data/googleRepairsData';

const GoogleRepairs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSelectPixel = () => {
    const el = document.getElementById('select-pixel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceAction = (service) => {
    if (service.actionText?.includes('Book a diagnosis')) {
      navigate('/pages/repairs');
    } else {
      scrollToSelectPixel();
    }
  };

  const handleModelClick = (modelId) => {
    navigate(`/pages/repairs/select-repair/${modelId}`);
  };

  const renderServiceIcon = (iconType) => {
    switch (iconType) {
      case 'screen':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'battery':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'charging':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'camera':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        );
      case 'diagnostics':
      default:
        return (
          <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  const renderTrustIcon = (icon) => {
    if (icon === 'G') {
      return <span className="font-black text-[#FF6534] text-base">G</span>;
    }
    if (icon === 'clock') {
      return (
        <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (icon === 'checkmark') {
      return (
        <svg className="w-5 h-5 text-[#FF6534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (icon === 'star') {
      return (
        <svg className="w-5 h-5 text-[#FF6534]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14 w-full">

        {/* SECTION 1: HERO CARD */}
        <section className="bg-gradient-to-r from-blue-50/40 via-orange-50/30 to-orange-50/50 rounded-3xl p-6 sm:p-10 border border-slate-200/70 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1F1035] tracking-tight leading-tight">
                Google Pixel <span className="text-[#FF6534]">Repairs</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-xl">
                Professional Google Pixel screen, battery, charging and camera repairs using genuine Google parts for supported devices.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {/* Book a Google Pixel repair button */}
                <button
                  onClick={scrollToSelectPixel}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-sm sm:text-base px-6 sm:px-7 py-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Book a Google Pixel repair
                </button>

                {/* Select your Pixel button */}
                <button
                  onClick={scrollToSelectPixel}
                  className="bg-white hover:bg-gray-50 text-[#1F1035] border border-gray-300 font-extrabold text-sm sm:text-base px-6 sm:px-7 py-3 rounded-xl shadow-2xs hover:shadow-sm transition-all cursor-pointer"
                >
                  Select your Pixel
                </button>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full overflow-hidden">
                <img
                  src={googlePixelHeroImg}
                  alt="Google Pixel Repair Service"
                  className="w-full h-auto rounded-2xl object-cover max-h-[300px] sm:max-h-[340px]"
                />
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 2: GOOGLE AUTHORISED SERVICE PROVIDER */}
        {/* <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            Left Box Image Column
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="bg-[#FAF7F5] rounded-2xl p-6 sm:p-8 w-full flex items-center justify-center min-h-[220px]">
                <img
                  src={googleAuthorisedDevicesImg}
                  alt="Google Authorised Repair Devices"
                  className="w-full h-auto object-contain max-h-[160px]"
                />
              </div>
            </div>

            Right Text Content Column
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FF6534] tracking-tight leading-snug">
                Google Authorised Service Provider
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                SAMZ is a Google Authorised Service Provider for Pixel repairs. Supported repairs use genuine parts sourced through Google and are completed by trained technicians.
              </p>

              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                Whether your Pixel has a cracked screen, worn battery, charging fault or camera problem, our team can inspect the device and confirm the repair available for your model.
              </p>

              <div className="pt-2">
                <button
                  onClick={scrollToSelectPixel}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-sm sm:text-base px-7 py-3 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Book a repair
                </button>
              </div>
            </div>

          </div>
        </section> */}


        {/* SECTION 3: TRUST FEATURES ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {googleTrustFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-12 h-12 rounded-full bg-orange-100/70 flex items-center justify-center mb-1">
                {renderTrustIcon(feature.icon)}
              </div>

              <h3 className="text-base font-extrabold text-[#1F1035] tracking-tight">
                {feature.title}
              </h3>

              <p className="text-xs text-gray-500 font-medium leading-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </section>


        {/* SECTION 4: REPAIR SERVICES GRID */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FF6534] tracking-tight">
              Google Pixel repair services
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Choose the repair that best matches the problem with your Pixel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {googleRepairServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Icon Circle */}
                  <div className="w-10 h-10 rounded-full bg-orange-100/70 flex items-center justify-center">
                    {renderServiceIcon(service.iconType)}
                  </div>

                  <h3 className="text-lg font-extrabold text-[#1F1035] tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => handleServiceAction(service)}
                    className="text-[#FF6534] hover:text-[#e05020] font-bold text-xs sm:text-sm inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {service.actionText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 5: SELECT YOUR GOOGLE PIXEL MODELS GRID */}
        <section id="select-pixel" className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FF6534] tracking-tight">
              Select your Google Pixel
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Choose your model to view available repairs, pricing and booking options.
            </p>
          </div>

          {/* Outer Box Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F1035]">
                Google Pixel models
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Choose your Pixel to see available repairs, current pricing and booking options for your model.
              </p>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {googlePixelModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelClick(model.id)}
                  className="bg-[#F5F3F8] hover:bg-[#F0ECF5] border border-transparent hover:border-[#FF6534]/40 rounded-xl py-3.5 px-4 text-center font-bold text-xs sm:text-sm text-[#1F1035] hover:text-[#FF6534] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION 6: GOOGLE PIXEL FOLD MODELS SECTION (Matches attached pic) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F1035]">
              Google Pixel Fold models
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Choose your Fold model to see the repair options available for your device.
            </p>
          </div>

          {/* Fold Models Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2">
            {googlePixelFoldModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelClick(model.id)}
                className="bg-[#F5F3F8] hover:bg-[#F0ECF5] border border-transparent hover:border-[#FF6534]/40 rounded-xl py-4 px-6 text-center font-bold text-xs sm:text-sm text-[#1F1035] hover:text-[#FF6534] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                {model.name}
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GoogleRepairs;
