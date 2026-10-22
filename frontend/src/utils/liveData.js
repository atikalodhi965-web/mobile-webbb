/**
 * Prefer live API results. Use static fallback only when the request failed.
 * Successful empty arrays stay empty (do not swap in mock rows).
 */
export const liveOrFallback = (apiItems, loading, error, fallback = []) => {
  if (loading) return [];
  if (error) return fallback;
  return Array.isArray(apiItems) ? apiItems : fallback;
};
