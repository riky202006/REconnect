import React from 'react';
import { SHARING_TYPES } from '../../constants';

export const CategoryBadge = ({ category, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-brand-paper text-brand-black border border-brand-black rounded-sm ${className}`}>
      {category}
    </span>
  );
};

export const SharingTypeBadge = ({ type, className = '' }) => {
  const config = SHARING_TYPES[type] || SHARING_TYPES.DONATE;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-brand-black border-2 border-brand-black rounded-sm shadow-hard-sm ${config.bgClass} ${className}`}
    >
      {config.badgeText}
    </span>
  );
};

