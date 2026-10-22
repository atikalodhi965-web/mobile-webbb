/**
 * Module L: Media / Uploads
 */
import { BACKEND_ORIGIN } from '../lib/env';

export const getMediaUrl = (path, fallback = '') => {
  if (!path) return fallback;
  if (/^(https?:\/\/|data:|blob:)/.test(path)) return path;
  const clean = String(path).replace(/^\/+/, '');
  if (clean.startsWith('uploads/')) return `${BACKEND_ORIGIN}/${clean}`;
  return `${BACKEND_ORIGIN}/uploads/${clean}`;
};

export const getPlaceholderUrl = (text = 'Image', w = 400, h = 300) =>
  `https://placehold.co/${w}x${h}/F3F4F6/9CA3AF?text=${encodeURIComponent(text)}`;
