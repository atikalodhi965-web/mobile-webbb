import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from './PageHeader';
import AdminTable from './AdminTable';
import { showDemoAlert } from './DemoNotice';

/**
 * Shared static list page: search + table + demo CRUD actions.
 */
const AdminResourcePage = ({
  title,
  subtitle,
  actionLabel = 'Add New',
  hideAction = false,
  columns,
  rows,
  searchKeys = [],
  searchPlaceholder = 'Search…',
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || searchKeys.length === 0) return rows;
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actionLabel={actionLabel}
        hideAction={hideAction}
        onAction={() => showDemoAlert('Add', { name: title })}
      />

      {searchKeys.length > 0 && (
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#1F1B2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8370e]/30 focus:border-[#b8370e]"
          />
        </div>
      )}

      <AdminTable
        columns={columns}
        rows={filtered}
        onView={(row) => showDemoAlert('View', row)}
        onEdit={(row) => showDemoAlert('Edit', row)}
        onDelete={(row) => showDemoAlert('Delete', row)}
      />
    </div>
  );
};

export default AdminResourcePage;
