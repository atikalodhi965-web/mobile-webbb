/**
 * Module B: Catalog (Device Types, Brands, Models)
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getDeviceTypes = async () => unwrap(await apiClient.get('/device-types'));

export const getBrands = async (params = {}) => unwrap(await apiClient.get('/brands', { params }));

export const getBrandBySlug = async (slug) => unwrap(await apiClient.get(`/brands/${slug}`));

export const getModels = async (params = {}) => unwrap(await apiClient.get('/models', { params }));

export const getModelBySlug = async (slug) => unwrap(await apiClient.get(`/models/${slug}`));

export const searchCatalog = async (query) =>
  unwrap(await apiClient.get('/search', { params: { q: query } }));
