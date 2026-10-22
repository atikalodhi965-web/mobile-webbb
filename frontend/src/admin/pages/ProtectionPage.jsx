import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { protectionPlans } from '../data/staticAdminData';

const ProtectionPage = () => (
  <AdminResourcePage
    title="Protection Plan"
    subtitle="SAMZ Protection Pack pricing and coverage options"
    actionLabel="Add Plan"
    searchKeys={['name', 'covers', 'devices']}
    searchPlaceholder="Search plans…"
    rows={protectionPlans}
    columns={[
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Plan' },
      {
        key: 'price',
        label: 'Price',
        render: (r) => `£${r.price}`,
      },
      { key: 'duration', label: 'Duration' },
      { key: 'covers', label: 'Covers' },
      { key: 'devices', label: 'Devices' },
      {
        key: 'isActive',
        label: 'Status',
        render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
      },
    ]}
  />
);

export default ProtectionPage;
