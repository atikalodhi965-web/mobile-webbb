/**
 * AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides authentication state and actions throughout the app.
 * Now connected to the real backend via authService.js.
 *
 * Token is stored in 'SAMZ_token' and user profile in 'SAMZ_auth_user'.
 * The axios client (apiClient.js) reads 'SAMZ_token' automatically.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe, updateMe, logoutUser } from '../services/authService';

const AuthContext = createContext();

const USER_KEY  = 'SAMZ_auth_user';
const TOKEN_KEY = 'SAMZ_token';

export const AuthProvider = ({ children }) => {
  // ── Hydrate from localStorage ──────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // ── Persist user profile to localStorage whenever it changes ───────────────
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Failed to persist auth user:', e);
    }
  }, [user]);

  // ── Try to restore session from existing token on first load ───────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !user) {
      getMe()
        .then((profile) => setUser(profile))
        .catch(() => {
          // Token expired or invalid – clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        });
    }
  }, []);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const switchAuthMode = useCallback((mode) => setAuthModalMode(mode), []);

  // ── Auth actions ───────────────────────────────────────────────────────────

  /**
   * Login with email + password.
   * Calls the real backend POST /auth/login.
   * On success, saves token + user and closes the modal.
   */
  const login = useCallback(async (email, password) => {
    if (!email || !password) throw new Error('Please enter both email and password.');

    const { user: profile } = await loginUser({ email, password });
    setUser(profile);
    return profile;
  }, []);

  /**
   * Register a new customer account.
   * Calls the real backend POST /auth/register.
   */
  const signup = useCallback(async (name, email, password) => {
    if (!name?.trim()) throw new Error('Please enter your full name.');
    if (!email || !password) throw new Error('Please fill in all required fields.');

    const { user: profile } = await registerUser({ name: name.trim(), email, password });
    setUser(profile);
    return profile;
  }, []);

  /**
   * Update the authenticated user's profile.
   * Calls PATCH /auth/me.
   */
  const updateProfile = useCallback(async (updates) => {
    const updated = await updateMe(updates);
    setUser(updated);
    return updated;
  }, []);

  /**
   * Logout – clears token + user from state and storage.
   */
  const logout = useCallback(() => {
    logoutUser();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        switchAuthMode,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
