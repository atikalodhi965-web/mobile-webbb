import { useState, useEffect, useCallback } from 'react';
import { errorMessage } from '../../lib/unwrap';

/**
 * useAdminResource
 *
 * @param {object} api   - Object with { getAll, create, update, remove }
 * @param {object} opts
 *   @param {object} defaultParams  - Query params passed to getAll
 *   @param {boolean} autoFetch     - Whether to fetch immediately (default: true)
 */
const useAdminResource = (api, opts = {}) => {
  const { defaultParams = {}, autoFetch = true } = opts;

  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  /* ── fetch list ── */
  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAll({ ...defaultParams, ...params });
      // crudFactory returns { items, pagination }
      const list = res?.items ?? res ?? [];
      setItems(list);
      setTotal(res?.pagination?.total ?? list.length);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [api]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (autoFetch) fetchAll(); }, [fetchAll, autoFetch]);

  /* ── create ── */
  const create = useCallback(async (data) => {
    setSaving(true);
    setError(null);
    try {
      const created = await api.create(data);
      setItems((prev) => [created, ...prev]);
      setTotal((t) => t + 1);
      return created;
    } catch (err) {
      const msg = errorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  }, [api]);

  /* ── update ── */
  const update = useCallback(async (id, data) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.update(id, data);
      setItems((prev) => prev.map((it) => (it._id === id ? updated : it)));
      return updated;
    } catch (err) {
      const msg = errorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  }, [api]);

  /* ── remove ── */
  const remove = useCallback(async (id) => {
    setSaving(true);
    setError(null);
    try {
      await api.remove(id);
      setItems((prev) => prev.filter((it) => it._id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      const msg = errorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  }, [api]);

  return { items, total, loading, saving, error, fetchAll, create, update, remove };
};

export default useAdminResource;
