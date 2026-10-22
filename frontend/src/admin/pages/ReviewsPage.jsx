import React from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import StatusBadge from '../components/StatusBadge';
import { reviewApi } from '../services/adminApi';

const STAR_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: '★'.repeat(n) + '☆'.repeat(5 - n) }));

const COLUMNS = [
  { key: '_id',        label: 'ID',       render: (r) => <span className="font-mono text-xs text-gray-400">{r._id?.slice(-6)}</span> },
  { key: 'author',     label: 'Author' },
  { key: 'location',   label: 'Location' },
  { key: 'rating',     label: 'Rating',   render: (r) => `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}` },
  { key: 'source',     label: 'Source' },
  { key: 'isFeatured', label: 'Featured', render: (r) => <StatusBadge status={r.isFeatured ? 'active' : 'inactive'} /> },
  { key: 'isActive',   label: 'Status' },
];

const FORM_FIELDS = [
  { name: 'author',     label: 'Author Name',   required: true,  placeholder: 'Hemali Patel' },
  { name: 'location',   label: 'Location',                       placeholder: 'Charing Cross' },
  { name: 'rating',     label: 'Rating',         type: 'select',  options: STAR_OPTIONS, defaultValue: '5' },
  { name: 'source',     label: 'Source',                          placeholder: 'Google review' },
  { name: 'quote',      label: 'Review Text',    type: 'textarea', fullWidth: true, required: true, placeholder: 'Amazing service…' },
  { name: 'isFeatured', label: 'Featured',       type: 'checkbox', defaultValue: true },
  { name: 'isActive',   label: 'Active',          type: 'checkbox', defaultValue: true },
  { name: 'image',      label: 'Photo',           type: 'file' },
];

const buildPayload = (vals) => {
  const fd = new FormData();
  Object.entries(vals).forEach(([k, v]) => {
    if (k === 'image') { if (v instanceof File) fd.append('image', v); }
    else fd.append(k, v === true ? 'true' : v === false ? 'false' : v ?? '');
  });
  return fd;
};

const ReviewsPage = () => {
  const resource = useAdminResource(reviewApi);
  return (
    <AdminLivePage
      title="Reviews"
      subtitle="Customer testimonials shown on the website"
      actionLabel="Add Review"
      columns={COLUMNS}
      searchKeys={['author', 'location', 'source']}
      searchPlaceholder="Search reviews…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default ReviewsPage;
