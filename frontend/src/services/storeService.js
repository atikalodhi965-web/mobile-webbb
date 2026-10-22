/**
 * Module E: Single Store & Availability
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const getCurrentStore = async () => unwrap(await apiClient.get('/stores/current'));

export const getStoreSlots = async (date) =>
  unwrap(await apiClient.get('/stores/slots', { params: { date } }));
