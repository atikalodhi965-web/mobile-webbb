const generateOrderNumber = () =>
  `SMZ-${Math.floor(100000 + Math.random() * 900000)}`;

const generateBookingNumber = () =>
  `SMZ-B-${Math.floor(100000 + Math.random() * 900000)}`;

module.exports = { generateOrderNumber, generateBookingNumber };
