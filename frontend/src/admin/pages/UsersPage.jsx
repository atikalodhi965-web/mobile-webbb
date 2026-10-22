import React from 'react';
<<<<<<< HEAD
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
=======
import AdminLivePage from '../components/AdminLivePage';
import StatusBadge from '../components/StatusBadge';
import useAdminResource from '../hooks/useAdminResource';
import { userApi } from '../services/adminApi';

const UsersPage = () => {
  const resource = useAdminResource(userApi);

  const COLUMNS = [
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
  ];

  const FORM_FIELDS = [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'phone', label: 'Phone' },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'staff', label: 'Staff' },
        { value: 'customer', label: 'Customer' },
      ],
      required: true,
    },
    { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
    { name: 'marketingOptIn', label: 'Marketing Opt‑In', type: 'checkbox' },
  ];

  const buildPayload = (vals) => vals;

  return (
    <AdminLivePage
      title="Customers & Staff"
      subtitle="Admin, store staff, and customer accounts"
      actionLabel="Add User"
      columns={COLUMNS}
      searchKeys={['name', 'email', 'role']}
      searchPlaceholder="Search users…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};
>>>>>>> 8f997a0 (Fix frontend tracking)

export default UsersPage;
