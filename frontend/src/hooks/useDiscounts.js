import { useState, useCallback } from 'react';
import { validateDiscount } from '../services/discountService';
import { errorMessage } from '../lib/unwrap';

export const useDiscountValidation = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = useCallback(async ({ code, subtotal, orderTotal }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await validateDiscount({ code, subtotal, orderTotal });
      setResult(data);
      return data;
    } catch (err) {
      const msg = errorMessage(err, 'Invalid discount code');
      setError(msg);
      setResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    validate,
    discount: result,
    valid: !!result?.code,
    message: result ? 'Discount applied' : '',
    loading,
    error,
    reset,
  };
};
