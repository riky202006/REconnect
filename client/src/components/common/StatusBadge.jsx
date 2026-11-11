import React from 'react';
import { REQUEST_STATUSES, LISTING_STATUSES } from '../../constants';

export const StatusBadge = ({ status, type = 'request', className = '' }) => {
  const dictionary = type === 'listing' ? LISTING_STATUSES : REQUEST_STATUSES;
  const config = dictionary[status] || { label: status, bgClass: 'bg-brand-paper' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-black border border-brand-black rounded-sm shadow-hard-sm ${config.bgClass} ${className}`}>
      {config.label}
    </span>
  );
};

export const StampBadge = ({ status }) => {
  if (status === 'CLAIMED') {
    return <div className="stamp-claimed">CLAIMED</div>;
  }
  if (status === 'COMPLETED' || status === 'DONE') {
    return <div className="stamp-done">DONE ✓</div>;
  }
  return null;
};

