import React from 'react';
import AdminResourcePage from '../components/AdminResourcePage';
import StatusBadge from '../components/StatusBadge';
import { heroSlides } from '../data/staticAdminData';

const HeroSlidesPage = () => (
  <AdminResourcePage
    title="Hero Slides"
    subtitle="Homepage banners and call-to-action slides"
    actionLabel="Add Slide"
    searchKeys={['title', 'subtitle', 'cta']}
    searchPlaceholder="Search slides…"
    rows={heroSlides}
    columns={[
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'cta', label: 'CTA' },
      {
        key: 'isActive',
        label: 'Status',
        render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
      },
    ]}
  />
);

export default HeroSlidesPage;
