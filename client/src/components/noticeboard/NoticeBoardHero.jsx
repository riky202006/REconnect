import React from 'react';
import { Pin, Sparkles, BookOpen, Clock, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NoticeBoardHero = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 p-4 md:p-8 bg-[#E5D4B8] border-3 md:border-4 border-brand-black rounded-neo shadow-hard-xl overflow-hidden">
      {/* Wooden / Corkboard Texture Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#121411 1px, transparent 1px), radial-gradient(#121411 1px, #E5D4B8 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* Frame Border Pins */}
      <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-brand-urgent border-2 border-brand-black shadow-sm" />
      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-brand-urgent border-2 border-brand-black shadow-sm" />
      <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-brand-urgent border-2 border-brand-black shadow-sm" />
      <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-brand-urgent border-2 border-brand-black shadow-sm" />

      {/* Center Header Banner on Board */}
      <div className="relative z-10 flex justify-center mb-6">
        <div className="inline-block px-6 py-2 bg-brand-chartreuse border-2 border-brand-black rounded shadow-hard rotate-[-1deg]">
          <span className="font-heading font-black text-xs md:text-sm tracking-widest uppercase text-brand-black flex items-center gap-2">
            📌 ADTU PHYSICAL NOTICEBOARD • PINNED BY STUDENTS FOR STUDENTS
          </span>
        </div>
      </div>

      {/* Grid of Pinned Notices & Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Notice Card 1: FREE TEXTBOOK (Pink post-it / paper note) */}
        <div className="relative bg-[#FFF9E6] border-2 border-brand-black p-4 rounded shadow-hard-card rotate-[-2deg] transition-transform hover:rotate-0">
          {/* Yellow Tape */}
          <div className="absolute -top-3 left-10 w-16 h-6 tape-strip rotate-3 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-brand-pink border-2 border-brand-black" />

          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-brand-pink text-brand-black border border-brand-black rounded">
              FREE DONATION
            </span>
            <span className="font-hand text-xs font-bold text-neutral-600">Panikhaiti Lib</span>
          </div>

          <h4 className="font-heading font-black text-base text-brand-black uppercase leading-tight">
            Engineering Math (Kreyszig 10th Ed)
          </h4>
          <p className="text-xs text-neutral-700 mt-1 font-medium">
            Passing my 3rd sem math book to any B.Tech fresher. Good condition!
          </p>

          <div className="mt-3 pt-2 border-t border-dashed border-brand-black flex items-center justify-between text-xs">
            <span className="font-hand text-sm font-bold text-neutral-800">- Priyam (CSE)</span>
            <span className="text-[10px] font-bold uppercase bg-brand-chartreuse px-1.5 py-0.5 border border-brand-black rounded">
              Verified
            </span>
          </div>

          {/* Perforated tear-off stub bottom */}
          <div className="mt-3 pt-2 border-t-2 border-dashed border-brand-black/60 flex justify-between text-[10px] font-mono font-bold text-neutral-600">
            <span className="border-r border-dashed border-brand-black pr-1">TEAR #1</span>
            <span className="border-r border-dashed border-brand-black px-1">TEAR #2</span>
            <span>TAKEN ✓</span>
          </div>
        </div>

        {/* Notice Card 2: BORROW LAB COAT (Blue Card) */}
        <div className="relative bg-white border-2 border-brand-black p-4 rounded shadow-hard-card rotate-[1.5deg] transition-transform hover:rotate-0">
          {/* Masking Tape */}
          <div className="absolute -top-3 right-8 w-16 h-6 tape-strip -rotate-2 pointer-events-none" />
          <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-brand-blue border-2 border-brand-black" />

          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-brand-blue text-brand-black border border-brand-black rounded">
              BORROW • 2 WEEKS
            </span>
            <span className="px-1.5 py-0.2 bg-brand-urgent text-white text-[9px] font-bold uppercase rounded">
              Urgent
            </span>
          </div>

          <h4 className="font-heading font-black text-base text-brand-black uppercase leading-tight">
            White Lab Apron (Size L)
          </h4>
          <p className="text-xs text-neutral-700 mt-1 font-medium">
            Washed and ironed for Biotech/Pharmacy lab tests. Return before semester finals.
          </p>

          <div className="mt-3 pt-2 border-t border-dashed border-brand-black flex items-center justify-between text-xs">
            <span className="font-hand text-sm font-bold text-neutral-800">- Ananya (Pharmacy)</span>
            <span className="font-mono text-[10px] font-bold">Room C-104</span>
          </div>

          <div className="mt-3 pt-2 border-t-2 border-dashed border-brand-black/60 flex justify-between text-[10px] font-mono font-bold text-neutral-600">
            <span className="border-r border-dashed border-brand-black pr-1">CALL/PIN</span>
            <span className="border-r border-dashed border-brand-black px-1">PICKUP</span>
            <span>RETURN</span>
          </div>
        </div>

        {/* Notice Card 3: EXCHANGE / CLAIMED STAMP (Orange card) */}
        <div className="relative bg-[#FFF3E0] border-2 border-brand-black p-4 rounded shadow-hard-card rotate-[-1deg] transition-transform hover:rotate-0">
          <div className="absolute -top-3 left-1/3 w-14 h-5 tape-strip rotate-1 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-brand-orange border-2 border-brand-black" />

          {/* Stamp overlay */}
          <div className="absolute inset-0 bg-brand-black/10 flex items-center justify-center pointer-events-none">
            <span className="stamp-claimed text-lg">CLAIMED</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-brand-orange text-brand-black border border-brand-black rounded">
              SWAP / BARTER
            </span>
          </div>

          <h4 className="font-heading font-black text-base text-brand-black uppercase leading-tight">
            Casio Scientific Calculator
          </h4>
          <p className="text-xs text-neutral-700 mt-1 font-medium">
            Exchanged with Rohan for Python programming handbook!
          </p>

          <div className="mt-3 pt-2 border-t border-dashed border-brand-black flex items-center justify-between text-xs">
            <span className="font-hand text-sm font-bold text-neutral-800">Done Deal 🤝</span>
            <span className="font-mono text-[10px] font-bold bg-white px-1 border border-brand-black">+50 RePoints</span>
          </div>
        </div>

      </div>

      {/* Floating handwritten notes and sticky memos on board */}
      <div className="relative z-10 mt-6 pt-4 border-t-2 border-brand-black/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white/80 border border-brand-black px-3 py-1 rounded text-xs">
          <span className="font-hand text-base font-bold text-brand-black">
            "Don't throw away that semester drafter, pass it forward!"
          </span>
        </div>

        <Link
          to="/resources"
          className="px-4 py-1.5 bg-brand-black text-brand-chartreuse text-xs font-black uppercase tracking-wider border-2 border-brand-black rounded hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-hard-sm"
        >
          <span>Browse 580+ Campus Notices</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

