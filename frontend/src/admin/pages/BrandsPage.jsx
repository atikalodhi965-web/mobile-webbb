import React, { useEffect, useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import TableImage from '../components/TableImage';
import { brandApi, fetchAllDeviceTypes } from '../services/adminApi';

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
    label: 'Logo',
    render: (r) => <TableImage src={r.image} alt={r.name} />,
  },
  {
    key: 'name',
    label: 'Brand',
    render: (r) => (
      <div>
        <p className="font-semibold text-[#1F1B2E] text-sm">{r.name}</p>
        <p className="text-xs font-mono text-gray-400 mt-0.5">{r.slug}</p>
      </div>
    ),
  },
  {
    key: 'deviceTypeIds',
    label: 'Device Types',
    render: (r) => {
      const types = r.deviceTypeIds ?? [];
      if (!types.length) return <span className="text-gray-300">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {types.map((dt, i) => (
            <span
              key={i}
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
            >
              {dt?.title ?? dt}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    key: 'description',
    label: 'Description',
    render: (r) =>
      r.description ? (
        <span className="text-xs text-gray-500 line-clamp-2 max-w-[220px] block">
          {r.description}
        </span>
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

const BrandsPage = () => {
  const resource = useAdminResource(brandApi);
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);

  useEffect(() => {
    fetchAllDeviceTypes()
      .then((res) => {
        const list = res?.items ?? res ?? [];
        setDeviceTypeOptions(list.map((dt) => ({ value: dt._id, label: dt.title })));
      })
      .catch(() => {});
  }, []);

  const FORM_FIELDS = [
    { name: 'name',         label: 'Brand Name',  required: true,  placeholder: 'e.g. Apple' },
    { name: 'slug',         label: 'Slug',          hint: 'Auto-generated if empty', placeholder: 'apple' },
    { name: 'deviceTypeId', label: 'Device Type',  type: 'select',  options: deviceTypeOptions },
    { name: 'sortOrder',    label: 'Sort Order',    type: 'number',  placeholder: '0' },
    { name: 'description',  label: 'Description',   type: 'textarea', fullWidth: true },
    { name: 'isActive',     label: 'Active',         type: 'checkbox', defaultValue: true },
    { name: 'image',        label: 'Logo Image',     type: 'file' },
  ];

  const buildPayload = (vals) => {
    const fd = new FormData();
    Object.entries(vals).forEach(([k, v]) => {
      if (k === 'image') {
        if (v instanceof File) fd.append('image', v);
      } else if (k === 'deviceTypeId' && v) {
        fd.append('deviceTypeIds', JSON.stringify([v]));
      } else {
        fd.append(k, v === true ? 'true' : v === false ? 'false' : v ?? '');
      }
    });
    return fd;
  };

  return (
    <AdminLivePage
      title="Brands"
      subtitle="Manage Apple, Samsung, Google and other repair brands"
      actionLabel="Add Brand"
      columns={COLUMNS}
      searchKeys={['name', 'slug']}
      searchPlaceholder="Search brands…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default BrandsPage;
