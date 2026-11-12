import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourceContext';
import {
  PlusCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Layers,
  Compass,
  Trophy,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { notifications, markAllNotificationsRead } = useResources();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Explore Resources', path: '/resources' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'ADTU Community', path: '/community' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-brand-bg border-b-3 border-brand-black shadow-hard-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-chartreuse border-2 border-brand-black rounded flex items-center justify-center font-heading font-black text-2xl text-brand-black shadow-hard-sm group-hover:rotate-6 transition-transform">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tighter text-brand-black leading-none">
                  ReConnect
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-neutral-600 font-mono -mt-0.5">
                  ADTU CAMPUS HUB
                </span>
              </div>
            </Link>

            {/* Tagline Badge for Desktop */}
            <div className="hidden lg:flex items-center ml-4 px-2.5 py-0.5 bg-brand-paper border border-brand-black rounded text-[11px] font-bold text-neutral-800">
              <span className="font-hand text-sm font-bold text-brand-black">Give More. Waste Less. Connect Better.</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-black uppercase tracking-wider transition ${
                    isActive
                      ? 'text-brand-black border-b-2 border-brand-black'
                      : 'text-neutral-700 hover:text-brand-black'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Share Resource CTA */}
                <Link
                  to="/resources/share"
                  className="px-3.5 py-2 bg-brand-chartreuse text-brand-black font-black text-xs uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard-sm flex items-center gap-1.5 hover:bg-yellow-300"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Pin Resource</span>
                </Link>

                {/* RePoints Ticker Pill */}
                <Link
                  to="/dashboard/profile"
                  className="px-2.5 py-1.5 bg-white border-2 border-brand-black rounded shadow-hard-sm flex items-center gap-1.5 hover:bg-brand-paper transition"
                  title="Your RePoints Balance"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="font-heading font-black text-xs text-brand-black">
                    {currentUser?.rePoints || 0} PTS
                  </span>
                </Link>

                {/* Notifications Bell Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) markAllNotificationsRead();
                    }}
                    className="relative p-2 bg-white text-brand-black border-2 border-brand-black rounded shadow-hard-sm hover:bg-brand-paper transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4 stroke-[2.5]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-urgent text-white font-black text-[9px] border border-brand-black rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-brand-black rounded-neo shadow-hard-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-brand-chartreuse border-b-2 border-brand-black flex items-center justify-between">
                        <span className="font-heading font-black text-sm uppercase text-brand-black">
                          Campus Board Alerts
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-white px-1.5 py-0.5 border border-brand-black rounded">
                          {notifications.length} Total
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y border-brand-black/10">
                        {notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link}
                            onClick={() => setShowNotifications(false)}
                            className={`p-3 block hover:bg-brand-paper/50 transition ${!n.read ? 'bg-brand-blue/10' : ''}`}
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-xs font-bold text-brand-black">{n.title}</p>
                              <span className="text-[10px] text-neutral-500">{n.time}</span>
                            </div>
                            <p className="text-xs text-neutral-700 mt-0.5 leading-snug">{n.message}</p>
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 bg-brand-paper border-t border-brand-black text-center">
                        <Link
                          to="/dashboard/requests"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-black uppercase text-brand-black hover:underline"
                        >
                          View All Requests →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1 pl-2 bg-white border-2 border-brand-black rounded shadow-hard-sm hover:bg-brand-paper transition"
                  >
                    <span className="font-heading font-black text-xs text-brand-black max-w-[100px] truncate">
                      {currentUser?.name?.split(' ')[0]}
                    </span>
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={currentUser?.name}
                      className="w-7 h-7 rounded-full border border-brand-black object-cover"
                    />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-brand-black rounded-neo shadow-hard-lg z-50 overflow-hidden divide-y divide-brand-black/10">
                      <div className="p-3 bg-brand-paper">
                        <p className="text-xs font-black text-brand-black truncate">{currentUser?.name}</p>
                        <p className="text-[10px] text-neutral-600 truncate">{currentUser?.community}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserDropdown(false)}
                          className="px-4 py-2 text-xs font-bold text-brand-black hover:bg-brand-paper flex items-center gap-2"
                        >
                          <Layers className="w-3.5 h-3.5" /> Dashboard
                        </Link>
                        <Link
                          to="/dashboard/listings"
                          onClick={() => setShowUserDropdown(false)}
                          className="px-4 py-2 text-xs font-bold text-brand-black hover:bg-brand-paper flex items-center gap-2"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> My Listings ({currentUser?.stats?.activeListings || 4})
                        </Link>
                        <Link
                          to="/dashboard/requests"
                          onClick={() => setShowUserDropdown(false)}
                          className="px-4 py-2 text-xs font-bold text-brand-black hover:bg-brand-paper flex items-center gap-2"
                        >
                          <Bell className="w-3.5 h-3.5" /> My Requests
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="px-4 py-2 text-xs font-bold text-brand-black hover:bg-brand-paper flex items-center gap-2"
                        >
                          <User className="w-3.5 h-3.5" /> Profile & RePoints
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-brand-urgent hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-black uppercase text-brand-black border-2 border-brand-black rounded brutal-btn shadow-hard-sm bg-white hover:bg-neutral-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-black uppercase text-brand-black border-2 border-brand-black rounded brutal-btn shadow-hard-sm bg-brand-chartreuse hover:bg-yellow-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <Link
                to="/dashboard/profile"
                className="px-2 py-1 bg-white border border-brand-black rounded font-heading font-black text-xs"
              >
                {currentUser?.rePoints || 0} PTS
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white text-brand-black border-2 border-brand-black rounded shadow-hard-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-bg border-t-2 border-brand-black px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-black uppercase text-brand-black hover:bg-brand-paper rounded"
            >
              Explore Resources
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-black uppercase text-brand-black hover:bg-brand-paper rounded"
            >
              Campus Leaderboard
            </Link>
            <Link
              to="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-black uppercase text-brand-black hover:bg-brand-paper rounded"
            >
              ADTU Community Hub
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t-2 border-brand-black space-y-2">
              <Link
                to="/resources/share"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center bg-brand-chartreuse text-brand-black font-black text-sm uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
              >
                + Pin New Resource
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold uppercase text-brand-black hover:bg-brand-paper rounded"
              >
                User Dashboard
              </Link>
              <Link
                to="/dashboard/listings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold uppercase text-brand-black hover:bg-brand-paper rounded"
              >
                My Listings
              </Link>
              <Link
                to="/dashboard/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold uppercase text-brand-black hover:bg-brand-paper rounded"
              >
                My Requests
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold uppercase text-brand-black hover:bg-brand-paper rounded"
              >
                My Profile & RePoints
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-xs font-bold uppercase text-brand-urgent hover:bg-red-50 rounded"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t-2 border-brand-black flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-white text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

