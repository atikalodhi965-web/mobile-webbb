import React, { useEffect, useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import TableImage from '../components/TableImage';
import { deviceModelApi, fetchAllBrands, fetchAllDeviceTypes } from '../services/adminApi';

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
    render: (r) => <TableImage src={r.image} alt={r.name} />,
  },
  {
    key: 'name',
    label: 'Model',
    render: (r) => (
      <div>
        <p className="font-semibold text-[#1F1B2E] text-sm">{r.name}</p>
        <p className="text-xs font-mono text-gray-400 mt-0.5">{r.slug}</p>
      </div>
    ),
  },
  {
    key: 'brandId',
    label: 'Brand',
    render: (r) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
        {r.brandId?.name ?? r.brandId ?? '—'}
      </span>
    ),
  },
  {
    key: 'deviceTypeId',
    label: 'Type',
    render: (r) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
        {r.deviceTypeId?.title ?? r.deviceTypeId ?? '—'}
      </span>
    ),
  },
  {
    key: 'categoryGroup',
    label: 'Group',
    render: (r) =>
      r.categoryGroup ? (
        <span className="text-xs text-gray-600 font-medium">{r.categoryGroup}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'modelNumber',
    label: 'Model No.',
    render: (r) =>
      r.modelNumber ? (
        <span className="text-xs font-mono text-gray-500">{r.modelNumber}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'year',
    label: 'Year',
    render: (r) => <span className="text-xs text-gray-500">{r.year || '—'}</span>,
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

const ModelsPage = () => {
  const resource = useAdminResource(deviceModelApi);
  const [brandOptions, setBrandOptions]           = useState([]);
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);

  useEffect(() => {
    fetchAllBrands()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setBrandOptions(list.map((b) => ({ value: b._id, label: b.name })));
      })
      .catch(() => {});

    fetchAllDeviceTypes()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setDeviceTypeOptions(list.map((dt) => ({ value: dt._id, label: dt.title })));
      })
      .catch(() => {});
  }, []);

  const FORM_FIELDS = [
    { name: 'name',          label: 'Model Name',   required: true, placeholder: 'e.g. iPhone 17 Pro Max' },
    { name: 'slug',          label: 'Slug',          hint: 'Auto-generated if empty' },
    { name: 'brandId',       label: 'Brand',         type: 'select', required: true, options: brandOptions },
    { name: 'deviceTypeId',  label: 'Device Type',   type: 'select', required: true, options: deviceTypeOptions },
    { name: 'categoryGroup', label: 'Group',         placeholder: 'e.g. iPhone 17 Series' },
    { name: 'modelNumber',   label: 'Model Number',  placeholder: 'A3293' },
    { name: 'year',          label: 'Year',          placeholder: '2025' },
    { name: 'sortOrder',     label: 'Sort Order',    type: 'number', placeholder: '0' },
    { name: 'isActive',      label: 'Active',         type: 'checkbox', defaultValue: true },
    { name: 'image',         label: 'Image',          type: 'file' },
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
      title="Device Models"
      subtitle="Models linked to brands and available repair services"
      actionLabel="Add Model"
      columns={COLUMNS}
      searchKeys={['name', 'slug', 'categoryGroup', 'modelNumber', 'year']}
      searchPlaceholder="Search models…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default ModelsPage;
