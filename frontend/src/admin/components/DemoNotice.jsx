import React from 'react';

/** Lightweight demo feedback for static admin actions */
export const showDemoAlert = (action, item) => {
  const name = item?.name || item?.title || item?.id || item?.code || item?.pageTitle || 'item';
  window.alert(`Demo mode: "${action}" for ${name}.\n\nThis will connect to the backend API later.`);
};

export default showDemoAlert;
