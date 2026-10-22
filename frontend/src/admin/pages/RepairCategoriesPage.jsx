import AdminLivePage from '../components/AdminLivePage';
import StatusBadge from '../components/StatusBadge';
import useAdminResource from '../hooks/useAdminResource';
import { repairCategoryApi } from '../services/adminApi';

const COLUMNS = [
  {
    key: 'title',
    label: 'Category',
    render: (r) => (
      <div className="min-w-[140px]">
        <p className="font-semibold text-[#1F1B2E] text-sm">{r.title}</p>
        <p className="text-xs font-mono text-gray-400 mt-0.5">{r.slug || '—'}</p>
      </div>
    ),
  },
  {
    key: 'shortTitle',
    label: 'Short Title',
    render: (r) => r.shortTitle || <span className="text-gray-300">—</span>,
  },
  {
    key: 'icon',
    label: 'Icon Key',
    render: (r) => r.icon || <span className="text-gray-300">—</span>,
  },
  {
    key: 'description',
    label: 'Description',
    render: (r) => r.description
      ? <span className="text-xs text-gray-500 line-clamp-2 max-w-[220px] block">{r.description}</span>
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

const FORM_FIELDS = [
  { name: 'title',      label: 'Category Name', required: true,  placeholder: 'e.g. Front Screen' },
  { name: 'shortTitle', label: 'Short Title',                     placeholder: 'Screen' },
  { name: 'slug',       label: 'Slug',           hint: 'Auto-generated if empty' },
  { name: 'icon',       label: 'Icon Key',        placeholder: 'screen' },
  { name: 'description', label: 'Description',   type: 'textarea', fullWidth: true },
  { name: 'sortOrder',  label: 'Sort Order',      type: 'number',   placeholder: '0' },
  { name: 'isActive',   label: 'Active',           type: 'checkbox', defaultValue: true },
  { name: 'image',      label: 'Image',            type: 'file' },
];

const buildPayload = (vals) => {
  const formData = new FormData();
  Object.entries(vals).forEach(([key, value]) => {
    if (key === 'image') {
      if (value instanceof File) formData.append('image', value);
    } else {
      formData.append(key, value === true ? 'true' : value === false ? 'false' : value ?? '');
    }
  });
  return formData;
};

const RepairCategoriesPage = () => {
  const resource = useAdminResource(repairCategoryApi);
  return (
    <AdminLivePage
      title="Repair Categories"
      subtitle="Screen, battery, camera, and other repair groups"
      actionLabel="Add Category"
      columns={COLUMNS}
      searchKeys={['title', 'shortTitle', 'slug', 'icon', 'description']}
      searchPlaceholder="Search categories…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default RepairCategoriesPage;
