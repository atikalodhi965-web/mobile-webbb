import { getMediaUrl } from '../services/mediaService';

export const modelHref = (model, brandSlug) => {
  if (model.href) return model.href;
  const slug = model.slug || model.id;
  if (brandSlug === 'apple') return `/pages/repairs/apple/${slug}`;
  return `/pages/repairs/select-repair/${slug}`;
};

export const mapModel = (model, brandSlug, fallbackImage) => ({
  id: model.slug || model._id,
  mongoId: model._id,
  name: model.name,
  title: model.name,
  image: getMediaUrl(model.image, fallbackImage),
  href: modelHref(model, brandSlug),
  modelNumber: model.modelNumber || '',
  year: model.year || '',
  categoryGroup: model.categoryGroup || '',
  slug: model.slug,
});

export const groupModelsByCategory = (models, groups) => {
  const buckets = {};
  groups.forEach((g) => {
    buckets[g.id] = { ...g, models: [] };
  });
  models.forEach((model) => {
    const key = model.categoryGroup;
    if (buckets[key]) buckets[key].models.push(model);
    else if (buckets.other) buckets[otherKey(buckets)].models.push(model);
    else {
      const first = Object.keys(buckets)[0];
      if (first) buckets[first].models.push(model);
    }
  });
  return Object.values(buckets).filter((g) => g.models.length > 0 || g.keepEmpty);
};

const otherKey = (buckets) =>
  buckets.other ? 'other' : Object.keys(buckets)[0];
