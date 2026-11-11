import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search resources, textbooks, lab equipment...', onClear, className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3.5 text-brand-black pointer-events-none">
        <Search className="w-5 h-5 stroke-[2.5]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-white text-brand-black placeholder:text-neutral-500 font-medium text-sm md:text-base border-2 border-brand-black rounded-neo shadow-hard focus:outline-none focus:bg-brand-bg transition"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          type="button"
          aria-label="Clear search"
          className="absolute right-3 p-1 text-brand-black hover:bg-brand-paper border border-brand-black rounded"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

