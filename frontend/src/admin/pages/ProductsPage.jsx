import React, { useEffect, useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import ProductForm from '../components/ProductForm';
import useAdminResource from '../hooks/useAdminResource';
import { brandApi, deviceTypeApi, productApi } from '../services/adminApi';
import { getMediaUrl } from '../../services/mediaService';

const getTotalStock = (product) => {
  const variants = Array.isArray(product?.stockByVariant) ? product.stockByVariant : [];
  return variants.reduce((sum, item) => sum + (Number(item?.stock) || 0), 0);
};

const COLUMNS = [
  {
    key: 'image',
    label: 'Image',
    render: (r) => {
      const src = getMediaUrl(r.image || r.images?.[0], '');
      return src ? (
        <img src={src} alt={r.name} className="h-11 w-11 object-cover rounded-lg border border-gray-100 shadow-2xs" />
      ) : (
        <div className="h-11 w-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-medium">
          No Img
        </div>
      );
    },
  },
  {
    key: 'name',
    label: 'Product',
    render: (r) => (
      <div>
        <p className="font-bold text-[#1F1B2E] text-sm">{r.name}</p>
        <p className="text-xs font-mono text-gray-400">{r.slug}</p>
      </div>
    ),
  },
  {
    key: 'brand',
    label: 'Brand',
    render: (r) => <span className="text-sm font-medium text-gray-700">{r.brand || '—'}</span>,
  },
  { key: 'category', label: 'Category' },
  {
    key: 'type',
    label: 'Type',
    render: (r) => <span className="capitalize font-medium text-xs text-gray-600">{r.type}</span>,
  },
  {
    key: 'price',
    label: 'Price',
    render: (r) => (
      <div>
        <span className="font-bold text-[#b8370e]">£{Number(r.price || 0).toFixed(2)}</span>
        {Number(r.originalPrice || 0) > 0 && (
          <span className="text-gray-400 line-through ml-1.5 text-xs">£{Number(r.originalPrice || 0).toFixed(2)}</span>
        )}
        {Number(r.savings || 0) > 0 && (
          <span className="block text-[10px] text-emerald-600 font-bold">Save £{Number(r.savings || 0).toFixed(2)}</span>
        )}
      </div>
    ),
  },
  {
    key: 'stockByVariant',
    label: 'Stock',
    render: (r) => (
      <span className="text-xs font-semibold text-gray-700">
        {getTotalStock(r)} pcs
      </span>
    ),
  },
  {
    key: 'conditions',
    label: 'Conditions',
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {(r.conditions || []).map((c, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              c === 'New'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {c}
          </span>
        )) || '—'}
      </div>
    ),
  },
  {
    key: 'conditionPrices',
    label: 'Cond. Prices',
    render: (r) => (
      <span className="text-xs text-gray-600 font-medium">
        {(r.conditionPrices || []).map((cp) => `${cp.condition}: £${Number(cp.price || 0).toFixed(2)}`).join(' | ') || '—'}
      </span>
    ),
  },
  {
    key: 'capacities',
    label: 'Capacities',
    render: (r) => (
      <span className="text-xs text-gray-500 font-mono">
        {(r.capacities || []).join(', ') || '—'}
      </span>
    ),
  },
  {
    key: 'colors',
    label: 'Colors',
    render: (r) => (
      <div className="flex items-center gap-1 max-w-[130px] flex-wrap">
        {(r.colors || []).map((c, i) => (
          <span
            key={i}
            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
            title={c.name || c.color || c.hex}
            style={{ backgroundColor: c.hex || '#000' }}
          />
        )) || '—'}
      </div>
    ),
  },
  {
    key: 'warranty',
    label: 'Warranty',
    render: (r) => <span className="text-xs text-gray-600">{r.warranty || '—'}</span>,
  },
  {
    key: 'tag',
    label: 'Badge',
    render: (r) =>
      r.tag ? (
        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#b8370e]/10 text-[#b8370e]">
          {r.tag}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'isFeatured',
    label: 'Featured',
    render: (r) => (
      <span
        className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
          r.isFeatured ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}
      >
        {r.isFeatured ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => (
      <span
        className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
          r.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}
      >
        {r.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

const ProductsPage = () => {
  const resource = useAdminResource(productApi);
  const [brands, setBrands] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);

  useEffect(() => {
    // Load brands
    brandApi
      .getAll({ isActive: true, limit: 100 })
      .then((result) => {
        const list = result?.items ?? result ?? [];
        setBrands(list);
      })
      .catch(() => {});

    // Load device types
    deviceTypeApi
      .getAll({ limit: 100 })
      .then((result) => {
        const list = result?.items ?? result ?? [];
        setDeviceTypes(list);
      })
      .catch(() => {});
  }, []);

  return (
    <AdminLivePage
      title="Refurbished Products"
      subtitle="Inventory, pricing, variants, and condition rules for the online shop"
      actionLabel="Add Product"
      columns={COLUMNS}
      searchKeys={['name', 'brand', 'type', 'category', 'tag']}
      searchPlaceholder="Search products by name, brand, type or category…"
      resource={resource}
      renderCustomForm={(formProps) => (
        <ProductForm
          {...formProps}
          brands={brands}
          deviceTypes={deviceTypes}
        />
      )}
    />
  );
};

export default ProductsPage;
