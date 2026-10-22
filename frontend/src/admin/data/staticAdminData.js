/** Static demo data for the SAMZ Admin Panel */

export const adminStats = {
  revenue: 28450,
  orders: 186,
  bookings: 94,
  pendingBookings: 12,
  products: 48,
  lowStock: 5,
  customers: 312,
  repairsToday: 17,
};

export const deviceTypes = [
  { id: 1, title: 'Smartphone Repairs', slug: 'smartphones', badge: 'Most Popular', priceFrom: 29, isActive: true },
  { id: 2, title: 'iPad Repairs', slug: 'ipad', badge: 'Same Day Repair', priceFrom: 49, isActive: true },
  { id: 3, title: 'MacBook Repairs', slug: 'macbook', badge: 'Express Service', priceFrom: 69, isActive: true },
];

export const brands = [
  { id: 1, name: 'Apple', slug: 'apple', deviceTypes: 'Smartphone, iPad, MacBook', models: 42, isActive: true },
  { id: 2, name: 'Samsung', slug: 'samsung', deviceTypes: 'Smartphone', models: 36, isActive: true },
  { id: 3, name: 'Google', slug: 'google', deviceTypes: 'Smartphone', models: 24, isActive: true },
];

export const deviceModels = [
  { id: 1, name: 'iPhone 17 Pro Max', brand: 'Apple', type: 'Smartphone', group: 'iPhone 17', repairs: 8, isActive: true },
  { id: 2, name: 'iPhone 16', brand: 'Apple', type: 'Smartphone', group: 'iPhone 16', repairs: 7, isActive: true },
  { id: 3, name: 'Galaxy S25 Ultra', brand: 'Samsung', type: 'Smartphone', group: 'S Series', repairs: 6, isActive: true },
  { id: 4, name: 'Pixel 8', brand: 'Google', type: 'Smartphone', group: 'Pixel', repairs: 5, isActive: true },
  { id: 5, name: 'iPad Pro 12.9"', brand: 'Apple', type: 'iPad', group: 'iPad Pro', repairs: 4, isActive: true },
  { id: 6, name: 'MacBook Pro 14"', brand: 'Apple', type: 'MacBook', group: 'MacBook Pro', repairs: 5, isActive: true },
];

export const repairCategories = [
  { id: 1, title: 'Front screen', slug: 'front-screen', icon: 'screen', services: 86, isActive: true },
  { id: 2, title: 'Back cover', slug: 'back-cover', icon: 'back', services: 42, isActive: true },
  { id: 3, title: 'Battery & charging', slug: 'battery-charging', icon: 'battery', services: 78, isActive: true },
  { id: 4, title: 'Camera (front or rear)', slug: 'camera-repair', icon: 'camera', services: 54, isActive: true },
];

export const repairServices = [
  { id: 1, title: 'iPhone 17 Screen Replacement', model: 'iPhone 17 Pro Max', category: 'Front screen', price: 129, warranty: 'Lifetime', partType: 'standard', isActive: true },
  { id: 2, title: 'Apple Genuine iPhone 17 Screen', model: 'iPhone 17 Pro Max', category: 'Front screen', price: 219, warranty: '12 months', partType: 'genuine', isActive: true },
  { id: 3, title: 'iPhone 17 Battery Replacement', model: 'iPhone 17 Pro Max', category: 'Battery & charging', price: 79, warranty: '12 months', partType: 'standard', isActive: true },
  { id: 4, title: 'Galaxy S25 Ultra Screen', model: 'Galaxy S25 Ultra', category: 'Front screen', price: 199, warranty: '12 months', partType: 'standard', isActive: true },
  { id: 5, title: 'Pixel 8 Battery Replacement', model: 'Pixel 8', category: 'Battery & charging', price: 69, warranty: '12 months', partType: 'standard', isActive: true },
  { id: 6, title: 'iPad Pro Screen Repair', model: 'iPad Pro 12.9"', category: 'Front screen', price: 249, warranty: '12 months', partType: 'standard', isActive: true },
];

export const products = [
  { id: 1, name: 'iPhone 13', brand: 'Apple', type: 'phone', price: 239, originalPrice: 429, stock: 14, tag: 'Top Deal', isActive: true },
  { id: 2, name: 'iPhone 15', brand: 'Apple', type: 'phone', price: 349, originalPrice: 599, stock: 8, tag: null, isActive: true },
  { id: 3, name: 'Galaxy S23', brand: 'Samsung', type: 'phone', price: 399, originalPrice: 699, stock: 2, tag: 'Top Deal', isActive: true },
  { id: 4, name: 'Pixel 8', brand: 'Google', type: 'phone', price: 329, originalPrice: 599, stock: 6, tag: 'Top Deal', isActive: true },
  { id: 5, name: 'Galaxy Z Flip 5', brand: 'Samsung', type: 'phone', price: 459, originalPrice: 759, stock: 1, tag: 'Save £300', isActive: true },
  { id: 6, name: 'iPhone SE', brand: 'Apple', type: 'phone', price: 149, originalPrice: 339, stock: 11, tag: 'Save £190', isActive: false },
];

export const bookings = [
  { id: 'SMZ-B-102341', customer: 'Atika Hamid', device: 'iPhone 17', repair: 'Screen Replacement', method: 'visit-us', store: 'Manchester Arndale', date: '15 Oct 2026', time: '11:00', total: 129, status: 'pending' },
  { id: 'SMZ-B-102342', customer: 'James Wilson', device: 'Galaxy S25 Ultra', repair: 'Screen Repair', method: 'visit-us', store: 'Birmingham Bullring', date: '15 Oct 2026', time: '14:30', total: 199, status: 'confirmed' },
  { id: 'SMZ-B-102343', customer: 'Sophie Taylor', device: 'Pixel 8', repair: 'Battery Replacement', method: 'mail-in', store: '—', date: '14 Oct 2026', time: '—', total: 79, status: 'in_progress' },
  { id: 'SMZ-B-102344', customer: 'David Miller', device: 'iPad Pro', repair: 'Screen Repair', method: 'visit-us', store: 'London Oxford Street', date: '13 Oct 2026', time: '10:00', total: 249, status: 'completed' },
  { id: 'SMZ-B-102345', customer: 'Elena Lau', device: 'MacBook Pro 14"', repair: 'Battery Service', method: 'mail-in', store: '—', date: '12 Oct 2026', time: '—', total: 189, status: 'cancelled' },
];

export const orders = [
  { id: 'SMZ-100234', customer: 'Atika Hamid', type: 'mixed', items: 3, total: 338, payment: 'paypal', paymentStatus: 'paid', orderStatus: 'processing', date: '15 Oct 2026' },
  { id: 'SMZ-100235', customer: 'Marcus Vance', type: 'product', items: 1, total: 249, payment: 'klarna', paymentStatus: 'paid', orderStatus: 'shipped', date: '14 Oct 2026' },
  { id: 'SMZ-100236', customer: 'Hemali Patel', type: 'repair', items: 2, total: 139, payment: 'paypal', paymentStatus: 'pending', orderStatus: 'placed', date: '14 Oct 2026' },
  { id: 'SMZ-100237', customer: 'Samuel Fleischman', type: 'product', items: 1, total: 399, payment: 'paypal', paymentStatus: 'paid', orderStatus: 'completed', date: '13 Oct 2026' },
  { id: 'SMZ-100238', customer: 'David Miller', type: 'product', items: 1, total: 149, payment: 'paypal', paymentStatus: 'failed', orderStatus: 'cancelled', date: '12 Oct 2026' },
];

export const payments = [
  { id: 'TXN-88421', orderId: 'SMZ-100234', provider: 'PayPal', amount: 338, status: 'completed', date: '15 Oct 2026' },
  { id: 'TXN-88422', orderId: 'SMZ-100235', provider: 'Klarna', amount: 249, status: 'completed', date: '14 Oct 2026' },
  { id: 'TXN-88423', orderId: 'SMZ-100236', provider: 'PayPal', amount: 139, status: 'initiated', date: '14 Oct 2026' },
  { id: 'TXN-88424', orderId: 'SMZ-100237', provider: 'PayPal', amount: 399, status: 'completed', date: '13 Oct 2026' },
  { id: 'TXN-88425', orderId: 'SMZ-100238', provider: 'PayPal', amount: 149, status: 'failed', date: '12 Oct 2026' },
];

export const stores = [
  { id: 1, name: 'Manchester Arndale Centre', region: 'Nationwide', city: 'Manchester', postcode: 'M4 3AQ', booking: true, isActive: true },
  { id: 2, name: 'Birmingham Bullring', region: 'Nationwide', city: 'Birmingham', postcode: 'B5 4BU', booking: true, isActive: true },
  { id: 3, name: 'London Oxford Street', region: 'London', city: 'London', postcode: 'W1C 2PL', booking: true, isActive: true },
  { id: 4, name: 'Liverpool One (Sky)', region: 'Nationwide', city: 'Liverpool', postcode: 'L1 8LQ', booking: false, isActive: true },
  { id: 5, name: 'Westfield White City', region: 'London', city: 'London', postcode: 'W12 7GF', booking: true, isActive: true },
];

export const discounts = [
  { id: 1, code: 'SAMZ10', type: 'percent', value: 10, used: 48, maxUses: 500, isActive: true },
  { id: 2, code: 'SAVE10', type: 'percent', value: 10, used: 22, maxUses: 200, isActive: true },
  { id: 3, code: 'FREE5', type: 'fixed', value: 5, used: 91, maxUses: 1000, isActive: true },
  { id: 4, code: 'WELCOME20', type: 'percent', value: 20, used: 15, maxUses: 50, isActive: false },
];

export const reviews = [
  { id: 1, author: 'Hemali Patel', location: 'Charing Cross', rating: 5, source: 'Google review', featured: true },
  { id: 2, author: 'Samuel Fleischman', location: 'Tottenham Court Road', rating: 5, source: 'Google review', featured: true },
  { id: 3, author: 'Elena Lau', location: 'Southampton', rating: 5, source: 'Google review', featured: true },
  { id: 4, author: 'Marcus Vance', location: 'Victoria Station', rating: 5, source: 'Google review', featured: false },
];

export const faqs = [
  { id: 1, pageKey: 'protection', question: 'What does the Protection Pack cover?', isActive: true },
  { id: 2, pageKey: 'warranty', question: 'How long is the repair warranty?', isActive: true },
  { id: 3, pageKey: 'repairs', question: 'How long does a screen repair take?', isActive: true },
  { id: 4, pageKey: 'refurbished', question: 'What condition grades do you offer?', isActive: true },
  { id: 5, pageKey: 'general', question: 'Can I book without an account?', isActive: true },
];

export const cmsPages = [
  { id: 1, pageKey: 'home', pageTitle: 'Home', sections: 4, published: true, updated: '10 Oct 2026' },
  { id: 2, pageKey: 'about-us', pageTitle: 'About Us', sections: 3, published: true, updated: '08 Oct 2026' },
  { id: 3, pageKey: 'warranty', pageTitle: 'Our Warranty', sections: 5, published: true, updated: '08 Oct 2026' },
  { id: 4, pageKey: 'mobile-repairs', pageTitle: 'Mobile Repairs', sections: 3, published: true, updated: '12 Oct 2026' },
  { id: 5, pageKey: 'terms', pageTitle: 'Terms & Conditions', sections: 2, published: true, updated: '01 Sep 2026' },
  { id: 6, pageKey: 'privacy', pageTitle: 'Privacy Policy', sections: 2, published: true, updated: '01 Sep 2026' },
];

export const heroSlides = [
  { id: 1, title: 'Express Phone Repairs', subtitle: 'Same-day screen & battery fixes', cta: 'Book now', isActive: true },
  { id: 2, title: 'Refurbished Devices', subtitle: 'Quality phones from £149', cta: 'Shop now', isActive: true },
  { id: 3, title: 'SAMZ Protection Pack', subtitle: 'Not just a case. It\'s a just in case!', cta: 'Learn more', isActive: true },
];

export const users = [
  { id: 1, name: 'SAMZ Admin', email: 'admin@samz.com', role: 'admin', isActive: true, joined: '01 Jan 2026' },
  { id: 2, name: 'Atika Hamid', email: 'hafizaatikahamid965@gmail.com', role: 'customer', isActive: true, joined: '10 Oct 2026' },
  { id: 3, name: 'James Wilson', email: 'james.w@email.com', role: 'customer', isActive: true, joined: '08 Oct 2026' },
  { id: 4, name: 'Store Staff', email: 'staff@samz.com', role: 'staff', isActive: true, joined: '15 Mar 2026' },
  { id: 5, name: 'Sophie Taylor', email: 'sophie.t@email.com', role: 'customer', isActive: false, joined: '02 Sep 2026' },
];

export const recentActivity = [
  { id: 1, text: 'New booking SMZ-B-102341 — iPhone 17 Screen', time: '12 min ago', type: 'booking' },
  { id: 2, text: 'Payment completed for order SMZ-100234', time: '28 min ago', type: 'payment' },
  { id: 3, text: 'Product Galaxy Z Flip 5 stock low (1 left)', time: '1 hr ago', type: 'stock' },
  { id: 4, text: 'Order SMZ-100235 marked as shipped', time: '2 hrs ago', type: 'order' },
  { id: 5, text: 'New customer registered: Atika Hamid', time: '3 hrs ago', type: 'user' },
];

export const protectionPlans = [
  { id: 1, name: 'SAMZ Protection Pack', price: 29.99, duration: '12 months', covers: 'Accidental damage, screen, liquid', devices: 'Phone', isActive: true },
  { id: 2, name: 'Tablet Protection', price: 39.99, duration: '12 months', covers: 'Screen & body damage', devices: 'iPad / Tablet', isActive: true },
  { id: 3, name: 'Laptop Care Plus', price: 59.99, duration: '12 months', covers: 'Hardware faults & accidental', devices: 'MacBook / Laptop', isActive: true },
  { id: 4, name: 'Family Bundle (3 devices)', price: 79.99, duration: '12 months', covers: 'Multi-device accidental cover', devices: 'Mixed', isActive: false },
];

export const mediaLibrary = [
  { id: 1, name: 'hero-phone-repair.jpg', type: 'image', usedOn: 'Home Hero', size: '420 KB', uploaded: '10 Oct 2026' },
  { id: 2, name: 'refurbished-iphone-13.webp', type: 'image', usedOn: 'Product Gallery', size: '186 KB', uploaded: '12 Oct 2026' },
  { id: 3, name: 'protection-pack-banner.png', type: 'image', usedOn: 'Protection Page', size: '312 KB', uploaded: '08 Oct 2026' },
  { id: 4, name: 'store-manchester.jpg', type: 'image', usedOn: 'Stores / Booking', size: '540 KB', uploaded: '05 Oct 2026' },
  { id: 5, name: 'about-team.jpg', type: 'image', usedOn: 'About Us', size: '398 KB', uploaded: '01 Oct 2026' },
  { id: 6, name: 'warranty-badge.svg', type: 'icon', usedOn: 'Warranty', size: '12 KB', uploaded: '01 Sep 2026' },
];
