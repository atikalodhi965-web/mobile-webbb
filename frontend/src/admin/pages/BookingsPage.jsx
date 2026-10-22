import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { bookings } from '../data/staticAdminData';

const BookingsPage = () => (
  <AdminResourcePage
    title="Repair Bookings"
    subtitle="Visit-us and mail-in appointments — update status and store"
    actionLabel="New Booking"
    searchKeys={['id', 'customer', 'device', 'repair', 'method', 'store', 'status']}
    searchPlaceholder="Search bookings…"
    rows={bookings}
    columns={[
      { key: 'id', label: 'Booking' },
      { key: 'customer', label: 'Customer' },
      { key: 'device', label: 'Device' },
      { key: 'repair', label: 'Repair' },
      {
        key: 'method',
        label: 'Method',
        render: (r) => <span className="capitalize">{r.method.replace(/-/g, ' ')}</span>,
      },
      { key: 'store', label: 'Store' },
      {
        key: 'schedule',
        label: 'Schedule',
        render: (r) => `${r.date}${r.time !== '—' ? ` · ${r.time}` : ''}`,
      },
      {
        key: 'total',
        label: 'Total',
        render: (r) => `£${r.total}`,
      },
      {
        key: 'status',
        label: 'Status',
        render: (r) => <StatusBadge status={r.status} />,
      },
    ]}
  />
);

export default BookingsPage;
