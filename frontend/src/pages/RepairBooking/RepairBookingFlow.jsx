import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
  ChevronLeft,
  Package,
  Mail,
  Smartphone,
  Maximize2
} from 'lucide-react';
import './RepairBookingFlow.css';
import { useCurrentStore } from '../../hooks/useStore';
import { useCreateBooking } from '../../hooks/useBookings';

const RepairBookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected repair data passed from SelectRepairScreen or defaults
  const repairInfo = location.state?.repair || {
    id: 'front-screen',
    title: 'Front Screen Replacement',
    price: '£129.99',
  };
  const deviceName = location.state?.device || 'iPhone 17';

  // Booking Flow Steps:
  // Step 0: 'method-selection'   → "How do you want us to fix your device?"
  // Step 1: 'visit-us' / 'mail-in' → "Choose a Service Centre" / "Mail-in service"
  // Step 2: 'confirm-details'    → "Please confirm your details!"
  // Step 3: 'confirm-purchase'   → "Confirm purchase" (cart screen)
  // Step 4: Checkout (external)
  const [currentStep, setCurrentStep] = useState('method-selection');
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Service Centre Search State (for Visit Us)
  const [postcodeQuery, setPostcodeQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null); // store id string
  const [selectedStoreObj, setSelectedStoreObj] = useState(null); // full store object
  const [showMoreLocations, setShowMoreLocations] = useState(false);
  const [mapType, setMapType] = useState('map');

  // Date / Time picker state
  const now = new Date(2026, 9, 13); // Oct 2026
  const [calMonth, setCalMonth] = useState(now.getMonth()); // 0-indexed
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // Date object or null
  const [selectedTime, setSelectedTime] = useState(null); // e.g. '10:00'

  const TIME_SLOTS = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30',
  ];

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Build calendar grid for current calMonth/calYear
  const buildCalendar = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
    const adjustedFirst = (firstDay === 0 ? 6 : firstDay - 1); // Mon=0
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < adjustedFirst; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  const advanceMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const retreatMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return null;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date(calYear, calMonth, selectedDate);
    const dayName = days[d.getDay()];
    const suffix = selectedDate === 1 ? 'st' : selectedDate === 2 ? 'nd' : selectedDate === 3 ? 'rd' : 'th';
    return `${dayName} ${selectedDate}${suffix} ${months[calMonth]} at ${selectedTime}`;
  };

  // Confirm Details form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    devicePasscode: '',
    mobileNetwork: '',
    additionalInfo: '',
    sendOffers: false,
    agreeTerms: false,
  });

  // Confirm Purchase cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 'repair-1',
      name: `${deviceName} Screen Replacement`,
      specs: 'White / - / End of Life',
      price: 79,
      qty: 1,
      icon: 'repair',
    },
    {
      id: 'mail-pack',
      name: 'Post in pack (Do not remove from basket)',
      specs: 'NA',
      price: 10,
      qty: 1,
      icon: 'pack',
      locked: true,
    },
  ]);

  // Progress bar step index mapping
  // visit-us path: method(0) -> choose-date-time(1) -> confirm-details(2) -> confirm-purchase(3) -> checkout(4)
  //   (service centre selection skipped – single store auto-selected)
  // mail-in path:  method(0) -> mail-in(1) -> confirm-details(2) -> confirm-purchase(3) -> checkout(4)
  const stepIndexMap = {
    'method-selection': 0,
    'visit-us': 1,       // kept for safety; normally jumped over
    'mail-in': 1,
    'choose-date-time': 1,
    'confirm-details': selectedMethod === 'visit-us' ? 2 : 2,
    'confirm-purchase': selectedMethod === 'visit-us' ? 3 : 3,
    'checkout': 4,
  };
  const currentStepIndex = stepIndexMap[currentStep] ?? 0;

  // Handle Go Back
  const handleGoBack = () => {
    if (currentStep === 'visit-us' || currentStep === 'mail-in') {
      setCurrentStep('method-selection');
    } else if (currentStep === 'choose-date-time') {
      // Single-store flow: skip the service centre screen, go back to method selection
      setCurrentStep('method-selection');
    } else if (currentStep === 'confirm-details') {
      if (selectedMethod === 'visit-us') setCurrentStep('choose-date-time');
      else setCurrentStep('mail-in');
    } else if (currentStep === 'confirm-purchase') {
      setCurrentStep('confirm-details');
    } else {
      navigate(-1);
    }
  };

  // Select method handler
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    if (method === 'visit-us') {
      // Auto-select the single store and jump straight to date/time picker
      setSelectedStore(SINGLE_STORE.id);
      setSelectedStoreObj(SINGLE_STORE);
      setSelectedDate(null);
      setSelectedTime(null);
      setCurrentStep('choose-date-time');
    } else {
      setCurrentStep(method);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue from Mail-in to Confirm Details
  const handleContinueMailIn = () => {
    setCurrentStep('confirm-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a store and go to date/time picker
  const handleSelectStore = (store) => {
    setSelectedStore(store.id);
    setSelectedStoreObj(store);
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentStep('choose-date-time');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue from date/time picker to Confirm Details
  const handleContinueDatetime = () => {
    setCurrentStep('confirm-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue from Confirm Details to Confirm Purchase
  // Also submit the booking to the backend
  const handleContinueToCart = async () => {
    // Build booking payload for backend
    try {
      const appointmentDate = selectedDate && calYear && calMonth !== null
        ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
        : undefined;

      await submitBooking({
        repairId: repairInfo?.id ?? repairInfo?._id ?? undefined,
        modelSlug: location.state?.device?.toLowerCase().replace(/\s+/g, '-') ?? undefined,
        method: selectedMethod,
        appointmentDate,
        appointmentTime: selectedTime ?? undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode,
        devicePasscode: formData.devicePasscode,
        mobileNetwork: formData.mobileNetwork !== 'Mobile Network' ? formData.mobileNetwork : undefined,
        additionalInfo: formData.additionalInfo,
        sendOffers: formData.sendOffers,
      });
    } catch (err) {
      // Non-blocking: still proceed to confirm-purchase screen even if booking API fails
      console.warn('Booking API error (proceeding anyway):', err?.message);
    }
    setCurrentStep('confirm-purchase');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Checkout from Confirm Purchase
  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        repair: repairInfo,
        device: deviceName,
        method: selectedMethod,
        formData,
      },
    });
  };

  // Remove item from cart
  const removeCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update cart quantity
  const updateCartQty = (id, val) => {
    const qty = Math.max(1, parseInt(val) || 1);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // ── Backend: single store & booking API ───────────────────────────────────
  const { store: backendStore } = useCurrentStore();
  const { submitBooking, loading: bookingLoading, error: bookingError } = useCreateBooking();

  // ── Single store (falls back to static if API not ready) ──────────────────
  const SINGLE_STORE = backendStore
    ? {
        id: backendStore._id ?? 'main-store',
        name: backendStore.name ?? 'SAMZ Service Centre',
        address: [
          backendStore.address?.street,
          backendStore.address?.city,
          backendStore.address?.postcode,
        ].filter(Boolean).join(', ') || backendStore.address || '123 High Street, London EC1A 1BB',
        distance: '0.0',
        available: true,
      }
    : {
        id: 'main-store',
        name: 'SAMZ Service Centre',
        address: '123 High Street, London EC1A 1BB',
        distance: '0.0',
        available: true,
      };

  // Service Centres Data (single-store only)
  const serviceCentres = [SINGLE_STORE];
  const moreServiceCentres = [];
  const allVisibleStores = serviceCentres;

  const mobileNetworks = [
    'Mobile Network',
    'EE',
    'O2',
    'Vodafone',
    'Three',
    'Sky Mobile',
    'Tesco Mobile',
    'Virgin Mobile',
    'giffgaff',
    'iD Mobile',
    'Unlocked',
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1F1B2E]">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* ================================================================ */}
        {/* PROGRESS BAR – 5 dots for 5 steps                               */}
        {/* ================================================================ */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center justify-between mb-2">
            {/* Horizontal Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2EEF8] -translate-y-1/2 z-0" />

            {/* 5 Dots */}
            {[0, 1, 2, 3, 4].map((index) => {
              const isActive = index === currentStepIndex;
              const isPast = index < currentStepIndex;

              return (
                <div key={index} className="relative z-10 flex flex-col items-center">
                  {/* Floating cracked phone icon above active dot */}
                  {isActive && (
                    <div className="absolute -top-11 flex flex-col items-center animate-bounce-short">
                      <div className="w-8 h-10 rounded-md border-2 border-[#2B0A3D] bg-white flex items-center justify-center shadow-xs">
                        <svg
                          className="w-5 h-5 text-[#2B0A3D]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="1.5" />
                          <path
                            d="M10 6l4 5-3 3 5 4"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="19" r="0.7" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${isPast
                        ? 'bg-[#FF6534] ring-4 ring-orange-100'
                        : isActive
                          ? 'bg-[#2B0A3D] ring-4 ring-[#E2EEF8]'
                          : 'bg-[#2B0A3D]'
                      }`}
                  />
                </div>
              );
            })}
          </div>

          {/* GO BACK Button */}
          <div className="pt-2">
            <button
              type="button"
              id="booking-go-back-btn"
              onClick={handleGoBack}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-black uppercase text-[#2B0A3D] hover:text-[#FF6534] transition-colors cursor-pointer tracking-wider"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
              <span>GO BACK</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SCREEN 1: Method Selection                                        */}
        {/* ================================================================ */}
        {currentStep === 'method-selection' && (
          <div className="text-center py-4 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FF6534] mb-12 tracking-tight">
              How do you want us to fix your device?
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 max-w-3xl mx-auto">
              {/* Option 1: Visit us */}
              <div className="flex flex-col items-center w-64">
                <button
                  type="button"
                  id="select-visit-us-btn"
                  onClick={() => handleSelectMethod('visit-us')}
                  className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl border-2 border-blue-100/80 shadow-md hover:shadow-xl hover:border-[#FF6534]/40 hover:-translate-y-1.5 transition-all duration-200 flex flex-col items-center justify-center p-6 cursor-pointer group"
                >
                  <div className="mb-4 text-[#2B0A3D] group-hover:scale-105 transition-transform">
                    <svg className="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="4" r="2.5" />
                      <path d="M13.5 8H10.5C9.4 8 8.5 8.9 8.5 10V14.5C8.5 15.05 8.95 15.5 9.5 15.5H10.5V20.5C10.5 21.05 10.95 21.5 11.5 21.5C12.05 21.5 12.5 21.05 12.5 20.5V16H13V20.5C13 21.05 13.45 21.5 14 21.5C14.55 21.5 15 21.05 15 20.5V15.5H16C16.55 15.5 17 15.05 17 14.5V10C17 8.9 16.1 8 15 8H13.5Z" />
                    </svg>
                  </div>
                  <span className="text-xl font-extrabold text-[#FF6534] tracking-tight">
                    Visit us
                  </span>
                </button>
                <p className="mt-4 text-xs sm:text-sm text-gray-700 font-medium text-center">
                  Drop your device in at<br />our service centre.
                </p>
              </div>

              {/* Option 2: Mail-in */}
              <div className="flex flex-col items-center w-64">
                <button
                  type="button"
                  id="select-mail-in-btn"
                  onClick={() => handleSelectMethod('mail-in')}
                  className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl border-2 border-blue-100/80 shadow-md hover:shadow-xl hover:border-[#FF6534]/40 hover:-translate-y-1.5 transition-all duration-200 flex flex-col items-center justify-center p-6 cursor-pointer group"
                >
                  <div className="mb-4 text-[#2B0A3D] group-hover:scale-105 transition-transform">
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                    </svg>
                  </div>
                  <span className="text-xl font-extrabold text-[#FF6534] tracking-tight">
                    Mail-in
                  </span>
                </button>
                <p className="mt-4 text-xs sm:text-sm text-gray-700 font-medium text-center">
                  No stores close to you?<br />Send your device to us!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SCREEN 2A: Choose a Service Centre (Visit Us)                    */}
        {/* ================================================================ */}
        {currentStep === 'visit-us' && (
          <div className="animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FF6534] text-center mb-8 tracking-tight">
              Choose a Service Centre
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[580px]">
              {/* Left: Store Locator Sidebar */}
              <div className="lg:col-span-5 p-6 bg-white flex flex-col">
                <h2 className="text-lg font-bold text-[#2B0A3D] text-center mb-4">
                  Find a Service Centre
                </h2>

                <div className="space-y-3 mb-5">
                  <input
                    type="text"
                    placeholder="Enter a postcode"
                    value={postcodeQuery}
                    onChange={(e) => setPostcodeQuery(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                  />
                  <button
                    type="button"
                    className="w-full bg-[#2B0A3D] hover:bg-[#1E072C] text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B0A3D] hover:text-[#FF6534] transition-colors cursor-pointer"
                    >
                      <span className="text-sm">⌖</span>
                      <span>Use my location</span>
                    </button>
                  </div>
                </div>

                {/* Store list with distances, availability and Select button */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                  {allVisibleStores.map((store) => (
                    <div
                      key={store.id}
                      className={`p-4 rounded-xl border transition-all ${selectedStore === store.id
                          ? 'border-[#FF6534] bg-orange-50/30'
                          : 'border-gray-200/80 bg-white'
                        }`}
                    >
                      <h3 className="font-bold text-gray-900 text-sm">
                        {store.name} –{' '}
                        <span className="text-gray-500 font-normal">{store.distance} miles away</span>
                      </h3>

                      {store.available ? (
                        <p className="text-xs font-bold text-[#16A34A] mt-1">Appointments available today</p>
                      ) : (
                        <p className="text-xs font-bold text-[#B43A12] mt-1">Parts out of stock</p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#2B0A3D] hover:text-[#FF6534] flex items-center gap-1 cursor-pointer"
                        >
                          <span>View store details</span>
                          <span>&gt;</span>
                        </button>

                        {store.available && (
                          <button
                            type="button"
                            id={`select-store-${store.id}`}
                            onClick={() => handleSelectStore(store)}
                            className="bg-[#2B0A3D] hover:bg-[#FF6534] text-white text-xs font-extrabold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View more / View less toggle */}
                <div className="text-center pt-4 border-t border-gray-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowMoreLocations(p => !p)}
                    className="text-xs font-bold text-[#FF6534] hover:underline cursor-pointer"
                  >
                    {showMoreLocations ? 'View less locations ▲' : 'View more locations ▼'}
                  </button>
                </div>
              </div>

              {/* Right: Interactive Map */}
              <div className="lg:col-span-7 bg-[#AADAFF] relative min-h-[420px] lg:min-h-full flex flex-col overflow-hidden">
                <div className="absolute top-4 left-4 z-20 flex bg-white rounded-md shadow-md overflow-hidden text-xs font-bold">
                  <button type="button" onClick={() => setMapType('map')} className={`px-3 py-1.5 ${mapType === 'map' ? 'bg-white text-gray-900 font-extrabold' : 'bg-gray-50 text-gray-600'}`}>Map</button>
                  <button type="button" onClick={() => setMapType('satellite')} className={`px-3 py-1.5 border-l border-gray-200 ${mapType === 'satellite' ? 'bg-white text-gray-900 font-extrabold' : 'bg-gray-50 text-gray-600'}`}>Satellite</button>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <button type="button" className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center text-gray-700 hover:text-black cursor-pointer">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full h-full relative flex-1 flex items-center justify-center select-none bg-[#98D2EB]">
                  <svg viewBox="0 0 600 700" className="w-full h-full max-w-[540px] max-h-[580px] drop-shadow-md">
                    <path d="M170 340 C160 360, 150 400, 160 440 C170 480, 200 500, 210 470 C220 440, 210 390, 200 360 Z" fill="#CDE5BE" stroke="#A8CE96" strokeWidth="1.5" />
                    <text x="175" y="420" fill="#4B6350" fontSize="12" fontWeight="700">Ireland</text>
                    <path d="M340 70 C360 80, 390 120, 370 170 C360 190, 380 230, 360 250 C380 260, 420 320, 420 380 C430 420, 410 480, 440 500 C450 530, 410 560, 370 560 C320 560, 300 540, 280 500 C270 470, 290 440, 310 410 C300 370, 270 330, 280 300 C300 280, 310 220, 330 150 Z" fill="#D8EBC7" stroke="#B8DC9F" strokeWidth="1.5" />
                    <text x="330" y="180" fill="#3A533E" fontSize="13" fontWeight="800">SCOTLAND</text>
                    <text x="360" y="360" fill="#2E4432" fontSize="14" fontWeight="900">United</text>
                    <text x="350" y="380" fill="#2E4432" fontSize="14" fontWeight="900">Kingdom</text>
                    <text x="375" y="475" fill="#526A56" fontSize="11" fontWeight="700">ENGLAND</text>
                    <text x="295" y="470" fill="#526A56" fontSize="10" fontWeight="700">WALES</text>
                    {[
                      { x: 360, y: 220, label: 'Edinburgh' }, { x: 330, y: 230, label: 'Glasgow' },
                      { x: 375, y: 385, label: 'Manchester' }, { x: 395, y: 420, label: 'Nottingham' },
                      { x: 370, y: 450, label: 'Birmingham' }, { x: 415, y: 505, label: 'London' },
                      { x: 430, y: 512, label: 'Westfield' },
                    ].map((pin, i) => (
                      <g key={i} className="cursor-pointer" onClick={() => setSelectedStore(pin.label)}>
                        <circle cx={pin.x} cy={pin.y} r="10" fill="#FF6534" opacity="0.4" />
                        <circle cx={pin.x} cy={pin.y} r="8" fill="#FF6534" />
                        <path d={`M${pin.x - 4} ${pin.y - 4} L${pin.x + 4} ${pin.y + 4} M${pin.x + 4} ${pin.y - 4} L${pin.x - 4} ${pin.y + 4}`} stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    ))}
                  </svg>
                  <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1 z-20">
                    <div className="w-7 h-7 bg-white rounded shadow-md flex items-center justify-center text-amber-500 font-bold text-xs cursor-pointer">👤</div>
                    <div className="bg-white rounded shadow-md flex flex-col overflow-hidden text-gray-700 font-bold">
                      <button type="button" className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-xs">+</button>
                      <button type="button" className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-xs border-t border-gray-200">-</button>
                    </div>
                  </div>
                  <div className="absolute bottom-1 left-3 text-[9px] text-gray-600 bg-white/70 px-1.5 py-0.5 rounded">Map data ©2026 Google</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SCREEN 2C: Choose Date & Time (Visit Us)                          */}
        {/* ================================================================ */}
        {currentStep === 'choose-date-time' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FF6534] text-center mb-2 tracking-tight">
              Choose the date &amp; time of your repair
            </h1>
            <p className="text-center text-sm text-gray-600 font-medium mb-2">
              <span className="font-bold text-[#2B0A3D]">{selectedStoreObj?.name}</span>
              {selectedStoreObj && <span className="text-gray-500"> – {selectedStoreObj.distance} miles away</span>}
            </p>

            {/* Selected summary + Continue button (appears once both date+time chosen) */}
            {selectedDate && selectedTime && (
              <div className="text-center mb-4 animate-fadeIn">
                <p className="text-sm font-bold text-[#2B0A3D] mb-3">{formatSelectedDateTime()}</p>
                <button
                  type="button"
                  id="datetime-continue-btn"
                  onClick={handleContinueDatetime}
                  className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold px-10 py-3 rounded-xl shadow-md text-sm transition-all cursor-pointer active:scale-95"
                >
                  Continue
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Calendar */}
              <div className="bg-[#EDF5FD] rounded-3xl p-6 border border-blue-100/70 shadow-xs">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-base font-extrabold text-[#2B0A3D]">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={retreatMonth}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#FF6534] hover:text-[#FF6534] transition-colors cursor-pointer text-sm"
                    >‹</button>
                    <button
                      type="button"
                      onClick={advanceMonth}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#FF6534] hover:text-[#FF6534] transition-colors cursor-pointer text-sm"
                    >›</button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_LABELS.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-[#FF6534]">{d}</div>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-y-1">
                  {buildCalendar().map((day, i) => {
                    if (!day) return <div key={i} />;
                    const isSelected = selectedDate === day && calMonth === calMonth && calYear === calYear;
                    const isPast = new Date(calYear, calMonth, day) < new Date(2026, 9, 13);
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isPast}
                        onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                        className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-all cursor-pointer ${isSelected
                            ? 'bg-[#2B0A3D] text-white font-extrabold'
                            : isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-800 hover:bg-[#FF6534]/10 hover:text-[#FF6534]'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Time Slot Picker */}
              <div className="bg-[#EDF5FD] rounded-3xl p-6 border border-blue-100/70 shadow-xs">
                <h3 className="text-base font-extrabold text-[#2B0A3D] mb-5">Pick a slot</h3>
                {!selectedDate ? (
                  <p className="text-sm text-gray-400 font-medium">Please select a date first.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const isChosen = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isChosen
                              ? 'bg-[#2B0A3D] text-white border-[#2B0A3D]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#FF6534] hover:text-[#FF6534]'
                            }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SCREEN 2B: Mail-in service                                        */}
        {/* ================================================================ */}
        {currentStep === 'mail-in' && (
          <div className="animate-fadeIn max-w-4xl mx-auto text-center py-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FF6534] mb-3 tracking-tight">
              Mail-in service
            </h1>

            <div className="max-w-2xl mx-auto mb-10 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              <p>Thank you for selecting our mail-in repair service.</p>
              <p className="mt-1">
                This is our most widely accessible service and ideal for customers who do not live near one of our service centres.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
              {/* Card 1: What's the process? */}
              <div className="bg-[#EDF5FD] rounded-3xl p-6 sm:p-8 border border-blue-100/70 shadow-xs flex flex-col">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#2B0A3D] mb-6 text-center">
                  What's the process?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#2B0A3D] flex items-center justify-center shrink-0 shadow-2xs">
                      <Package className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      We will send you a mail-in pack, within 1-2 business days of receiving your order.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#2B0A3D] flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      Place the device inside the pack and drop into your local post office.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#2B0A3D] flex items-center justify-center shrink-0 shadow-2xs">
                      <Smartphone className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      Once we receive your device, we will diagnose the issue, complete the repair, and mail your device back to you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: How long will it take? */}
              <div className="bg-[#EDF5FD] rounded-3xl p-6 sm:p-8 border border-blue-100/70 shadow-xs flex flex-col">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#2B0A3D] mb-6 text-center">
                  How long will it take?
                </h3>
                <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  <p>
                    Usually, your device will be returned to you{' '}
                    <span className="text-[#FF6534] font-bold">
                      within 2-3 business days from the point we receive your device
                    </span>{' '}
                    at our central service centre.
                  </p>
                  <p>
                    In certain circumstances, depending on the nature of the issue and parts
                    availability, your repair may take longer than this. In these circumstances we
                    will contact you so that you remain up to date on how your repair is progressing.
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              id="mail-in-continue-btn"
              onClick={handleContinueMailIn}
              className="bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-sm sm:text-base px-10 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer active:scale-95"
            >
              Continue
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* SCREEN 3: Confirm Details                                         */}
        {/* ================================================================ */}
        {currentStep === 'confirm-details' && (
          <div className="animate-fadeIn max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FF6534] text-center mb-8 tracking-tight">
              Please confirm your details!
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Your details form */}
              <div className="bg-[#EDF5FD] rounded-3xl p-6 sm:p-8 border border-blue-100/70 shadow-xs">
                <h2 className="text-lg font-extrabold text-[#2B0A3D] text-center mb-6">
                  Your details
                </h2>

                <div className="space-y-3">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First Name*"
                      value={formData.firstName}
                      onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Last Name*"
                      value={formData.lastName}
                      onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <input
                    type="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                  />

                  {/* Phone & Postcode */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="Phone*"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Postcode"
                      value={formData.postcode}
                      onChange={(e) => setFormData((p) => ({ ...p, postcode: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                    />
                  </div>

                  {/* Device Passcode & Mobile Network */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Device Passcode*"
                      value={formData.devicePasscode}
                      onChange={(e) => setFormData((p) => ({ ...p, devicePasscode: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors"
                    />
                    <select
                      value={formData.mobileNetwork}
                      onChange={(e) => setFormData((p) => ({ ...p, mobileNetwork: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors text-gray-600 cursor-pointer"
                    >
                      {mobileNetworks.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Any additional information? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. I have an additional device to repair"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData((p) => ({ ...p, additionalInfo: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: Repair details */}
              <div className="bg-[#EDF5FD] rounded-3xl p-6 sm:p-8 border border-blue-100/70 shadow-xs">
                <h2 className="text-lg font-extrabold text-[#2B0A3D] text-center mb-6">
                  Repair details
                </h2>

                <div className="space-y-4">
                  {/* Repair Type Card */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-extrabold text-[#FF6534] mb-1">Repair Type:</p>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">
                        {repairInfo.title || `${deviceName} ${repairInfo.id || 'Screen Replacement'}`}
                      </p>
                      <p className="text-xs font-extrabold text-[#FF6534] mt-2">Repair Price:</p>
                      <p className="text-sm font-bold text-gray-800">
                        {repairInfo.price || '£79'}
                      </p>
                    </div>
                    <div className="w-10 h-12 rounded-md border-2 border-[#2B0A3D] bg-gray-50 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#2B0A3D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="1.5" />
                        <path d="M10 6l4 5-3 3 5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Mail-In Pack Card (only for mail-in) */}
                  {selectedMethod === 'mail-in' && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-xs font-extrabold text-[#FF6534] mb-1">Mail-In Pack:</p>
                        <p className="text-sm text-gray-700 font-medium leading-snug">
                          Royal Mail special delivery for maximum speed and security.
                        </p>
                        <p className="text-xs font-extrabold text-[#FF6534] mt-2">
                          Cost: <span className="text-gray-800 font-bold">£10.00</span>
                        </p>
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8 text-[#2B0A3D]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Where + When cards (only for visit-us) */}
                  {selectedMethod === 'visit-us' && selectedStoreObj && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-xs font-extrabold text-[#FF6534] mb-1">Where:</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedStoreObj.name}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{selectedStoreObj.address}</p>
                        {selectedDate && selectedTime && (
                          <>
                            <p className="text-xs font-extrabold text-[#FF6534] mt-2">When:</p>
                            <p className="text-xs font-semibold text-gray-800">{formatSelectedDateTime()}</p>
                          </>
                        )}
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8 text-[#2B0A3D]" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="4" r="2.5" />
                          <path d="M13.5 8H10.5C9.4 8 8.5 8.9 8.5 10V14.5C8.5 15.05 8.95 15.5 9.5 15.5H10.5V20.5C10.5 21.05 10.95 21.5 11.5 21.5C12.05 21.5 12.5 21.05 12.5 20.5V16H13V20.5C13 21.05 13.45 21.5 14 21.5C14.55 21.5 15 21.05 15 20.5V15.5H16C16.55 15.5 17 15.05 17 14.5V10C17 8.9 16.1 8 15 8H13.5Z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Total Cost */}
                  <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-xs">
                    <p className="text-sm font-bold text-gray-800">
                      Total cost:{' '}
                      <span className="text-[#FF6534] font-extrabold text-base">
                        £{selectedMethod === 'mail-in' ? '89' : '79'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes & Continue to Payment */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <label className="flex items-start gap-2.5 cursor-pointer max-w-2xl w-full">
                <input
                  type="checkbox"
                  checked={formData.sendOffers}
                  onChange={(e) => setFormData((p) => ({ ...p, sendOffers: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#FF6534] cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium">
                  To provide further peace of mind, from time to time we like to send our loyal
                  customers special offers, promotions &amp; useful advice.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer max-w-2xl w-full">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData((p) => ({ ...p, agreeTerms: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#FF6534] cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium">
                  I agree to the{' '}
                  <a href="/terms-conditions" className="text-[#FF6534] font-bold hover:underline">
                    Terms &amp; Conditions. *
                  </a>
                </span>
              </label>

              <button
                type="button"
                id="confirm-details-continue-btn"
                onClick={handleContinueToCart}
                className="mt-2 bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-sm sm:text-base px-12 py-3.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer active:scale-95"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SCREEN 4: Confirm Purchase (Cart)                                 */}
        {/* ================================================================ */}
        {currentStep === 'confirm-purchase' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FF6534] text-center mb-8 tracking-tight">
              Confirm purchase
            </h1>

            {/* Cart Container */}
            <div className="bg-[#EDF5FD] rounded-3xl p-6 sm:p-8 border border-blue-100/70 shadow-xs">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    {/* Left: Icon & Name */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        {item.icon === 'repair' ? (
                          <svg className="w-8 h-8 text-[#2B0A3D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="1.5" />
                            <path d="M10 6l4 5-3 3 5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-[#2B0A3D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M12 10V6" />
                            <path d="M12 18v-2" />
                            <path d="M16 12h2" />
                            <path d="M6 12h2" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 sm:w-56">
                        <h3 className="text-sm font-bold text-[#2B0A3D] leading-snug">{item.name}</h3>
                        <p className="text-xs text-[#FF6534] font-semibold mt-0.5">{item.specs}</p>
                      </div>
                    </div>

                    {/* Right: Qty & Price & Remove */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.qty}
                        onChange={(e) => updateCartQty(item.id, e.target.value)}
                        disabled={item.locked}
                        className="w-20 py-1.5 px-2 border border-gray-300 rounded-lg text-center font-bold text-sm text-[#1C0D2A] focus:outline-none focus:border-[#FF6534] bg-white shadow-2xs disabled:opacity-60"
                      />
                      <span className="text-base font-black text-[#FF6534] min-w-[50px] text-right">
                        £{item.price * item.qty}
                      </span>
                      {!item.locked && (
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.id)}
                          className="text-gray-400 hover:text-black font-extrabold text-xl p-1 cursor-pointer transition-colors leading-none"
                          title="Remove item"
                        >
                          ✖
                        </button>
                      )}
                      {item.locked && <div className="w-8" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment notice */}
              <div className="mt-6 pt-4 border-t border-blue-200/60 text-xs sm:text-sm text-gray-700 space-y-1">
                <h4 className="font-bold text-[#1C0D2A] text-sm sm:text-base">
                  Pay with PayPal or Klarna
                </h4>
                <p className="text-gray-600 font-medium">
                  You can split your payment in 3 with Klarna, or checkout using PayPal.
                </p>
                <p className="text-gray-600 font-medium">
                  If you don't have a PayPal account, don't worry. You can still go through PayPal
                  as a guest, and checkout using a credit or debit card.
                </p>
              </div>

              {/* Subtotal & Checkout */}
              <div className="flex flex-col items-end pt-4 border-t border-blue-200/60 mt-4">
                <div className="text-right text-base sm:text-lg font-bold text-[#1C0D2A]">
                  Subtotal :{' '}
                  <span className="font-black text-[#FF6534] text-xl sm:text-2xl">
                    £{cartTotal}
                  </span>
                </div>

                <button
                  type="button"
                  id="confirm-purchase-checkout-btn"
                  onClick={handleCheckout}
                  className="mt-4 bg-[#FF6534] hover:bg-[#e05020] text-white font-extrabold text-base py-3.5 px-10 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Checkout Cart
                </button>
              </div>
            </div>

            {/* Bottom notice */}
            <div className="mt-6 text-center text-xs sm:text-sm text-gray-600 font-semibold border-t border-gray-100 pt-4">
              Any discounts for additional repairs will be added on the checkout stage
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RepairBookingFlow;
