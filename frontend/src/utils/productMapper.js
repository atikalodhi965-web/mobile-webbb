import { getMediaUrl } from '../services/mediaService';

export const mapProduct = (p) => {
  if (!p) return null;
  const colors = Array.isArray(p.colors) ? p.colors : [];
  const capacities = Array.isArray(p.capacities) ? p.capacities : [];
  const conditions = Array.isArray(p.conditions) ? p.conditions : [];
  const conditionPrices = Array.isArray(p.conditionPrices) && p.conditionPrices.length
    ? p.conditionPrices
    : conditions.map((condition) => ({ condition, price: p.price ?? 0 }));

  return {
    ...p,
    id: p.slug || p._id || p.id,
    mongoId: p._id,
    name: p.name,
    brand: typeof p.brand === 'string' ? p.brand : p.brand?.name || '',
    category: p.category || p.brand || '',
    tagline: p.tagline || '',
    tag: p.tag || null,
    price: p.price ?? 0,
    originalPrice: p.originalPrice || 0,
    savings: p.savings || 0,
    image: getMediaUrl(p.image || p.images?.[0], ''),
    colors,
    capacities,
    conditions,
    conditionPrices,
    description: p.description || { text: '', bullets: [] },
    warranty: p.warranty || '',
    returns: p.returns || '',
    slug: p.slug,
  };
};
