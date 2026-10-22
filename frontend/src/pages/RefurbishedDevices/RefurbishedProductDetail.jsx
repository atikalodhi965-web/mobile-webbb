import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { REFURBISHED_PRODUCTS, getProductById } from './data/refurbishedData';
import { useCart } from '../../context/CartContext';

// Interactive Front & Back Phone Graphic component with dynamic color theme
const MainDeviceDisplay = ({ product, selectedColor }) => {
  const phoneBg = selectedColor?.phoneBg || '#255273';
  const hex = selectedColor?.hex || '#2D5C7F';
  const gradient = selectedColor?.screenGradient || 'from-blue-900 via-teal-800 to-indigo-950';

  return (
    <div className="relative w-full aspect-[4/3.2] max-h-[440px] flex items-center justify-center select-none py-4 px-2">
      {/* Soft background glow matching phone color */}
      <div
        className="absolute inset-4 rounded-3xl opacity-20 blur-2xl transition-colors duration-500"
        style={{ backgroundColor: hex }}
      ></div>

      <div className="relative flex items-center justify-center space-x-3 sm:space-x-6 z-10 w-full max-w-md">

        {/* Back of Phone */}
        <div
          className="relative w-36 sm:w-44 h-64 sm:h-80 rounded-[36px] p-2 shadow-2xl border-2 border-white/30 transform -rotate-3 transition-all duration-500 shrink-0"
          style={{ backgroundColor: phoneBg }}
        >
          <div className="w-full h-full rounded-[28px] relative overflow-hidden flex flex-col justify-between p-3 border border-black/10">
            {/* Camera Module */}
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-black/20 backdrop-blur-xs rounded-2xl p-1.5 shadow-inner border border-white/10 grid grid-cols-2 gap-1 items-center justify-items-center">
              <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-900/80"></div>
              </div>
              <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-900/80"></div>
              </div>
              <div className="col-span-2 w-1.5 h-1.5 rounded-full bg-amber-200/90 shadow-xs"></div>
            </div>

            {/* Apple Silhouette */}
            <div className="self-center my-auto opacity-40 text-white font-black text-lg sm:text-xl select-none">
              
            </div>

            {/* Antenna line accent */}
            <div className="w-full h-0.5 bg-black/10 rounded-full"></div>
          </div>
        </div>

        {/* Front of Phone */}
        <div className="relative w-36 sm:w-44 h-64 sm:h-80 bg-slate-950 rounded-[36px] p-2 shadow-2xl border-2 border-slate-800 transform rotate-3 transition-all duration-500 shrink-0 -ml-8 sm:-ml-10 z-10">
          <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-[28px] relative overflow-hidden p-2 flex flex-col justify-between border border-white/10`}>

            {/* Dynamic Island / Notch */}
            <div className="mx-auto w-12 sm:w-14 h-3 bg-slate-950 rounded-full mt-1 flex items-center justify-end px-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950 border border-blue-800"></div>
            </div>

            {/* Screen Wallpaper Content */}
            <div className="my-auto px-2 text-center">
              <div className="w-full py-3 px-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-lg">
                <span className="text-[10px] sm:text-xs text-white/80 font-mono tracking-wider">SAMZ Certified</span>
                <span className="text-sm sm:text-base font-extrabold text-white tracking-wide">{product.name}</span>
                <span className="text-[9px] text-white/70 mt-0.5 font-medium">{selectedColor?.name}</span>
              </div>
            </div>

            {/* Home Indicator Bar */}
            <div className="mx-auto w-14 h-1 bg-white/60 rounded-full mb-1"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

const RefurbishedProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find product by route parameter id
  const product = getProductById(id);

  // States for options
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedCapacity, setSelectedCapacity] = useState(product.capacities[0] || '128GB');
  const [selectedConditionIndex, setSelectedConditionIndex] = useState(
    product.conditionPrices.findIndex(c => c.condition === 'Fair+') !== -1
      ? product.conditionPrices.findIndex(c => c.condition === 'Fair+')
      : 0
  );

  // Accordion toggle state
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    warranty: false,
    returns: false,
  });

  // Toast notification state for Add to Cart
  const [showToast, setShowToast] = useState(false);

  // Terms & Conditions Modal state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsTermsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Ensure options sync if product changes
  useEffect(() => {
    if (product) {
      setSelectedColorIndex(0);
      setSelectedCapacity(product.capacities[0] || '128GB');
      const defaultCondIdx = product.conditionPrices.findIndex(c => c.condition === 'Fair+');
      setSelectedConditionIndex(defaultCondIdx !== -1 ? defaultCondIdx : 0);
    }
  }, [product?.id]);

  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const selectedCondition = product.conditionPrices[selectedConditionIndex] || product.conditionPrices[0];

  const { addToCart } = useCart();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      color: selectedColor,
      capacity: selectedCapacity,
      condition: selectedCondition,
      unitPrice: selectedCondition.price,
      quantity: 1,
    });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1C0D2A] selection:bg-[#FF6534] selection:text-white relative">
      {/* Header */}
      <Header />

      {/* Top Stepper Breadcrumb Bar */}
      <div className="w-full bg-[#FFF5F2] border-b border-[#FFE4DC] py-3.5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2 sm:space-x-6 text-xs sm:text-sm font-bold">

          {/* Step 1: Refurbished devices */}
          <Link
            to="/collections/refurbished"
            className="flex items-center space-x-2 text-[#FF6534] hover:underline cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6534] inline-block"></span>
            <span>Refurbished devices</span>
          </Link>

          <div className="w-8 sm:w-16 h-0.5 bg-[#FF6534]/40"></div>

          {/* Step 2: Product Name (Active) */}
          <div className="flex items-center space-x-2 text-[#FF6534]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6534] inline-block shadow-xs"></span>
            <span className="font-extrabold">{product.name}</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>

          {/* Step 3: Delivery */}
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-800 inline-block"></span>
            <span>Delivery</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>

          {/* Step 4: Payment */}
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-800 inline-block"></span>
            <span>Payment</span>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-5 z-50 bg-[#1C0D2A] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/20 animate-bounce">
          <span className="text-xl">🛍️</span>
          <div>
            <p className="font-bold text-sm">{product.name} Added to Cart!</p>
            <p className="text-xs text-gray-300">{selectedCapacity} • {selectedColor.name} • {selectedCondition.condition} (£{selectedCondition.price}.00)</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Thumbnails + Large Display */}
          <div className="lg:col-span-6 bg-gray-50/50 rounded-2xl p-4 sm:p-6 border border-gray-100 flex flex-col sm:flex-row items-center gap-4">

            {/* 4 Vertical Thumbnails on Left */}
            <div className="flex sm:flex-col flex-row gap-3 justify-center order-2 sm:order-1">
              {product.colors.map((c, index) => {
                const isActive = index === selectedColorIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedColorIndex(index)}
                    className={`w-16 sm:w-20 h-20 sm:h-24 rounded-2xl p-1 border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center bg-white shadow-xs ${isActive
                      ? 'border-[#FF6534] shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    {/* Small graphic preview in thumbnail */}
                    <div className="w-10 sm:w-12 h-14 sm:h-16 rounded-xl flex items-center justify-center p-1" style={{ backgroundColor: c.phoneBg }}>
                      <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold select-none">{c.name.slice(0, 3)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Big Main Frame Display */}
            <div className="w-full order-1 sm:order-2 flex-grow">
              <MainDeviceDisplay product={product} selectedColor={selectedColor} />
            </div>

          </div>

          {/* Right Column: Specifications & Configuration */}
          <div className="lg:col-span-6 space-y-6">

            {/* Tagline & Product Name */}
            <div>
              <span className="font-caveat text-3xl sm:text-4xl text-[#FF6534] font-bold block tracking-wide">
                {product.tagline || 'Cheeky Refurb'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C0D2A] tracking-tight mt-1">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
                {selectedCapacity} / {selectedColor.name} / {selectedCondition.condition}
              </p>
            </div>

            {/* Capacity Selector */}
            <div>
              <label className="text-sm font-bold text-[#1C0D2A] block mb-2">
                Capacity: <span className="font-extrabold">{selectedCapacity}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.capacities.map((cap) => {
                  const isSelected = cap === selectedCapacity;
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setSelectedCapacity(cap)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${isSelected
                        ? 'border-2 border-[#FF6534] text-[#FF6534] bg-[#FFF5F2] shadow-xs'
                        : 'border border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                        }`}
                    >
                      {cap}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colour Selector */}
            <div>
              <label className="text-sm font-bold text-[#1C0D2A] block mb-2">
                Colour: <span className="font-extrabold">{selectedColor.name}</span>
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, index) => {
                  const isSelected = index === selectedColorIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedColorIndex(index)}
                      title={c.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 cursor-pointer flex items-center justify-center ${isSelected
                        ? 'border-[#FF6534] ring-2 ring-[#FF6534]/30 scale-110'
                        : 'border-gray-300'
                        }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && (
                        <span className={`text-xs ${c.hex === '#F5F5F7' || c.hex === '#F5F5F5' ? 'text-gray-900' : 'text-white'}`}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition Selector */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <label className="text-sm font-bold text-[#1C0D2A]">
                  Condition: <span className="font-extrabold">{selectedCondition.condition}</span>
                </label>
                <button type="button" className="text-xs font-bold text-[#FF6534] hover:underline cursor-pointer">
                  Learn more
                </button>
              </div>

              {/* 3 Box Grid Options */}
              <div className="grid grid-cols-3 gap-3">
                {product.conditionPrices.map((condObj, index) => {
                  const isSelected = index === selectedConditionIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedConditionIndex(index)}
                      className={`p-3 rounded-xl text-center border-2 transition-all duration-200 cursor-pointer bg-white ${isSelected
                        ? 'border-[#FF6534] text-[#FF6534] bg-[#FFF5F2] shadow-xs'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      <span className="block text-xs font-bold">{condObj.condition}</span>
                      <span className="block text-sm font-extrabold mt-0.5">£{condObj.price}.00</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dark Purple Feature Highlights Bar */}
            <div className="bg-mauve-100 text-black py-4 px-4 sm:px-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none shadow-xl border border-white/10">

              {/* Item 1: 24 Month warranty */}
              <div className="flex items-center space-x-3.5 w-full justify-start sm:justify-center">
                <svg className="w-10 h-10 text-[#FF6534] shrink-0" viewBox="0 0 40 40" fill="none" stroke="currentColor">
                  <circle cx="20" cy="20" r="17" strokeWidth="2.5" />
                  <path d="M14 16C15 14.5 16.5 14 17.5 14" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22.5 14C23.5 14 25 14.5 26 16" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M13 23C15 28 25 28 27 23" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="text-left">
                  <span className="block text-base sm:text-lg font-black text-[#FF6534] leading-none">24 Month</span>
                  <span className="block text-xs sm:text-sm font-bold text-neutral-900 leading-tight mt-0.5">warranty</span>
                </div>
              </div>

              {/* Separator 1 */}
              <div className="hidden sm:block w-px h-10 bg-black/20 shrink-0"></div>

              {/* Item 2: 36 Month Battery Guarantee */}
              <div className="flex items-center space-x-3.5 w-full justify-start sm:justify-center">
                <svg className="w-10 h-10 text-[#FF6534] shrink-0" viewBox="0 0 40 40" fill="none" stroke="currentColor">
                  <circle cx="20" cy="22" r="14" strokeWidth="2.5" />
                  <path d="M15 19C16 18 17 18 18 19" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22 19C23 18 24 18 25 19" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M15 26C17 29 23 29 25 26" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M30 10C29 8.5 27 9.5 27 11C27 13 30 15 30 15C30 15 33 13 33 11C33 9.5 31 8.5 30 10Z" fill="#FF6534" stroke="none" />
                  <path d="M11 15C10 13.8 8.5 14.6 8.5 15.8C8.5 17.4 11 19 11 19C11 19 13.5 17.4 13.5 15.8C13.5 14.6 12 13.8 11 15Z" fill="#FF6534" stroke="none" />
                </svg>
                <div className="text-left">
                  <span className="block text-base sm:text-lg font-black text-[#FF6534] leading-none">36 Month</span>
                  <span className="block text-xs sm:text-sm font-bold text-gray-500 leading-tight mt-0.5">Battery Guarantee</span>
                </div>
              </div>

              {/* Separator 2 */}
              <div className="hidden sm:block w-px h-10 bg-black/20 shrink-0"></div>

              {/* Item 3: 20% off accessories & repairs */}
              <div className="flex items-center space-x-3.5 w-full justify-start sm:justify-center">
                <svg className="w-10 h-10 text-[#FF6534] shrink-0" viewBox="0 0 40 40" fill="none" stroke="currentColor">
                  <circle cx="20" cy="20" r="17" strokeWidth="2.5" />
                  <path d="M11 15H29V19C29 20.5 27.5 22 26 22H24C22.5 22 21 20.5 21 19V17H19V19C19 20.5 17.5 22 16 22H14C12.5 22 11 20.5 11 19V15Z" fill="#FF6534" stroke="none" />
                  <path d="M13 25C15 29 25 29 27 25" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="text-left">
                  <span className="block text-base sm:text-lg font-black text-[#FF6534] leading-none">20% off</span>
                  <span className="block text-xs sm:text-sm font-bold text-neutral-900 leading-tight mt-0.5">accessories & repairs</span>
                </div>
              </div>

            </div>

            {/* Terms & Conditions & Pricing Area */}
            <div className="pt-2 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-xs text-gray-500 hover:text-[#FF6534] font-semibold block cursor-pointer hover:underline transition-colors text-left"
                  >
                    Terms & Conditions
                  </button>
                  <span className="text-xl sm:text-2xl font-black text-[#FF6534] tracking-tight block mt-1">
                    Top Deal
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-black text-[#FF6534] tracking-tight block">
                    £{selectedCondition.price}.00
                  </span>
                  {/* <span className="text-xs text-gray-500 font-medium block">
                    Pay in 3 instalments of <strong className="text-gray-800">£{(selectedCondition.price / 3).toFixed(2)}</strong> with Klarna
                  </span> */}
                </div>
              </div>

              {/* Add to Cart CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#FF6534] hover:bg-[#e05020] active:scale-[0.99] text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl transition-all duration-200 cursor-pointer text-center"
              >
                Add to cart
              </button>

              <p className="text-xs text-gray-500 text-center font-medium">
                Free Next Day Delivery when you order by 12pm Mon – Fri
              </p>
            </div>

          </div>

        </div>

        {/* Collapsible Accordions Section */}
        <div className="mt-12 space-y-4 max-w-5xl mx-auto">

          {/* 1. Product Description */}
          <div className="border-b border-sky-100 pb-4">
            <button
              type="button"
              onClick={() => toggleSection('description')}
              className="w-full flex items-center justify-between text-left py-3 group cursor-pointer"
            >
              <h3 className={`text-xl font-bold transition-colors ${expandedSections.description ? 'text-[#FF6534]' : 'text-[#1C0D2A] group-hover:text-[#FF6534]'}`}>
                Product Description
              </h3>
              {expandedSections.description ? (
                <ChevronUp className="w-6 h-6 text-[#FF6534]" strokeWidth={2} />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#FF6534]" strokeWidth={2} />
              )}
            </button>

            {expandedSections.description && (
              <div className="pt-2 pb-4 space-y-4 text-sm text-gray-700 leading-relaxed font-sans animate-fadeIn">
                <p>
                  {typeof product.description === 'object' ? product.description.text : product.description}
                </p>

                {product.description?.bullets && (
                  <ul className="space-y-2 pt-2 pl-4">
                    {product.description.bullets.map((bp, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#FF6534] font-bold text-base leading-none mt-1">•</span>
                        <span>
                          <strong className="text-gray-900 font-bold">{bp.title}</strong> {bp.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* 2. Warranty */}
          <div className="border-b border-sky-100 pb-4">
            <button
              type="button"
              onClick={() => toggleSection('warranty')}
              className="w-full flex items-center justify-between text-left py-3 group cursor-pointer"
            >
              <h3 className={`text-xl font-bold transition-colors ${expandedSections.warranty ? 'text-[#FF6534]' : 'text-[#1C0D2A] group-hover:text-[#FF6534]'}`}>
                Warranty
              </h3>
              {expandedSections.warranty ? (
                <ChevronUp className="w-6 h-6 text-[#FF6534]" strokeWidth={2} />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#FF6534]" strokeWidth={2} />
              )}
            </button>

            {expandedSections.warranty && (
              <div className="pt-2 pb-4 text-sm text-gray-700 leading-relaxed font-sans animate-fadeIn">
                <p>
                  {product.warranty}
                </p>
              </div>
            )}
          </div>

          {/* 3. Returns */}
          <div className="border-b border-sky-100 pb-4">
            <button
              type="button"
              onClick={() => toggleSection('returns')}
              className="w-full flex items-center justify-between text-left py-3 group cursor-pointer"
            >
              <h3 className={`text-xl font-bold transition-colors ${expandedSections.returns ? 'text-[#FF6534]' : 'text-[#1C0D2A] group-hover:text-[#FF6534]'}`}>
                Returns
              </h3>
              {expandedSections.returns ? (
                <ChevronUp className="w-6 h-6 text-[#FF6534]" strokeWidth={2} />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#FF6534]" strokeWidth={2} />
              )}
            </button>

            {expandedSections.returns && (
              <div className="pt-2 pb-4 text-sm text-gray-700 leading-relaxed font-sans animate-fadeIn">
                <p>
                  {product.returns}
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Terms & Conditions Modal Dialog (Matching Header MegaMenu Design) */}
      {isTermsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsTermsModalOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="relative w-[920px] max-w-[94vw] max-h-[85vh] bg-white rounded-[1.25rem] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-200/90 overflow-hidden flex flex-col font-sans animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top 3px Accent Bar in #FF6534 (Matching Header MegaMenu) */}
            <div className="h-[3px] bg-[#FF6534] w-full shrink-0"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-black text-[#FF6534] tracking-tight">
                Terms & Conditions (Refurbished Devices)
              </h2>
              {/* Close Button 'X' */}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF6534] text-gray-600 hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                title="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-gray-700 leading-relaxed font-sans">

              <h3 className="text-sm font-bold text-[#FF6534] tracking-wide">
                Refurbished Devices
              </h3>

              <div className="space-y-4">
                <p>
                  <strong className="text-gray-900 font-bold">3.1</strong> Following the purchase of a Refurbished Device from a store or online, you are entitled to a 14-day cooling off period, during which time you may return the device to SAMZ in the condition it was originally sold to you in, for any reason. SAMZ are unable to refund or replace your device outside of this period, unless there is genuine fault, in which case it is covered under our warranty.
                </p>

                <p>
                  <strong className="text-gray-900 font-bold">3.2</strong> You will receive a 24 month warranty with your device, and if any fault is found during this period, you are entitled to return the device to SAMZ, where we will either provide you with a replacement device, or a refund. In the event that a replacement device is provided, the warranty period will remain as 24 months from the date of the original purchase.
                </p>

                <p>
                  <strong className="text-gray-900 font-bold">3.3</strong> If your battery falls below 80% in the 3 years following your purchase, we will replace the battery on your device free of charge, up to once per year, in any of our branches. The replacement will be an SAMZ battery for Apple devices and Genuine OEM battery for Google & Samsung devices. In the event that we are unable to replace the battery, we will offer you a like-for-like device.
                </p>

                <p>
                  <strong className="text-gray-900 font-bold">3.4</strong> Purchases made in-store must be returned to the original SAMZ store. To commence a return for a Refurbished device purchased online, please email <a href="mailto:customerservice@SAMZ.com" className="text-[#FF6534] font-semibold underline">customerservice@SAMZ.com</a> with the subject line 'Return Request: ' followed by your order number. You may be asked to cover the return postage, which you will be reimbursed for.
                </p>
              </div>

            </div>

            {/* Modal Footer Bar */}
            <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="bg-[#1C0D2A] hover:bg-[#2c164a] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RefurbishedProductDetail;
