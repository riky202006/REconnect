import React from 'react';
import { CATEGORIES, ITEM_CONDITIONS, COMMUNITIES } from '../../constants';
import { Filter, RotateCcw, CheckSquare, Sparkles } from 'lucide-react';

export const FilterBar = ({
  selectedType,
  onSelectType,
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  selectedAvailability,
  onSelectAvailability,
  selectedCommunity,
  onSelectCommunity,
  onReset
}) => {
  const isFiltered =
    selectedType !== 'ALL' ||
    selectedCategory !== 'All Categories' ||
    (selectedCondition && selectedCondition !== 'All Conditions') ||
    (selectedAvailability && selectedAvailability !== 'ALL') ||
    (selectedCommunity && selectedCommunity !== 'All Communities');

  return (
    <div className="bg-brand-paper border-2 border-brand-black p-4 rounded-neo shadow-hard space-y-4">
      {/* Top row: Type toggles and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 stroke-[2.5]" />
          <span className="font-heading font-black text-xs md:text-sm tracking-wide uppercase">
            Filter by Mode:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectType('ALL')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-brand-black rounded-sm transition ${
              selectedType === 'ALL'
                ? 'bg-brand-black text-white shadow-none translate-x-[2px] translate-y-[2px]'
                : 'bg-white text-brand-black shadow-hard-sm hover:bg-neutral-100'
            }`}
          >
            All Modes
          </button>
          <button
            type="button"
            onClick={() => onSelectType('DONATE')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-brand-black rounded-sm transition ${
              selectedType === 'DONATE'
                ? 'bg-brand-pink text-brand-black font-black translate-x-[2px] translate-y-[2px]'
                : 'bg-white text-brand-black shadow-hard-sm hover:bg-pink-100'
            }`}
          >
            💖 Free Donate
          </button>
          <button
            type="button"
            onClick={() => onSelectType('BORROW')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-brand-black rounded-sm transition ${
              selectedType === 'BORROW'
                ? 'bg-brand-blue text-brand-black font-black translate-x-[2px] translate-y-[2px]'
                : 'bg-white text-brand-black shadow-hard-sm hover:bg-blue-100'
            }`}
          >
            🔄 Borrow
          </button>
          <button
            type="button"
            onClick={() => onSelectType('EXCHANGE')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-brand-black rounded-sm transition ${
              selectedType === 'EXCHANGE'
                ? 'bg-brand-orange text-brand-black font-black translate-x-[2px] translate-y-[2px]'
                : 'bg-white text-brand-black shadow-hard-sm hover:bg-amber-100'
            }`}
          >
            ⚡ Exchange / Swap
          </button>
        </div>

        {/* Reset button */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase bg-white text-brand-urgent border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-red-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Second row: Category, Condition, Availability, Community */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t-2 border-brand-black/20">
        
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 block">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white text-brand-black font-bold text-xs border-2 border-brand-black rounded shadow-hard-sm focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 block">
            Condition:
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => onSelectCondition(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white text-brand-black font-bold text-xs border-2 border-brand-black rounded shadow-hard-sm focus:outline-none"
          >
            <option value="All Conditions">All Conditions</option>
            {ITEM_CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 block">
            Availability Status:
          </label>
          <select
            value={selectedAvailability}
            onChange={(e) => onSelectAvailability(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white text-brand-black font-bold text-xs border-2 border-brand-black rounded shadow-hard-sm focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="RESERVED">Reserved</option>
            <option value="CLAIMED">Claimed / Done</option>
          </select>
        </div>

        {/* Community Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 block">
            Campus Community:
          </label>
          <select
            value={selectedCommunity}
            onChange={(e) => onSelectCommunity(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white text-brand-black font-bold text-xs border-2 border-brand-black rounded shadow-hard-sm focus:outline-none truncate"
          >
            {COMMUNITIES.map((com) => (
              <option key={com} value={com}>
                {com}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
