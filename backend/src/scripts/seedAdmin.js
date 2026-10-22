require('dotenv').config();
const connectDB = require('../config/db');
const config = require('../config');
const User = require('../models/User');
const Store = require('../models/Store');

const DEFAULT_OPENING_HOURS = [
  { day: 'monday', open: '10:00', close: '18:30', closed: false },
  { day: 'tuesday', open: '10:00', close: '18:30', closed: false },
  { day: 'wednesday', open: '10:00', close: '18:30', closed: false },
  { day: 'thursday', open: '10:00', close: '18:30', closed: false },
  { day: 'friday', open: '10:00', close: '18:30', closed: false },
  { day: 'saturday', open: '10:00', close: '18:30', closed: false },
  { day: 'sunday', open: '10:00', close: '18:30', closed: true },
];

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = config.adminSeed.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`Updated existing user to admin: ${email}`);
      } else {
        console.log(`Admin already exists: ${email}`);
      }
    } else {
      await User.create({
        name: config.adminSeed.name,
        email,
        password: config.adminSeed.password,
        role: 'admin',
        isActive: true,
      });
      console.log(`Admin created: ${email}`);
      console.log(`Password: ${config.adminSeed.password}`);
    }

    const storeSeed = {
      key: 'primary',
      slug: 'samz-service-centre',
      name: 'SAMZ Service Centre',
      region: 'London',
      address: '123 High Street, London EC1A 1BB',
      city: 'London',
      postcode: 'EC1A 1BB',
      phone: '',
      openingHours: DEFAULT_OPENING_HOURS,
      availableForBooking: true,
      timeSlots: Store.DEFAULT_TIME_SLOTS,
      isActive: true,
    };

    const store = await Store.findOneAndUpdate(
      { key: 'primary' },
      { $setOnInsert: storeSeed },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`Store ready: ${store.name} (${store._id})`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
