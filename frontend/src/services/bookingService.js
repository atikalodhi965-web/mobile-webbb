/**
 * Module F: Repair Bookings
 */
import apiClient from '../lib/apiClient';
import { unwrap } from '../lib/unwrap';

export const createBooking = async (bookingData) =>
  unwrap(await apiClient.post('/bookings', bookingData));

export const getMyBookings = async () => unwrap(await apiClient.get('/bookings/my'));

export const getBookingById = async (id) => unwrap(await apiClient.get(`/bookings/${id}`));

export const cancelBooking = async (id) =>
  unwrap(await apiClient.patch(`/bookings/${id}/cancel`));
