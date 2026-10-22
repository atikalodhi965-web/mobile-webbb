import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { users } from '../data/staticAdminData';

const UsersPage = () => (
  <AdminResourcePage
    title="Customers & Staff"
    subtitle="Admin, store staff, and customer accounts"
    actionLabel="Add User"
    searchKeys={['name', 'email', 'role']}
    searchPlaceholder="Search users…"
    rows={users}
    columns={[
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      {
        key: 'role',
        label: 'Role',
        render: (r) => <StatusBadge status={r.role} />,
      },
      {
        key: 'isActive',
        label: 'Status',
        render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
      },
      { key: 'joined', label: 'Joined' },
    ]}
  />
);

export default UsersPage;
