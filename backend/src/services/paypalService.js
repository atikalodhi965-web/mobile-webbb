const config = require('../config');
const ApiError = require('../utils/ApiError');

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Fetch OAuth 2.0 access token using PayPal Client ID and Client Secret
 */
const getAccessToken = async () => {
  const { clientId, clientSecret, baseUrl } = config.paypal;

  if (!clientId || !clientSecret) {
    throw new ApiError(
      500,
      'PayPal credentials missing. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in backend .env'
    );
  }

  // Return cached token if valid (with 60-second safety margin)
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDesc = data.error_description || data.message || 'Failed to authenticate with PayPal';
    throw new ApiError(response.status, `PayPal Auth Error: ${errorDesc}`);
  }

  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

  return cachedToken;
};

/**
 * Create a PayPal Order via PayPal REST API v2
 * @param {Object} options
 * @param {number} options.amount
 * @param {string} [options.currency]
 * @param {string} [options.referenceId]
 * @param {string} [options.description]
 * @param {string} [options.customId]
 * @returns {Promise<Object>}
 */
const createOrder = async ({
  amount,
  currency = config.paypal.currency || 'GBP',
  referenceId,
  description = 'SAMZ Store Purchase',
  customId,
}) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new ApiError(400, 'Invalid payment amount.');
  }

  const accessToken = await getAccessToken();
  const { baseUrl } = config.paypal;

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: referenceId ? String(referenceId) : undefined,
        custom_id: customId ? String(customId) : undefined,
        description: description ? String(description).slice(0, 127) : undefined,
        amount: {
          currency_code: currency,
          value: numericAmount.toFixed(2),
        },
      },
    ],
  };

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDetails = data.details?.map((d) => `${d.issue}: ${d.description}`).join('; ') || data.message;
    throw new ApiError(response.status, `PayPal Create Order Failed: ${errorDetails || response.statusText}`);
  }

  return data;
};

/**
 * Capture payment for an approved PayPal Order via PayPal REST API v2
 * @param {string} paypalOrderId
 * @returns {Promise<Object>}
 */
const captureOrder = async (paypalOrderId) => {
  if (!paypalOrderId) {
    throw new ApiError(400, 'PayPal Order ID is required for capture.');
  }

  const accessToken = await getAccessToken();
  const { baseUrl } = config.paypal;

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDetails = data.details?.map((d) => `${d.issue}: ${d.description}`).join('; ') || data.message;
    throw new ApiError(response.status, `PayPal Capture Failed: ${errorDetails || response.statusText}`);
  }

  return data;
};

/**
 * Retrieve details for a PayPal Order
 * @param {string} paypalOrderId
 * @returns {Promise<Object>}
 */
const getOrderDetails = async (paypalOrderId) => {
  if (!paypalOrderId) {
    throw new ApiError(400, 'PayPal Order ID is required.');
  }

  const accessToken = await getAccessToken();
  const { baseUrl } = config.paypal;

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'Failed to fetch PayPal order');
  }

  return data;
};

module.exports = {
  getAccessToken,
  createOrder,
  captureOrder,
  getOrderDetails,
};
