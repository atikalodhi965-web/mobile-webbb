import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProductBySlug } from '../services/productService';
import { errorMessage } from '../lib/unwrap';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(filters);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(filters);
      if (Array.isArray(data)) {
        setProducts(data);
        setTotal(data.length);
        setPage(1);
        setPages(1);
      } else {
        const items = data.items ?? data.products ?? data.data ?? [];
        setProducts(items);
        setTotal(data.pagination?.total ?? data.total ?? items.length);
        setPage(data.pagination?.page ?? data.page ?? 1);
        setPages(data.pagination?.pages ?? data.pages ?? 1);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);
  return { products, total, page, pages, loading, error, refetch };
};

export const useProductDetail = (slugOrId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!!slugOrId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slugOrId) return;
    setLoading(true);
    setError(null);
    getProductBySlug(slugOrId)
      .then(setProduct)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [slugOrId]);

  return { product, loading, error };
};
