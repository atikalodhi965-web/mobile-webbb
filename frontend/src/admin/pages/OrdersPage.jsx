import React from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import StatusBadge from '../components/StatusBadge';
import { orderApi } from '../services/adminApi';

/* Orders are created by customers — admin can only update status.
   The inline form is disabled; the table shows read-only data with a status
   dropdown patch via the edit pencil. */

const ORDER_STATUSES = [
  { value: 'placed',     label: 'Placed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped' },
  { value: 'completed',  label: 'Completed' },
  { value: 'cancelled',  label: 'Cancelled' },
];

const PAYMENT_STATUSES = [
  { value: 'pending',   label: 'Pending' },
  { value: 'paid',      label: 'Paid' },
  { value: 'failed',    label: 'Failed' },
  { value: 'refunded',  label: 'Refunded' },
];

const COLUMNS = [
  { key: 'orderNumber', label: 'Order',    render: (r) => r.orderNumber ?? <span className="font-mono text-xs text-gray-400">{r._id?.slice(-8)}</span> },
  { key: 'customer',    label: 'Customer', render: (r) => r.customer?.name ?? r.guestEmail ?? '—' },
  { key: 'total',       label: 'Total',    render: (r) => `£${(r.total ?? 0).toFixed(2)}` },
  { key: 'paymentStatus', label: 'Payment', render: (r) => <StatusBadge status={r.paymentStatus} /> },
  { key: 'orderStatus',   label: 'Order',   render: (r) => <StatusBadge status={r.orderStatus} /> },
  { key: 'createdAt',  label: 'Date',      render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : '—' },
];

/* Edit form — admin can update order and payment status */
const FORM_FIELDS = [
  { name: 'orderStatus',   label: 'Order Status',   type: 'select', options: ORDER_STATUSES },
  { name: 'paymentStatus', label: 'Payment Status', type: 'select', options: PAYMENT_STATUSES },
];

const buildPayload = (vals) => ({
  orderStatus:   vals.orderStatus   || undefined,
  paymentStatus: vals.paymentStatus || undefined,
});

const OrdersPage = () => {
  const resource = useAdminResource(orderApi);
  return (
    <AdminLivePage
      title="Orders"
      subtitle="Product purchases, repair checkouts and fulfilment status"
      actionLabel="New Order"
      columns={COLUMNS}
      searchKeys={['orderNumber', 'guestEmail']}
      searchPlaceholder="Search orders…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default OrdersPage;
