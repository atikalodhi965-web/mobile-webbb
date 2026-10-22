import { useEffect, useMemo, useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import { brandApi, productApi } from '../services/adminApi';

const PRODUCT_TYPES = [
  { value: 'phone',     label: 'Phone' },
  { value: 'tablet',    label: 'Tablet' },
  { value: 'laptop',    label: 'Laptop' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'other',     label: 'Other' },
];

const DEFAULT_CAPACITIES = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
const DEFAULT_CONDITIONS = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Refurbished'];
const DEFAULT_COLORS = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple', 'Pink', 'Graphite'];

const toOptions = (values) => {
  const seen = new Set();
  return values
    .filter(Boolean)
    .filter((value) => {
      const key = String(value).trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((value) => ({ value: String(value).trim(), label: String(value).trim() }));
};

const parseCsv = (value) => {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))];
};

const COLUMNS = [
  { key: '_id',           label: 'ID',      render: (r) => <span className="font-mono text-xs text-gray-400">{r._id?.slice(-6)}</span> },
  { key: 'image',         label: 'Image',  render: (r) => r.image ? <img src={r.image} alt={r.name} className="h-12 w-12 object-cover rounded" /> : null },
  { key: 'name',          label: 'Product' },
  { key: 'brand',         label: 'Brand' },
  { key: 'category',      label: 'Category' },
  { key: 'type',          label: 'Type',    render: (r) => <span className="capitalize">{r.type}</span> },
  {
    key: 'price',
    label: 'Price',
    render: (r) => (
      <span>
        <span className="font-bold text-[#b8370e]">£{r.price}</span>
        {r.originalPrice > 0 && (
          <span className="text-gray-400 line-through ml-1.5 text-xs">£{r.originalPrice}</span>
        )}
      </span>
    ),
  },
  { key: 'tag',           label: 'Tag' },
  { key: 'tagline',       label: 'Tagline' },
  { key: 'warranty',      label: 'Warranty' },
  { key: 'returns',       label: 'Returns' },
  { key: 'capacities',    label: 'Capacities', render: (r) => (r.capacities || []).join(', ') },
  { key: 'conditions',    label: 'Conditions', render: (r) => (r.conditions || []).join(', ') },
  { key: 'colors',        label: 'Colors', render: (r) => (r.colors || []).map(c => c.name).join(', ') },
  { key: 'conditionPrices', label: 'Cond. Prices', render: (r) => (r.conditionPrices || []).map(cp => `${cp.condition}: £${cp.price}`).join(' | ') },
  { key: 'stockByVariant', label: 'Variants', render: (r) => (r.stockByVariant || []).length },
  { key: 'description',   label: 'Description', render: (r) => r.description?.text?.substring(0,30) + '...' },
  { key: 'isActive',      label: 'Status' },
];

const FORM_FIELDS = [
  { name: 'name',          label: 'Product Name',   required: true,  placeholder: 'e.g. iPhone 15 128GB' },
  { name: 'slug',          label: 'Slug',             hint: 'Auto-generated if empty' },
  { name: 'category',      label: 'Category',         placeholder: 'Smartphone' },
  { name: 'type',          label: 'Type',             type: 'select', options: PRODUCT_TYPES },
  { name: 'price',         label: 'Sale Price (£)',   type: 'number', required: true, placeholder: '349', step: '0.01' },
  { name: 'originalPrice', label: 'Original Price (£)', type: 'number', placeholder: '599', step: '0.01' },
  { name: 'savings',       label: 'Savings (£)',      type: 'number', placeholder: '0', step: '0.01' },
  { name: 'tag',           label: 'Tag / Badge',      placeholder: 'Top Deal' },
  { name: 'tagline',       label: 'Tagline',          placeholder: 'Best value this week' },
  { name: 'warranty',      label: 'Warranty',          placeholder: '12 months' },
  { name: 'returns',       label: 'Returns Policy',   placeholder: '30 days' },
  { name: 'capacities',    label: 'Capacities', type: 'multi-select', placeholder: 'Enter a custom capacity', hint: 'Select one or more listed capacities, or add a custom value.' },
  { name: 'conditions',    label: 'Conditions', type: 'multi-select', placeholder: 'Enter a custom condition', hint: 'Select one or more listed conditions, or add a custom value.' },
  { name: 'colors',        label: 'Colors', type: 'multi-select', placeholder: 'Enter a custom color', hint: 'Select one or more listed colors, or add a custom value.' },
  { name: 'conditionPrices', label: 'Condition Prices (JSON)', placeholder: '[{"condition":"New","price":500}]', type: 'textarea', rows: 3 },
  { name: 'stockByVariant',  label: 'Stock By Variant (JSON)', placeholder: '[{"color":"Red","capacity":"128GB","condition":"New","sku":"IP13-128-RED","stock":10,"price":699}]', type: 'textarea', rows: 3 },
  { name: 'description',   label: 'Description Text', type: 'textarea', rows: 3, placeholder: 'Full product description...' },
  { name: 'descriptionBullets', label: 'Description Bullets (JSON)', placeholder: '[{"title":"Battery","text":"Long lasting"}]', type: 'textarea', rows: 3 },
  { name: 'isFeatured',   label: 'Featured',           type: 'checkbox', defaultValue: false },
  { name: 'isActive',     label: 'Active',             type: 'checkbox', defaultValue: true },
  { name: 'image',        label: 'Main Image',         type: 'file' },
  { name: 'images',       label: 'Additional Images', type: 'file', multiple: true, maxCount: 5 },
  { name: 'sortOrder',    label: 'Sort Order',        type: 'number', placeholder: '0' },
];

const createBuildPayload = (brandOptions) => (vals, editRow) => {
  const fd = new FormData();
  const { image, images, ...rest } = vals;
  const colorDetails = new Map((editRow?.colors || []).map((color) => [color.name?.toLowerCase(), color]));
  const selectedBrand = vals.brand === '__custom__' ? vals.brandCustom : vals.brand;
  const selectedBrandOption = brandOptions.find((option) => option.value === vals.brand);

  fd.append('brand', selectedBrand || '');
  fd.append('brandId', JSON.stringify(selectedBrandOption?.id || null));
  // Main image
  if (image instanceof File) {
    fd.append('image', image);
  }
  // Additional images (up to 5)
  if (images) {
    const files = Array.isArray(images) ? images : (images instanceof FileList ? Array.from(images) : []);
    files.slice(0, 5).forEach((file, idx) => {
      fd.append('images', file);
      if (idx === 0 && !(image instanceof File)) {
        fd.append('image', file);
      }
    });
  }
  // Append other fields, handling arrays
  Object.entries(rest).forEach(([k, v]) => {
    if (['brand', 'brandCustom'].includes(k)) {
      return;
    }
    if (k === 'capacities' || k === 'conditions') {
      fd.append(k, JSON.stringify(parseCsv(v)));
    } else if (k === 'colors') {
      const colors = parseCsv(v).map((name) => ({
        ...(colorDetails.get(name.toLowerCase()) || {}),
        name,
      }));
      fd.append(k, JSON.stringify(colors));
    } else if (Array.isArray(v)) {
      v.forEach((item) => fd.append(k, item));
    } else {
      fd.append(k, v === true ? 'true' : v === false ? 'false' : v ?? '');
    }
  });
  return fd;
};

const ProductsPage = () => {
  const resource = useAdminResource(productApi);
  const [brands, setBrands] = useState([]);
  const [brandError, setBrandError] = useState('');

  useEffect(() => {
    brandApi.getAll({ isActive: true, limit: 100 })
      .then((result) => {
        const list = result?.items ?? result ?? [];
        setBrands(list);
      })
      .catch((error) => {
        setBrandError(error.message || 'Unable to load brands from the brand table.');
      });
  }, []);

  const brandOptions = useMemo(
    () => brands.map((brand) => ({ value: brand.name, label: brand.name, id: brand._id })),
    [brands]
  );
  const buildPayload = useMemo(() => createBuildPayload(brandOptions), [brandOptions]);
  const brandField = useMemo(() => ({
    name: 'brand',
    label: 'Brand',
    type: 'select',
    options: brandOptions,
    allowCustom: true,
    customName: 'brandCustom',
    customPlaceholder: 'Enter a new brand name',
    hint: brandError || 'Select a brand or choose “Add a new value…” to enter one manually.',
    formatValue: (value) => (
      value && !brandOptions.some((option) => option.value === value) ? '__custom__' : value
    ),
  }), [brandError, brandOptions]);
  const formFields = useMemo(() => {
    const capacities = resource.items.flatMap((product) => product.capacities || []);
    const conditions = resource.items.flatMap((product) => product.conditions || []);
    const colors = resource.items.flatMap((product) => (product.colors || []).map((color) => color.name));
    return [
      FORM_FIELDS[0],
      FORM_FIELDS[1],
      brandField,
      ...FORM_FIELDS.slice(2).map((field) => {
        if (field.name === 'capacities') {
          return {
            ...field,
            options: toOptions([...DEFAULT_CAPACITIES, ...capacities]),
            formatValue: (value) => value || [],
          };
        }
        if (field.name === 'conditions') {
          return {
            ...field,
            options: toOptions([...DEFAULT_CONDITIONS, ...conditions]),
            formatValue: (value) => value || [],
          };
        }
        if (field.name === 'colors') {
          return {
            ...field,
            options: toOptions([...DEFAULT_COLORS, ...colors]),
            formatValue: (value) => Array.isArray(value) ? value.map((color) => color.name) : [],
          };
        }
        return field;
      }),
    ];
  }, [brandField, resource.items]);

  return (
    <AdminLivePage
      title="Refurbished Products"
      subtitle="Inventory, pricing and tags for the online shop"
      actionLabel="Add Product"
      columns={COLUMNS}
      searchKeys={['name', 'brand', 'type', 'tag']}
      searchPlaceholder="Search products…"
      resource={resource}
      formFields={formFields}
      buildPayload={buildPayload}
    />
  );
};

export default ProductsPage;
