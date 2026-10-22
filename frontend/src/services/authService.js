/**
 * Module A: Auth & Users
 * POST /auth/register  POST /auth/login  GET /auth/me  PATCH /auth/me
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

const TOKEN_KEY = 'SAMZ_token';

export const saveToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const registerUser = async ({ name, email, password, phone, marketingOptIn }) => {
  const res = await apiClient.post('/auth/register', {
    name,
    email,
    password,
    phone,
    marketingOptIn,
  });
  const payload = unwrap(res);
  saveToken(payload.token);
  return payload;
};

export const loginUser = async ({ email, password }) => {
  const res = await apiClient.post('/auth/login', { email, password });
  const payload = unwrap(res);
  saveToken(payload.token);
  return payload;
};

export const getMe = async () => {
  const res = await apiClient.get('/auth/me');
  return unwrap(res);
};

export const updateMe = async (updates) => {
  const res = await apiClient.patch('/auth/me', updates);
  return unwrap(res);
};

export const logoutUser = () => {
  removeToken();
};
