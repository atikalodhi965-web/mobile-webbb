import { useState, useEffect, useCallback } from 'react';
import { getRepairCategories, getRepairsForModel, getRepairById } from '../services/repairService';
import { errorMessage } from '../lib/unwrap';

export const useRepairCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRepairCategories();
      setCategories(Array.isArray(data) ? data : data?.categories ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { categories, loading, error, refetch };
};

export const useRepairsForModel = (modelSlug) => {
  const [repairs, setRepairs] = useState([]);
  const [model, setModel] = useState(null);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(!!modelSlug);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!modelSlug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRepairsForModel(modelSlug);
      if (Array.isArray(data)) {
        setRepairs(data);
        setGrouped({});
        setModel(null);
      } else {
        setRepairs(data?.services ?? []);
        setGrouped(data?.grouped ?? {});
        setModel(data?.model ?? null);
      }
    } catch (err) {
      setError(errorMessage(err));
      setRepairs([]);
    } finally {
      setLoading(false);
    }
  }, [modelSlug]);

  useEffect(() => { refetch(); }, [refetch]);
  return { repairs, model, grouped, loading, error, refetch };
};

export const useRepairById = (id) => {
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getRepairById(id)
      .then(setRepair)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return { repair, loading, error };
};
