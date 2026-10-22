import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { cmsPages } from '../data/staticAdminData';

const CmsPagesPage = () => (
  <AdminResourcePage
    title="CMS Pages"
    subtitle="Edit About, Warranty, Terms, and other site content"
    actionLabel="Add Page"
    searchKeys={['pageKey', 'pageTitle']}
    searchPlaceholder="Search pages…"
    rows={cmsPages}
    columns={[
      { key: 'id', label: 'ID' },
      { key: 'pageTitle', label: 'Title' },
      { key: 'pageKey', label: 'Key' },
      { key: 'sections', label: 'Sections' },
      {
        key: 'published',
        label: 'Published',
        render: (r) => <StatusBadge status={r.published ? 'active' : 'inactive'} />,
      },
      { key: 'updated', label: 'Updated' },
    ]}
  />
);

export default CmsPagesPage;
