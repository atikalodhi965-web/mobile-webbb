import React, { useState } from 'react';
import AdminLivePage from '../components/AdminLivePage';
import StatusBadge from '../components/StatusBadge';
import TableImage from '../components/TableImage';
import useAdminResource from '../hooks/useAdminResource';
import { cmsPageApi } from '../services/adminApi';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Globe,
  Upload,
  Layers,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';

const PAGE_KEY_PRESETS = [
  { value: 'about', label: 'About Us (/about)' },
  { value: 'warranty', label: 'Warranty & Battery Policy (/warranty)' },
  { value: 'terms', label: 'Terms & Conditions (/terms)' },
  { value: 'privacy', label: 'Privacy Policy (/privacy)' },
  { value: 'faq', label: 'Help & FAQs (/faq)' },
  { value: 'contact', label: 'Contact Us & Stores (/contact)' },
  { value: 'delivery', label: 'Delivery & Returns (/delivery)' },
  { value: '__custom__', label: '+ Custom Page Key…' },
];

const COLUMNS = [
  {
    key: 'pageTitle',
    label: 'CMS Page',
    render: (r) => (
      <div>
        <p className="font-bold text-[#1F1B2E] text-sm">{r.pageTitle || 'Untitled Page'}</p>
        <p className="font-mono text-xs text-[#b8370e] font-semibold mt-0.5">/{r.pageKey}</p>
      </div>
    ),
  },
  {
    key: 'image',
    label: 'Hero / Banner',
    render: (r) => {
      const img = r.sections?.[0]?.image || r.image;
      return <TableImage src={img} alt={r.pageTitle} />;
    },
  },
  {
    key: 'sections',
    label: 'Content Summary',
    render: (r) => {
      const sec = r.sections?.[0];
      if (!sec) return <span className="text-gray-300 italic">No sections</span>;
      return (
        <div className="max-w-[260px]">
          {sec.title && <p className="font-bold text-xs text-gray-800">{sec.title}</p>}
          <p className="text-xs text-gray-500 line-clamp-2">
            {sec.body || sec.subtitle || (r.sections.length > 1 ? `${r.sections.length} sections defined` : '—')}
          </p>
        </div>
      );
    },
  },
  {
    key: 'seo',
    label: 'SEO Meta',
    render: (r) => (
      <div className="max-w-[180px]">
        <p className="text-xs font-semibold text-gray-700 truncate">{r.seo?.title || '—'}</p>
        <p className="text-[11px] text-gray-400 truncate">{r.seo?.description || ''}</p>
      </div>
    ),
  },
  {
    key: 'isPublished',
    label: 'Status',
    render: (r) => <StatusBadge status={r.isPublished ? 'active' : 'inactive'} />,
  },
  {
    key: 'updatedAt',
    label: 'Last Modified',
    render: (r) => (
      <span className="text-xs text-gray-400">
        {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '—'}
      </span>
    ),
  },
];

const CmsPagesPage = () => {
  const resource = useAdminResource(cmsPageApi);

  return (
    <AdminLivePage
      title="CMS Pages"
      subtitle="Manage page content, policy documents, section text, and SEO meta tags"
      actionLabel="Add Page"
      columns={COLUMNS}
      searchKeys={['pageKey', 'pageTitle']}
      searchPlaceholder="Search CMS pages by title or key slug…"
      resource={resource}
      renderCustomForm={({ editRow, closeForm, resource: res, saving, formError, setFormError }) => (
        <CmsPageFormModal
          editRow={editRow}
          closeForm={closeForm}
          resource={res}
          saving={saving}
          formError={formError}
          setFormError={setFormError}
        />
      )}
    />
  );
};

/* ─── Add / Edit CMS Page Form ─── */
const CmsPageFormModal = ({
  editRow,
  closeForm,
  resource,
  saving,
  formError,
  setFormError,
}) => {
  const isEdit = !!editRow;

  const [pageTitle, setPageTitle] = useState(editRow?.pageTitle || '');
  const [selectedKey, setSelectedKey] = useState(() => {
    if (!editRow?.pageKey) return 'about';
    const found = PAGE_KEY_PRESETS.some((p) => p.value === editRow.pageKey);
    return found ? editRow.pageKey : '__custom__';
  });
  const [customKey, setCustomKey] = useState(
    editRow?.pageKey && !PAGE_KEY_PRESETS.some((p) => p.value === editRow.pageKey)
      ? editRow.pageKey
      : ''
  );

  // Section fields
  const firstSection = editRow?.sections?.[0] || {};
  const [sectionTitle, setSectionTitle] = useState(firstSection.title || '');
  const [sectionSubtitle, setSectionSubtitle] = useState(firstSection.subtitle || '');
  const [sectionBody, setSectionBody] = useState(firstSection.body || '');
  const [ctaText, setCtaText] = useState(firstSection.ctaText || '');
  const [ctaLink, setCtaLink] = useState(firstSection.ctaLink || '');

  // Bullets
  const [bullets, setBullets] = useState(() => firstSection.bullets || []);
  const [newBullet, setNewBullet] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState(editRow?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(editRow?.seo?.description || '');

  // Settings
  const [isPublished, setIsPublished] = useState(editRow?.isPublished ?? true);

  // Image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(firstSection.image || null);

  const addBullet = () => {
    const trimmed = newBullet.trim();
    if (trimmed && !bullets.includes(trimmed)) {
      setBullets([...bullets, trimmed]);
      setNewBullet('');
    }
  };

  const removeBullet = (idx) => {
    setBullets(bullets.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const resolvedPageKey = selectedKey === '__custom__' ? customKey.trim().toLowerCase() : selectedKey;

    if (!resolvedPageKey) {
      setFormError('Page key (slug identifier) is required.');
      return;
    }
    if (!pageTitle.trim()) {
      setFormError('Page Title is required.');
      return;
    }

    const sections = [
      {
        sectionKey: 'main',
        title: sectionTitle.trim(),
        subtitle: sectionSubtitle.trim(),
        body: sectionBody.trim(),
        bullets: bullets.filter(Boolean),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        image: typeof imagePreview === 'string' ? imagePreview : null,
      },
    ];

    const seo = {
      title: seoTitle.trim() || pageTitle.trim(),
      description: seoDescription.trim(),
      keywords: [],
    };

    const fd = new FormData();
    fd.append('pageKey', resolvedPageKey);
    fd.append('pageTitle', pageTitle.trim());
    fd.append('sections', JSON.stringify(sections));
    fd.append('seo', JSON.stringify(seo));
    fd.append('isPublished', isPublished ? 'true' : 'false');

    if (imageFile instanceof File) {
      fd.append('image', imageFile);
    }

    try {
      if (isEdit) {
        await resource.update(editRow.pageKey || editRow._id, fd);
      } else {
        await resource.create(fd);
      }
      closeForm();
      resource.fetchAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save page. Please check the fields and try again.');
    }
  };

  return (
    <div className="mb-8 bg-white border border-[#b8370e]/20 rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#b8370e]/10 via-amber-500/5 to-transparent border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#b8370e] text-white flex items-center justify-center font-black shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1F1B2E]">
              {isEdit ? `Edit CMS Page: ${editRow?.pageTitle}` : 'Create New CMS Page'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Configure page route, body content copy, diagnostic bullets, and SEO meta
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeForm}
          className="text-gray-400 hover:text-gray-600 text-xl font-light cursor-pointer"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {formError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs font-semibold">
            {formError}
          </div>
        )}

        {/* 1. Page Identity */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#b8370e]" /> 1. Page Identity & Route
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Page Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="e.g. 24-Month SAMZ Warranty Policy"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Page URL Route / Key <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30"
              >
                {PAGE_KEY_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {selectedKey === '__custom__' && (
                <input
                  type="text"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="custom-route-slug (e.g. price-match)"
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none"
                  required
                />
              )}
            </div>
          </div>
        </div>

        {/* 2. Main Section Content */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#b8370e]" /> 2. Page Content & Copy
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                  Main Section Headline
                </label>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="e.g. Our Commitment to Premium Quality"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                  Section Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  placeholder="e.g. Every device rigorously inspected and certified"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Page Body Copy / Descriptive Text
              </label>
              <textarea
                value={sectionBody}
                onChange={(e) => setSectionBody(e.target.value)}
                rows={5}
                placeholder="Enter complete markdown or detailed paragraphs explaining the terms, story, or policies..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Bullets */}
            <div className="bg-gray-50/70 border border-gray-200/60 rounded-xl p-3.5">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-2 uppercase">
                Key Points / Highlight Bullets
              </label>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {bullets.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200 shadow-2xs"
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => removeBullet(i)}
                      className="text-gray-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-lg">
                <input
                  type="text"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  placeholder="Add bullet (e.g. 36-Month Battery Health Guarantee)"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addBullet}
                  className="px-3.5 py-1.5 bg-[#1F1B2E] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Call to action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                  CTA Button Label (Optional)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Book a Repair Today"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                  CTA Button Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. /repairs"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SEO & Media */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#b8370e]" /> 3. SEO Meta & Banner Image
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SAMZ Repair | Warranty Policy"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                SEO Meta Description
              </label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Learn about our 24-month comprehensive device warranty..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1F1B2E] mb-1 uppercase">
                Featured Hero Image / Graphic
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                  />
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#b8370e]" />
                  {imagePreview ? 'Change Image' : 'Upload Featured Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-[#b8370e] rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-[#1F1B2E] uppercase">
                Published & Publicly Accessible
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={closeForm}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#b8370e] hover:bg-[#962d0b] disabled:opacity-60 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {saving ? 'Saving Page…' : isEdit ? 'Update CMS Page' : 'Publish CMS Page'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CmsPagesPage;
