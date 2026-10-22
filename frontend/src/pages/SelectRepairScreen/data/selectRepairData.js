// Static repair data for iPhone models and repair sub-categories

export const repairCategories = [
  {
    id: 'front-screen',
    title: 'Front screen',
    shortTitle: 'Front screen',
    icon: 'screen',
  },
  {
    id: 'back-cover',
    title: 'Back cover',
    shortTitle: 'Back cover',
    icon: 'back',
  },
  {
    id: 'battery-charging',
    title: 'Battery & charging',
    shortTitle: 'Battery & charging',
    icon: 'battery',
  },
  {
    id: 'camera-repair',
    title: 'Camera (front or rear)',
    shortTitle: 'Camera repair',
    icon: 'camera',
  },
];

// Helper to generate repair options dynamically per device model
export const getModelRepairData = (modelId, modelName = 'iPhone 17') => {
  const formattedName = modelName || 'iPhone 17';

  return {
    'front-screen': [
      {
        id: `${modelId}-screen-standard`,
        title: `${formattedName} Screen Replacement`,
        price: '£129',
        priceNumber: 129,
        icon: 'screen',
        description:
          'Have you cracked or smashed your screen? Bring your device back to life with a shiny new replacement OLED screen. Get that new phone feeling again!',
        warranty: 'Lifetime',
        repairTime: 'Up to 60 minutes',
        note: 'Please ensure you book online prior to arriving, so we can make sure your required part is on site and ready for your repair. Note: this time is an estimate, and may vary slightly depending on location.',
      },
      {
        id: `${modelId}-screen-genuine`,
        title: `Apple Genuine ${formattedName} Screen Replacement`,
        price: '£219',
        priceNumber: 219,
        icon: 'screen',
        description:
          'Official Apple Genuine screen replacement installed by certified technicians using original Apple parts. Preserves full original display quality and system calibration.',
        warranty: '12 months',
        repairTime: 'Up to 60 minutes',
        note: 'Please ensure you book online prior to arriving, so we can make sure your required part is on site and ready for your repair. Note: this time is an estimate, and may vary slightly depending on location.',
      },
    ],
    'back-cover': [
      {
        id: `${modelId}-back-glass`,
        title: `${formattedName} Rear Back Glass Replacement`,
        price: '£89',
        priceNumber: 89,
        icon: 'back',
        description:
          'Cracked or smashed back glass? We restore your phone back housing to mint condition with premium back glass replacement.',
        warranty: '12 months',
        repairTime: 'Up to 90 minutes',
        note: 'Please ensure you book online prior to arriving, so we can make sure your required part is on site and ready for your repair.',
      },
    ],
    'battery-charging': [
      {
        id: `${modelId}-battery-standard`,
        title: `${formattedName} Battery Replacement`,
        price: '£79',
        priceNumber: 79,
        icon: 'battery',
        description:
          "Please note: An 'Important Battery Message' will temporarily appear, before disappearing into the 'Settings' app after 48 hours. The ability to view your battery health within the 'Settings' app will also be removed. This does not affect the functionality or performance of your device in any other way, but is used by Apple to promote the use of their own batteries.",
        warranty: '12 months',
        repairTime: 'Up to 60 minutes',
        note: 'Please ensure you book online prior to arriving, so we can make sure your required part is on site and ready for your repair. Note: this time is an estimate, and may vary slightly depending on location.',
      },
      {
        id: `${modelId}-battery-genuine`,
        title: `Apple Genuine ${formattedName} Battery Replacement`,
        price: '£169',
        priceNumber: 169,
        icon: 'battery',
        description:
          'Is your battery no longer lasting the day? Our highly-trained technicians can fix it with a brand new replacement!',
        warranty: '3 Months',
        repairTime: 'Up to 60 minutes',
        note: 'Please ensure you book online prior to arriving, so we can make sure your required part is on site and ready for your repair. Note: this time is an estimate, and may vary slightly depending on location.',
      },
    ],
    'camera-repair': [
      {
        id: `${modelId}-rear-camera`,
        title: `${formattedName} Rear Camera Replacement`,
        price: '£99',
        priceNumber: 99,
        icon: 'camera',
        description:
          'Blurry photos or broken camera lens? We replace the rear camera module to get your photos crisp and clear again.',
        warranty: '12 months',
        repairTime: 'Up to 60 minutes',
        note: 'Please ensure you book online prior to arriving, so we can make sure your required part is on site and ready for your repair.',
      },
      {
        id: `${modelId}-front-camera`,
        title: `${formattedName} Front Camera & Sensor Repair`,
        price: '£79',
        priceNumber: 79,
        icon: 'camera',
        description:
          'Fix front selfie camera issues, proximity sensor, or microphone functionality quickly and reliably.',
        warranty: '12 months',
        repairTime: 'Up to 45 minutes',
        note: 'Please ensure you book online prior to arriving.',
      },
    ],
  };
};
