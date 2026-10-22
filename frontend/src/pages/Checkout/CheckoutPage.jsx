import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Lock,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useDiscountValidation, usePlaceOrder } from '../../hooks/useOrders';
import PayPalModal from '../../components/Checkout/PayPalModal';
import './CheckoutPage.css';

// Input sanitization against XSS & script injection
const sanitizeInput = (val) => {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // If cart is empty, provide demo fallback items matching reference screenshots
  const displayItems = cartItems.length > 0 ? cartItems : [
    {
      id: 'demo-item-1',
      name: 'Samsung Galaxy S20 Screen Replacement',
      specs: 'Cosmic Grey / - / End of Life',
      quantity: 1,
      unitPrice: 199.00,
      image: null,
      color: { phoneBg: '#64748b' }
    },
    {
      id: 'demo-item-2',
      name: 'Post in pack (Do not remove from basket)',
      specs: 'NA',
      quantity: 1,
      unitPrice: 10.00,
      image: null,
      isPack: true,
      color: { phoneBg: '#e2e8f0' }
    },
    {
      id: 'demo-item-3',
      name: 'Refurbished Marginal VAT - iPhone 13',
      specs: '128GB / Blue / Fair+',
      quantity: 1,
      unitPrice: 249.00,
      image: null,
      color: { phoneBg: '#255273' }
    }
  ];

  // Calculate items subtotal
  const subtotal = cartItems.length > 0
    ? cartSubtotal
    : displayItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');

  // Backend discount validation hook
  const { validate: validateDiscountApi } = useDiscountValidation();
  // Backend order placement hook (for future full wiring)
  const { placeOrder } = usePlaceOrder();

  // Checkout workflow state: 'details' (Image 1 & 2) -> 'review' (Image 3) -> 'success'
  const [checkoutStep, setCheckoutStep] = useState('details');

  // PayPal Popup state (Image 4)
  const [isPayPalOpen, setIsPayPalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    email: user?.email || '',
    newsOffers: true,
    country: 'United Kingdom',
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    postcode: '',
    phone: '',
    saveInfo: false,
    paymentMethod: 'paypal', // 'paypal' | 'klarna'
    billingAddressType: 'same', // 'same' | 'different'
    differentBillingAddress: ''
  });

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize user email if logged in
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        firstName: prev.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: prev.lastName || (user.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '')
      }));
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [checkoutStep]);

  // Handle Field Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Quick autofill demo button with details matching screenshot
  const handleAutofillDemo = () => {
    setFormData({
      email: 'hafizaatikahamid965@gmail.com',
      newsOffers: true,
      country: 'United Kingdom',
      firstName: 'Atika',
      lastName: 'Hamid',
      company: 'SAMZ Tech',
      address: 'syyyygg, House no. 2A street no. 3',
      apartment: 'Harbanspurah',
      city: 'London',
      postcode: 'SW1A 1AA',
      phone: '+923221844025',
      saveInfo: true,
      paymentMethod: 'paypal',
      billingAddressType: 'same',
      differentBillingAddress: ''
    });
    setErrors({});
  };

  // Security Validation Checks
  const validateForm = () => {
    const newErrors = {};

    // 1. Email validation
    const emailSanitized = sanitizeInput(formData.email);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailSanitized) {
      newErrors.email = 'Enter an email address';
    } else if (!emailRegex.test(emailSanitized)) {
      newErrors.email = 'Enter a valid email address';
    }

    // 2. First name validation (min 2 letters)
    const firstNameSanitized = sanitizeInput(formData.firstName);
    if (!firstNameSanitized) {
      newErrors.firstName = 'Enter a first name';
    } else if (firstNameSanitized.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // 3. Last name validation
    const lastNameSanitized = sanitizeInput(formData.lastName);
    if (!lastNameSanitized) {
      newErrors.lastName = 'Enter a last name';
    } else if (lastNameSanitized.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // 4. Address validation
    const addressSanitized = sanitizeInput(formData.address);
    if (!addressSanitized) {
      newErrors.address = 'Enter an address';
    } else if (addressSanitized.length < 4) {
      newErrors.address = 'Please enter a complete address';
    }

    // 5. City validation
    const citySanitized = sanitizeInput(formData.city);
    if (!citySanitized) {
      newErrors.city = 'Enter a city';
    }

    // 6. Postcode validation
    const postcodeSanitized = sanitizeInput(formData.postcode);
    if (!postcodeSanitized) {
      newErrors.postcode = 'Enter a postcode';
    } else if (postcodeSanitized.length < 3) {
      newErrors.postcode = 'Enter a valid postcode';
    }

    // 7. Phone validation (min 7 digits)
    const phoneSanitized = sanitizeInput(formData.phone);
    const phoneRegex = /^[0-9+() \-]{7,20}$/;
    if (!phoneSanitized) {
      newErrors.phone = 'Enter a phone number';
    } else if (!phoneRegex.test(phoneSanitized)) {
      newErrors.phone = 'Enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Review Order Submission
  const handleReviewOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      // Proceed to Review step
      setCheckoutStep('review');
    } else {
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
    setIsSubmitting(false);
  };

  // Handle Discount Code – tries backend first, falls back to static demo codes
  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    setDiscountError('');
    setDiscountSuccess('');

    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setDiscountError('Enter a discount code');
      return;
    }

    // Try backend validation first
    try {
      const result = await validateDiscountApi({ code, orderTotal: subtotal });
      if (result?.valid && result?.discount) {
        const disc = result.discount;
        const discountVal = disc.type === 'percentage'
          ? (subtotal * disc.value) / 100
          : disc.value;
        setAppliedDiscount(discountVal);
        setDiscountSuccess(`Discount applied: -£${discountVal.toFixed(2)}`);
        return;
      } else {
        // Backend said invalid; fall through to static demo check
      }
    } catch (_err) {
      // Backend unavailable – fall through to static demo codes
    }

    // Static fallback demo codes
    if (code === 'SAMZ10' || code === 'SAVE10' || code === 'DISCOUNT') {
      const discountVal = subtotal * 0.1;
      setAppliedDiscount(discountVal);
      setDiscountSuccess(`10% discount applied (-£${discountVal.toFixed(2)})`);
    } else if (code === 'FREE5') {
      setAppliedDiscount(5);
      setDiscountSuccess('£5.00 discount applied');
    } else {
      setDiscountError('Invalid discount code. Try SAMZ10');
    }
  };

  // Pricing calculations
  const shippingFee = 0.00; // Free Shipping
  const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingFee);
  const estimatedTax = (finalTotal * 0.2 / 1.2).toFixed(2); // UK 20% VAT included

  // Handle Successful Payment from PayPal Modal
  const handlePaymentSuccess = (paymentDetails) => {
    setIsPayPalOpen(false);
    clearCart();

    const orderRecord = {
      orderNumber: 'SMZ-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.postcode}, ${formData.country}`,
      paymentMethod: 'PayPal',
      transactionId: paymentDetails.transactionId,
      total: finalTotal,
      items: displayItems
    };

    setCompletedOrder(orderRecord);
    setCheckoutStep('success');
  };

  // ==========================================
  // VIEW: SUCCESS ORDER CONFIRMATION
  // ==========================================
  if (checkoutStep === 'success' && completedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        <header className="bg-white border-b border-gray-200 py-4 px-6 sm:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-[#282338]">SAMZ</span>
          </Link>
          <div className="text-sm font-semibold text-gray-500">
            Order Confirmed
          </div>
        </header>

        <main className="max-w-2xl mx-auto w-full px-4 py-12 flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Payment Successful
              </span>
              <h1 className="text-3xl font-black text-gray-900 mt-2">
                Thank you for your order!
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Your order number is <strong className="text-gray-900 font-bold">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 text-left text-sm space-y-3 border border-gray-200/80">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Confirmation Sent To:</span>
                <span className="font-semibold text-gray-900">{completedOrder.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-semibold text-gray-900">PayPal ({completedOrder.transactionId})</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Shipping To:</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">{completedOrder.shippingAddress}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-900 font-bold">Total Paid:</span>
                <span className="text-lg font-black text-[#FF6534]">£{completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
              >
                Return to Home
              </Link>
              <Link
                to="/collections/refurbished"
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-8 py-3.5 rounded-xl transition-all text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN CHECKOUT & REVIEW SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-white font-sans text-[#282338] checkout-page-root">
      {/* Top Header matching reference picture */}
      <header className="border-b border-gray-100 py-4 px-4 sm:px-10 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#282338]">
              SAMZ
            </span>
          </Link>
        </div>

        <Link
          to="/cart"
          className="text-gray-600 hover:text-gray-900 p-2 relative flex items-center gap-1 transition-colors"
          title="Return to Cart"
        >
          <ShoppingBag className="w-6 h-6 text-[#1773B0]" />
          <span className="text-xs font-bold text-[#1773B0]">
            {displayItems.reduce((acc, it) => acc + (it.quantity || 1), 0)}
          </span>
        </Link>
      </header>

      {/* Two Column Layout matching reference screenshots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* LEFT COLUMN: Checkout Form or Complete Your Order Review */}
        <div className="lg:col-span-7 lg:pr-6">

          {/* Quick Demo Autofill Bar */}
          <div className="mb-6 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium">
              💡 Need to test quickly? Auto-fill test details from screenshot:
            </span>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="bg-[#1773B0] text-white hover:bg-[#146296] font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              ✨ Demo Autofill
            </button>
          </div>

          {/* PHASE 1: DETAILS ENTRY (IMAGE 1 & IMAGE 2) */}
          {checkoutStep === 'details' && (
            <div className="space-y-7">
              {/* Express Checkout section with PayPal button */}
              <div className="text-center">
                <span className="text-xs text-gray-500 font-semibold block mb-2">
                  Express checkout
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (validateForm()) {
                      setIsPayPalOpen(true);
                    } else {
                      setIsPayPalOpen(true); // Allow direct express PayPal launch
                    }
                  }}
                  className="w-full bg-[#FFC439] hover:bg-[#F2BA36] py-3 px-6 rounded-lg shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  title="Express checkout with PayPal"
                >
                  <span className="text-lg font-black italic tracking-tighter text-[#003087]">
                    Pay<span className="text-[#0079C1]">Pal</span>
                  </span>
                </button>

                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    OR
                  </span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>
              </div>

              {/* Contact section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Contact</h2>
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="text-xs font-semibold text-[#1773B0] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Logged In
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="checkout-email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`checkout-input ${errors.email ? 'border-red-500 bg-red-50/20' : ''}`}
                  />
                  <HelpCircle className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}

                <label className="flex items-center gap-2.5 mt-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.newsOffers}
                    onChange={(e) => handleInputChange('newsOffers', e.target.checked)}
                    className="w-4 h-4 rounded text-[#1773B0] focus:ring-[#1773B0] border-gray-300"
                  />
                  <span className="text-xs text-gray-700">Email me with news and offers</span>
                </label>
              </div>

              {/* Delivery section */}
              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-bold text-gray-900">Delivery</h2>

                {/* Country/Region */}
                <div>
                  <div className="relative">
                    <label className="absolute left-3.5 top-1.5 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                      Country/Region
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="checkout-input pt-5 pb-2 text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Ireland">Ireland</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-4 pointer-events-none" />
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`checkout-input ${errors.firstName ? 'border-red-500 bg-red-50/20' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`checkout-input ${errors.lastName ? 'border-red-500 bg-red-50/20' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Company (optional) */}
                <div>
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="checkout-input"
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`checkout-input pr-10 ${errors.address ? 'border-red-500 bg-red-50/20' : ''}`}
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  {errors.address && (
                    <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Apartment, suite, etc. (optional) */}
                <div>
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    className="checkout-input"
                  />
                </div>

                {/* City & Postcode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`checkout-input ${errors.city ? 'border-red-500 bg-red-50/20' : ''}`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Postcode"
                      value={formData.postcode}
                      onChange={(e) => handleInputChange('postcode', e.target.value)}
                      className={`checkout-input ${errors.postcode ? 'border-red-500 bg-red-50/20' : ''}`}
                    />
                    {errors.postcode && (
                      <p className="text-xs text-red-600 mt-1">{errors.postcode}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`checkout-input ${errors.phone ? 'border-red-500 bg-red-50/20' : ''}`}
                  />
                  <HelpCircle className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Save information checkbox */}
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                    className="w-4 h-4 rounded text-[#1773B0] focus:ring-[#1773B0] border-gray-300"
                  />
                  <span className="text-xs text-gray-700">Save this information for next time</span>
                </label>
              </div>

              {/* Shipping method */}
              <div className="space-y-2 pt-2">
                <h2 className="text-lg font-bold text-gray-900">Shipping method</h2>
                {formData.address ? (
                  <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex items-center justify-between text-xs font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1773B0]"></span>
                      <span>Free Shipping</span>
                    </div>
                    <span className="font-bold text-gray-900">FREE</span>
                  </div>
                ) : (
                  <div className="bg-gray-100 border border-gray-200/80 rounded-xl p-4 text-center text-xs text-gray-500 font-medium">
                    Enter your shipping address to view available shipping methods.
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="space-y-2 pt-2">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Payment</h2>
                  <p className="text-xs text-gray-500">All transactions are secure and encrypted.</p>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                  {/* PayPal Radio Card */}
                  <div
                    onClick={() => handleInputChange('paymentMethod', 'paypal')}
                    className={`p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'paypal' ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={() => handleInputChange('paymentMethod', 'paypal')}
                          className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0]"
                        />
                        <span className="text-sm font-semibold text-gray-900">PayPal</span>
                      </label>
                      <span className="text-sm font-black italic tracking-tighter text-[#003087]">
                        Pay<span className="text-[#0079C1]">Pal</span>
                      </span>
                    </div>

                    {formData.paymentMethod === 'paypal' && (
                      <div className="mt-3 pt-3 border-t border-gray-200 text-center text-xs text-gray-600 bg-gray-50/70 p-3 rounded-lg">
                        You'll be redirected to PayPal to complete your purchase
                      </div>
                    )}
                  </div>

                  {/* Klarna Radio Card */}
                  <div
                    onClick={() => handleInputChange('paymentMethod', 'klarna')}
                    className={`p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'klarna' ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="klarna"
                          checked={formData.paymentMethod === 'klarna'}
                          onChange={() => handleInputChange('paymentMethod', 'klarna')}
                          className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0]"
                        />
                        <span className="text-sm font-semibold text-gray-900">Pay with Klarna</span>
                      </label>
                      <span className="bg-[#FFB3C7] text-black font-extrabold text-[11px] px-2 py-0.5 rounded tracking-wider">
                        Klarna
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address Section */}
              <div className="space-y-2 pt-2">
                <h2 className="text-lg font-bold text-gray-900">Billing address</h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                  <div
                    onClick={() => handleInputChange('billingAddressType', 'same')}
                    className={`p-4 cursor-pointer transition-colors ${formData.billingAddressType === 'same' ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="billingAddressType"
                        value="same"
                        checked={formData.billingAddressType === 'same'}
                        onChange={() => handleInputChange('billingAddressType', 'same')}
                        className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span className="text-sm font-semibold text-gray-900">Same as shipping address</span>
                    </label>
                  </div>

                  <div
                    onClick={() => handleInputChange('billingAddressType', 'different')}
                    className={`p-4 cursor-pointer transition-colors ${formData.billingAddressType === 'different' ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="billingAddressType"
                        value="different"
                        checked={formData.billingAddressType === 'different'}
                        onChange={() => handleInputChange('billingAddressType', 'different')}
                        className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span className="text-sm font-semibold text-gray-900">Use a different billing address</span>
                    </label>

                    {formData.billingAddressType === 'different' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <input
                          type="text"
                          placeholder="Enter billing address"
                          value={formData.differentBillingAddress}
                          onChange={(e) => handleInputChange('differentBillingAddress', e.target.value)}
                          className="checkout-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Order Button */}
              <div className="pt-4">
                <button
                  type="button"
                  id="checkout-review-btn"
                  onClick={handleReviewOrder}
                  className="w-full bg-[#1773B0] hover:bg-[#146296] text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-all text-base cursor-pointer active:scale-[0.99]"
                >
                  Review order
                </button>
              </div>

              {/* Policies Footer */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-start gap-4 text-xs text-[#1773B0]">
                <a href="#refund" className="hover:underline">Refund policy</a>
                <a href="#privacy" className="hover:underline">Privacy policy</a>
                <a href="#terms" className="hover:underline">Terms of service</a>
              </div>
            </div>
          )}

          {/* PHASE 2: COMPLETE YOUR ORDER REVIEW (IMAGE 3) */}
          {checkoutStep === 'review' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-gray-900">
                Complete your order
              </h1>

              {/* Review Order Details Table matching Image 3 */}
              <div className="border border-gray-200 rounded-xl overflow-hidden text-sm divide-y divide-gray-200">
                {/* Contact Row */}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="w-24 text-gray-500 font-medium shrink-0">
                    Contact
                  </div>
                  <div className="flex-1 text-gray-900 font-semibold break-all">
                    {formData.email}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('details')}
                      className="text-xs font-semibold text-[#1773B0] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Ship to Row */}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="w-24 text-gray-500 font-medium shrink-0">
                    Ship to
                  </div>
                  <div className="flex-1 text-gray-900 leading-relaxed">
                    <p className="font-bold">{formData.firstName} {formData.lastName}</p>
                    <p className="text-gray-700 text-xs">
                      {formData.address}{formData.apartment ? ', ' + formData.apartment : ''}
                    </p>
                    <p className="text-gray-700 text-xs">
                      {formData.city}, {formData.postcode}, {formData.country}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('details')}
                      className="text-xs font-semibold text-[#1773B0] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Shipping Row */}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="w-24 text-gray-500 font-medium shrink-0">
                    Shipping
                  </div>
                  <div className="flex-1 text-gray-900">
                    <span className="font-semibold">Free Shipping · FREE</span>
                    <p className="text-xs text-gray-500 mt-0.5">No other methods available</p>
                  </div>
                  <div className="w-12"></div>
                </div>

                {/* Payment Row */}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="w-24 text-gray-500 font-medium shrink-0">
                    Payment
                  </div>
                  <div className="flex-1 text-gray-900 leading-relaxed">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold capitalize">{formData.paymentMethod}</span>
                      {formData.paymentMethod === 'paypal' && (
                        <span className="text-xs font-black italic tracking-tighter text-[#003087] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          Pay<span className="text-[#0079C1]">Pal</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700">
                      {formData.billingAddressType === 'same'
                        ? `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.postcode}, ${formData.country}`
                        : formData.differentBillingAddress || 'Custom billing address'
                      }
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">{formData.phone}</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('details')}
                      className="text-xs font-semibold text-[#1773B0] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="pt-3">
                <button
                  type="button"
                  id="checkout-pay-now-btn"
                  onClick={() => setIsPayPalOpen(true)}
                  className="w-full bg-[#1773B0] hover:bg-[#146296] text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-all text-base cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-white/80" />
                  <span>Pay now</span>
                </button>
              </div>

              {/* Policies Footer */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-start gap-4 text-xs text-[#1773B0]">
                <a href="#refund" className="hover:underline">Refund policy</a>
                <a href="#privacy" className="hover:underline">Privacy policy</a>
                <a href="#terms" className="hover:underline">Terms of service</a>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY (IMAGE 1, 2, 3) */}
        <div className="lg:col-span-5 bg-gray-50/60 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl border border-gray-200/80 lg:border-none">
          <div className="sticky top-6 space-y-6">

            {/* Items List */}
            <div className="divide-y divide-gray-200/70">
              {displayItems.map((item, index) => {
                const itemTotal = (item.unitPrice || 0) * (item.quantity || 1);
                const phoneBg = item.color?.phoneBg || '#255273';

                return (
                  <div key={item.id || index} className="py-3.5 flex items-center justify-between gap-4">
                    {/* Item Thumbnail with Count Badge */}
                    <div className="relative shrink-0">
                      <div
                        className="w-14 h-14 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-2xs"
                        style={{ backgroundColor: item.color ? `${phoneBg}15` : '#f8fafc' }}
                      >
                        {item.isPack ? (
                          <div className="text-xl">📦</div>
                        ) : (
                          <div
                            className="w-8 h-10 rounded-md flex items-center justify-center text-[8px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: phoneBg }}
                          >
                            📱
                          </div>
                        )}
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-xs">
                        {item.quantity || 1}
                      </span>
                    </div>

                    {/* Item Title & Specs */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {item.specs || `${item.capacity || '128GB'} / ${item.color?.name || 'Default'} / ${item.condition?.condition || 'Fair+'}`}
                      </p>
                    </div>

                    {/* Item Price */}
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        £{itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discount Code Form */}
            <form onSubmit={handleApplyDiscount} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="checkout-input flex-1 uppercase"
              />
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
              >
                Apply
              </button>
            </form>
            {discountError && (
              <p className="text-xs text-red-600 -mt-3">{discountError}</p>
            )}
            {discountSuccess && (
              <p className="text-xs text-emerald-600 font-semibold -mt-3 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {discountSuccess}
              </p>
            )}

            {/* Subtotal, Shipping, Taxes, Total Breakdown */}
            <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal · {displayItems.reduce((acc, it) => acc + (it.quantity || 1), 0)} items</span>
                <span className="font-semibold text-gray-900">£{subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-£{appliedDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>
                  {formData.address ? (
                    <span className="font-semibold text-gray-900">FREE</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Enter shipping address</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                <div>
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <p className="text-[11px] text-gray-400">
                    Including £{estimatedTax} in taxes
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-semibold mr-1.5">GBP</span>
                  <span className="text-2xl font-black text-gray-900">
                    £{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* PAYPAL INTEGRATION MODAL (IMAGE 4) */}
      <PayPalModal
        isOpen={isPayPalOpen}
        onClose={() => setIsPayPalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        orderDetails={{
          total: finalTotal,
          email: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          shippingAddress: `${formData.address}, ${formData.city}`
        }}
      />
    </div>
  );
};

export default CheckoutPage;
