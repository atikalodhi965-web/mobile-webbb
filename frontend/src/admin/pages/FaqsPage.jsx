import React from 'react';
import AdminLivePage from '../components/AdminLivePage';
import useAdminResource from '../hooks/useAdminResource';
import { faqApi } from '../services/adminApi';

const PAGE_KEY_OPTIONS = [
  { value: 'repairs',      label: 'Repairs' },
  { value: 'refurbished',  label: 'Refurbished Products' },
  { value: 'protection',   label: 'Protection Plan' },
  { value: 'warranty',     label: 'Warranty' },
  { value: 'general',      label: 'General' },
  { value: 'booking',      label: 'Booking' },
  { value: 'contact',      label: 'Contact' },
];

const COLUMNS = [
  { key: '_id',      label: 'ID',       render: (r) => <span className="font-mono text-xs text-gray-400">{r._id?.slice(-6)}</span> },
  { key: 'pageKey',  label: 'Page',     render: (r) => <span className="capitalize">{r.pageKey}</span> },
  { key: 'question', label: 'Question' },
  { key: 'isActive', label: 'Status' },
];

const FORM_FIELDS = [
  { name: 'pageKey',  label: 'Page',     type: 'select', required: true, options: PAGE_KEY_OPTIONS },
  { name: 'question', label: 'Question', required: true,  fullWidth: true, placeholder: 'What does the Protection Pack cover?' },
  { name: 'answer',   label: 'Answer',   type: 'textarea', fullWidth: true, required: true, placeholder: 'Our Protection Pack covers…' },
  { name: 'sortOrder', label: 'Sort Order', type: 'number', placeholder: '0' },
  { name: 'isActive', label: 'Active',    type: 'checkbox', defaultValue: true },
];

const buildPayload = (vals) => ({
  ...vals,
  sortOrder: Number(vals.sortOrder) || 0,
  isActive:  !!vals.isActive,
});

const FaqsPage = () => {
  const resource = useAdminResource(faqApi);
  return (
    <AdminLivePage
      title="FAQs"
      subtitle="Questions for protection, warranty, repairs and shop pages"
      actionLabel="Add FAQ"
      columns={COLUMNS}
      searchKeys={['question', 'pageKey']}
      searchPlaceholder="Search FAQs…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};

export default FaqsPage;
