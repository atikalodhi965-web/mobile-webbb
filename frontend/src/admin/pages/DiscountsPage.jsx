import React from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import StatusBadge from '../components/StatusBadge';
import { discountApi } from '../services/adminApi';

const DISCOUNT_TYPES = [
  { value: 'percent', label: 'Percentage (%)' },
  { value: 'fixed',   label: 'Fixed Amount (£)' },
];

const COLUMNS = [
  { key: '_id',    label: 'ID',    render: (r) => <span className="font-mono text-xs text-gray-400">{r._id?.slice(-6)}</span> },
  { key: 'code',   label: 'Code',  render: (r) => <span className="font-mono font-bold text-[#b8370e]">{r.code}</span> },
  { key: 'type',   label: 'Type',  render: (r) => <span className="capitalize">{r.type}</span> },
  { key: 'value',  label: 'Value', render: (r) => r.type === 'percent' ? `${r.value}%` : `£${r.value}` },
  { key: 'usedCount', label: 'Used', render: (r) => `${r.usedCount ?? 0} / ${r.maxUses ?? '∞'}` },
  { key: 'endsAt', label: 'Expires', render: (r) => r.endsAt ? new Date(r.endsAt).toLocaleDateString('en-GB') : '—' },
  { key: 'isActive', label: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} /> },
];

const FORM_FIELDS = [
  { name: 'code',           label: 'Promo Code',      required: true,  placeholder: 'SAMZ10' },
  { name: 'type',           label: 'Discount Type',   type: 'select',  required: true, options: DISCOUNT_TYPES },
  { name: 'value',          label: 'Value',            type: 'number',  required: true, placeholder: '10', step: '0.01' },
  { name: 'minOrderAmount', label: 'Min Order (£)',    type: 'number',  placeholder: '0', step: '0.01' },
  { name: 'maxUses',        label: 'Max Uses',         type: 'number',  placeholder: '500' },
  { name: 'startsAt',       label: 'Starts At',        type: 'text',    placeholder: 'YYYY-MM-DD' },
  { name: 'endsAt',         label: 'Expires At',       type: 'text',    placeholder: 'YYYY-MM-DD' },
  { name: 'isActive',       label: 'Active',           type: 'checkbox', defaultValue: true },
];

const buildPayload = (vals) => ({
  ...vals,
  code:           (vals.code || '').toUpperCase().trim(),
  value:          Number(vals.value) || 0,
  minOrderAmount: Number(vals.minOrderAmount) || 0,
  maxUses:        vals.maxUses ? Number(vals.maxUses) : null,
  startsAt:       vals.startsAt || null,
  endsAt:         vals.endsAt   || null,
  isActive:       !!vals.isActive,
});

const DiscountsPage = () => {
  const resource = useAdminResource(discountApi);
  return (
    <AdminLivePage
      title="Discounts"
      subtitle="Promo codes for repairs and refurbished products"
      actionLabel="Add Discount"
      columns={COLUMNS}
      searchKeys={['code', 'type']}
      searchPlaceholder="Search codes…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default DiscountsPage;
