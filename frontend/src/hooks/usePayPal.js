import { useState, useEffect, useCallback } from 'react';
import { getPayPalConfig, createPayPalOrder, capturePayPalOrder } from '../services/orderService';
import { errorMessage } from '../lib/unwrap';

export const usePayPal = () => {
  const [config, setConfig] = useState({
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    currency: 'GBP',
    mode: 'sandbox',
  });
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getPayPalConfig()
      .then((data) => {
        if (!mounted) return;
        const fetchedClientId = data?.clientId || import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
        setConfig({
          clientId: fetchedClientId,
          currency: data?.currency || 'GBP',
          mode: data?.mode || 'sandbox',
        });
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('Could not fetch PayPal config from backend, using fallback:', err);
      })
      .finally(() => {
        if (mounted) setLoadingConfig(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateOrder = useCallback(async (orderData) => {
    setProcessing(true);
    setError(null);
    try {
      const data = await createPayPalOrder(orderData);
      return data;
    } catch (err) {
      const msg = errorMessage(err, 'Failed to create PayPal order');
      setError(msg);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleCaptureOrder = useCallback(async ({ paypalOrderId, orderId }) => {
    setProcessing(true);
    setError(null);
    try {
      const data = await capturePayPalOrder({ paypalOrderId, orderId });
      return data;
    } catch (err) {
      const msg = errorMessage(err, 'Failed to capture PayPal payment');
      setError(msg);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  return {
    config,
    isConfigured: Boolean(config.clientId && config.clientId !== 'your_paypal_client_id'),
    loadingConfig,
    processing,
    error,
    setError,
    handleCreateOrder,
    handleCaptureOrder,
  };
};
