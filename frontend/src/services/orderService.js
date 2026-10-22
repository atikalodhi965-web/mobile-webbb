/**
 * Module G: Cart / Orders / Payments
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const createOrder = async (orderData) =>
  unwrap(await apiClient.post('/orders', orderData));

export const getMyOrders = async () => unwrap(await apiClient.get('/orders/my'));

export const getOrderById = async (id) => unwrap(await apiClient.get(`/orders/${id}`));

export const markOrderPaid = async (id, paymentData) =>
  unwrap(await apiClient.post(`/orders/${id}/pay`, paymentData));
