import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  ArrowLeftRight,
  User,
  PlusCircle,
  Compass,
  Trophy,
  Users,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const navGroups = [
    {
      title: 'My Workspace',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Listings', path: '/dashboard/listings', icon: Layers },
        { label: 'My Requests', path: '/dashboard/requests', icon: Inbox },
        { label: 'Transactions', path: '/dashboard/transactions', icon: ArrowLeftRight },
        { label: 'Profile & RePoints', path: '/dashboard/profile', icon: User },
      ]
    },
    {
      title: 'Campus Noticeboard',
      items: [
        { label: 'Pin Resource', path: '/resources/share', icon: PlusCircle, highlight: true },
        { label: 'Explore Resources', path: '/resources', icon: Compass },
        { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
        { label: 'ADTU Community', path: '/community', icon: Users },
      ]
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-brand-paper border-b-2 lg:border-b-0 lg:border-r-3 border-brand-black p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 bg-white border-2 border-brand-black rounded-neo shadow-hard-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-brand-chartreuse border-b-2 border-l-2 border-brand-black flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-black" />
          </div>

          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser?.name}
              className="w-11 h-11 rounded-full border-2 border-brand-black object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-brand-black truncate font-heading leading-tight">
                {currentUser?.name}
              </h4>
              <p className="text-[11px] text-neutral-600 truncate font-semibold">
                {currentUser?.department || 'Student'}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-brand-black/20 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-neutral-600">RePoints Balance</span>
            <span className="font-heading font-black text-xs text-brand-black px-2 py-0.5 bg-brand-chartreuse border border-brand-black rounded shadow-hard-sm">
              {currentUser?.rePoints || 0} PTS
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <h5 className="text-[11px] font-black uppercase tracking-wider text-neutral-600 px-2 font-mono">
              {group.title}
            </h5>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 text-xs font-black uppercase tracking-wider rounded border-2 transition-all ${
                        isActive
                          ? 'bg-brand-chartreuse text-brand-black border-brand-black shadow-hard-sm font-black translate-x-1'
                          : item.highlight
                          ? 'bg-white text-brand-black border-brand-black hover:bg-neutral-100 shadow-hard-sm'
                          : 'bg-transparent text-neutral-800 border-transparent hover:bg-white hover:border-brand-black'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sustainability Campus Footer Banner */}
      <div className="mt-8 pt-4 border-t-2 border-brand-black/20">
        <div className="p-3 bg-brand-bg border border-brand-black rounded text-[11px] font-medium text-neutral-700 space-y-1">
          <p className="font-bold text-brand-black uppercase font-heading flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Campus Circle
          </p>
          <p className="font-hand text-sm text-neutral-800">
            Every shared book spares ~2.5 kg paper waste!
          </p>
        </div>
      </div>
    </aside>
  );
};

