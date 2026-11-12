import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing pinned here yet',
  description = 'No resources or requests found matching your current filter criteria.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="w-full py-16 px-4 bg-brand-paper/50 border-2 border-dashed border-brand-black rounded-neo text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-brand-chartreuse border-2 border-brand-black rounded-full flex items-center justify-center shadow-hard mb-4">
        <Icon className="w-8 h-8 text-brand-black stroke-[2.5]" />
      </div>
      <h3 className="text-xl font-black text-brand-black uppercase font-heading">{title}</h3>
      <p className="max-w-md text-sm text-neutral-600 mt-1 font-medium">{description}</p>
      
      {actionText && (
        <div className="mt-5">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-chartreuse text-brand-black font-extrabold text-sm uppercase border-2 border-brand-black rounded brutal-btn shadow-hard"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-chartreuse text-brand-black font-extrabold text-sm uppercase border-2 border-brand-black rounded brutal-btn shadow-hard"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading community board...' }) => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-brand-black border-t-brand-chartreuse rounded-full animate-spin" />
      <span className="font-heading font-bold text-sm tracking-wider uppercase text-neutral-800">
        {text}
      </span>
    </div>
  );
};

