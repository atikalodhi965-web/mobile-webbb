/**
 * Module K: CMS / Page Content
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getHeroSlides = async () => unwrap(await apiClient.get('/cms/hero-slides'));

export const getPageContent = async (pageKey) =>
  unwrap(await apiClient.get(`/cms/pages/${pageKey}`));

export const getProtection = async () => unwrap(await apiClient.get('/cms/protection'));
