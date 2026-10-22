import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, CheckCircle2, AlertCircle, X, ExternalLink, Globe } from 'lucide-react';
import './PayPalModal.css';

const PayPalModal = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  orderDetails = {},
}) => {
  const { total = 0, email = '', customerName = '', shippingAddress = '' } = orderDetails;

  const [step, setStep] = useState('login'); // 'login' | 'password' | 'processing' | 'success'
  const [paypalEmail, setPaypalEmail] = useState(email || '');
  const [password, setPassword] = useState('••••••••••');
  const [errorMessage, setErrorMessage] = useState('');

  // Keep email synchronized if prop changes
  React.useEffect(() => {
    if (email) {
      setPaypalEmail(email);
    }
  }, [email]);

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!paypalEmail || !paypalEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setStep('password');
  };

  const handlePayNow = () => {
    setStep('processing');
    setErrorMessage('');

    // Simulate realistic payment verification
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess({
          transactionId: 'PAYPAL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          status: 'COMPLETED',
          payerEmail: paypalEmail,
          amount: total,
        });
      }, 1200);
    }, 1500);
  };

  const handleClose = () => {
    setStep('login');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="paypal-overlay" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="paypal-window" onClick={(e) => e.stopPropagation()}>
        {/* Fake Browser Titlebar matching Google Chrome popup in reference */}
        <div className="paypal-titlebar">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
            <span className="text-xs font-medium text-gray-700 ml-1">
              Pay with PayPal - Google Chrome
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-900 p-1 cursor-pointer transition-colors"
            title="Close window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fake URL Address Bar matching screenshot */}
        <div className="paypal-urlbar">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 truncate flex-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-gray-900 font-semibold">paypal.com</span>
            <span className="text-gray-400">/pay?token=4P2596849G1070058&version=6.67.0&commit=true</span>
          </div>
          <Key className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
        </div>

        {/* Main Content Area */}
        <div className="paypal-body">
          {/* Official PayPal Logo */}
          <div className="text-center pt-2 pb-1">
            <div className="inline-flex items-center justify-center gap-1">
              <svg className="h-8 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.666 4.333H4.25c-.482 0-.895.353-.967.83L.844 21.84a.5.5 0 00.495.576h3.693l.93-5.903.03-.186c.071-.478.484-.83.966-.83h2.008c4.205 0 7.494-1.708 8.455-6.685.421-2.18-.04-3.57-1.196-4.398-.946-.677-2.45-1.074-4.56-1.074zm.88 6.57c-.55 2.85-2.732 2.85-4.8 2.85h-1.15l1.01-6.425c.026-.17.173-.295.345-.295h.85c1.442 0 2.585 0 3.23.75.438.51.644 1.343.515 3.12z"
                  fill="#003087"
                />
                <path
                  d="M26.248 11.417h-3.693a.5.5 0 00-.495.576l.03.186.93 5.903H19.327a.978.978 0 01-.966-.83L17.517 11.99a.5.5 0 00-.495-.423h-3.7a.5.5 0 00-.495.576l2.439 15.43a.5.5 0 00.495.423h3.693a.5.5 0 00.495-.576l.666-4.228.03-.186c.071-.478.484-.83.966-.83h1.834c3.84 0 6.845-1.56 7.722-6.106.385-1.99-.036-3.26-.95-4.017-.745-.618-1.956-.98-3.964-.98zm.805 6.002c-.503 2.603-2.495 2.603-4.383 2.603h-1.05l.923-5.867c.024-.155.158-.27.315-.27h.776c1.317 0 2.36 0 2.95.685.4.466.588 1.226.47 2.849z"
                  fill="#0079C1"
                />
                <text x="36" y="22" fill="#003087" fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">
                  Pay<tspan fill="#0079C1">Pal</tspan>
                </text>
              </svg>
            </div>
          </div>

          {/* Subheader */}
          <p className="text-center text-sm font-semibold text-gray-800 mb-5">
            Let's check out with SAMZ
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Enter Email / Mobile Number */}
          {step === 'login' && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Email or mobile number"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="paypal-input"
                  autoFocus
                />
              </div>

              <div className="text-left">
                <a href="#forgot" className="paypal-link text-xs font-semibold">
                  Forgot email?
                </a>
              </div>

              <div className="pt-2">
                <button type="submit" className="paypal-btn-primary">
                  Next
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="paypal-btn-secondary"
                >
                  <span className="w-4 h-4 rounded-full border border-gray-400 inline-flex items-center justify-center text-[10px] mr-1.5">👤</span>
                  Log in with Passkey
                </button>
              </div>

              <div className="paypal-divider">
                <span>or</span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="paypal-btn-secondary"
                >
                  Pay with Debit or Credit Card
                </button>
              </div>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="paypal-link text-xs font-semibold"
                >
                  Cancel and return to SAMZ
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Password / One-Touch Confirmation */}
          {step === 'password' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[11px] text-gray-500 font-medium">Paying as</p>
                  <p className="text-xs font-bold text-gray-900 truncate max-w-[220px]">{paypalEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-xs font-semibold text-[#0070BA] hover:underline"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  PayPal Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="paypal-input"
                  placeholder="Enter PayPal password"
                />
              </div>

              {/* Order total info */}
              <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Total to Pay:</span>
                <span className="font-extrabold text-gray-900 text-sm">£{Number(total).toFixed(2)}</span>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handlePayNow}
                  className="paypal-btn-primary"
                >
                  Complete Payment of £{Number(total).toFixed(2)}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="paypal-link text-xs font-semibold"
                >
                  Cancel and return to SAMZ
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing Payment */}
          {step === 'processing' && (
            <div className="py-10 text-center space-y-4">
              <div className="inline-block animate-spin w-10 h-10 border-4 border-[#0070BA] border-t-transparent rounded-full"></div>
              <h3 className="text-base font-bold text-gray-800">Processing your PayPal payment...</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Please do not refresh or close this window while we secure your transaction.
              </p>
            </div>
          )}

          {/* STEP 4: Payment Success Confirmation */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Payment Authorized!</h3>
              <p className="text-xs text-gray-600">
                Redirecting back to SAMZ to complete your order...
              </p>
            </div>
          )}
        </div>

        {/* Footer Area with Language and Policy Links matching screenshot */}
        <div className="paypal-footer">
          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500 mb-2 font-medium">
            <span className="inline-flex items-center gap-1 cursor-pointer hover:text-gray-800">
              <span>🇺🇸</span>
              <span className="text-[10px]">▼</span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="cursor-pointer hover:underline">English</span>
            <span className="cursor-pointer hover:underline">Français</span>
            <span className="cursor-pointer hover:underline">Español</span>
            <span className="cursor-pointer hover:underline">中文</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 font-medium">
            <a href="#contact" className="hover:underline">Contact Us</a>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <a href="#legal" className="hover:underline">Legal</a>
            <a href="#policy" className="hover:underline">Policy Updates</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalModal;
