import { useState, useEffect, useCallback } from 'react';
import { createBooking, getMyBookings, getBookingById, cancelBooking } from '../services/bookingService';
import { errorMessage } from '../lib/unwrap';

export const useCreateBooking = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createBooking(bookingData);
      setBooking(data);
      return data;
    } catch (err) {
      const msg = errorMessage(err, 'Booking failed');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setBooking(null);
    setError(null);
  }, []);

  return { submitBooking, booking, loading, error, reset };
};

export const useMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : data?.bookings ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { bookings, loading, error, refetch };
};

export const useBookingById = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getBookingById(id)
      .then(setBooking)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return { booking, loading, error };
};

export const useCancelBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancel = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await cancelBooking(id);
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading, error };
};
