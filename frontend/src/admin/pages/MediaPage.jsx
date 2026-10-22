import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import { mediaLibrary } from '../data/staticAdminData';

const MediaPage = () => (
  <AdminResourcePage
    title="Media Library"
    subtitle="Images and icons used across products, heroes, and CMS"
    actionLabel="Upload Media"
    searchKeys={['name', 'type', 'usedOn']}
    searchPlaceholder="Search media…"
    rows={mediaLibrary}
    columns={[
      { key: 'id', label: 'ID' },
      {
        key: 'name',
        label: 'File',
        render: (r) => (
          <span className="font-mono text-xs font-semibold text-[#1C0D2A]">{r.name}</span>
        ),
      },
      {
        key: 'type',
        label: 'Type',
        render: (r) => <span className="capitalize">{r.type}</span>,
      },
      { key: 'usedOn', label: 'Used On' },
      { key: 'size', label: 'Size' },
      { key: 'uploaded', label: 'Uploaded' },
    ]}
  />
);

export default MediaPage;
