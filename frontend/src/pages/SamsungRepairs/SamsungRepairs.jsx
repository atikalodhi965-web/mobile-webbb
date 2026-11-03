import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getModels } from '../../services/catalogService';
import { getMediaUrl } from '../../services/mediaService';
import { samsungCategories } from './data/samsungRepairsData';

const samsungFallbackImg = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();

const getCategoryKeyForModel = (model) => {
  const group = normalizeText(model?.categoryGroup || model?.group || '');
  const name = normalizeText(model?.name || '');
  const slug = normalizeText(model?.slug || '');

  if (group.includes('flip') || group.includes('fold') || name.includes('flip') || name.includes('fold')) {
    return 'flip-fold';
  }

  if (group.includes('note') || name.includes('note') || slug.includes('note')) {
    return 'note-series';
  }

  if (group.includes('a-series') || group.includes('a series') || /a\d/.test(name) || /a\d/.test(slug)) {
    return 'a-series';
  }

  return 's-series';
};

const SamsungRepairs = () => {
  const [samsungModels, setSamsungModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelsError, setModelsError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSamsungModels = async () => {
      try {
        setLoadingModels(true);
        setModelsError('');

        const response = await getModels({ brand: 'samsung', deviceType: 'smartphone' });
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.models)
            ? response.models
            : Array.isArray(response?.data)
              ? response.data
              : [];

        if (isMounted) {
          setSamsungModels(items);
        }
      } catch (err) {
        console.error('Failed to load Samsung smartphone models', err);
        if (isMounted) {
          setSamsungModels([]);
          setModelsError('Unable to load Samsung models right now.');
        }
      } finally {
        if (isMounted) {
          setLoadingModels(false);
        }
      }
    };

    fetchSamsungModels();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoriesWithModels = useMemo(() => {
    const grouped = samsungCategories.map((category) => ({
      ...category,
      subCategories: [],
    }));

    const normalizedModels = (samsungModels || []).filter((model) => {
      const brandName = normalizeText(model?.brandId?.name || model?.brand?.name || model?.brandName || model?.brand || '');
      const deviceType = normalizeText(model?.deviceTypeId?.title || model?.deviceType?.title || model?.deviceTypeName || '');
      const modelName = normalizeText(model?.name || '');

      const isSamsungBrand = brandName === 'samsung';
      const isSmartphone = deviceType.includes('smartphone') || deviceType.includes('phone') || modelName.includes('galaxy');
      const isExcluded = /ipad|macbook|tablet|watch|airpods/.test(modelName);

      return isSamsungBrand && isSmartphone && !isExcluded;
    });

    normalizedModels.forEach((model) => {
      const categoryKey = getCategoryKeyForModel(model);
      const category = grouped.find((entry) => entry.id === categoryKey);
      if (!category) return;

      category.subCategories.push({
        id: model.slug || model._id || model.id,
        name: model.name,
        image: getMediaUrl(model.image || model.images?.[0] || '', samsungFallbackImg),
        href: `/pages/repairs/select-repair/${model.slug || model._id || model.id}`,
      });
    });

    return grouped;
  }, [samsungModels]);

  const [activeCategoryId, setActiveCategoryId] = useState(samsungCategories[0].id);

  useEffect(() => {
    if (!categoriesWithModels.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(samsungCategories[0].id);
    }
  }, [categoriesWithModels, activeCategoryId]);

  const activeCategory =
    categoriesWithModels.find((cat) => cat.id === activeCategoryId) || categoriesWithModels[0] || samsungCategories[0];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-10 sm:mb-14 tracking-tight">
          Select your Samsung
        </h1>

        {modelsError && !loadingModels && (
          <p className="text-center text-sm text-red-600 mb-6">{modelsError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Samsung Categories
            </h2>

            {categoriesWithModels.map((category) => {
              const isActive = activeCategoryId === category.id;

              return (
                <div
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`group rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-between ${
                    isActive
                      ? 'border-2 border-[#FF6534] bg-white shadow-lg scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-[#FF6534]/50 shadow-2xs hover:shadow-md'
                  }`}
                >
                  <div className="w-12 h-16 sm:w-14 sm:h-20 border-2 border-[#1F1B2E] rounded-xl flex items-center justify-center p-1 mb-3 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#FF6534] rounded-full"></div>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#1F1B2E] mb-4 leading-snug">
                    {category.name}
                  </h3>

                  <button
                    className={`w-full py-2.5 rounded-full font-extrabold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#FF6534] text-white shadow-sm'
                        : 'bg-white border border-[#FF6534] text-[#FF6534] hover:bg-[#FF6534] hover:text-white'
                    }`}
                  >
                    Select device
                  </button>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-8 lg:col-span-9 flex flex-col">
            <div className="bg-[#EBF4FA] border border-blue-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col h-full min-h-[660px] md:min-h-[760px] max-h-[820px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-200/60 flex-shrink-0">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B2E] tracking-tight">
                  {activeCategory.name}
                </h2>
                <span className="text-xs sm:text-sm font-semibold text-[#FF6534] bg-white px-4 py-1.5 rounded-full shadow-2xs border border-orange-100">
                  {activeCategory.subCategories.length} Models
                </span>
              </div>

              {loadingModels ? (
                <div className="flex-grow flex items-center justify-center text-sm text-gray-500">
                  Loading Samsung models...
                </div>
              ) : activeCategory.subCategories.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-base sm:text-lg font-bold text-[#1F1B2E]">
                  No models available
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8 items-stretch py-2">
                    {activeCategory.subCategories.map((model) => (
                      <Link
                        key={model.id}
                        to={model.href}
                        className="group flex flex-col items-center bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer w-full max-w-[170px] sm:max-w-[190px] justify-between"
                      >
                        <div className="w-24 sm:w-28 h-36 sm:h-44 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={model.image}
                            alt={model.name}
                            className="max-h-full max-w-full object-contain drop-shadow-md"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = samsungFallbackImg;
                            }}
                          />
                        </div>

                        <h4 className="text-base sm:text-lg font-extrabold text-[#FF6534] group-hover:text-[#e05020] text-center tracking-tight transition-colors">
                          {model.name}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SamsungRepairs;
