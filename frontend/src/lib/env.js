/**
 * Frontend env helpers.
 * Vite only exposes variables prefixed with VITE_.
 */
export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_ORIGIN ||
  API_URL.replace(/\/api\/v1\/?$/, '');
