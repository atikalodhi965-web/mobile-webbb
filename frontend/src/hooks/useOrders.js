import { useState, useEffect, useCallback } from 'react';
import { createOrder, getMyOrders, getOrderById, markOrderPaid } from '../services/orderService';
import { errorMessage } from '../lib/unwrap';
export { useDiscountValidation } from './useDiscounts';

export const usePlaceOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createOrder(orderData);
      setOrder(data);
      return data;
    } catch (err) {
      const msg = errorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { placeOrder, order, loading, error };
};

export const useMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : data?.orders ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { orders, loading, error, refetch };
};

export const useOrderById = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return { order, loading, error };
};

export const useMarkOrderPaid = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const confirmPayment = useCallback(async (orderId, paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await markOrderPaid(orderId, paymentData);
      setOrder(data);
      return data;
    } catch (err) {
      const msg = errorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { confirmPayment, order, loading, error };
};
