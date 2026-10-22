/** Pull `data` out of the backend { success, message, data } envelope. */
export const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

export const errorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.message || fallback;

export const isMongoId = (value) =>
  typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
