import { useState, useEffect, useCallback } from 'react';
import {
  getDeviceTypes,
  getBrands,
  getBrandBySlug,
  getModels,
  getModelBySlug,
  searchCatalog,
} from '../services/catalogService';
import { errorMessage } from '../lib/unwrap';

const asList = (data, keys = []) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

export const useDeviceTypes = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDeviceTypes(asList(await getDeviceTypes(), ['deviceTypes']));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { deviceTypes, loading, error, refetch };
};

export const useBrands = (params = {}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBrands(asList(await getBrands(params), ['brands']));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);
  return { brands, loading, error, refetch };
};

export const useBrandBySlug = (slug) => {
  const [brand, setBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getBrandBySlug(slug)
      .then((data) => {
        if (data?.brand) {
          setBrand(data.brand);
          setModels(asList(data.models));
        } else {
          setBrand(data);
          setModels(asList(data?.models));
        }
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  return { brand, models, loading, error };
};

export const useModels = (params = {}) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setModels(asList(await getModels(params), ['models']));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);
  return { models, loading, error, refetch };
};

export const useModelBySlug = (slug) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getModelBySlug(slug)
      .then(setModel)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  return { model, loading, error };
};

export const useCatalogSearch = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query?.trim() || query.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResults(await searchCatalog(query));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};
