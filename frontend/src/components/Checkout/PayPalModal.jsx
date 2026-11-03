import React, { useState, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Info,
} from 'lucide-react';
import { usePayPal } from '../../hooks/usePayPal';
import './PayPalModal.css';

const PayPalModal = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentError,
  orderPayload = {},
  orderDetails = {},
}) => {
  const { total = 0, email = '', customerName = '', shippingAddress = '' } = orderDetails;
  const { config, isConfigured, loadingConfig, error: hookError, handleCreateOrder, handleCaptureOrder } = usePayPal();

  const [errorMessage, setErrorMessage] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const internalOrderIdRef = useRef(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isCapturing) return; // Prevent closing mid-capture
    setErrorMessage('');
    setIsCapturing(false);
    onClose();
  };

  // Step 1 & 2: Call backend to create PayPal order and MongoDB order
  const handleCreatePayPalOrder = async () => {
    try {
      setErrorMessage('');
      const response = await handleCreateOrder(orderPayload);
      const data = response?.data || response;

      // Save internal MongoDB Order ID to use during capture
      internalOrderIdRef.current = data?.orderId || null;

      if (!data?.paypalOrderId) {
        throw new Error('PayPal Order ID was not returned by server.');
      }

      return data.paypalOrderId;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to initiate PayPal order.';
      setErrorMessage(msg);
      if (onPaymentError) onPaymentError(err);
      throw err;
    }
  };

  // Step 4: After customer approves on PayPal, call backend to capture payment and update MongoDB
  const handleApprove = async (data, actions) => {
    setIsCapturing(true);
    setErrorMessage('');

    try {
      const capturePayload = {
        paypalOrderId: data.orderID,
        orderId: internalOrderIdRef.current,
      };

      const response = await handleCaptureOrder(capturePayload);
      const result = response?.data || response;

      setCaptureSuccess(true);

      setTimeout(() => {
        setIsCapturing(false);
        onPaymentSuccess(result?.order || result, result?.payment);
      }, 1000);
    } catch (err) {
      setIsCapturing(false);
      const msg = err?.response?.data?.message || err?.message || 'Payment capture failed.';
      setErrorMessage(msg);
      if (onPaymentError) onPaymentError(err);
    }
  };

  const handleError = (err) => {
    console.error('PayPal Checkout error:', err);
    setErrorMessage('An error occurred with PayPal. Please try again or use another payment method.');
    if (onPaymentError) onPaymentError(err);
  };

  const handleCancel = () => {
    setErrorMessage('Payment cancelled. You have not been charged.');
  };

  return (
    <div className="paypal-overlay" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="paypal-window" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="paypal-modal-header">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black italic tracking-tighter text-[#003087]">
              Pay<span className="text-[#0079C1]">Pal</span>
            </span>
            <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Checkout
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isCapturing}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="paypal-modal-body">
          {/* Order Summary Pill */}
          <div className="paypal-order-summary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Amount to pay
              </span>
              <span className="text-2xl font-black text-gray-900">
                £{Number(total).toFixed(2)}
              </span>
            </div>
            {customerName && (
              <div className="text-xs text-gray-600 truncate">
                Customer: <strong className="text-gray-900 font-medium">{customerName}</strong>
              </div>
            )}
            {shippingAddress && (
              <div className="text-xs text-gray-600 truncate mt-0.5">
                Ship to: <span className="text-gray-700">{shippingAddress}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {(errorMessage || hookError) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {errorMessage || hookError}
              </div>
            </div>
          )}

          {/* Capturing / Verifying State */}
          {isCapturing && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#0079C1] animate-spin mx-auto" />
              <div className="text-sm font-bold text-gray-800">
                {captureSuccess ? 'Payment Verified!' : 'Verifying and Capturing Payment...'}
              </div>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Please wait while our backend securely verifies your transaction with PayPal and records your order.
              </p>
            </div>
          )}

          {/* Loading Config State */}
          {!isCapturing && loadingConfig && (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#003087] animate-spin mx-auto" />
              <p className="text-xs text-gray-500">Connecting to PayPal gateway...</p>
            </div>
          )}

          {/* Missing Credentials Notice */}
          {!isCapturing && !loadingConfig && !isConfigured && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>PayPal Sandbox Setup Required</span>
              </div>
              <p className="leading-relaxed text-amber-800/90">
                To test real PayPal payments, please add your PayPal Sandbox credentials in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/.env</code>:
              </p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] space-y-0.5">
                <div>PAYPAL_CLIENT_ID=your_sandbox_client_id</div>
                <div>PAYPAL_CLIENT_SECRET=your_sandbox_client_secret</div>
                <div>PAYPAL_MODE=sandbox</div>
              </div>
              <p className="text-[11px] text-amber-700">
                You can get these instantly from <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="underline font-semibold text-amber-900">developer.paypal.com</a> under <strong>Apps &amp; Credentials</strong>.
              </p>
            </div>
          )}

          {/* Real PayPal Buttons */}
          {!isCapturing && !loadingConfig && isConfigured && (
            <div className="pt-2">
              <div className="mb-3 text-center text-xs text-gray-500">
                Click below to complete your payment securely with PayPal:
              </div>

              <PayPalScriptProvider
                options={{
                  clientId: config.clientId,
                  currency: config.currency || 'GBP',
                  intent: 'capture',
                  components: 'buttons',
                }}
              >
                <div className="min-h-[140px]">
                  <PayPalButtons
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                      height: 48,
                    }}
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprove}
                    onError={handleError}
                    onCancel={handleCancel}
                  />
                </div>
              </PayPalScriptProvider>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="paypal-modal-footer">
          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL Encryption</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gray-500" />
              <span>PayPal Buyer Protection</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalModal;
