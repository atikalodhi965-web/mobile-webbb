/**
 * Module H: Discounts / Coupons
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const validateDiscount = async ({ code, subtotal, orderTotal }) =>
  unwrap(
    await apiClient.post('/orders/discounts/validate', {
      code,
      subtotal: subtotal ?? orderTotal ?? 0,
    })
  );
