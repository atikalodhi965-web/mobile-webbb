/**
 * Module D: Refurbished Products
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getProducts = async (params = {}) =>
  unwrap(await apiClient.get('/products', { params }));

export const getProductBySlug = async (slugOrId) =>
  unwrap(await apiClient.get(`/products/${slugOrId}`));
