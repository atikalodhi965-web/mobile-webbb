import React from 'react';
import { useNavigate } from 'react-router-dom';

// Render device graphic illustration matching front & back phone mockups
const DeviceGraphic = ({ imageType, name }) => {
  return (
    <div className="relative w-full h-56 flex items-center justify-center my-2 select-none group">
      {/* Background soft shadow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-gray-100/50 rounded-2xl -z-10 group-hover:scale-102 transition-transform duration-300"></div>

      <div className="flex items-center justify-center space-x-2.5">
        {/* Back of Phone */}
        <div className="relative w-28 h-48 bg-slate-900 rounded-[28px] p-1.5 shadow-xl border border-slate-700/50 transform -rotate-3 transition-transform duration-300 group-hover:-rotate-6">
          <div className="w-full h-full bg-slate-800 rounded-[22px] relative overflow-hidden flex flex-col justify-between p-2">
            {/* Camera Bump */}
            <div className="w-9 h-9 bg-slate-900 rounded-xl p-1 shadow-inner border border-slate-700/40 grid grid-cols-2 gap-1 items-center justify-items-center">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
              </div>
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></div>
              </div>
            </div>
            {/* Apple / Brand Logo Silhouette */}
            <div className="self-center my-auto opacity-30 text-white font-black text-xs tracking-tighter">
              
            </div>
          </div>
        </div>

        {/* Front of Phone */}
        <div className="relative w-28 h-48 bg-slate-900 rounded-[28px] p-1.5 shadow-2xl border border-slate-800 transform rotate-3 transition-transform duration-300 group-hover:rotate-6">
          {/* Screen Content */}
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-[22px] relative overflow-hidden p-1 flex flex-col justify-between">
            {/* Dynamic Island / Notch */}
            <div className="mx-auto w-8 h-2 bg-slate-950 rounded-full mt-1"></div>

            {/* Screen Display Wall Art */}
            <div className="my-auto px-2 text-center">
              <div className="w-full h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center">
                <span className="text-[10px] text-white/70 font-mono">SAMZ Certified</span>
                <span className="text-xs font-bold text-white tracking-wide">{name}</span>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mx-auto w-10 h-0.5 bg-white/50 rounded-full mb-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RefurbishedCard = ({ product }) => {
  const navigate = useNavigate();
  const productPath = `/collections/refurbished/${product.slug || product.id}`;

  const handleCardNavigation = () => {
    navigate(productPath);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardNavigation();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardNavigation}
      onKeyDown={handleCardKeyDown}
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 relative flex flex-col justify-between font-sans cursor-pointer"
    >

      {/* Top Badge (if any) */}
      {product.tag && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#FF6534] text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-xs inline-block">
            {product.tag}
          </span>
        </div>
      )}

      {/* Product Image Mockup */}
      <DeviceGraphic imageType={product.imageType} name={product.name} />

      {/* Product Information */}
      <div className="mt-3">
        <div>
          {/* Category Label */}
          <span className="text-xs text-gray-500 font-medium block">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="text-xl font-bold text-[#1C0D2A] mt-0.5">
            {product.name}
          </h3>
        </div>

        <div className="flex items-start justify-between gap-3 mt-3">
          <div className="min-w-0">
            {/* Color Swatches */}
            <div className="flex items-center space-x-2 mb-2.5">
              {(product.colors || []).map((color, idx) => (
                <span
                  key={idx}
                  title={color.name}
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            {/* Capacities */}
            <p className="text-2xs font-semibold text-gray-600 tracking-tight">
              {(product.capacities || []).join(', ')}
            </p>
          </div>

          {/* Pricing */}
          <div className="shrink-0 text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-[11px] font-bold text-[#FF6534]">From</span>
              <span className="text-xl font-black text-[#FF6534]">
                £{product.price}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                £{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Dark Purple Feature Highlights Box */}
        <div className="bg-mauve-100 text-black p-3 rounded-xl space-y-1.5 my-3 text-xs font-semibold select-none shadow-xs">
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>24 Month Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔋</span>
            <span>36 Month Battery Guarantee</span>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleCardNavigation}
          className="w-full bg-[#1C0D2A] hover:bg-[#2c164a] text-white text-sm font-bold py-3 rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
        >
          View options
        </button>
      </div>

    </div>
  );
};

export default RefurbishedCard;
