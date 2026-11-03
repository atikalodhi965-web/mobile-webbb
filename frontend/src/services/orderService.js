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

/**
 * PayPal Integration APIs
 */
export const getPayPalConfig = async () =>
  unwrap(await apiClient.get('/orders/paypal/config'));

export const createPayPalOrder = async (orderData) =>
  unwrap(await apiClient.post('/orders/paypal/create-order', orderData));

export const capturePayPalOrder = async (captureData) =>
  unwrap(await apiClient.post('/orders/paypal/capture-order', captureData));

export const createPayPalForExisting = async (orderId) =>
  unwrap(await apiClient.post(`/orders/${orderId}/paypal-create`));

export const capturePayPalForExisting = async (orderId, paypalOrderId) =>
  unwrap(await apiClient.post(`/orders/${orderId}/paypal-capture`, { paypalOrderId }));
