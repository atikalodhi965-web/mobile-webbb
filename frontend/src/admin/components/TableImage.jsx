/**
 * TableImage — compact thumbnail for admin table rows.
 * Renders a 40×40 rounded image from a server path, or a placeholder icon.
 */
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { BACKEND_ORIGIN } from '../../lib/env';

const TableImage = ({ src, alt = 'image', size = 40 }) => {
  const [broken, setBroken] = useState(false);

  const fullSrc = src
    ? src.startsWith('http')
      ? src
      : `${BACKEND_ORIGIN}${src}`
    : null;

  if (!fullSrc || broken) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"
      >
        <ImageOff className="w-4 h-4 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={fullSrc}
      alt={alt}
      onError={() => setBroken(true)}
      style={{ width: size, height: size }}
      className="rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0"
    />
  );
};

export default TableImage;
