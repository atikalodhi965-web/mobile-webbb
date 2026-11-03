import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getModels } from '../../services/catalogService';
import { getMediaUrl } from '../../services/mediaService';
import appleFallbackImg from '../../assets/images/apple-iphone.png';

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();

const getModelImage = (model) => {
  const directImage =
    model?.image ||
    model?.thumbnail ||
    model?.imageUrl ||
    model?.coverImage ||
    (Array.isArray(model?.images) ? model.images.find(Boolean) : '') ||
    model?.brandId?.image ||
    model?.deviceTypeId?.image ||
    '';

  return getMediaUrl(directImage, appleFallbackImg);
};

const isAppleSmartphoneModel = (model) => {
  const brandName = normalizeText(model?.brandId?.name || model?.brand?.name || model?.brandName || '');
  const deviceTypeTitle = normalizeText(model?.deviceTypeId?.title || model?.deviceType?.title || model?.deviceTypeName || '');
  const deviceTypeSlug = normalizeText(model?.deviceTypeId?.slug || model?.deviceType?.slug || model?.deviceTypeSlug || '');
  const modelName = normalizeText(model?.name || '');
  const categoryGroup = normalizeText(model?.categoryGroup || '');

  const isAppleBrand = brandName === 'apple';
  const isSmartphoneType =
    deviceTypeTitle.includes('smartphone') ||
    deviceTypeSlug.includes('smartphone') ||
    deviceTypeSlug.includes('phone') ||
    modelName.includes('iphone') ||
    categoryGroup.includes('smartphone') ||
    categoryGroup.includes('phone');

  const isExcludedAppleDevice =
    modelName.includes('ipad') ||
    modelName.includes('macbook') ||
    modelName.includes('watch') ||
    modelName.includes('airpods') ||
    categoryGroup.includes('ipad') ||
    categoryGroup.includes('macbook') ||
    categoryGroup.includes('tablet') ||
    categoryGroup.includes('watch');

  return isAppleBrand && isSmartphoneType && !isExcludedAppleDevice;
};

const AppleRepairs = () => {
  const [appleModels, setAppleModels] = useState([]);
  console.log('AppleRepairs: appleModels', appleModels);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAppleModels = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getModels({ brand: 'apple', deviceType: 'smartphone' });
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.models)
            ? response.models
            : Array.isArray(response?.data)
              ? response.data
              : [];

        const filteredModels = items.filter(isAppleSmartphoneModel);

        if (isMounted) {
          setAppleModels(filteredModels.length > 0 ? filteredModels : items);
        }
      } catch (err) {
        console.error('Failed to load Apple smartphone models', err);

        if (isMounted) {
          setError('Unable to load Apple smartphone models right now.');
          setAppleModels([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAppleModels();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E] selection:bg-[#FF6534] selection:text-white">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-12 sm:mb-16 tracking-tight">
          Select Your iPhone
        </h1>

        {error && !isLoading && (
          <p className="text-center text-sm text-red-600 mb-8">{error}</p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-x-10 lg:gap-y-16 items-center justify-items-center mb-16">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="w-full max-w-[240px]">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 bg-gray-200 animate-pulse rounded-3xl" />
                </div>
                <div className="h-6 w-28 bg-gray-200 animate-pulse rounded-full mx-auto" />
              </div>
            ))}
          </div>
        ) : appleModels.length === 0 ? (
          <div className="text-center text-gray-600 text-sm">No Apple smartphone models available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-x-10 lg:gap-y-16 items-center justify-items-center mb-16">
            {appleModels.map((phone) => {
              const modelName = phone?.name || 'Apple iPhone';
              const modelImage = getModelImage(phone);
              const modelId = phone?.slug || phone?._id || phone?.id || modelName;
              const modelHref = phone?.href || `/pages/repairs/apple/${phone?.slug || modelId}`;

              return (
                <Link
                  key={modelId}
                  to={modelHref}
                  className="group flex flex-col items-center cursor-pointer w-full max-w-[240px] transition-all duration-300"
                >
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#C5DCEE]/70 rounded-3xl transform rotate-45 group-hover:bg-[#B3D2E9] group-hover:scale-105 transition-all duration-300 shadow-xs"></div>
                    </div>

                    <div className="relative z-10 w-28 sm:w-32 h-40 sm:h-44 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                      <img
                        src={modelImage}
                        alt={modelName}
                        className="max-h-full max-w-full object-contain drop-shadow-md"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = appleFallbackImg;
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#FF6534] group-hover:text-[#e05020] tracking-tight text-center transition-colors">
                    {modelName}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppleRepairs;
