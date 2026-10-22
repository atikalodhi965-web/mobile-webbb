/**
 * Module I: Reviews
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getReviews = async (params = {}) =>
  unwrap(await apiClient.get('/cms/reviews', { params }));
