import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Wrench } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const { isAdminAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F9] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Soft brand atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 10%, #FFF5F2 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, #FFE8DF 0%, transparent 50%)',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#b8370e] text-white shadow-lg shadow-[#b8370e]/30 mb-4">
            <Wrench className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-[#b8370e] tracking-tight">SAMZ Admin</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Device Repair & E-commerce console
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5"
        >
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                placeholder="admin@samz.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-sm font-medium text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#1C0D2A] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#b8370e] hover:bg-[#962d0b] disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
          >
            {loading ? 'Signing in…' : 'Sign in to Dashboard'}
          </button>

          <p className="text-center text-xs font-medium text-gray-400">
            Use your SAMZ admin credentials to sign in.
          </p>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-gray-500">
          <Link to="/" className="text-[#b8370e] font-bold hover:underline">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
