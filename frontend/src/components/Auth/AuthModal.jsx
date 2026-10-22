import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    switchAuthMode,
    login,
    signup,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen]);

  // Reset errors and fields on mode change
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setErrorMessage('');
    setSuccessMessage('');
    closeAuthModal();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Demo autofill helper
  const handleAutofillDemo = () => {
    setEmail('customer@samztech.com');
    setPassword('demoPass123');
    setFullName('Alex Morgan');
    setErrorMessage('');
  };

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const user = await login(email, password, rememberMe);
      setSuccessMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        handleClose();
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await signup(fullName, email, password);
      setSuccessMessage(`Account created! Welcome to SAMZ, ${newUser.name}!`);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Password recovery link sent to ${email}. Please check your inbox.`);
    }, 700);
  };

  return (
    <div
      className="auth-modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar with Close Button */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          {/* SAMZ mini logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 transform rotate-45">
                <div className="w-2 h-2 bg-[#FF6534] rounded-xs"></div>
                <div className="w-2 h-2 bg-[#FF6534] rounded-xs"></div>
                <div className="w-2 h-2 bg-[#FF6534] rounded-xs"></div>
                <div className="w-2 h-2 bg-[#FF6534] rounded-xs"></div>
              </div>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-[#282338]">
              SAMZ
            </span>
          </div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="auth-modal-scroll-area">
          {/* Top Mode Segmented Pill Switcher (Login vs Sign Up) */}
          {authModalMode !== 'forgot' && (
            <div className="flex bg-gray-100 p-1 rounded-full mb-6 max-w-xs mx-auto">
              <button
                type="button"
                className={`auth-tab-btn ${authModalMode === 'login' ? 'active' : ''}`}
                onClick={() => switchAuthMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authModalMode === 'signup' ? 'active' : ''}`}
                onClick={() => switchAuthMode('signup')}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Header Title & Subtitle */}
          <div className="text-center mb-6">
            <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-[#1e1b2e]">
              {authModalMode === 'login' && 'Welcome back!'}
              {authModalMode === 'signup' && 'Create your account'}
              {authModalMode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {authModalMode === 'login' && 'Login to your account below'}
              {authModalMode === 'signup' && 'Sign up for fast repairs & order tracking'}
              {authModalMode === 'forgot' && "Enter your email and we'll send reset instructions"}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Email
                </label>
                <div className="auth-input-group">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="auth-input-group">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#FF6534] rounded border-gray-300 focus:ring-[#FF6534]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => switchAuthMode('forgot')}
                  className="text-xs font-semibold text-gray-500 hover:text-[#FF6534] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Demo Helper Pill */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="text-xs text-gray-400 hover:text-[#FF6534] transition-colors inline-flex items-center gap-1"
                >
                  <span>✨ Quick demo auto-fill</span>
                </button>
              </div>

              {/* Reference-matching Bottom Links: Register - Forgot your password? - Close */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                <button
                  type="button"
                  onClick={() => switchAuthMode('signup')}
                  className="auth-sub-link font-semibold text-[#282338]"
                >
                  Register
                </button>
                <span>-</span>
                <button
                  type="button"
                  onClick={() => switchAuthMode('forgot')}
                  className="auth-sub-link font-semibold text-[#282338]"
                >
                  Forgot your password?
                </button>
                <span>-</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="auth-sub-link font-semibold text-[#282338]"
                >
                  Close
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGN UP FORM */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Full Name
                </label>
                <div className="auth-input-group">
                  <User className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="auth-input-group">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="auth-input-group">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Confirm Password
                </label>
                <div className="auth-input-group">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 leading-snug select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#FF6534] rounded border-gray-300 focus:ring-[#FF6534]"
                  />
                  <span>
                    I agree to the{' '}
                    <a
                      href="/pages/terms-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6534] underline hover:text-[#e55325]"
                    >
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a
                      href="/pages/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6534] underline hover:text-[#e55325]"
                    >
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Bottom links */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => switchAuthMode('login')}
                  className="auth-sub-link font-bold text-[#FF6534]"
                >
                  Sign In
                </button>
                <span>-</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="auth-sub-link font-semibold text-[#282338]"
                >
                  Close
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD */}
          {authModalMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="auth-input-group">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-btn-primary"
                >
                  {isLoading ? 'Sending link...' : 'Send Reset Link'}
                </button>
              </div>

              {/* Bottom links */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                <button
                  type="button"
                  onClick={() => switchAuthMode('login')}
                  className="auth-sub-link font-bold text-[#FF6534]"
                >
                  Back to Sign In
                </button>
                <span>-</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="auth-sub-link font-semibold text-[#282338]"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
