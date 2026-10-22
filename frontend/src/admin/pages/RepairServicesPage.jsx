import { useEffect, useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import TableImage from '../components/TableImage';
import StatusBadge from '../components/StatusBadge';
import useAdminResource from '../hooks/useAdminResource';
import { repairServiceApi, fetchAllModels, fetchAllCategories } from '../services/adminApi';

const TruncatedText = ({ value, className = '' }) => {
  if (!value) return <span className="text-gray-300">—</span>;
  return (
    <span title={String(value)} className={`block max-w-[180px] truncate ${className}`}>
      {value}
    </span>
  );
};

const COLUMNS = [
  {
    key: 'image',
    label: 'Image',
    render: (r) => <TableImage src={r.image} alt={r.title} />,
  },
  {
    key: 'title',
    label: 'Service',
    render: (r) => (
      <div className="min-w-0 max-w-[180px]">
        <TruncatedText value={r.title} className="font-semibold text-[#1F1B2E] text-sm" />
        {r.slug && <TruncatedText value={r.slug} className="text-xs font-mono text-gray-400 mt-0.5" />}
      </div>
    ),
  },
  {
    key: 'modelId',
    label: 'Model',
    render: (r) => <TruncatedText value={r.modelId?.name ?? r.modelId} />,
  },
  {
    key: 'categoryId',
    label: 'Category',
    render: (r) => <TruncatedText value={r.categoryId?.title ?? r.categoryId} />,
  },
  {
    key: 'price',
    label: 'Price',
    render: (r) => {
      const amount = Number(r.price);
      const currency = r.currency || 'GBP';
      if (!Number.isFinite(amount)) return '—';
      return currency === 'GBP'
        ? `£${amount.toFixed(2)}`
        : `${currency} ${amount.toFixed(2)}`;
    },
  },
  { key: 'warranty', label: 'Warranty', render: (r) => <TruncatedText value={r.warranty} /> },
  { key: 'repairTime', label: 'Repair Time', render: (r) => <TruncatedText value={r.repairTime} /> },
  {
    key: 'partType',
    label: 'Part',
    render: (r) => r.partType
      ? <TruncatedText value={r.partType} className="capitalize" />
      : <span className="text-gray-300">—</span>,
  },
  {
    key: 'description',
    label: 'Description / Note',
    render: (r) => {
      const details = [r.description, r.note].filter(Boolean).join(' · ');
      return <TruncatedText value={details} className="text-xs text-gray-500" />;
    },
  },
  {
    key: 'icon',
    label: 'Icon',
    render: (r) => <TruncatedText value={r.icon} />,
  },
  {
    key: 'features',
    label: 'Features',
    render: (r) => Array.isArray(r.features) && r.features.length
      ? <TruncatedText value={r.features.join(', ')} className="text-xs text-gray-500" />
      : <span className="text-gray-300">—</span>,
  },
  {
    key: 'sortOrder',
    label: 'Order',
    render: (r) => <span className="text-xs text-gray-500 font-mono">{r.sortOrder ?? 0}</span>,
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
  },
];

const PART_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'genuine',  label: 'Genuine' },
  { value: 'oem',      label: 'OEM' },
  { value: 'other',    label: 'Other' },
];

const RepairServicesPage = () => {
  const resource = useAdminResource(repairServiceApi);
  const [modelOptions,    setModelOptions]    = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    fetchAllModels()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setModelOptions(list.map((m) => ({ value: m._id, label: m.name })));
      })
      .catch(() => {});

    fetchAllCategories()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setCategoryOptions(list.map((c) => ({ value: c._id, label: c.title })));
      })
      .catch(() => {});
  }, []);

  const FORM_FIELDS = [
    { name: 'title',       label: 'Service Name',  required: true,  placeholder: 'e.g. Screen Replacement' },
    { name: 'slug',        label: 'Slug',            hint: 'Auto-generated if empty' },
    { name: 'modelId',     label: 'Device Model',   type: 'select',  required: true, options: modelOptions },
    { name: 'categoryId',  label: 'Repair Category', type: 'select',  required: true, options: categoryOptions },
    { name: 'price',       label: 'Price (£)',       type: 'number',  required: true, placeholder: '129', step: '0.01' },
    { name: 'partType',    label: 'Part Type',       type: 'select',  options: PART_TYPES },
    { name: 'warranty',    label: 'Warranty',         placeholder: 'Lifetime / 12 months' },
    { name: 'repairTime',  label: 'Repair Time',      placeholder: 'Same day / 1–2 hrs' },
    { name: 'description', label: 'Description',      type: 'textarea', fullWidth: true },
    { name: 'isActive',    label: 'Active',            type: 'checkbox', defaultValue: true },
    { name: 'image',       label: 'Image',             type: 'file' },
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

  return (
    <AdminLivePage
      title="Repair Services"
      subtitle="Priced repair jobs per model and category"
      actionLabel="Add Service"
      columns={COLUMNS}
      searchKeys={['title', 'slug', 'description', 'note', 'icon']}
      searchPlaceholder="Search repair services…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
      bulkLink="#"
    />
  );
};

export default RepairServicesPage;
