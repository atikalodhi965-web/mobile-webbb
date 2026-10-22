import React from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import TableImage from '../components/TableImage';
import { deviceTypeApi } from '../services/adminApi';

/* ─── Status badge helper ─── */
const StatusBadge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Inactive
    </span>
  );

const COLUMNS = [
  {
    key: 'image',
    label: 'Image',
    render: (r) => <TableImage src={r.image} alt={r.title} />,
  },
  {
    key: 'title',
    label: 'Title',
    render: (r) => (
      <div>
        <p className="font-semibold text-[#1F1B2E] text-sm">{r.title}</p>
        <p className="text-xs font-mono text-gray-400 mt-0.5">{r.slug}</p>
      </div>
    ),
  },
  {
    key: 'badge',
    label: 'Badge',
    render: (r) =>
      r.badge ? (
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b8370e]/10 text-[#b8370e] border border-[#b8370e]/20">
          {r.badge}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'priceFrom',
    label: 'Price From',
    render: (r) => (
      <span className="font-semibold text-[#1F1B2E]">
        £{r.priceFrom ?? 0}
      </span>
    ),
  },
  {
    key: 'buttonText',
    label: 'Button Text',
    render: (r) => <span className="text-gray-600 text-xs">{r.buttonText || '—'}</span>,
  },
  {
    key: 'href',
    label: 'Link',
    render: (r) =>
      r.href ? (
        <span className="text-xs font-mono text-indigo-500 truncate max-w-[120px] block">{r.href}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'sortOrder',
    label: 'Order',
    render: (r) => (
      <span className="text-xs text-gray-500 font-mono">{r.sortOrder ?? 0}</span>
    ),
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => <StatusBadge active={r.isActive} />,
  },
];

const FORM_FIELDS = [
  { name: 'title',       label: 'Title',        required: true,  placeholder: 'e.g. Smartphone Repairs' },
  { name: 'slug',        label: 'Slug',          hint: 'Auto-generated if empty', placeholder: 'smartphones' },
  { name: 'badge',       label: 'Badge',          placeholder: 'e.g. Most Popular' },
  { name: 'priceFrom',   label: 'Price From (£)', type: 'number', placeholder: '29', step: '0.01' },
  { name: 'buttonText',  label: 'Button Text',    placeholder: 'Book Repair' },
  { name: 'href',        label: 'Link / Href',    placeholder: '/repair/smartphones' },
  { name: 'sortOrder',   label: 'Sort Order',     type: 'number', placeholder: '0' },
  { name: 'description', label: 'Description',    type: 'textarea', fullWidth: true },
  { name: 'isActive',    label: 'Active',          type: 'checkbox', defaultValue: true },
  { name: 'image',       label: 'Image',           type: 'file' },
];

const buildPayload = (vals) => {
  const fd = new FormData();
  Object.entries(vals).forEach(([k, v]) => {
    if (k === 'image') {
      if (v instanceof File) fd.append('image', v);
    } else {
      fd.append(k, v === true ? 'true' : v === false ? 'false' : v ?? '');
    }
  });
  return fd;
};

const DeviceTypesPage = () => {
  const resource = useAdminResource(deviceTypeApi);
  return (
    <AdminLivePage
      title="Device Types"
      subtitle="Phone, tablet, and laptop repair categories on the storefront"
      actionLabel="Add Device Type"
      columns={COLUMNS}
      searchKeys={['title', 'slug', 'badge']}
      searchPlaceholder="Search device types…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default DeviceTypesPage;
