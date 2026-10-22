/**
 * Module C: Repair Services (categories + priced repairs)
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getRepairCategories = async () =>
  unwrap(await apiClient.get('/repairs/categories'));

export const getRepairsForModel = async (modelSlug) =>
  unwrap(await apiClient.get(`/repairs/model/${modelSlug}`));

export const getRepairById = async (id) => unwrap(await apiClient.get(`/repairs/${id}`));
