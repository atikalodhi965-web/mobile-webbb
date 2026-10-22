const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/apiResponse');
const { requireSingleStore, getAvailableSlots } = require('../../services/storeService');

const getCurrentStore = asyncHandler(async (req, res) => {
  const store = await requireSingleStore({ requireActive: true });
  sendSuccess(res, { message: 'Store fetched', data: store });
});

const getStoreSlots = asyncHandler(async (req, res) => {
  const store = await requireSingleStore({ requireActive: true });
  const slots = await getAvailableSlots(req.query.date, store);
  sendSuccess(res, { message: 'Slots fetched', data: slots });
});

module.exports = { getCurrentStore, getStoreSlots };
