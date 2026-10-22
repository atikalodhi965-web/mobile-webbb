import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import { errorMessage } from '../../lib/unwrap';

const AdminAuthContext = createContext(null);
const USER_KEY  = 'SAMZ_admin_user';
const TOKEN_KEY = 'SAMZ_token';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (admin) localStorage.setItem(USER_KEY, JSON.stringify(admin));
      else localStorage.removeItem(USER_KEY);
    } catch { /* ignore */ }
  }, [admin]);

  /**
   * login – calls the real backend /admin/auth/login endpoint.
   * On success it stores the JWT token so all subsequent apiClient
   * calls include the Authorization header automatically.
   */
  const login = async (email, password) => {
    if (!email || !password) throw new Error('Please enter email and password.');
    if (password.length < 6)  throw new Error('Password must be at least 6 characters.');

    const res = await apiClient
      .post('/admin/auth/login', { email, password })
      .catch((err) => { throw new Error(errorMessage(err, 'Login failed.')); });

    const { token, user } = res.data?.data ?? res.data ?? {};
    if (!token) throw new Error('Invalid response from server. No token returned.');

    localStorage.setItem(TOKEN_KEY, token);
    const loggedIn = { ...user, id: user?._id ?? user?.id };
    setAdmin(loggedIn);
    return loggedIn;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('SAMZ_auth_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAdminAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export default AdminAuthContext;
