import { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import AdminTable from './AdminTable';
import StatusBadge from './StatusBadge';

/**
 * AdminLivePage
 *
 * API-backed list page with inline add/edit form.
 *
 * Props:
 *  title, subtitle
 *  actionLabel      – label for the Add button (default "Add New")
 *  columns          – table column definitions  { key, label, render? }
 *  searchKeys       – keys to search across
 *  searchPlaceholder
 *  resource         – return value of useAdminResource()
 *  formFields       – field descriptors for the inline form
 *                     { name, label, type, required, options, placeholder, hint, defaultValue, fullWidth, step }
 *                     types: text | number | select | multi-select | checkbox | file | textarea
 *  buildPayload(vals) – converts form values → API payload (object or FormData)
 *  bulkLink         – optional href for the "Add more in bulk" link inside the form
 *                     Defaults to "#" so the link always appears in add mode.
 */
const AdminLivePage = ({
  title,
  subtitle,
  actionLabel = 'Add New',
  columns = [],
  searchKeys = [],
  searchPlaceholder = 'Search…',
  resource,
  formFields = [],
  buildPayload,
  bulkLink,          // optional; "Add more in bulk" always shows, href defaults to "#"
}) => {
  const { items, loading, saving, error, fetchAll, create, update, remove } = resource;

  /* ── local UI state ── */
  const [query,      setQuery]      = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editRow,    setEditRow]    = useState(null);   // null = add mode, obj = edit mode
  const [formValues, setFormValues] = useState({});
  const [formError,  setFormError]  = useState('');

  /* ── filtered rows ── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys.length) return items;
    return items.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
    );
  }, [items, query, searchKeys]);

  /* ── default form values ── */
  const defaultValues = () =>
    Object.fromEntries(formFields.map((f) => [
      f.name,
      f.defaultValue ?? (f.type === 'multi-select' ? [] : ''),
    ]));

  /* ── open add panel ── */
  const openAdd = () => {
    setEditRow(null);
    setFormValues(defaultValues());
    setFormError('');
    setShowForm((v) => !v);
  };

  /* ── open edit panel ── */
  const openEdit = (row) => {
    setEditRow(row);
    const vals = {};
    formFields.forEach((f) => {
      const value = f.formatValue ? f.formatValue(row[f.name], row) : row[f.name];
      vals[f.name] = value ?? '';
      if (f.customName) {
        vals[f.customName] = value === '__custom__' ? row[f.name] ?? '' : '';
      }
    });
    setFormValues(vals);
    setFormError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => { setShowForm(false); setEditRow(null); };

  const handleFieldChange = (name, value) =>
    setFormValues((prev) => ({ ...prev, [name]: value }));

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const missing = formFields.filter((f) => f.required && !formValues[f.name]);
    if (missing.length) {
      setFormError(`Please fill in: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }

    try {
      const payload = buildPayload ? buildPayload(formValues, editRow) : formValues;
      if (editRow) {
        await update(editRow._id, payload);
      } else {
        await create(payload);
      }
      closeForm();
      fetchAll();
    } catch (err) {
      setFormError(err.message || 'Failed to save. Please try again.');
    }
  };

  /* ── delete ── */
  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name || row.title || row._id}"? This cannot be undone.`)) return;
    try { await remove(row._id); } catch { /* error already in resource.error */ }
  };

  /* ── normalise columns (auto status badge) ── */
  const normalisedColumns = columns.map((col) => {
    if (col.key === 'isActive' && !col.render) {
      return { ...col, render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} /> };
    }
    return col;
  });

  /* ── effective bulk link href ── */
  const bulkHref = bulkLink || '#';

  return (
    <div>
      {/* ─────────────── Page header ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#b8370e] tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>}
          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-rose-600 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
        </div>

        {/* Only the Add button lives here — NO bulk link */}
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#b8370e] hover:bg-[#962d0b] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer flex-shrink-0"
        >
          <span className="text-lg leading-none">{showForm && !editRow ? '−' : '+'}</span>
          {actionLabel}
          {showForm && !editRow
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ─────────────── Inline Add / Edit Form ─────────────── */}
      {showForm && (
        <div className="mb-6 bg-white border border-[#b8370e]/20 rounded-2xl shadow-sm overflow-hidden">

          {/* Form header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#1F1B2E] text-base">
              {editRow
                ? `Edit — ${editRow.name || editRow.title || ''}`
                : `New ${title.replace(/s$/, '')}`}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none font-light cursor-pointer"
              aria-label="Close form"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">

            {/* Inline error */}
            {formError && (
              <div className="mb-4 flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-sm font-medium">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {formError}
              </div>
            )}

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields.map((field) => (
                <div key={field.name} className={field.fullWidth ? 'sm:col-span-2 lg:col-span-3' : ''}>
                  <label className="block text-xs font-bold text-[#1F1B2E] mb-1.5 uppercase tracking-wide">
                    {field.label}
                    {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <>
                      <select
                        value={formValues[field.name] ?? ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                      >
                        <option value="">— Select —</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                        {field.allowCustom && <option value="__custom__">Add a new value…</option>}
                      </select>
                      {field.allowCustom && formValues[field.name] === '__custom__' && (
                        <input
                          type="text"
                          value={formValues[field.customName] ?? ''}
                          onChange={(e) => handleFieldChange(field.customName, e.target.value)}
                          placeholder={field.customPlaceholder || 'Enter a new value'}
                          className="w-full mt-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1F1B2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                        />
                      )}
                    </>

                  ) : field.type === 'multi-select' ? (
                    <>
                      <select
                        value=""
                        onChange={(e) => {
                          const selected = e.target.value;
                          const values = formValues[field.name] || [];
                          if (selected && !values.some((value) => value.toLowerCase() === selected.toLowerCase())) {
                            handleFieldChange(field.name, [...values, selected]);
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1F1B2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                      >
                        <option value="">— Select or add values —</option>
                        {(field.options || []).map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formValues[field.name] || []).map((value) => (
                          <span key={value} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                            {value}
                            <button
                              type="button"
                              onClick={() => handleFieldChange(field.name, formValues[field.name].filter((item) => item !== value))}
                              className="font-bold text-gray-500 hover:text-rose-600"
                              aria-label={`Remove ${value}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={formValues[`${field.name}Custom`] ?? ''}
                          onChange={(e) => handleFieldChange(`${field.name}Custom`, e.target.value)}
                          placeholder={field.placeholder || 'Enter a custom value'}
                          className="min-w-0 flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#1F1B2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const custom = (formValues[`${field.name}Custom`] || '').trim();
                            const values = formValues[field.name] || [];
                            if (custom && !values.some((value) => value.toLowerCase() === custom.toLowerCase())) {
                              handleFieldChange(field.name, [...values, custom]);
                            }
                            handleFieldChange(`${field.name}Custom`, '');
                          }}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-[#b8370e] hover:bg-[#b8370e]/5"
                        >
                          Add
                        </button>
                      </div>
                    </>

                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formValues[field.name] ?? ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ''}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e] resize-none"
                    />

                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id={`field-${field.name}`}
                        type="checkbox"
                        checked={!!formValues[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                        className="w-4 h-4 accent-[#b8370e]"
                      />
                      <label htmlFor={`field-${field.name}`} className="text-sm text-gray-600">
                        {field.hint || field.placeholder || 'Active'}
                      </label>
                    </div>

                  ) : field.type === 'file' ? (
                    field.multiple ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const currentFiles = Array.isArray(formValues[field.name]) ? formValues[field.name] : [];
                            const maxCount = field.maxCount;
                            let combined = [...currentFiles, ...files];
                            if (maxCount && combined.length > maxCount) {
                              combined = combined.slice(0, maxCount);
                            }
                            handleFieldChange(field.name, combined);
                            e.target.value = '';
                          }}
                          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#b8370e]/10 file:text-[#b8370e] file:font-semibold hover:file:bg-[#b8370e]/20 cursor-pointer"
                        />
                        {Array.isArray(formValues[field.name]) && formValues[field.name].length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {formValues[field.name].map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs text-gray-700">
                                <span className="truncate max-w-[150px]">{file.name || `File ${idx + 1}`}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = formValues[field.name].filter((_, i) => i !== idx);
                                    handleFieldChange(field.name, updated);
                                  }}
                                  className="text-gray-400 hover:text-rose-600 font-bold ml-1"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFieldChange(field.name, e.target.files?.[0] ?? null)}
                        className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#b8370e]/10 file:text-[#b8370e] file:font-semibold hover:file:bg-[#b8370e]/20 cursor-pointer"
                      />
                    )

                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formValues[field.name] ?? ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ''}
                      min={field.type === 'number' ? 0 : undefined}
                      step={field.step}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1F1B2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
                    />
                  )}

                  {field.hint && field.type !== 'checkbox' && (
                    <p className="mt-1 text-xs text-gray-400">{field.hint}</p>
                  )}
                </div>
              ))}
            </div>

            {/* ── Form footer: Submit · Cancel · Add more in bulk → ── */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#b8370e] hover:bg-[#962d0b] disabled:opacity-60 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editRow ? 'Save Changes' : actionLabel}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {/* Bulk link — always visible in add mode, pushed to the right */}
              {!editRow && (
                <a
                  href={bulkHref}
                  target={bulkLink ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#b8370e]/80 hover:text-[#b8370e] hover:underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Add more in bulk →
                </a>
              )}
            </div>

          </form>
        </div>
      )}

      {/* ─────────────── Search ─────────────── */}
      {searchKeys.length > 0 && (
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#1F1B2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
          />
        </div>
      )}

      {/* ─────────────── Table ─────────────── */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#b8370e]" />
            <span className="text-sm font-medium text-gray-400">Loading {title.toLowerCase()}…</span>
          </div>
        </div>
      ) : (
        <AdminTable
          columns={normalisedColumns}
          rows={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {/* record count */}
      {!loading && items.length > 0 && (
        <p className="mt-3 text-xs text-gray-400 font-medium">
          Showing {filtered.length} of {items.length} records
        </p>
      )}
    </div>
  );
};

export default AdminLivePage;
