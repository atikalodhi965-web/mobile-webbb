/**
 * Admin API service – all admin modules
 * Wraps the shared apiClient with admin-specific endpoints.
 */
import apiClient from '../../lib/apiClient';
import { unwrap } from '../../lib/unwrap';

export { apiClient };

const BASE = '/admin';

/* ── low-level helpers ── */
const get    = (url, params)       => apiClient.get(url, { params }).then(unwrap);
const post   = (url, data, cfg)    => apiClient.post(url, data, cfg).then(unwrap);
const put    = (url, data, cfg)    => apiClient.put(url, data, cfg).then(unwrap);
const patch  = (url, data)         => apiClient.patch(url, data).then(unwrap);
const del    = (url)               => apiClient.delete(url).then(unwrap);
const mCfg   = (form)             => form instanceof FormData
  ? { headers: { 'Content-Type': undefined } } : {};

/* ═══════════════════════ CATALOG ═══════════════════════ */

export const deviceTypeApi = {
  getAll:  (p) => get(`${BASE}/catalog/device-types`, p),
  getById: (id) => get(`${BASE}/catalog/device-types/${id}`),
  create:  (f) => post(`${BASE}/catalog/device-types`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/catalog/device-types/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/catalog/device-types/${id}`),
};

export const brandApi = {
  getAll:  (p) => get(`${BASE}/catalog/brands`, p),
  getById: (id) => get(`${BASE}/catalog/brands/${id}`),
  create:  (f) => post(`${BASE}/catalog/brands`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/catalog/brands/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/catalog/brands/${id}`),
};

export const deviceModelApi = {
  getAll:  (p) => get(`${BASE}/catalog/models`, p),
  getById: (id) => get(`${BASE}/catalog/models/${id}`),
  create:  (f) => post(`${BASE}/catalog/models`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/catalog/models/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/catalog/models/${id}`),
};

/* ═══════════════════════ REPAIRS ═══════════════════════ */

export const repairCategoryApi = {
  getAll:  (p) => get(`${BASE}/repairs/categories`, p),
  getById: (id) => get(`${BASE}/repairs/categories/${id}`),
  create:  (f) => post(`${BASE}/repairs/categories`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/repairs/categories/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/repairs/categories/${id}`),
};

export const repairServiceApi = {
  getAll:  (p) => get(`${BASE}/repairs/services`, p),
  getById: (id) => get(`${BASE}/repairs/services/${id}`),
  create:  (f) => post(`${BASE}/repairs/services`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/repairs/services/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/repairs/services/${id}`),
};

/* ══════════════════ REFURBISHED PRODUCTS ══════════════════ */

export const productApi = {
  getAll:  (p) => get(`${BASE}/products`, p),
  getById: (id) => get(`${BASE}/products/${id}`),
  create:  (f) => post(`${BASE}/products`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/products/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/products/${id}`),
  togglePublish: (id, isActive) => patch(`${BASE}/products/${id}/publish`, { isActive }),
};

/* ══════════════════════ BOOKINGS ══════════════════════ */

export const bookingApi = {
  getAll:       (p) => get(`${BASE}/bookings`, p),
  getById:      (id) => get(`${BASE}/bookings/${id}`),
  create:       (d) => post(`${BASE}/bookings`, d),
  update:       (id, d) => put(`${BASE}/bookings/${id}`, d),
  remove:       (id) => del(`${BASE}/bookings/${id}`),
  updateStatus: (id, status) => patch(`${BASE}/bookings/${id}/status`, { status }),
};

/* ══════════════════════ ORDERS (read + status update) ══════════════════════ */

export const orderApi = {
  getAll:  (p) => get(`${BASE}/orders`, p),
  getById: (id) => get(`${BASE}/orders/${id}`),
  // Orders are created by customers; admin only updates status
  update:  (id, d) => patch(`${BASE}/orders/${id}/status`, d),
  // stub create/remove so useAdminResource works in read-only mode
  create:  () => Promise.reject(new Error('Orders are created by customers.')),
  remove:  () => Promise.reject(new Error('Orders cannot be deleted.')),
};

/* ═══════════════════════ PAYMENTS (read-only) ═══════════════════════ */

export const paymentApi = {
  // Payments controller returns a flat array, not { items, pagination }
  getAll:  () => apiClient.get(`${BASE}/payments`).then(r => {
    const raw = unwrap(r);
    // normalise to { items } shape
    return Array.isArray(raw) ? { items: raw } : raw;
  }),
  getById:  () => Promise.resolve(null),
  create:   () => Promise.reject(new Error('Payments are recorded automatically.')),
  update:   () => Promise.reject(new Error('Payments cannot be edited.')),
  remove:   () => Promise.reject(new Error('Payments cannot be deleted.')),
};

/* ═══════════════════════ DISCOUNTS ═══════════════════════ */

export const discountApi = {
  getAll:  (p) => get(`${BASE}/cms/discounts`, p),
  getById: (id) => get(`${BASE}/cms/discounts/${id}`),
  create:  (d) => post(`${BASE}/cms/discounts`, d),
  update:  (id, d) => put(`${BASE}/cms/discounts/${id}`, d),
  remove:  (id) => del(`${BASE}/cms/discounts/${id}`),
};

/* ═══════════════════════ REVIEWS ═══════════════════════ */

export const reviewApi = {
  getAll:  (p) => get(`${BASE}/cms/reviews`, p),
  getById: (id) => get(`${BASE}/cms/reviews/${id}`),
  create:  (f) => post(`${BASE}/cms/reviews`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/cms/reviews/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/cms/reviews/${id}`),
};

/* ═══════════════════════ FAQs ═══════════════════════ */

export const faqApi = {
  getAll:  (p) => get(`${BASE}/cms/faqs`, p),
  getById: (id) => get(`${BASE}/cms/faqs/${id}`),
  create:  (d) => post(`${BASE}/cms/faqs`, d),
  update:  (id, d) => put(`${BASE}/cms/faqs/${id}`, d),
  remove:  (id) => del(`${BASE}/cms/faqs/${id}`),
};

/* ═══════════════════════ HERO SLIDES ═══════════════════════ */

export const heroSlideApi = {
  getAll:  (p) => get(`${BASE}/cms/hero-slides`, p),
  getById: (id) => get(`${BASE}/cms/hero-slides/${id}`),
  create:  (f) => post(`${BASE}/cms/hero-slides`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/cms/hero-slides/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/cms/hero-slides/${id}`),
};

/* ═══════════════════════ PROTECTION PLANS ═══════════════════════ */

export const protectionApi = {
  getAll:  (p) => get(`${BASE}/cms/protection`, p),
  getById: (id) => get(`${BASE}/cms/protection/${id}`),
  create:  (f) => post(`${BASE}/cms/protection`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/cms/protection/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/cms/protection/${id}`),
};

/* ═══════════════════════ CMS PAGES ═══════════════════════ */

export const cmsPageApi = {
  // CMS pages use pageKey or _id; normalise to { items, pagination }
  getAll: async (p) => {
    const raw = await apiClient.get(`${BASE}/cms/pages`, { params: p }).then(unwrap);
    const list = Array.isArray(raw) ? raw : raw?.items ?? [];
    return { items: list, pagination: { total: list.length, page: 1, limit: 100, pages: 1 } };
  },
  getById: (id) => get(`${BASE}/cms/pages/${id}`),
  create:  (f) => post(`${BASE}/cms/pages`, f, mCfg(f)),
  update:  (id, f) => put(`${BASE}/cms/pages/${id}`, f, mCfg(f)),
  remove:  (id) => del(`${BASE}/cms/pages/${id}`),
};

/* ═══════════════════════ USERS (CUSTOMERS & STAFF) ═══════════════════════ */

<<<<<<< HEAD
export const mediaApi = {
=======
export const userApi = {
  getAll:  (p) => get(`${BASE}/users`, p),
  getById: (id) => get(`${BASE}/users/${id}`),
  create:  (d) => post(`${BASE}/users`, d),
  update:  (id, d) => put(`${BASE}/users/${id}`, d),
  remove:  (id) => del(`${BASE}/users/${id}`),
};

/* ═══════════════════════ CONVENIENCE FETCHERS ═══════════════════════ */

export const fetchAllDeviceTypes = () => deviceTypeApi.getAll({ limit: 200 });
export const fetchAllBrands      = () => brandApi.getAll({ limit: 200 });
export const fetchAllModels      = () => deviceModelApi.getAll({ limit: 200 });
export const fetchAllCategories  = () => repairCategoryApi.getAll({ limit: 200 });
