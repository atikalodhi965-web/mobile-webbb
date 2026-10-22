import React from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import StatusBadge from '../components/StatusBadge';
import { paymentApi } from '../services/adminApi';

/* Payments are automated — read-only in the admin panel */

const COLUMNS = [
  { key: '_id',         label: 'Transaction', render: (r) => <span className="font-mono text-xs text-gray-400">{r._id?.slice(-8)}</span> },
  { key: 'orderId',     label: 'Order',       render: (r) => r.orderId?.orderNumber ?? r.orderId?._id?.slice(-8) ?? '—' },
  { key: 'provider',    label: 'Provider',    render: (r) => <span className="capitalize">{r.provider}</span> },
  { key: 'amount',      label: 'Amount',      render: (r) => `£${(r.amount ?? 0).toFixed(2)}` },
  { key: 'status',      label: 'Status',      render: (r) => <StatusBadge status={r.status} /> },
  { key: 'createdAt',   label: 'Date',        render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : '—' },
];

const PaymentsPage = () => {
  const resource = useAdminResource(paymentApi);
  return (
    <AdminLivePage
      title="Payments"
      subtitle="PayPal, Klarna and other transaction records (read-only)"
      actionLabel="Record Payment"
      columns={COLUMNS}
      searchKeys={['provider', 'status']}
      searchPlaceholder="Search payments…"
      resource={resource}
      formFields={[]}        /* read-only — no add form fields */
      buildPayload={() => {}}
    />
  );
};

export default PaymentsPage;
