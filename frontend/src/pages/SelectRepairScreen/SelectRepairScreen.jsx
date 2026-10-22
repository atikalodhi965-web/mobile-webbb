/**
 * SelectRepairScreen.jsx
 * ──────────────────────
 * Fetches real repair categories + priced repairs from the backend.
 * Falls back to static local data while loading or if the API is unavailable.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useRepairCategories, useRepairsForModel } from '../../hooks/useRepairs';
import { repairCategories as staticCategories, getModelRepairData } from './data/selectRepairData';

const SelectRepairScreen = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Derive a readable model name from the URL slug
  const modelName = modelId
    ? modelId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'iPhone 17';

  // ── Backend data ──────────────────────────────────────────────────────────
  const { categories: apiCategories, loading: catsLoading } = useRepairCategories();
  const { repairs: apiRepairs, loading: repairsLoading } = useRepairsForModel(modelId);

  const loading = catsLoading || repairsLoading;

  // ── Active category state ──────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Use backend categories if available, fall back to static
  const categories = useMemo(() => {
    if (!catsLoading && apiCategories.length > 0) {
      return apiCategories.map((cat) => ({
        id: cat._id ?? cat.id ?? cat.slug,
        title: cat.name ?? cat.title,
        shortTitle: cat.name ?? cat.title,
        icon: cat.icon ?? 'battery',
      }));
    }
    return staticCategories;
  }, [apiCategories, catsLoading]);

  // Set default active category once categories are available
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories]);

  // ── Repair options for current category ───────────────────────────────────
  const currentOptions = useMemo(() => {
    // If backend has repairs, group them by category
    if (!repairsLoading && apiRepairs.length > 0) {
      return apiRepairs.filter((r) => {
        const rCatId = r.category?._id ?? r.category?.id ?? r.category ?? r.categoryId;
        return rCatId === activeCategory || r.categorySlug === activeCategory;
      }).map((r) => ({
        id: r._id ?? r.id,
        title: r.name ?? r.title,
        price: r.price !== undefined ? `£${r.price}` : 'POA',
        priceNumber: r.price ?? 0,
        icon: r.icon ?? r.category?.icon ?? 'battery',
        description: r.description ?? '',
        warranty: r.warranty ?? '12 months',
        repairTime: r.repairTime ?? 'Up to 60 minutes',
        note: r.note ?? '',
      }));
    }

    // Fall back to static data
    if (modelId && activeCategory) {
      const staticData = getModelRepairData(modelId, modelName);
      return staticData[activeCategory] ?? [];
    }
    return [];
  }, [apiRepairs, repairsLoading, activeCategory, modelId, modelName]);

  const handleBookRepair = (repairOption) => {
    navigate('/book-repair', { state: { repair: repairOption, device: modelName } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      <Header />

      {/* Process Bar */}
      <div className="bg-[#DCE9F5] py-3 px-4 text-center font-sans text-xs sm:text-sm font-semibold text-[#1F1B2E] border-b border-blue-100">
        <div className="max-w-4xl mx-auto flex items-center justify-center flex-wrap gap-2 sm:gap-4">
          <span className="text-gray-600">1 Select device</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#FF6534] font-extrabold">2 Select repair</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">3 Select store</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">4 Select date</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">5 Book repair</span>
        </div>
      </div>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-4 tracking-tight">
          {modelName} Repairs
        </h1>

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-6">
          <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium leading-relaxed">
            If your {modelName} is damaged, we understand that you would want this repaired in no time so you can go back to enjoying the great performance and features of your device.
            {isExpanded && (
              <span className="block mt-2 text-gray-600 animate-fadeIn">
                At SAMZ, our certified technicians offer quick, reliable, and high-quality screen, battery, and component repairs backed by our comprehensive warranty options.
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#FF6534] font-bold underline ml-1 cursor-pointer hover:text-[#e05020]"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-28 sm:h-32 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        {!loading && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <div key={cat.id} className="relative w-full flex flex-col items-center">
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full h-28 sm:h-32 rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-200 cursor-pointer relative ${
                        isActive
                          ? 'border-2 border-[#FF6534] bg-white shadow-md'
                          : 'border border-blue-100/90 bg-[#F4F8FC] hover:bg-[#EBF3FA] text-gray-700 shadow-2xs'
                      }`}
                    >
                      <div className="mb-2">
                        {cat.icon === 'screen' && (
                          <svg className={`w-8 h-8 ${isActive ? 'text-[#FF6534]' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
                            <path d="M9 7l6 6M15 7l-6 6" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                        {cat.icon === 'back' && (
                          <svg className={`w-8 h-8 ${isActive ? 'text-[#FF6534]' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
                            <rect x="9" y="4" width="3" height="4" rx="0.5" strokeWidth="1.5" />
                            <path d="M10 12l4 4M14 12l-4 4" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                        {(cat.icon === 'battery' || !['screen','back','camera'].includes(cat.icon)) && (
                          <svg className={`w-8 h-8 ${isActive ? 'text-[#FF6534]' : 'text-[#1F1B2E]'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15 4V2H9v2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2zm-2 10h-2v4h-2l4-7v4h2l-4 7z" />
                          </svg>
                        )}
                        {cat.icon === 'camera' && (
                          <svg className={`w-8 h-8 ${isActive ? 'text-[#FF6534]' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h3l1.5-2h5.5L16 7h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <circle cx="12" cy="13" r="3" strokeWidth="2" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-extrabold text-center leading-tight ${isActive ? 'text-[#FF6534]' : 'text-[#1F1B2E]'}`}>
                        {cat.shortTitle ?? cat.title}
                      </span>
                    </button>
                    {isActive && (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#FF6534]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Repair Options Box */}
        {!loading && currentOptions.length > 0 && (
          <div className="border-2 border-[#FF6534] rounded-3xl p-6 sm:p-10 bg-white shadow-xl mb-12">
            <div className={`grid grid-cols-1 ${currentOptions.length > 1 ? 'md:grid-cols-2 gap-8 md:divide-x md:divide-gray-200' : 'max-w-3xl mx-auto'}`}>
              {currentOptions.map((option, idx) => (
                <div
                  key={option.id}
                  className={`flex flex-col justify-between items-center text-center ${
                    currentOptions.length > 1 && idx === 1 ? 'md:pl-8 pt-8 md:pt-0 border-t md:border-t-0 border-gray-200' : ''
                  }`}
                >
                  {/* Icon + Title + Price + CTA */}
                  <div className="w-full flex flex-col items-center mb-6">
                    <div className="mb-4 text-[#1F1B2E] flex justify-center">
                      {option.icon === 'battery' && (
                        <svg className="w-16 h-16 text-[#1F1B2E]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15 4V2H9v2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2zm-2 10h-2v4h-2l4-7v4h2l-4 7z" />
                        </svg>
                      )}
                      {option.icon === 'screen' && (
                        <svg className="w-16 h-16 text-[#1F1B2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
                          <path d="M9 7l6 6M15 7l-6 6" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      {option.icon === 'back' && (
                        <svg className="w-16 h-16 text-[#1F1B2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
                          <rect x="9" y="4" width="3" height="4" rx="0.5" strokeWidth="1.5" />
                          <path d="M10 12l4 4M14 12l-4 4" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      {option.icon === 'camera' && (
                        <svg className="w-16 h-16 text-[#1F1B2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h3l1.5-2h5.5L16 7h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <circle cx="12" cy="13" r="3" strokeWidth="2" />
                        </svg>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#FF6534] mb-2 tracking-tight max-w-sm">
                      {option.title}
                    </h3>

                    <div className="text-3xl sm:text-4xl font-extrabold text-[#1F1B2E] mb-5">
                      {option.price}
                    </div>

                    <button
                      onClick={() => handleBookRepair(option)}
                      className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-sm sm:text-base px-10 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                      Book Repair
                    </button>
                  </div>

                  {/* Details */}
                  <div className="w-full text-left space-y-4 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-700">
                    {option.description && (
                      <div>
                        <h4 className="font-extrabold text-[#1F1B2E] mb-1">Repair description</h4>
                        <p className="text-gray-600 font-medium leading-relaxed">{option.description}</p>
                      </div>
                    )}
                    {option.warranty && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="font-extrabold text-[#1F1B2E]">Warranty: </span>
                        <span className="font-extrabold text-[#FF6534]">{option.warranty}</span>
                      </div>
                    )}
                    {option.repairTime && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="mb-1">
                          <span className="font-extrabold text-[#1F1B2E]">Repair time: </span>
                          <span className="font-extrabold text-[#FF6534]">{option.repairTime}</span>
                        </div>
                        {option.note && (
                          <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-normal mt-1">
                            {option.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty / No repairs for category */}
        {!loading && currentOptions.length === 0 && activeCategory && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm font-medium">No repairs available for this category yet.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default SelectRepairScreen;
