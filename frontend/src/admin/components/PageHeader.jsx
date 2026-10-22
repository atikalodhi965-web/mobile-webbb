import React from 'react';
const PageHeader = ({ title, subtitle, actionLabel = 'Add New', onAction, hideAction = false }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#b8370e] tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>}
      </div>
      {!hideAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 bg-[#b8370e] hover:bg-[#962d0b] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
