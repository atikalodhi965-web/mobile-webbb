import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import smartphonesImg from '../../assets/images/smartphones.png';
import appleImg from '../../assets/images/apple-iphone.png';
import samsungImg from '../../assets/images/samsung-phone.png';
import googleImg from '../../assets/images/google-phone.png';
import { getBrands } from '../../services/catalogService';
import { getMediaUrl } from '../../services/mediaService';

const brandFallbackImage = (brand) => {
  const key = String(brand?.slug || brand?.name || '').toLowerCase();
  if (key.includes('apple')) return appleImg;
  if (key.includes('samsung')) return samsungImg;
  if (key.includes('google') || key.includes('pixel')) return googleImg;
  return smartphonesImg;
};

const MobileRepairs = () => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        const normalizedBrands = Array.isArray(data) ? data : data?.brands || [];
        setBrands(normalizedBrands);
      } catch (err) {
        console.error('Failed to load brands', err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  const scrollToSelect = () => {
    const el = document.getElementById('select-mobile');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const brandCards = loadingBrands
    ? [1, 2, 3].map((i) => (
        <div key={i} className="w-56 h-56 bg-gray-100 rounded-2xl animate-pulse" />
      ))
    : brands.map((brand) => {
      const href = brand.href || (brand.slug ? `/pages/repairs/${brand.slug}` : '#');

        return (
          <Link
            key={brand.id || brand.slug}
            to={href}
            className="group flex flex-col items-center cursor-pointer w-full max-w-[260px]"
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-44 h-44 sm:w-48 sm:h-48 bg-[#C5DCEE]/70 rounded-3xl transform rotate-45 group-hover:bg-[#B3D2E9] group-hover:scale-105 transition-all duration-300 shadow-sm" />
              </div>
              <div className="relative z-10 w-32 sm:w-36 h-44 sm:h-48 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                <img
                  src={getMediaUrl(brand.image, brandFallbackImage(brand))}
                  alt={`${brand.name} Repair`}
                  className="max-h-full max-w-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FF6534] group-hover:text-[#e05020] tracking-tight transition-colors">
              {brand.name}
            </h3>
          </Link>
        );
      });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      <Header />

      <main className="flex-grow">
        <section className="bg-[#EBF3FA] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-b border-slate-200/60">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1B2E] tracking-tight mb-1">
                Express
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FF6534] tracking-tight mb-8">
                Mobile Phone Repairs
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <button
                  onClick={scrollToSelect}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  Select your device
                </button>
              </div>
            </div>

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

        <section id="select-mobile" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-14 tracking-tight">
            Select Your Mobile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 items-center justify-items-center mb-12">
            {brandCards}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MobileRepairs;
