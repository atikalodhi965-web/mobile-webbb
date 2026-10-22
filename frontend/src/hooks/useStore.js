import { useState, useEffect, useCallback } from 'react';
import { getCurrentStore, getStoreSlots } from '../services/storeService';
import { errorMessage } from '../lib/unwrap';

export const useCurrentStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStore(await getCurrentStore());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { store, loading, error, refetch };
};

export const useStoreSlots = (date) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(!!date);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getStoreSlots(date)
      .then((data) => {
        if (Array.isArray(data)) setSlots(data);
        else setSlots(data?.timeSlots ?? data?.slots ?? []);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [date]);

  return { slots, loading, error };
};
