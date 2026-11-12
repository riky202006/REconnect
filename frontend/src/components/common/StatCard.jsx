import React from 'react';

export const StatCard = ({ label, value, subtext, icon: Icon, color = 'bg-white', noteHandwritten }) => {
  return (
    <div className={`relative p-5 border-2 border-brand-black rounded-neo shadow-hard-card ${color} flex flex-col justify-between overflow-hidden transition-all hover:-translate-y-0.5`}>
      {/* Tape decoration at top */}
      <div className="absolute -top-3 left-6 w-16 h-5 tape-strip rotate-2 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-700">{label}</p>
          <h3 className="text-3xl md:text-4xl font-black text-brand-black mt-1 font-heading tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="p-2.5 bg-brand-black text-white border-2 border-brand-black rounded shadow-hard-sm">
            <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-brand-black/20 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-600">{subtext}</span>
        {noteHandwritten && (
          <span className="font-hand text-base text-brand-black font-bold -rotate-3">
            {noteHandwritten}
          </span>
        )}
      </div>
    </div>
  );
};

