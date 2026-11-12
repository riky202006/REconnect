import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-16 bg-brand-paper border-t-3 border-brand-black">
      {/* Newspaper / Noticeboard Top Warning Ribbon */}
      <div className="bg-brand-chartreuse py-2 px-4 border-b-2 border-brand-black text-center overflow-x-hidden">
        <p className="font-heading font-black text-xs md:text-sm tracking-wider uppercase text-brand-black flex items-center justify-center gap-2">
          <span>⚡ ZERO WASTE ADTU INITIATIVE</span>
          <span>•</span>
          <span>DONATE</span>
          <span>•</span>
          <span>BORROW</span>
          <span>•</span>
          <span>EXCHANGE</span>
          <span>•</span>
          <span>KEEP VALUABLE CAMPUS RESOURCES OUT OF LANDFILLS</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Manifesto */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-chartreuse border-2 border-brand-black rounded flex items-center justify-center font-heading font-black text-lg text-brand-black shadow-hard-sm">
                R
              </div>
              <span className="font-heading font-black text-2xl tracking-tighter text-brand-black">
                ReConnect
              </span>
            </div>
            <p className="font-hand text-lg text-brand-black font-bold -rotate-1">
              "Give More. Waste Less. Connect Better."
            </p>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              The community resource sharing network designed for Assam Down Town University students and faculty. Passing forward textbooks, engineering tools, lab coats, and hostel essentials.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 pt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-urgent" />
              <span>Panikhaiti Campus, Guwahati 781026</span>
            </div>
          </div>

          {/* Col 2: Campus Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase text-brand-black tracking-wider border-b-2 border-brand-black pb-1">
              Noticeboard Links
            </h4>
            <ul className="space-y-2 text-xs font-bold text-neutral-700">
              <li>
                <Link to="/resources" className="hover:text-brand-black hover:underline">
                  Explore Active Resources
                </Link>
              </li>
              <li>
                <Link to="/resources/share" className="hover:text-brand-black hover:underline">
                  Pin a New Item to Board
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-brand-black hover:underline">
                  Campus RePoints Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-brand-black hover:underline">
                  ADTU Hub & Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resource Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase text-brand-black tracking-wider border-b-2 border-brand-black pb-1">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-700">
              <li>
                <Link to="/resources?category=Books" className="hover:text-brand-black hover:underline">
                  📖 Books & Study References
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Electronics" className="hover:text-brand-black hover:underline">
                  ⚡ Electronics & Calculators
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Clothing" className="hover:text-brand-black hover:underline">
                  🥼 Lab Coats & Uniforms
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Furniture" className="hover:text-brand-black hover:underline">
                  🪑 Hostel Study Desks & Chairs
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Food" className="hover:text-brand-black hover:underline">
                  🥫 Pantry & Sealed Food
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Print Notice Card */}
          <div className="bg-white border-2 border-brand-black p-4 rounded-neo shadow-hard-card rotate-1 space-y-2 relative">
            <div className="absolute -top-3 right-4 w-12 h-4 tape-strip -rotate-3" />
            <span className="text-[10px] font-black uppercase tracking-wider bg-brand-pink px-2 py-0.5 border border-brand-black rounded inline-block">
              Photocopy Notice #42
            </span>
            <h5 className="font-heading font-black text-sm text-brand-black uppercase">
              End-of-Semester Passing Out?
            </h5>
            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
              Before vacating hostel rooms, don't dump your items! Pin them for junior batches and earn verified alumni eco-badges.
            </p>
            <div className="pt-1">
              <Link
                to="/resources/share"
                className="inline-block px-3 py-1 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border border-brand-black rounded brutal-btn shadow-hard-sm"
              >
                Pin It Forward →
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t-2 border-brand-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-neutral-600">
          <p>© 2026 ReConnect • College Software Engineering Project. Built with React & Tailwind.</p>
          <div className="flex items-center gap-4">
            <span className="font-hand text-base font-bold text-brand-black">ADTU Community First</span>
            <span className="inline-block px-2 py-0.5 bg-brand-chartreuse border border-brand-black text-[10px] font-black uppercase text-brand-black rounded">
              Verified Circular Economy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

