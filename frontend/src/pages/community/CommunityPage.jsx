import React, { useState, useEffect } from 'react';
import { mockCommunityInfo } from '../../data/mockData';
import { communityService } from '../../services/communityService';
import { useResources } from '../../context/ResourceContext';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Leaf,
  ShieldCheck,
  Megaphone,
  BookOpen,
  Mail,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  Heart,
  UserPlus,
  CheckCircle2,
  Activity,
  Tv,
  Shirt,
  Armchair,
  Apple,
  Home
} from 'lucide-react';

const CATEGORIES_DATA = [
  { name: 'Books', icon: BookOpen, count: 184, color: 'bg-brand-chartreuse' },
  { name: 'Electronics', icon: Tv, count: 96, color: 'bg-brand-blue' },
  { name: 'Clothing', icon: Shirt, count: 62, color: 'bg-brand-pink' },
  { name: 'Furniture', icon: Armchair, count: 48, color: 'bg-brand-orange' },
  { name: 'Food', icon: Apple, count: 35, color: 'bg-brand-chartreuse' },
  { name: 'Household', icon: Home, count: 55, color: 'bg-brand-paper' }
];

export const CommunityPage = () => {
  const { resources, transactions } = useResources();
  const [communityInfo, setCommunityInfo] = useState(mockCommunityInfo);

  useEffect(() => {
    async function loadInfo() {
      try {
        const live = await communityService.getInfo();
        if (live) setCommunityInfo(live);
      } catch (e) {}
    }
    loadInfo();
  }, []);

  // Activity feed tab
  const [activityTab, setActivityTab] = useState('ALL'); // 'ALL' | 'RESOURCES' | 'TRANSACTIONS' | 'MEMBERS'

  // Recent activity mock data
  const recentMembers = [
    { name: 'Kaushik Barua', dept: 'Mechanical Engg (4th Sem)', time: '20 mins ago', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80' },
    { name: 'Meghna Das', dept: 'Faculty of Nursing (2nd Yr)', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
    { name: 'Abhinav Roy', dept: 'Civil Engg (6th Sem)', time: '3 hours ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Community Overview Header */}
      <div className="relative p-6 sm:p-8 bg-brand-chartreuse border-3 border-brand-black rounded-neo shadow-hard-card overflow-hidden">
        {/* Tape decoration */}
        <div className="absolute -top-3 left-12 w-28 h-6 tape-strip rotate-1 pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase bg-brand-black text-white px-2 py-0.5 rounded">
              OFFICIAL HUB
            </span>
            <span className="font-hand text-base font-bold text-brand-black">
              Panikhaiti, Guwahati, Assam
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading leading-tight">
            {communityInfo.name}
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-neutral-800 max-w-3xl leading-relaxed">
            {communityInfo.tagline}
          </p>

          <p className="text-xs text-neutral-700 font-medium max-w-3xl pt-1">
            {communityInfo.about}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-bold pt-2">
            <MapPin className="w-3.5 h-3.5 text-brand-urgent shrink-0" />
            <span>{communityInfo.location}</span>
          </div>
        </div>
      </div>

      {/* 2. Impact Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Member Count */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center">
          <div className="w-8 h-8 mx-auto bg-brand-paper border border-brand-black rounded-full flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {communityInfo.membersCount}+
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-1">Verified Members</p>
        </div>

        {/* Resources Shared */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center">
          <div className="w-8 h-8 mx-auto bg-brand-chartreuse border border-brand-black rounded-full flex items-center justify-center mb-1">
            <Package className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {communityInfo.resourcesListed}
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-1">Resources Shared</p>
        </div>

        {/* Successful Exchanges */}
        <div className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm text-center">
          <div className="w-8 h-8 mx-auto bg-brand-blue border border-brand-black rounded-full flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4 text-brand-black" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {communityInfo.itemsExchangedOrDonated}
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-600 mt-1">Successful Exchanges</p>
        </div>

        {/* Community Impact */}
        <div className="p-4 bg-brand-chartreuse border-2 border-brand-black rounded-neo shadow-hard-sm text-center">
          <div className="w-8 h-8 mx-auto bg-brand-black rounded-full flex items-center justify-center mb-1">
            <Leaf className="w-4 h-4 text-brand-chartreuse" />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl text-brand-black">
            {communityInfo.co2SavedKg} kg
          </span>
          <p className="text-[11px] font-bold uppercase text-neutral-800 mt-1">CO2e Diverted</p>
        </div>
      </div>

      {/* 3. Popular Categories Section */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-brand-black pb-3">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
              <Layers className="w-6 h-6 stroke-[2.5]" />
              Popular Resource Categories
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Browse by the most requested items across university faculties.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-black uppercase text-brand-black hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES_DATA.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="p-4 rounded-neo border-2 border-brand-black bg-white hover:bg-neutral-50 shadow-hard-sm transition flex flex-col items-center text-center space-y-2 group"
              >
                <div
                  className={`w-12 h-12 rounded-full border-2 border-brand-black flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-brand-black stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm uppercase text-brand-black">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500 font-semibold">
                    {cat.count} items
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Announcements (Pinned Physical Style) */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-brand-black pb-3">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
              <Megaphone className="w-6 h-6 stroke-[2.5]" />
              Campus Announcements & Drives
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Upcoming sharing events, textbook collection drives, and campus sustainability news.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold uppercase bg-brand-paper px-2 py-0.5 border border-brand-black rounded">
            Live Board
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(communityInfo.announcements || []).map((ann) => (
            <div
              key={ann.id}
              className={`p-4 border-2 border-brand-black rounded-neo shadow-hard-sm space-y-2 relative flex flex-col justify-between ${
                ann.urgent ? 'bg-brand-urgent/10 border-brand-urgent' : 'bg-brand-paper/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border border-brand-black ${
                      ann.urgent ? 'bg-brand-urgent text-white' : 'bg-brand-chartreuse text-brand-black'
                    }`}
                  >
                    {ann.tag}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">{ann.date}</span>
                </div>

                <h3 className="font-heading font-black text-base text-brand-black leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                  {ann.content}
                </p>
              </div>

              <div className="pt-2 text-[10px] font-mono text-neutral-500 font-bold border-t border-brand-black/10">
                ADTU Campus Resource Desk
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Community Activity Feed */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-brand-black pb-3">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
              <Activity className="w-6 h-6 stroke-[2.5]" />
              Live Campus Activity Feed
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Real-time sharing, completed handovers, and welcoming new students.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-brand-paper border-2 border-brand-black rounded p-1 self-start sm:self-auto">
            <button
              onClick={() => setActivityTab('ALL')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                activityTab === 'ALL'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActivityTab('RESOURCES')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                activityTab === 'RESOURCES'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setActivityTab('TRANSACTIONS')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                activityTab === 'TRANSACTIONS'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Handovers
            </button>
            <button
              onClick={() => setActivityTab('MEMBERS')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                activityTab === 'MEMBERS'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Members
            </button>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-3">
          {/* Recently Shared Resources */}
          {(activityTab === 'ALL' || activityTab === 'RESOURCES') &&
            resources.slice(0, 3).map((res) => (
              <div
                key={`act_res_${res.id}`}
                className="p-3.5 bg-brand-paper/40 border-2 border-brand-black rounded-neo shadow-hard-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-brand-black overflow-hidden shrink-0 bg-white">
                    <img
                      src={res.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                      alt={res.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-brand-chartreuse border border-brand-black rounded">
                        NEW LISTING
                      </span>
                      <span className="text-xs font-bold text-neutral-500">
                        by {res.postedBy?.name}
                      </span>
                    </div>
                    <p className="font-heading font-black text-sm uppercase text-brand-black line-clamp-1">
                      {res.title}
                    </p>
                  </div>
                </div>

                <Link
                  to="/explore"
                  className="px-2.5 py-1 text-[11px] font-black uppercase bg-white border border-brand-black rounded hover:bg-neutral-100 shrink-0"
                >
                  View
                </Link>
              </div>
            ))}

          {/* Recent Completed Transactions */}
          {(activityTab === 'ALL' || activityTab === 'TRANSACTIONS') &&
            transactions.slice(0, 2).map((txn) => (
              <div
                key={`act_txn_${txn.id}`}
                className="p-3.5 bg-brand-blue/20 border-2 border-brand-black rounded-neo shadow-hard-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-chartreuse border border-brand-black flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-brand-black text-white rounded">
                        HANDOVER COMPLETED
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-600">
                        {txn.date}
                      </span>
                    </div>
                    <p className="font-heading font-black text-sm uppercase text-brand-black line-clamp-1">
                      {txn.provider?.name} handed over "{txn.resourceTitle}" to {txn.receiver?.name}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-black text-brand-black bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded shrink-0">
                  +50 PTS
                </span>
              </div>
            ))}

          {/* New Community Members */}
          {(activityTab === 'ALL' || activityTab === 'MEMBERS') &&
            recentMembers.map((member, mIdx) => (
              <div
                key={`act_mem_${mIdx}`}
                className="p-3.5 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-2 border-brand-black object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-brand-pink border border-brand-black rounded">
                        NEW MEMBER
                      </span>
                      <span className="text-xs font-mono text-neutral-500">{member.time}</span>
                    </div>
                    <p className="font-heading font-black text-sm uppercase text-brand-black">
                      {member.name} joined the ADTU circular network
                    </p>
                    <p className="text-[11px] text-neutral-600 font-medium">{member.dept}</p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-brand-paper border border-brand-black flex items-center justify-center text-xs font-bold shrink-0">
                  👋
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 6. Campus Coordinators / Mentors Section */}
      <div className="bg-brand-paper border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="border-b-2 border-brand-black pb-3">
          <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
            Faculty Mentors & Student Coordinators
          </h2>
          <p className="text-xs text-neutral-700 font-medium">
            Contact the campus coordinator desk for bulk department donations or lab equipment setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(communityInfo.coordinators || []).map((coord, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm space-y-2"
            >
              <div className="w-8 h-8 rounded-full bg-brand-chartreuse border border-brand-black flex items-center justify-center font-heading font-black text-sm">
                {coord.name.charAt(0)}
              </div>
              <h3 className="font-heading font-black text-base uppercase text-brand-black">
                {coord.name}
              </h3>
              <p className="text-xs text-neutral-600 font-semibold">{coord.role}</p>
              <a
                href={`mailto:${coord.contact}`}
                className="text-xs font-mono text-brand-black hover:underline flex items-center gap-1.5 pt-1 font-bold"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-600" />
                <span>{coord.contact}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};