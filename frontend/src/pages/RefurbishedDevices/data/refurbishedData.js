export const REFURBISHED_PRODUCTS = [
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: 'Top Deal',
    colors: [
      { name: 'Blue', hex: '#2D5C7F', phoneBg: '#255273', screenGradient: 'from-blue-900 via-teal-800 to-indigo-950' },
      { name: 'Starlight', hex: '#F5F5F7', phoneBg: '#E2E8F0', screenGradient: 'from-amber-700 via-orange-800 to-amber-950' },
      { name: 'Midnight', hex: '#1C1C1E', phoneBg: '#0F172A', screenGradient: 'from-slate-900 via-gray-900 to-zinc-950' },
      { name: 'Pink', hex: '#F9D0DC', phoneBg: '#F472B6', screenGradient: 'from-rose-800 via-pink-900 to-purple-950' },
    ],
    capacities: ['128GB', '256GB', '512GB'],
    conditions: ['Fair', 'Fair+', 'Good'],
    conditionPrices: [
      { condition: 'Fair', price: 239 },
      { condition: 'Fair+', price: 249 },
      { condition: 'Good', price: 269 }
    ],
    price: 239,
    originalPrice: 429,
    savings: 190,
    type: 'phone',
    imageType: 'iphone13',
    description: {
      text: "A refurbished iPhone 13 offers the perfect balance of performance and value. This renewed phone features a dual-camera system with Cinematic Mode, allowing anyone to shoot professional-looking videos with automatic focus shifts. With its vibrant OLED screen and the A15 Bionic chip, it's a modern, high-speed device that fits comfortably in the hand and budget of most users.",
      bullets: [
        { title: 'Cinematic Mode:', text: 'Professional focus-tracking for your videos.' },
        { title: 'Diagonal Camera Layout:', text: 'Larger sensors for better light intake and detail.' },
        { title: 'Base 128GB Storage:', text: 'Twice the starting storage of the previous generation.' },
        { title: 'A15 Bionic:', text: 'Incredible efficiency and power for gaming and apps.' },
        { title: 'IP68 Water Resistance:', text: 'Protection against accidental spills and drops in water.' },
        { title: 'Vibrant OLED:', text: 'Super Retina XDR display with high peak brightness.' },
        { title: 'MagSafe Support:', text: 'Use a wide range of magnetic chargers and accessories.' },
        { title: 'Cost-Effective Upgrade:', text: 'The "sweet spot" of the current iPhone lineup' }
      ]
    },
    warranty: "Your device will come with a 24-Month Warranty from SAMZ, so if it stops working or has developed any faults, not as a result of accidental or liquid damage, we'll repair or replace it at no cost to you. If we replace your device, the warranty continues for the remainder of your 24 months from the date of the initial purchase. In addition, our 36-month battery guarantee means that if your battery falls below 80% at any point during this period, we'll replace it in-store, up to three times.",
    returns: "Purchases made online must be returned using our online returns process. Purchases made in-store must be returned to the original SAMZ store."
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: null,
    colors: [
      { name: 'Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-zinc-900 via-gray-900 to-black' },
      { name: 'Blue', hex: '#7998AD', phoneBg: '#3B82F6', screenGradient: 'from-blue-800 via-sky-800 to-indigo-900' },
      { name: 'Pink', hex: '#F9D0DC', phoneBg: '#EC4899', screenGradient: 'from-pink-800 via-rose-800 to-purple-900' },
      { name: 'Yellow', hex: '#F3E5AB', phoneBg: '#EAB308', screenGradient: 'from-yellow-700 via-amber-800 to-orange-950' },
      { name: 'Green', hex: '#C2DFD3', phoneBg: '#10B981', screenGradient: 'from-emerald-800 via-teal-800 to-slate-900' },
    ],
    capacities: ['128GB', '256GB', '512GB'],
    conditions: ['Fair+', 'Good', 'Excellent'],
    conditionPrices: [
      { condition: 'Fair+', price: 349 },
      { condition: 'Good', price: 379 },
      { condition: 'Excellent', price: 419 }
    ],
    price: 349,
    originalPrice: 599,
    savings: 250,
    type: 'phone',
    imageType: 'iphone15',
    description: {
      text: "The refurbished iPhone 15 features the groundbreaking Dynamic Island, a powerful 48MP Main camera with 2x Telephoto, USB-C integration, and a durable color-infused glass design.",
      bullets: [
        { title: 'Dynamic Island:', text: 'Bubbles up alerts and Live Activities seamlessly.' },
        { title: '48MP Main Camera:', text: 'Super-high resolution photos with 2x Telephoto zoom.' },
        { title: 'A16 Bionic Chip:', text: 'Powers advanced camera features and high-framerate gaming.' },
        { title: 'USB-C Charging:', text: 'Universal connectivity for quick charging and data transfer.' },
        { title: 'Color-Infused Glass:', text: 'Back glass infused with rich color across the material.' }
      ]
    },
    warranty: "Your iPhone 15 includes a comprehensive 24-Month SAMZ Warranty covering internal defects and hardware faults. Plus, enjoy our 36-month battery health guarantee.",
    returns: "Online purchases qualify for hassle-free 14-day returns via our online portal. In-store purchases can be returned directly to any SAMZ store location."
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: null,
    colors: [
      { name: 'Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-zinc-900 via-slate-900 to-black' },
      { name: 'White', hex: '#F5F5F5', phoneBg: '#E2E8F0', screenGradient: 'from-slate-700 via-zinc-800 to-slate-900' },
      { name: 'Pink', hex: '#F9D0DC', phoneBg: '#F472B6', screenGradient: 'from-rose-800 via-pink-900 to-purple-950' },
      { name: 'Teal', hex: '#A8E6CF', phoneBg: '#14B8A6', screenGradient: 'from-teal-800 via-emerald-900 to-cyan-950' },
      { name: 'Ultramarine', hex: '#8B95C9', phoneBg: '#6366F1', screenGradient: 'from-indigo-900 via-blue-900 to-purple-950' },
    ],
    capacities: ['128GB', '256GB', '512GB'],
    conditions: ['Good', 'Excellent'],
    conditionPrices: [
      { condition: 'Good', price: 549 },
      { condition: 'Excellent', price: 599 }
    ],
    price: 549,
    originalPrice: 799,
    savings: 250,
    type: 'phone',
    imageType: 'iphone16',
    description: {
      text: "Experience cutting-edge performance with the refurbished iPhone 16 featuring Apple Intelligence support, revolutionary Camera Control button, and the ultra-fast A18 chip.",
      bullets: [
        { title: 'Camera Control:', text: 'Tactile slider for instant photo and video adjustments.' },
        { title: 'A18 Chip:', text: '2 generations ahead with incredible battery efficiency.' },
        { title: 'Action Button:', text: 'Customizable single-press shortcut to your favorite feature.' },
        { title: 'Super Retina XDR:', text: '6.1-inch OLED with Ceramic Shield front glass.' }
      ]
    },
    warranty: "Covered by our 24-Month SAMZ Warranty against mechanical and electrical defects, with 36-Month Battery Replacement protection.",
    returns: "Returns must be requested within 14 days of receipt using our online returns authorization."
  },
  {
    id: 'iphone-se-2020',
    name: 'iPhone SE',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: 'Save £190',
    colors: [
      { name: 'Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'White', hex: '#F5F5F5', phoneBg: '#E2E8F0', screenGradient: 'from-stone-700 via-slate-800 to-zinc-900' },
      { name: 'Red', hex: '#D00000', phoneBg: '#DC2626', screenGradient: 'from-red-900 via-rose-950 to-slate-950' },
    ],
    capacities: ['64GB', '128GB', '256GB'],
    conditions: ['Fair', 'Fair+'],
    conditionPrices: [
      { condition: 'Fair', price: 149 },
      { condition: 'Fair+', price: 169 }
    ],
    price: 149,
    originalPrice: 339,
    savings: 190,
    type: 'phone',
    imageType: 'iphonese',
    description: {
      text: "Compact and powerful, the refurbished iPhone SE combines Apple's classic tactile home button design with high-speed processing and 4K video recording.",
      bullets: [
        { title: 'Touch ID:', text: 'Secure fingerprint sensor integrated into home button.' },
        { title: 'Compact 4.7" Display:', text: 'Ultra-portable design for one-handed operation.' },
        { title: 'A13 Bionic:', text: 'Proven speed for daily apps and photography.' }
      ]
    },
    warranty: "Full 24-Month Warranty included with every refurbished iPhone SE.",
    returns: "Online orders include 14-day full return privileges."
  },
  {
    id: 'iphone-13-mini',
    name: 'iPhone 13 mini',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: 'Save £210',
    colors: [
      { name: 'Starlight', hex: '#F5F5F5', phoneBg: '#E2E8F0', screenGradient: 'from-slate-700 via-stone-800 to-zinc-900' },
      { name: 'Midnight', hex: '#1F1F1F', phoneBg: '#0F172A', screenGradient: 'from-slate-900 via-gray-900 to-zinc-950' },
      { name: 'Blue', hex: '#4F709C', phoneBg: '#255273', screenGradient: 'from-blue-900 via-indigo-950 to-slate-950' },
    ],
    capacities: ['128GB', '256GB'],
    conditions: ['Fair+', 'Good'],
    conditionPrices: [
      { condition: 'Fair+', price: 219 },
      { condition: 'Good', price: 239 }
    ],
    price: 219,
    originalPrice: 429,
    savings: 210,
    type: 'phone',
    imageType: 'iphone13mini',
    description: {
      text: "Full iPhone 13 flagship power built into a pocket-sized 5.4-inch chassis. Perfect for those who love compact phones without compromising on speed or camera quality.",
      bullets: [
        { title: '5.4" Super Retina OLED:', text: 'Vibrant, sharp display in a small form factor.' },
        { title: 'Cinematic Mode:', text: 'Shallow depth of field video capture.' }
      ]
    },
    warranty: "24-Month Warranty and 36-Month Battery Guarantee included.",
    returns: "Returnable within 14 days of delivery in original condition."
  },
  {
    id: 'iphone-11',
    name: 'iPhone 11',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: 'Save £270',
    colors: [
      { name: 'Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'White', hex: '#F5F5F5', phoneBg: '#E2E8F0', screenGradient: 'from-stone-700 via-slate-800 to-zinc-900' },
      { name: 'Purple', hex: '#CDB4DB', phoneBg: '#A855F7', screenGradient: 'from-purple-900 via-indigo-950 to-slate-950' },
      { name: 'Green', hex: '#B5EAD7', phoneBg: '#10B981', screenGradient: 'from-emerald-900 via-teal-950 to-slate-950' },
    ],
    capacities: ['64GB', '128GB', '256GB'],
    conditions: ['Fair', 'Fair+'],
    conditionPrices: [
      { condition: 'Fair', price: 169 },
      { condition: 'Fair+', price: 189 }
    ],
    price: 169,
    originalPrice: 439,
    savings: 270,
    type: 'phone',
    imageType: 'iphone11',
    description: {
      text: "The iPhone 11 features a versatile dual 12MP camera system with Ultra Wide and Night mode capabilities, coupled with Liquid Retina HD display and long battery life.",
      bullets: [
        { title: 'Ultra Wide Camera:', text: 'Capture 4x more scene in every shot.' },
        { title: 'Night Mode:', text: 'Auto low-light enhancement for natural photos.' }
      ]
    },
    warranty: "Backed by 24-Month SAMZ Hardware Protection Warranty.",
    returns: "Full return coverage within 14 days of purchase."
  },
  {
    id: 'samsung-galaxy-s23',
    name: 'Galaxy S23',
    brand: 'Samsung',
    category: 'Samsung',
    tagline: 'Cheeky Refurb',
    tag: 'Top Deal',
    colors: [
      { name: 'Phantom Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'Cream', hex: '#FAF0E6', phoneBg: '#FEF08A', screenGradient: 'from-amber-900 via-orange-950 to-zinc-950' },
      { name: 'Green', hex: '#4E6C50', phoneBg: '#15803D', screenGradient: 'from-emerald-900 via-green-950 to-slate-950' },
      { name: 'Lavender', hex: '#E6E6FA', phoneBg: '#C084FC', screenGradient: 'from-purple-900 via-fuchsia-950 to-slate-950' },
    ],
    capacities: ['128GB', '256GB'],
    conditions: ['Good', 'Excellent'],
    conditionPrices: [
      { condition: 'Good', price: 399 },
      { condition: 'Excellent', price: 449 }
    ],
    price: 399,
    originalPrice: 699,
    savings: 300,
    type: 'phone',
    imageType: 'samsung',
    description: {
      text: "The Galaxy S23 delivers pro-grade Nightography cameras, Snapdragon 8 Gen 2 for Galaxy processor, and smooth 120Hz Dynamic AMOLED 2X display.",
      bullets: [
        { title: '50MP Pro Camera:', text: 'DetailDetail Detail Detail detail detail.' },
        { title: 'Nightography:', text: 'AI-enhanced dark room photo clarity.' },
        { title: '120Hz AMOLED:', text: 'Ultra-responsive adaptive refresh rate.' }
      ]
    },
    warranty: "24-Month SAMZ Warranty covering all component repair costs.",
    returns: "14-day online return guarantee included."
  },
  {
    id: 'samsung-galaxy-s22',
    name: 'Galaxy S22',
    brand: 'Samsung',
    category: 'Samsung',
    tagline: 'Cheeky Refurb',
    tag: 'Save £200',
    colors: [
      { name: 'Phantom Black', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'Pink Gold', hex: '#E8C5C8', phoneBg: '#F472B6', screenGradient: 'from-pink-900 via-rose-950 to-slate-950' },
      { name: 'Green', hex: '#3B5249', phoneBg: '#15803D', screenGradient: 'from-emerald-900 via-slate-950 to-black' },
    ],
    capacities: ['128GB', '256GB'],
    conditions: ['Fair+', 'Good'],
    conditionPrices: [
      { condition: 'Fair+', price: 289 },
      { condition: 'Good', price: 319 }
    ],
    price: 289,
    originalPrice: 489,
    savings: 200,
    type: 'phone',
    imageType: 'samsung',
    description: {
      text: "Featuring armor aluminum frame and Gorilla Glass Victus+, the Galaxy S22 is built for durability with professional video stabilization.",
      bullets: [
        { title: 'Armor Aluminum:', text: 'Tougher drop-resistant frame construction.' },
        { title: 'Vision Booster:', text: 'Optimal outdoor screen visibility.' }
      ]
    },
    warranty: "24-Month SAMZ Warranty provided.",
    returns: "Returns accepted within 14 days of delivery."
  },
  {
    id: 'google-pixel-8',
    name: 'Pixel 8',
    brand: 'Google',
    category: 'Google',
    tagline: 'Cheeky Refurb',
    tag: 'Top Deal',
    colors: [
      { name: 'Obsidian', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'Hazel', hex: '#778877', phoneBg: '#475569', screenGradient: 'from-slate-800 via-zinc-900 to-black' },
      { name: 'Rose', hex: '#F9D0DC', phoneBg: '#F472B6', screenGradient: 'from-rose-900 via-pink-950 to-slate-950' },
    ],
    capacities: ['128GB', '256GB'],
    conditions: ['Good', 'Excellent'],
    conditionPrices: [
      { condition: 'Good', price: 329 },
      { condition: 'Excellent', price: 369 }
    ],
    price: 329,
    originalPrice: 599,
    savings: 270,
    type: 'phone',
    imageType: 'pixel',
    description: {
      text: "Google Pixel 8 is engineered with Google Tensor G3 for custom AI processing, Best Take photo editing, and 7 years of software security updates.",
      bullets: [
        { title: 'Tensor G3 AI:', text: 'Powers Real Tone, Audio Magic Eraser & Best Take.' },
        { title: 'Actua Display:', text: 'Super bright 6.2-inch 120Hz display.' }
      ]
    },
    warranty: "Includes 24-Month SAMZ Technical Warranty.",
    returns: "14 days return policy apply."
  },
  {
    id: 'google-pixel-7a',
    name: 'Pixel 7a',
    brand: 'Google',
    category: 'Google',
    tagline: 'Cheeky Refurb',
    tag: 'Save £150',
    colors: [
      { name: 'Charcoal', hex: '#2F3E46', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'Sea', hex: '#A8DADC', phoneBg: '#0284C7', screenGradient: 'from-sky-900 via-indigo-950 to-slate-950' },
      { name: 'Snow', hex: '#F8F9FA', phoneBg: '#E2E8F0', screenGradient: 'from-slate-700 via-zinc-800 to-slate-900' },
    ],
    capacities: ['128GB'],
    conditions: ['Fair+', 'Good'],
    conditionPrices: [
      { condition: 'Fair+', price: 219 },
      { condition: 'Good', price: 249 }
    ],
    price: 219,
    originalPrice: 369,
    savings: 150,
    type: 'phone',
    imageType: 'pixel',
    description: {
      text: "The Pixel 7a delivers Google Tensor G2 performance, wireless charging capability, and a 64MP camera at an incredible value.",
      bullets: [
        { title: '64MP Main Camera:', text: 'High resolution low light clarity.' },
        { title: 'Wireless Charging:', text: 'Convenient cable-free power up.' }
      ]
    },
    warranty: "Covered by 24-Month SAMZ Warranty.",
    returns: "Online order returns accepted within 14 days."
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    brand: 'Apple',
    category: 'iPhone',
    tagline: 'Cheeky Refurb',
    tag: 'Top Deal',
    colors: [
      { name: 'Midnight', hex: '#1F1F1F', phoneBg: '#0F172A', screenGradient: 'from-slate-900 via-gray-900 to-zinc-950' },
      { name: 'Starlight', hex: '#F5F5F5', phoneBg: '#E2E8F0', screenGradient: 'from-stone-700 via-slate-800 to-zinc-900' },
      { name: 'Blue', hex: '#A2C4C9', phoneBg: '#0284C7', screenGradient: 'from-sky-900 via-indigo-950 to-slate-950' },
      { name: 'Purple', hex: '#D6C7E2', phoneBg: '#A855F7', screenGradient: 'from-purple-900 via-indigo-950 to-slate-950' },
    ],
    capacities: ['128GB', '256GB', '512GB'],
    conditions: ['Good', 'Excellent'],
    conditionPrices: [
      { condition: 'Good', price: 299 },
      { condition: 'Excellent', price: 339 }
    ],
    price: 299,
    originalPrice: 549,
    savings: 250,
    type: 'phone',
    imageType: 'iphone14',
    description: {
      text: "Refurbished iPhone 14 features Crash Detection safety system, enhanced low-light Photonic Engine camera processing, and all-day battery performance.",
      bullets: [
        { title: 'Photonic Engine:', text: 'Dramatically improves low-light photo detail.' },
        { title: 'Action Mode:', text: 'Smooth video recording without a gimbal.' }
      ]
    },
    warranty: "24-Month SAMZ Warranty and 36-Month Battery Guarantee included.",
    returns: "Returns process supported within 14 days of delivery."
  },
  {
    id: 'samsung-z-flip-5',
    name: 'Galaxy Z Flip 5',
    brand: 'Samsung',
    category: 'Samsung',
    tagline: 'Cheeky Refurb',
    tag: 'Save £300',
    colors: [
      { name: 'Graphite', hex: '#1F1F1F', phoneBg: '#18181B', screenGradient: 'from-slate-900 via-gray-900 to-black' },
      { name: 'Mint', hex: '#D4F1F4', phoneBg: '#14B8A6', screenGradient: 'from-teal-900 via-emerald-950 to-slate-950' },
      { name: 'Lavender', hex: '#E6E6FA', phoneBg: '#C084FC', screenGradient: 'from-purple-900 via-fuchsia-950 to-slate-950' },
    ],
    capacities: ['256GB', '512GB'],
    conditions: ['Good', 'Excellent'],
    conditionPrices: [
      { condition: 'Good', price: 459 },
      { condition: 'Excellent', price: 499 }
    ],
    price: 459,
    originalPrice: 759,
    savings: 300,
    type: 'phone',
    imageType: 'samsung',
    description: {
      text: "The Galaxy Z Flip 5 features a redesigned Flex Hinge, large 3.4-inch Flex Window outer screen for quick widgets and hands-free selfie camera angles.",
      bullets: [
        { title: '3.4" Flex Window:', text: 'Reply to messages and preview photos when folded.' },
        { title: 'Flex Cam:', text: 'Hands-free group shots and video vlogging.' }
      ]
    },
    warranty: "24-Month SAMZ Warranty covering folding screen mechanism and internals.",
    returns: "14 days return policy from order delivery date."
  }
];

export const getProductById = (id) => {
  return REFURBISHED_PRODUCTS.find((p) => p.id === id) || REFURBISHED_PRODUCTS[0];
};
