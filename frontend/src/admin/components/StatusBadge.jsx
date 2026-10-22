import React from 'react';

const STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-sky-100 text-sky-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  processing: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  paid: 'bg-emerald-100 text-emerald-800',
  shipped: 'bg-violet-100 text-violet-800',
  placed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-rose-100 text-rose-700',
  failed: 'bg-rose-100 text-rose-700',
  initiated: 'bg-amber-100 text-amber-800',
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-100 text-slate-600',
  admin: 'bg-[#b8370e]/15 text-[#b8370e]',
  staff: 'bg-purple-100 text-purple-800',
  customer: 'bg-slate-100 text-slate-700',
};

const StatusBadge = ({ status }) => {
  const key = String(status || '').toLowerCase().replace(/\s+/g, '_');
  const label = String(status || '').replace(/_/g, ' ');
  const style = STYLES[key] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${style}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
