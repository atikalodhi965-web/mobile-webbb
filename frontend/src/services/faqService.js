/**
 * Module J: FAQs
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getFaqs = async (params = {}) =>
  unwrap(await apiClient.get('/cms/faqs', { params }));
