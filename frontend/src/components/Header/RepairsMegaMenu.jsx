import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getModels } from '../../services/catalogService';
import './RepairsMegaMenu.css';

const REPAIR_MENU_CACHE_KEY = 'samz-repair-menu-cache-v1';
const EMPTY_MENU = {
  applePhones: [],
  samsungPhones: [],
  googlePhones: [],
  appleTablets: [],
  appleLaptops: [],
};

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();

const getModelList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.models)) return response.models;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const getBrandName = (model) => {
  const candidates = [
    model?.brand?.name,
    model?.brandId?.name,
    model?.brandName,
    model?.brand,
    model?.brand_slug,
    model?.brandSlug,
  ];

  return normalizeText(candidates.find((value) => value !== undefined && value !== null && value !== ''));
};

const getDeviceTypeName = (model) => {
  const candidates = [
    model?.deviceType?.title,
    model?.deviceTypeId?.title,
    model?.deviceTypeName,
    model?.deviceType,
    model?.deviceTypeSlug,
    model?.type,
  ];

  return normalizeText(candidates.find((value) => value !== undefined && value !== null && value !== ''));
};

const getModelHref = (model) => {
  const slug = model?.slug || model?.modelSlug || model?._id || model?.id;
  return slug ? `/pages/repairs/select-repair/${slug}` : '/pages/repairs';
};

const buildMenuList = (items = []) => {
  const unique = [];
  const seen = new Set();

  items.forEach((item) => {
    const name = String(item?.name || item?.modelName || '').trim();
    if (!name) return;

    const key = (item?.slug || item?._id || item?.id || name).toString();
    if (seen.has(key)) return;

    seen.add(key);
    unique.push({
      name,
      href: getModelHref(item),
    });
  });

  return unique.slice(0, 12);
};

const isAppleSmartphone = (model) => {
  const brandName = getBrandName(model);
  const deviceTypeName = getDeviceTypeName(model);
  const modelName = normalizeText(model?.name || model?.modelName || '');

  return (
    brandName === 'apple' &&
    (
      deviceTypeName.includes('smartphone') ||
      deviceTypeName.includes('phone') ||
      modelName.includes('iphone')
    )
  );
};

const isSamsungSmartphone = (model) => {
  const brandName = getBrandName(model);
  const deviceTypeName = getDeviceTypeName(model);
  return brandName === 'samsung' && (deviceTypeName.includes('smartphone') || deviceTypeName.includes('phone'));
};

const isGoogleSmartphone = (model) => {
  const brandName = getBrandName(model);
  const deviceTypeName = getDeviceTypeName(model);
  return brandName === 'google' && (deviceTypeName.includes('smartphone') || deviceTypeName.includes('phone'));
};

const isAppleTablet = (model) => {
  const brandName = getBrandName(model);
  const deviceTypeName = getDeviceTypeName(model);
  const modelName = normalizeText(model?.name || model?.modelName || '');

  return (
    brandName === 'apple' &&
    (
      deviceTypeName.includes('tablet') ||
      modelName.includes('ipad') ||
      model?.categoryGroup?.toLowerCase?.().includes('ipad')
    )
  );
};

const isAppleLaptop = (model) => {
  const brandName = getBrandName(model);
  const deviceTypeName = getDeviceTypeName(model);
  const modelName = normalizeText(model?.name || model?.modelName || '');

  return (
    brandName === 'apple' &&
    (
      deviceTypeName.includes('laptop') ||
      modelName.includes('macbook') ||
      model?.categoryGroup?.toLowerCase?.().includes('macbook')
    )
  );
};

let repairMenuCache = null;
let repairMenuPromise = null;

const loadRepairMenuModels = async () => {
  if (repairMenuCache) return repairMenuCache;

  try {
    const rawCache = sessionStorage.getItem(REPAIR_MENU_CACHE_KEY);
    if (rawCache) {
      const parsedCache = JSON.parse(rawCache);
      repairMenuCache = parsedCache;
      return parsedCache;
    }
  } catch (error) {
    console.warn('Failed to read repair menu cache', error);
  }

  if (!repairMenuPromise) {
    repairMenuPromise = Promise.all([
      getModels({ brand: 'apple', deviceType: 'smartphone' }),
      getModels({ brand: 'samsung', deviceType: 'smartphone' }),
      getModels({ brand: 'google', deviceType: 'smartphone' }),
      getModels({ brand: 'apple', deviceType: 'tablet' }),
      getModels({ brand: 'apple', deviceType: 'laptop' }),
    ]).then(([applePhones, samsungPhones, googlePhones, appleTablets, appleLaptops]) => {
      const menu = {
        applePhones: buildMenuList(getModelList(applePhones).filter(isAppleSmartphone)),
        samsungPhones: buildMenuList(getModelList(samsungPhones).filter(isSamsungSmartphone)),
        googlePhones: buildMenuList(getModelList(googlePhones).filter(isGoogleSmartphone)),
        appleTablets: buildMenuList(getModelList(appleTablets).filter(isAppleTablet)),
        appleLaptops: buildMenuList(getModelList(appleLaptops).filter(isAppleLaptop)),
      };

      repairMenuCache = menu;
      try {
        sessionStorage.setItem(REPAIR_MENU_CACHE_KEY, JSON.stringify(menu));
      } catch (error) {
        console.warn('Failed to cache repair menu models', error);
      }

      return menu;
    }).finally(() => {
      repairMenuPromise = null;
    });
  }

  return repairMenuPromise;
};

const RepairsMegaMenu = ({ onMouseEnter, onMouseLeave }) => {
  const [menuModels, setMenuModels] = useState(() => {
    try {
      const cached = sessionStorage.getItem(REPAIR_MENU_CACHE_KEY);
      return cached ? JSON.parse(cached) : EMPTY_MENU;
    } catch (error) {
      return EMPTY_MENU;
    }
  });
  const [loading, setLoading] = useState(!repairMenuCache && !sessionStorage.getItem(REPAIR_MENU_CACHE_KEY));

  useEffect(() => {
    let isMounted = true;

    const fetchMenuModels = async () => {
      try {
        const data = await loadRepairMenuModels();
        if (isMounted) {
          setMenuModels(data);
        }
      } catch (error) {
        console.error('Failed to load repair menu models', error);
        if (isMounted) {
          setMenuModels(EMPTY_MENU);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenuModels();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderModelLinks = (items) => {
    if (!items || !items.length) {
      return null;
    }

    return items.map((item) => (
      <Link key={`${item.name}-${item.href}`} to={item.href} className="block repairs-megamenu-link">
        {item.name}
      </Link>
    ));
  };

  const applePhoneLeft = useMemo(() => [...(menuModels.applePhones || [])].slice(0, 7), [menuModels.applePhones]);
  const applePhoneRight = useMemo(() => [...(menuModels.applePhones || [])].slice(7, 14), [menuModels.applePhones]);

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[1040px] max-w-[95vw] font-sans"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="repairs-megamenu-container overflow-hidden bg-white">
        <div className="h-[3px] bg-[#FF6534] w-full"></div>

        <div className="p-6 sm:p-7 lg:p-8">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-7">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                <svg className="w-5 h-5 text-[#FF6534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2.2" />
                  <line x1="11" y1="18" x2="13" y2="18" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <h3 className="repairs-megamenu-header-title">Smartphones</h3>
              </div>

              <div className="grid grid-cols-12 gap-4 pt-1">
                <div className="col-span-6">
                  <h4 className="repairs-megamenu-sub-header mb-3">iPhone</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-2">
                      {!loading && renderModelLinks(applePhoneLeft)}
                    </div>
                    <div className="space-y-2">
                      {!loading && renderModelLinks(applePhoneRight)}
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <h4 className="repairs-megamenu-sub-header mb-3">Samsung</h4>
                  <div className="space-y-2">
                    {!loading && renderModelLinks(menuModels.samsungPhones)}
                  </div>
                </div>

                <div className="col-span-3">
                  <h4 className="repairs-megamenu-sub-header mb-3">Google</h4>
                  <div className="space-y-2">
                    {!loading && renderModelLinks(menuModels.googlePhones)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 flex justify-center self-stretch">
              <div className="w-[1px] bg-gray-100 h-full"></div>
            </div>

            <div className="col-span-2">
              <div className="mb-3 pb-2 border-b border-gray-100">
                <h3 className="repairs-megamenu-header-title">iPad</h3>
              </div>
              <div className="space-y-2 pt-1">
                {!loading && renderModelLinks(menuModels.appleTablets)}
              </div>
            </div>

            <div className="col-span-2">
              <div className="mb-3 pb-2 border-b border-gray-100">
                <h3 className="repairs-megamenu-header-title">MacBook</h3>
              </div>
              <div className="space-y-2 pt-1">
                {!loading && renderModelLinks(menuModels.appleLaptops)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairsMegaMenu;
