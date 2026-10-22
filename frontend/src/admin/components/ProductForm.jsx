import React, { useState, useEffect, useMemo } from 'react';
import {
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Upload,
  Image as ImageIcon,
  Layers,
  Tag,
  DollarSign,
  FileText,
  Shield,
  Palette,
  HardDrive,
  Cpu,
  X,
} from 'lucide-react';

/* ─── Static Preset Definitions ─── */
const PRODUCT_TYPES = [
  { value: 'phone', label: 'Phone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'other', label: 'Other' },
];

// STRICT REQUIREMENT: Only 2 options for condition: New or Refurbished
const CONDITION_OPTIONS = ['Refurbished', 'New'];

const CATEGORY_PRESETS = [
  'Smartphones',
  'iPhones',
  'Samsung Galaxy',
  'Google Pixel',
  'Tablets & iPads',
  'Laptops & MacBooks',
  'Smartwatches',
  'Accessories',
];

const TAG_PRESETS = [
  { value: '', label: 'None' },
  { value: 'Top Deal', label: 'Top Deal' },
  { value: 'Save £190', label: 'Save £190' },
  { value: 'Save £250', label: 'Save £250' },
  { value: 'Best Seller', label: 'Best Seller' },
  { value: 'New Arrival', label: 'New Arrival' },
  { value: 'Featured', label: 'Featured' },
  { value: 'Limited Stock', label: 'Limited Stock' },
  { value: 'Cheeky Refurb', label: 'Cheeky Refurb' },
  { value: 'Special Offer', label: 'Special Offer' },
];

const TAGLINE_PRESETS = [
  { value: '', label: 'None' },
  { value: 'Cheeky Refurb', label: 'Cheeky Refurb' },
  { value: 'Best value this week', label: 'Best value this week' },
  { value: 'Certified Pre-Owned', label: 'Certified Pre-Owned' },
  { value: 'As Good As New', label: 'As Good As New' },
  { value: 'Customer Favorite', label: 'Customer Favorite' },
  { value: 'Premium Grade Device', label: 'Premium Grade Device' },
];

const WARRANTY_PRESETS = [
  '24-Month SAMZ Warranty with 36-Month Battery Guarantee',
  '24-Month SAMZ Warranty',
  '12-Month SAMZ Warranty',
  '6-Month SAMZ Warranty',
  'Lifetime Limited Warranty',
];

const RETURNS_PRESETS = [
  '14-Day Hassle-Free Returns (Online & In-Store)',
  '30-Day Money-Back Guarantee',
  '14-Day Online Returns Only',
  'Standard Store Returns Policy',
];

const CAPACITY_PRESETS = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];

const COLOR_PRESETS = [
  { name: 'Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-zinc-900 via-gray-900 to-black' },
  { name: 'White', hex: '#F5F5F7', phoneBg: '#E2E8F0', screenGradient: 'from-slate-700 via-zinc-800 to-slate-900' },
  { name: 'Midnight', hex: '#1C1C1E', phoneBg: '#0F172A', screenGradient: 'from-slate-900 via-gray-900 to-zinc-950' },
  { name: 'Starlight', hex: '#F5F5F7', phoneBg: '#E2E8F0', screenGradient: 'from-amber-700 via-orange-800 to-amber-950' },
  { name: 'Space Gray', hex: '#4B4846', phoneBg: '#374151', screenGradient: 'from-gray-900 via-zinc-900 to-slate-950' },
  { name: 'Silver', hex: '#E2E4E1', phoneBg: '#CBD5E1', screenGradient: 'from-slate-600 via-gray-700 to-zinc-900' },
  { name: 'Gold', hex: '#F9E5C9', phoneBg: '#FEF08A', screenGradient: 'from-yellow-800 via-amber-800 to-amber-950' },
  { name: 'Blue', hex: '#2D5C7F', phoneBg: '#255273', screenGradient: 'from-blue-900 via-teal-800 to-indigo-950' },
  { name: 'Deep Purple', hex: '#483E4C', phoneBg: '#581C87', screenGradient: 'from-purple-950 via-indigo-950 to-slate-950' },
  { name: 'Natural Titanium', hex: '#9F9586', phoneBg: '#78716C', screenGradient: 'from-stone-800 via-neutral-900 to-zinc-950' },
  { name: 'Red', hex: '#D00000', phoneBg: '#DC2626', screenGradient: 'from-red-900 via-rose-950 to-slate-950' },
  { name: 'Green', hex: '#C2DFD3', phoneBg: '#10B981', screenGradient: 'from-emerald-800 via-teal-800 to-slate-900' },
  { name: 'Pink', hex: '#F9D0DC', phoneBg: '#F472B6', screenGradient: 'from-rose-800 via-pink-900 to-purple-950' },
  { name: 'Yellow', hex: '#F3E5AB', phoneBg: '#EAB308', screenGradient: 'from-yellow-700 via-amber-800 to-orange-950' },
];

const FEATURE_PRESETS = [
  '5G Enabled',
  'Super Retina XDR OLED',
  'Dynamic Island',
  'Ceramic Shield',
  'MagSafe Wireless Charging',
  'Face ID',
  'Touch ID',
  'Water & Dust Resistant (IP68)',
  'A15 Bionic Chip',
  'A16 Bionic Chip',
  'A18 Chip',
  '48MP Main Camera',
  'USB-C Fast Charging',
  'All-Day Battery Life',
];

const ProductForm = ({
  editRow,
  closeForm,
  resource,
  saving,
  formError,
  setFormError,
  brands = [],
  deviceTypes = [],
}) => {
  const isEdit = !!editRow;

  /* ─── Form State ─── */
  const [name, setName] = useState(editRow?.name || '');
  const [slug, setSlug] = useState(editRow?.slug || '');
  const [type, setType] = useState(editRow?.type || 'phone');

  // Brand dropdown + custom
  const [selectedBrand, setSelectedBrand] = useState(
    editRow?.brandId?._id || editRow?.brandId || (editRow?.brand ? '__custom__' : '')
  );
  const [customBrand, setCustomBrand] = useState(
    editRow?.brand && !brands.some((b) => b._id === editRow?.brandId || b.name === editRow?.brand)
      ? editRow.brand
      : ''
  );

  // Device Type dropdown
  const [selectedDeviceType, setSelectedDeviceType] = useState(
    editRow?.deviceTypeId?._id || editRow?.deviceTypeId || ''
  );

  // Category dropdown + custom
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (!editRow?.category) return CATEGORY_PRESETS[0];
    return CATEGORY_PRESETS.includes(editRow.category) ? editRow.category : '__custom__';
  });
  const [customCategory, setCustomCategory] = useState(
    editRow?.category && !CATEGORY_PRESETS.includes(editRow.category) ? editRow.category : ''
  );

  // Tag / Badge dropdown + custom
  const [selectedTag, setSelectedTag] = useState(() => {
    if (!editRow?.tag) return '';
    return TAG_PRESETS.some((t) => t.value === editRow.tag) ? editRow.tag : '__custom__';
  });
  const [customTag, setCustomTag] = useState(
    editRow?.tag && !TAG_PRESETS.some((t) => t.value === editRow.tag) ? editRow.tag : ''
  );

  // Tagline dropdown + custom
  const [selectedTagline, setSelectedTagline] = useState(() => {
    if (!editRow?.tagline) return 'Cheeky Refurb';
    return TAGLINE_PRESETS.some((t) => t.value === editRow.tagline) ? editRow.tagline : '__custom__';
  });
  const [customTagline, setCustomTagline] = useState(
    editRow?.tagline && !TAGLINE_PRESETS.some((t) => t.value === editRow.tagline) ? editRow.tagline : ''
  );

  // Pricing
  const [price, setPrice] = useState(editRow?.price !== undefined ? editRow.price : '');
  const [originalPrice, setOriginalPrice] = useState(editRow?.originalPrice !== undefined ? editRow.originalPrice : '');
  const [savings, setSavings] = useState(editRow?.savings !== undefined ? editRow.savings : '');

  // CONDITIONS (Strictly ONLY 'Refurbished' and 'New')
  const [selectedConditions, setSelectedConditions] = useState(() => {
    if (editRow?.conditions && Array.isArray(editRow.conditions) && editRow.conditions.length > 0) {
      // Filter out any legacy conditions that are not New or Refurbished
      const valid = editRow.conditions.filter((c) => CONDITION_OPTIONS.includes(c));
      return valid.length > 0 ? valid : ['Refurbished'];
    }
    return ['Refurbished'];
  });

  // Condition Prices
  const [refurbishedPrice, setRefurbishedPrice] = useState(() => {
    const cp = editRow?.conditionPrices?.find((c) => c.condition === 'Refurbished');
    return cp ? cp.price : editRow?.price || '';
  });
  const [newPrice, setNewPrice] = useState(() => {
    const cp = editRow?.conditionPrices?.find((c) => c.condition === 'New');
    return cp ? cp.price : editRow?.originalPrice || '';
  });

  // Capacities
  const [capacities, setCapacities] = useState(() => editRow?.capacities || ['128GB', '256GB']);
  const [customCapacityInput, setCustomCapacityInput] = useState('');

  // Colors
  const [colors, setColors] = useState(() => {
    if (editRow?.colors && Array.isArray(editRow.colors) && editRow.colors.length > 0) {
      return editRow.colors;
    }
    return [COLOR_PRESETS[0], COLOR_PRESETS[1]];
  });
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563EB');

  // Variant Stock
  const [variants, setVariants] = useState(() => {
    if (editRow?.stockByVariant && Array.isArray(editRow.stockByVariant)) {
      return editRow.stockByVariant;
    }
    return [];
  });

  // Description & Bullets
  const [descriptionText, setDescriptionText] = useState(
    typeof editRow?.description === 'string'
      ? editRow.description
      : editRow?.description?.text || ''
  );
  const [bullets, setBullets] = useState(() => {
    if (Array.isArray(editRow?.description?.bullets)) {
      return editRow.description.bullets;
    }
    return [
      { title: 'SAMZ Certified:', text: 'Fully tested with 70+ point diagnostic check.' },
      { title: 'Battery Health:', text: 'Guaranteed 85%+ maximum battery capacity.' },
    ];
  });
  const [newBulletTitle, setNewBulletTitle] = useState('');
  const [newBulletText, setNewBulletText] = useState('');

  // Features
  const [features, setFeatures] = useState(() => editRow?.features || ['5G Enabled', 'All-Day Battery Life']);
  const [customFeatureInput, setCustomFeatureInput] = useState('');

  // Warranty & Returns
  const [selectedWarranty, setSelectedWarranty] = useState(() => {
    if (!editRow?.warranty) return WARRANTY_PRESETS[0];
    return WARRANTY_PRESETS.includes(editRow.warranty) ? editRow.warranty : '__custom__';
  });
  const [customWarranty, setCustomWarranty] = useState(
    editRow?.warranty && !WARRANTY_PRESETS.includes(editRow.warranty) ? editRow.warranty : ''
  );

  const [selectedReturns, setSelectedReturns] = useState(() => {
    if (!editRow?.returns) return RETURNS_PRESETS[0];
    return RETURNS_PRESETS.includes(editRow.returns) ? editRow.returns : '__custom__';
  });
  const [customReturns, setCustomReturns] = useState(
    editRow?.returns && !RETURNS_PRESETS.includes(editRow.returns) ? editRow.returns : ''
  );

  // Status & Sorting
  const [isFeatured, setIsFeatured] = useState(editRow?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(editRow?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(editRow?.sortOrder ?? 0);

  // Media
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editRow?.image || null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState(editRow?.images || []);

  /* ─── Auto calculate savings ─── */
  const handlePriceChange = (val) => {
    setPrice(val);
    if (!refurbishedPrice) setRefurbishedPrice(val);
    const p = parseFloat(val);
    const orig = parseFloat(originalPrice);
    if (!isNaN(p) && !isNaN(orig) && orig > p) {
      setSavings(Math.round((orig - p) * 100) / 100);
    }
  };

  const handleOriginalPriceChange = (val) => {
    setOriginalPrice(val);
    if (!newPrice) setNewPrice(val);
    const orig = parseFloat(val);
    const p = parseFloat(price);
    if (!isNaN(p) && !isNaN(orig) && orig > p) {
      setSavings(Math.round((orig - p) * 100) / 100);
    }
  };

  /* ─── Condition Toggles (Only New & Refurbished) ─── */
  const toggleCondition = (cond) => {
    if (selectedConditions.includes(cond)) {
      if (selectedConditions.length === 1) {
        // Keep at least one condition active
        return;
      }
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  /* ─── Capacity helpers ─── */
  const toggleCapacity = (cap) => {
    if (capacities.includes(cap)) {
      setCapacities(capacities.filter((c) => c !== cap));
    } else {
      setCapacities([...capacities, cap]);
    }
  };

  const addCustomCapacity = () => {
    const val = customCapacityInput.trim().toUpperCase();
    if (val && !capacities.includes(val)) {
      setCapacities([...capacities, val]);
      setCustomCapacityInput('');
    }
  };

  /* ─── Color helpers ─── */
  const toggleColorPreset = (preset) => {
    const exists = colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
    if (exists) {
      setColors(colors.filter((c) => c.name.toLowerCase() !== preset.name.toLowerCase()));
    } else {
      setColors([...colors, preset]);
    }
  };

  const addCustomColor = () => {
    const trimmed = customColorName.trim();
    if (!trimmed) return;
    if (colors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return;

    setColors([
      ...colors,
      {
        name: trimmed,
        hex: customColorHex,
        phoneBg: customColorHex,
        screenGradient: 'from-slate-900 via-gray-900 to-black',
      },
    ]);
    setCustomColorName('');
  };

  const removeColor = (colorName) => {
    setColors(colors.filter((c) => c.name !== colorName));
  };

  /* ─── Variant Generator ─── */
  const generateVariants = () => {
    if (!colors.length || !capacities.length || !selectedConditions.length) {
      alert('Please select at least one Color, Capacity, and Condition first.');
      return;
    }

    const brandPrefix = (name || 'PRD')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);

    const generated = [];
    colors.forEach((col) => {
      capacities.forEach((cap) => {
        selectedConditions.forEach((cond) => {
          // Check if variant already exists
          const existing = variants.find(
            (v) => v.color === col.name && v.capacity === cap && v.condition === cond
          );

          if (existing) {
            generated.push(existing);
          } else {
            const condPrice =
              cond === 'Refurbished'
                ? parseFloat(refurbishedPrice) || parseFloat(price) || 0
                : parseFloat(newPrice) || parseFloat(originalPrice) || parseFloat(price) || 0;

            const sku = `${brandPrefix}-${cap}-${cond === 'Refurbished' ? 'REF' : 'NEW'}-${col.name.slice(0, 3).toUpperCase()}`;

            generated.push({
              color: col.name,
              capacity: cap,
              condition: cond,
              sku,
              stock: 10,
              price: condPrice,
            });
          }
        });
      });
    });

    setVariants(generated);
  };

  const addVariantRow = () => {
    const firstColor = colors[0]?.name || 'Black';
    const firstCap = capacities[0] || '128GB';
    const firstCond = selectedConditions[0] || 'Refurbished';
    const defaultP = firstCond === 'Refurbished' ? (parseFloat(refurbishedPrice) || parseFloat(price) || 0) : (parseFloat(newPrice) || 0);

    setVariants([
      ...variants,
      {
        color: firstColor,
        capacity: firstCap,
        condition: firstCond,
        sku: '',
        stock: 5,
        price: defaultP,
      },
    ]);
  };

  const updateVariantRow = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariantRow = (index) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  /* ─── Bullets helpers ─── */
  const addBullet = () => {
    if (!newBulletTitle.trim() && !newBulletText.trim()) return;
    setBullets([
      ...bullets,
      { title: newBulletTitle.trim(), text: newBulletText.trim() },
    ]);
    setNewBulletTitle('');
    setNewBulletText('');
  };

  const removeBullet = (index) => {
    setBullets(bullets.filter((_, idx) => idx !== index));
  };

  /* ─── Features helpers ─── */
  const toggleFeaturePreset = (feat) => {
    if (features.includes(feat)) {
      setFeatures(features.filter((f) => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const addCustomFeature = () => {
    const trimmed = customFeatureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
      setCustomFeatureInput('');
    }
  };

  const removeFeature = (feat) => {
    setFeatures(features.filter((f) => f !== feat));
  };

  /* ─── Image Upload Handlers ─── */
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files].slice(0, 8));
    }
  };

  const removeGalleryFile = (idx) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== idx));
  };

  const removeExistingGallery = (url) => {
    setExistingGallery(existingGallery.filter((item) => item !== url));
  };

  /* ─── Submit Form ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setFormError('A valid sale price (£) is required.');
      return;
    }
    if (!selectedConditions.length) {
      setFormError('Please select at least one condition (New or Refurbished).');
      return;
    }

    // Resolve Brand
    let brandName = '';
    let brandId = null;
    if (selectedBrand === '__custom__') {
      brandName = customBrand.trim();
    } else if (selectedBrand) {
      const found = brands.find((b) => b._id === selectedBrand);
      if (found) {
        brandName = found.name;
        brandId = found._id;
      }
    }

    // Resolve Category
    const categoryName = selectedCategory === '__custom__' ? customCategory.trim() : selectedCategory;

    // Resolve Tag / Tagline
    const resolvedTag = selectedTag === '__custom__' ? customTag.trim() : selectedTag;
    const resolvedTagline = selectedTagline === '__custom__' ? customTagline.trim() : selectedTagline;

    // Resolve Warranty / Returns
    const resolvedWarranty = selectedWarranty === '__custom__' ? customWarranty.trim() : selectedWarranty;
    const resolvedReturns = selectedReturns === '__custom__' ? customReturns.trim() : selectedReturns;

    // Build conditionPrices array
    const conditionPrices = [];
    if (selectedConditions.includes('Refurbished')) {
      const p = parseFloat(refurbishedPrice) || parseFloat(price) || 0;
      conditionPrices.push({ condition: 'Refurbished', price: p });
    }
    if (selectedConditions.includes('New')) {
      const p = parseFloat(newPrice) || parseFloat(originalPrice) || parseFloat(price) || 0;
      conditionPrices.push({ condition: 'New', price: p });
    }

    // Build FormData
    const fd = new FormData();
    fd.append('name', name.trim());
    if (slug.trim()) fd.append('slug', slug.trim());
    fd.append('type', type);
    fd.append('brand', brandName);
    if (brandId) fd.append('brandId', brandId);
    if (selectedDeviceType) fd.append('deviceTypeId', selectedDeviceType);
    if (categoryName) fd.append('category', categoryName);
    if (resolvedTag) fd.append('tag', resolvedTag);
    if (resolvedTagline) fd.append('tagline', resolvedTagline);

    fd.append('price', String(parseFloat(price) || 0));
    fd.append('originalPrice', String(parseFloat(originalPrice) || 0));
    fd.append('savings', String(parseFloat(savings) || 0));

    fd.append('conditions', JSON.stringify(selectedConditions));
    fd.append('conditionPrices', JSON.stringify(conditionPrices));
    fd.append('capacities', JSON.stringify(capacities));
    fd.append('colors', JSON.stringify(colors));
    fd.append('stockByVariant', JSON.stringify(variants));

    fd.append(
      'description',
      JSON.stringify({
        text: descriptionText,
        bullets: bullets.filter((b) => b.title || b.text),
      })
    );

    fd.append('features', JSON.stringify(features));
    fd.append('warranty', resolvedWarranty);
    fd.append('returns', resolvedReturns);
    fd.append('isFeatured', isFeatured ? 'true' : 'false');
    fd.append('isActive', isActive ? 'true' : 'false');
    fd.append('sortOrder', String(parseInt(sortOrder, 10) || 0));

    // Images
    if (imageFile instanceof File) {
      fd.append('image', imageFile);
    } else if (imagePreview) {
      fd.append('image', imagePreview);
    }

    // New uploaded gallery files
    galleryFiles.forEach((file) => {
      fd.append('images', file);
    });

    // If no new files uploaded but existing gallery images exist
    if (galleryFiles.length === 0 && existingGallery.length > 0) {
      fd.append('images', JSON.stringify(existingGallery));
    }

    try {
      if (isEdit) {
        await resource.update(editRow._id, fd);
      } else {
        await resource.create(fd);
      }
      closeForm();
      resource.fetchAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save product. Please check the values and try again.');
    }
  };

  return (
    <div className="mb-8 bg-white border border-[#b8370e]/20 rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* ─── Header ─── */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#b8370e]/5 via-amber-500/5 to-transparent border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#b8370e] text-white flex items-center justify-center font-black shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F1B2E]">
              {isEdit ? `Edit Product: ${editRow?.name}` : 'Add New Refurbished Product'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Configure inventory, variants, condition pricing, and specifications
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeForm}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Error Alert */}
        {formError && (
          <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3.5 text-rose-700 text-sm font-medium animate-fadeIn">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Submission Error</p>
              <p className="text-xs mt-0.5">{formError}</p>
            </div>
          </div>
        )}

        {/* ─── Section 1: Basic Information ─── */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#b8370e]" /> 1. Product Identity & Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. iPhone 15 Pro 128GB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Slug (URL Key)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="auto-generated-if-empty"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Device Type Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              >
                {PRODUCT_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Brand <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              >
                <option value="">— Select Brand —</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
                <option value="__custom__">+ Enter custom brand…</option>
              </select>
              {selectedBrand === '__custom__' && (
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                />
              )}
            </div>

            {/* Device Type Link Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Catalog Device Model / Type
              </label>
              <select
                value={selectedDeviceType}
                onChange={(e) => setSelectedDeviceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              >
                <option value="">— Link to Device Type (Optional) —</option>
                {deviceTypes.map((dt) => (
                  <option key={dt._id} value={dt._id}>
                    {dt.title || dt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Shop Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Custom Category…</option>
              </select>
              {selectedCategory === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              )}
            </div>

            {/* Badge / Tag Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Badge / Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              >
                {TAG_PRESETS.map((t) => (
                  <option key={t.label} value={t.value}>
                    {t.label}
                  </option>
                ))}
                <option value="__custom__">+ Custom Tag…</option>
              </select>
              {selectedTag === '__custom__' && (
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="e.g. Special Deal"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              )}
            </div>

            {/* Tagline Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Tagline
              </label>
              <select
                value={selectedTagline}
                onChange={(e) => setSelectedTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
              >
                {TAGLINE_PRESETS.map((t) => (
                  <option key={t.label} value={t.value}>
                    {t.label}
                  </option>
                ))}
                <option value="__custom__">+ Custom Tagline…</option>
              </select>
              {selectedTagline === '__custom__' && (
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Premium Grade Refurb"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* ─── Section 2: Pricing & Condition Rules (STRICTLY New or Refurbished) ─── */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-[#b8370e]" /> 2. Pricing & Conditions
          </h3>

          <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-4 sm:p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-[#1F1B2E] uppercase">
                  Available Conditions <span className="text-rose-500">*</span>
                </span>
                <p className="text-xs text-gray-500">
                  Select which conditions are stocked for this product (Only <strong>New</strong> or <strong>Refurbished</strong>).
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {CONDITION_OPTIONS.map((cond) => {
                  const isChecked = selectedConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isChecked
                          ? 'bg-[#b8370e] text-white border-[#b8370e] shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition Specific Pricing Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-200/50">
              {selectedConditions.includes('Refurbished') && (
                <div>
                  <label className="block text-xs font-bold text-[#1F1B2E] mb-1">
                    Refurbished Sale Price (£) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">£</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={refurbishedPrice}
                      onChange={(e) => {
                        setRefurbishedPrice(e.target.value);
                        if (!price) setPrice(e.target.value);
                      }}
                      placeholder="e.g. 299"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#b8370e] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                    />
                  </div>
                </div>
              )}

              {selectedConditions.includes('New') && (
                <div>
                  <label className="block text-xs font-bold text-[#1F1B2E] mb-1">
                    Brand New Price (£)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">£</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPrice}
                      onChange={(e) => {
                        setNewPrice(e.target.value);
                        if (!originalPrice) setOriginalPrice(e.target.value);
                      }}
                      placeholder="e.g. 499"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Standard Price, Original Price & Savings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Base Display Price (£) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">£</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="239"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#b8370e] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-400">Starting price displayed on listing cards</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Original RRP (£)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">£</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => handleOriginalPriceChange(e.target.value)}
                  placeholder="429"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 line-through focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-400">Shown crossed-out for discount visibility</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Customer Savings (£)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">£</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="190"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-400">Auto-calculated: RRP − Display Price</p>
            </div>
          </div>
        </div>

        {/* ─── Section 3: Capacities & Color Variants ─── */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-[#b8370e]" /> 3. Storage Capacities & Colors
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Capacities */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Storage Capacities
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {CAPACITY_PRESETS.map((cap) => {
                  const isSelected = capacities.includes(cap);
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => toggleCapacity(cap)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-[#1F1B2E] text-white border-[#1F1B2E]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {cap}
                    </button>
                  );
                })}
              </div>

              {/* Custom capacity input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCapacityInput}
                  onChange={(e) => setCustomCapacityInput(e.target.value)}
                  placeholder="Custom storage (e.g. 16GB)"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomCapacity}
                  className="px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Selected Capacities Pills */}
              <div className="mt-3 flex flex-wrap gap-1">
                {capacities.map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/70 text-amber-900 border border-amber-200"
                  >
                    {cap}
                    <button
                      type="button"
                      onClick={() => toggleCapacity(cap)}
                      className="text-amber-700 hover:text-rose-600 font-black ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Color Options
              </label>

              {/* Preset Color Swatches */}
              <div className="flex flex-wrap gap-1.5 mb-3 max-h-32 overflow-y-auto p-0.5">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => toggleColorPreset(preset)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1F1B2E] text-white border-[#1F1B2E]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0 shadow-2xs"
                        style={{ backgroundColor: preset.hex }}
                      />
                      {preset.name}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Creator */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  placeholder="Custom color name"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none"
                />
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-white p-0.5"
                  title="Pick color hex"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Selected Colors list */}
              <div className="mt-3 flex flex-wrap gap-1">
                {colors.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200 shadow-2xs"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: c.hex || '#000' }}
                    />
                    {c.name}
                    <button
                      type="button"
                      onClick={() => removeColor(c.name)}
                      className="text-gray-400 hover:text-rose-600 font-black ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 4: Stock by Variant Manager (NO JSON!) ─── */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#b8370e]" /> 4. Stock by Variant (Interactive Table)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage precise inventory counts, SKUs, and pricing for each variation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generateVariants}
                className="inline-flex items-center gap-1.5 bg-[#b8370e]/10 hover:bg-[#b8370e]/20 text-[#b8370e] font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Generate Variants
              </button>

              <button
                type="button"
                onClick={addVariantRow}
                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>
          </div>

          {variants.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50/50">
              <Cpu className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-600">No stock variants created yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Click <strong>"Auto-Generate Variants"</strong> to automatically generate SKU, pricing, and stock combinations from your selected colors, capacities, and conditions.
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2.5">Color</th>
                      <th className="px-3 py-2.5">Capacity</th>
                      <th className="px-3 py-2.5">Condition</th>
                      <th className="px-3 py-2.5">SKU</th>
                      <th className="px-3 py-2.5 w-24">Stock</th>
                      <th className="px-3 py-2.5 w-28">Price (£)</th>
                      <th className="px-2 py-2.5 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        {/* Color Dropdown */}
                        <td className="px-3 py-2">
                          <select
                            value={v.color}
                            onChange={(e) => updateVariantRow(idx, 'color', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white font-medium"
                          >
                            {colors.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                            {!colors.some((c) => c.name === v.color) && (
                              <option value={v.color}>{v.color}</option>
                            )}
                          </select>
                        </td>

                        {/* Capacity Dropdown */}
                        <td className="px-3 py-2">
                          <select
                            value={v.capacity}
                            onChange={(e) => updateVariantRow(idx, 'capacity', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white font-medium"
                          >
                            {capacities.map((cap) => (
                              <option key={cap} value={cap}>
                                {cap}
                              </option>
                            ))}
                            {!capacities.includes(v.capacity) && (
                              <option value={v.capacity}>{v.capacity}</option>
                            )}
                          </select>
                        </td>

                        {/* Condition Dropdown (ONLY New or Refurbished) */}
                        <td className="px-3 py-2">
                          <select
                            value={v.condition}
                            onChange={(e) => updateVariantRow(idx, 'condition', e.target.value)}
                            className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white font-bold text-[#b8370e]"
                          >
                            {CONDITION_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* SKU */}
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={v.sku || ''}
                            onChange={(e) => updateVariantRow(idx, 'sku', e.target.value)}
                            placeholder="SKU"
                            className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs font-mono"
                          />
                        </td>

                        {/* Stock */}
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            value={v.stock ?? 0}
                            onChange={(e) => updateVariantRow(idx, 'stock', parseInt(e.target.value, 10) || 0)}
                            className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs font-bold text-center"
                          />
                        </td>

                        {/* Price */}
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={v.price ?? 0}
                            onChange={(e) => updateVariantRow(idx, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 rounded-lg border border-gray-200 text-xs font-bold text-emerald-700"
                          />
                        </td>

                        {/* Remove */}
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeVariantRow(idx)}
                            className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Delete variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer count */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Total Variants: <strong>{variants.length}</strong></span>
                <span>
                  Total Inventory Stock:{' '}
                  <strong className="text-emerald-700">
                    {variants.reduce((acc, curr) => acc + (parseInt(curr.stock, 10) || 0), 0)} units
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Section 5: Description & Highlights ─── */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#b8370e]" /> 5. Product Description & Highlights
          </h3>

          <div className="space-y-4">
            {/* Description Text */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Main Product Description
              </label>
              <textarea
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                rows={3}
                placeholder="A refurbished iPhone 15 offers outstanding performance, dual-camera innovation, and exceptional value..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 resize-none"
              />
            </div>

            {/* Bullets / Highlights Builder (No raw JSON!) */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Product Key Highlights / Diagnostic Checkpoints
              </label>

              {/* Existing Bullets */}
              <div className="space-y-2 mb-3">
                {bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#b8370e] shrink-0" />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <strong className="text-[#1F1B2E]">{b.title}</strong>
                      <span className="sm:col-span-2 text-gray-600">{b.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBullet(idx)}
                      className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Bullet Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newBulletTitle}
                  onChange={(e) => setNewBulletTitle(e.target.value)}
                  placeholder="Highlight Title (e.g. Battery Life:)"
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none"
                />
                <input
                  type="text"
                  value={newBulletText}
                  onChange={(e) => setNewBulletText(e.target.value)}
                  placeholder="Detail text (e.g. 100% capacity tested)"
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addBullet}
                  className="inline-flex items-center justify-center gap-1 bg-[#1F1B2E] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Highlight
                </button>
              </div>
            </div>

            {/* Features Tags */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Quick Feature Badges
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {FEATURE_PRESETS.map((f) => {
                  const isSelected = features.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeaturePreset(f)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>

              {/* Custom Feature Input */}
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={customFeatureInput}
                  onChange={(e) => setCustomFeatureInput(e.target.value)}
                  placeholder="Add custom feature"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomFeature}
                  className="px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 6: Warranty, Returns & Meta Settings ─── */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#b8370e]" /> 6. Warranty, Returns & Publish Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Warranty Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Warranty Coverage
              </label>
              <select
                value={selectedWarranty}
                onChange={(e) => setSelectedWarranty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
              >
                {WARRANTY_PRESETS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
                <option value="__custom__">+ Custom Warranty…</option>
              </select>
              {selectedWarranty === '__custom__' && (
                <input
                  type="text"
                  value={customWarranty}
                  onChange={(e) => setCustomWarranty(e.target.value)}
                  placeholder="Enter warranty terms"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              )}
            </div>

            {/* Returns Policy Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Returns Policy
              </label>
              <select
                value={selectedReturns}
                onChange={(e) => setSelectedReturns(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
              >
                {RETURNS_PRESETS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="__custom__">+ Custom Returns Policy…</option>
              </select>
              {selectedReturns === '__custom__' && (
                <input
                  type="text"
                  value={customReturns}
                  onChange={(e) => setCustomReturns(e.target.value)}
                  placeholder="Enter returns terms"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              )}
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase">
                Catalog Display Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-[#1F1B2E] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-gray-400">Lower numbers appear first in catalog</p>
            </div>
          </div>

          {/* Visibility Checkboxes */}
          <div className="mt-4 flex flex-wrap items-center gap-6 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-[#b8370e] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-[#1F1B2E] uppercase">
                Active / Published in Shop
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#b8370e] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-[#1F1B2E] uppercase">
                Featured Product (Homepage & Top Deals)
              </span>
            </label>
          </div>
        </div>

        {/* ─── Section 7: Media / Image Uploads ─── */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#b8370e]" /> 7. Product Images
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Main Featured Image
              </label>

              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 mb-3 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-full p-1 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#b8370e]" />
                {imagePreview ? 'Replace Main Image' : 'Select Main Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Images */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Gallery Photos (Up to 8)
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {/* Existing uploaded images */}
                {existingGallery.map((url, i) => (
                  <div key={`exist-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingGallery(url)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Newly selected files */}
                {galleryFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-indigo-200 bg-indigo-50 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New upload ${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryFile(i)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#b8370e]" />
                Add Gallery Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ─── Form Actions Footer ─── */}
        <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={closeForm}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#b8370e] hover:bg-[#962d0b] disabled:opacity-60 text-white font-extrabold text-sm px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Product…
              </>
            ) : isEdit ? (
              'Update Product'
            ) : (
              'Save & Publish Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
