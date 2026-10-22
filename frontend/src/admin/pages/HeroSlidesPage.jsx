import React from 'react';
<<<<<<< HEAD
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
=======
import AdminLivePage from '../components/AdminLivePage';
import StatusBadge from '../components/StatusBadge';
import TableImage from '../components/TableImage';
import useAdminResource from '../hooks/useAdminResource';
import { heroSlideApi } from '../services/adminApi';

const COLUMNS = [
  {
    key: 'image',
    label: 'Slide Banner',
    render: (r) => <TableImage src={r.image} alt={r.title} />,
  },
  {
    key: 'title',
    label: 'Headline & Subtitle',
    render: (r) => (
      <div>
        <p className="font-bold text-[#1F1B2E] text-sm">{r.title}</p>
        {r.subtitle && <p className="text-xs text-gray-500 mt-0.5">{r.subtitle}</p>}
      </div>
    ),
  },
  {
    key: 'cta',
    label: 'Call to Action',
    render: (r) =>
      r.ctaText ? (
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#b8370e]/10 text-[#b8370e]">
            {r.ctaText}
          </span>
          {r.ctaLink && (
            <p className="text-[11px] font-mono text-gray-400 mt-0.5">{r.ctaLink}</p>
          )}
        </div>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: 'sortOrder',
    label: 'Sort Order',
    render: (r) => <span className="font-mono text-xs text-gray-600">{r.sortOrder ?? 0}</span>,
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
  },
];

const FORM_FIELDS = [
  {
    name: 'title',
    label: 'Slide Headline',
    required: true,
    placeholder: 'e.g. Certified Refurbished iPhones',
    fullWidth: true,
  },
  {
    name: 'subtitle',
    label: 'Subtitle / Tagline',
    placeholder: 'e.g. 100% genuine parts, 24-month SAMZ warranty & free delivery',
    fullWidth: true,
  },
  {
    name: 'ctaText',
    label: 'CTA Button Text',
    placeholder: 'e.g. Shop iPhones or Book Repair',
  },
  {
    name: 'ctaLink',
    label: 'CTA Button Link (URL)',
    placeholder: 'e.g. /shop or /repairs',
  },
  {
    name: 'sortOrder',
    label: 'Display Order',
    type: 'number',
    placeholder: '0',
    hint: 'Lower numbers appear first on the homepage',
  },
  {
    name: 'isActive',
    label: 'Active Banner',
    type: 'checkbox',
    defaultValue: true,
    hint: 'Visible in the homepage hero carousel',
  },
  {
    name: 'image',
    label: 'Banner Image',
    type: 'file',
    fullWidth: true,
    hint: 'Recommended size: 1920x800px or 16:9 ratio',
  },
];

const buildPayload = (vals) => {
  const fd = new FormData();
  Object.entries(vals).forEach(([k, v]) => {
    if (k === 'image') {
      if (v instanceof File) fd.append('image', v);
    } else if (k === 'isActive') {
      fd.append('isActive', v ? 'true' : 'false');
    } else if (k === 'sortOrder') {
      fd.append('sortOrder', String(parseInt(v, 10) || 0));
    } else {
      fd.append(k, v ?? '');
    }
  });
  return fd;
};

const HeroSlidesPage = () => {
  const resource = useAdminResource(heroSlideApi);

  return (
    <AdminLivePage
      title="Hero Slides"
      subtitle="Homepage hero banner carousel and call-to-action slides"
      actionLabel="Add Slide"
      columns={COLUMNS}
      searchKeys={['title', 'subtitle', 'ctaText', 'ctaLink']}
      searchPlaceholder="Search hero slides by title, subtitle, CTA…"
      resource={resource}
      formFields={FORM_FIELDS}
      buildPayload={buildPayload}
    />
  );
};
>>>>>>> 8f997a0 (Fix frontend tracking)

export default HeroSlidesPage;
