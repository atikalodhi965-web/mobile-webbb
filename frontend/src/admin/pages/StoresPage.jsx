import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { stores } from '../data/staticAdminData';

const StoresPage = () => (
  <AdminResourcePage
    title="Stores"
    subtitle="Locations available for in-store repair bookings"
    actionLabel="Add Store"
    searchKeys={['name', 'city', 'region', 'postcode']}
    searchPlaceholder="Search stores…"
    rows={stores}
    columns={[
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Store' },
      { key: 'city', label: 'City' },
      { key: 'region', label: 'Region' },
      { key: 'postcode', label: 'Postcode' },
      {
        key: 'booking',
        label: 'Booking',
        render: (r) => <StatusBadge status={r.booking ? 'active' : 'inactive'} />,
      },
      {
        key: 'isActive',
        label: 'Status',
        render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
      },
    ]}
  />
);

export default StoresPage;
