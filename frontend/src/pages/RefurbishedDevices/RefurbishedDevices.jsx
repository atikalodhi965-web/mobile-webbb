/**
 * RefurbishedDevices.jsx
 * ──────────────────────
 * Now fetches products from the backend via useProducts hook.
 * Filters are applied client-side from the API result set.
 */
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RefurbishedBanner from './components/RefurbishedBanner';
import RefurbishedFilters from './components/RefurbishedFilters';
import RefurbishedCard from './components/RefurbishedCard';
import { useProducts } from '../../hooks/useProducts';

const RefurbishedDevices = () => {
  const [selectedPrice, setSelectedPrice] = useState(600);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Fetch all refurbished products from the backend
  const { products: apiProducts, loading, error } = useProducts();

  // Normalise backend product shape to match what RefurbishedCard expects
  const products = useMemo(() => {
    return apiProducts.map((p) => ({
      id: p._id ?? p.id,
      name: p.name,
      brand: p.brand?.name ?? p.brand ?? '',
      price: p.variants?.[0]?.price ?? p.price ?? 0,
      image: p.images?.[0] ?? p.image ?? null,
      capacities: p.variants
        ? [...new Set(p.variants.map((v) => v.storage ?? v.capacity).filter(Boolean))]
        : p.capacities ?? [],
      conditions: p.variants
        ? [...new Set(p.variants.map((v) => v.condition).filter(Boolean))]
        : p.conditions ?? [],
      slug: p.slug,
      // Pass through the rest for RefurbishedCard
      ...p,
    }));
  }, [apiProducts]);

  // Filter handlers
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCapacity = (capacity) => {
    setSelectedCapacities((prev) =>
      prev.includes(capacity) ? prev.filter((c) => c !== capacity) : [...prev, capacity]
    );
  };

  const toggleCondition = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setSelectedPrice(600);
    setSelectedBrands([]);
    setSelectedCapacities([]);
    setSelectedConditions([]);
  };

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.price > selectedPrice) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (
        selectedCapacities.length > 0 &&
        !product.capacities.some((c) => selectedCapacities.includes(c))
      ) return false;
      if (
        selectedConditions.length > 0 &&
        !product.conditions.some((c) => selectedConditions.includes(c))
      ) return false;
      return true;
    });
  }, [products, selectedPrice, selectedBrands, selectedCapacities, selectedConditions]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col font-sans text-[#1C0D2A] selection:bg-[#FF6534] selection:text-white">
      <Header />
      <RefurbishedBanner />

      <main id="refurbished-catalog" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div id="refurbished-heading" className="text-center mb-8 scroll-mt-24">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FF6534] tracking-tight">
            Refurbished Devices
          </h1>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 mb-6 text-sm text-orange-700 font-medium text-center">
            ⚠️ Could not load products from server. Showing cached data if available.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filters */}
          <div className="lg:col-span-3">
            <RefurbishedFilters
              filteredCount={filteredProducts.length}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              selectedCapacities={selectedCapacities}
              toggleCapacity={toggleCapacity}
              selectedConditions={selectedConditions}
              toggleCondition={toggleCondition}
              clearFilters={clearFilters}
            />
          </div>

          {/* Right Column: Product Grid */}
          <div className="lg:col-span-9">
            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Cards */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <RefurbishedCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-gray-100 my-4">
                <p className="text-lg font-bold text-gray-700">
                  No products match your selected filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-[#FF6534] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#e05020] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefurbishedDevices;
