import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourceContext';
import { StatCard } from '../../components/common/StatCard';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { ResourceDetailsModal } from '../../components/resources/ResourceDetailsModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Layers,
  Inbox,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Compass,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Activity,
  Heart,
  Repeat,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { resources, requests, updateRequestStatus, transactions } = useResources();
  const [selectedResource, setSelectedResource] = useState(null);

  // Filter listings belonging to current user
  const myListings = resources.filter(r => r.postedBy?.id === currentUser?.id);
  // Filter active listings
  const activeListings = myListings.filter(r => r.status === 'AVAILABLE' || r.status === 'RESERVED');
  // Filter incoming requests (where currentUser owns the item)
  const incomingRequests = requests.filter(r => r.owner?.id === currentUser?.id && r.status === 'PENDING');
  // Completed shares
  const completedSharesCount = transactions.filter(t => t.status === 'COMPLETED').length + myListings.filter(r => r.status === 'CLAIMED').length;

  // Realistic recent community activities at ADTU
  const communityActivities = [
    {
      id: 'act_1',
      user: 'Ananya Deka (Pharmacy)',
      action: 'lent White Cotton Lab Coat to junior',
      time: '15 mins ago',
      type: 'BORROW',
      points: '+30 PTS'
    },
    {
      id: 'act_2',
      user: 'Rohan Bordoloi (Engineering)',
      action: 'exchanged Casio FX-991EX for Data Science book',
      time: '1 hour ago',
      type: 'EXCHANGE',
      points: '+40 PTS'
    },
    {
      id: 'act_3',
      user: 'Snigdha Saikia (Nursing)',
      action: 'donated Mini Drafter to 1st year B.Tech student',
      time: '3 hours ago',
      type: 'DONATE',
      points: '+50 PTS'
    },
    {
      id: 'act_4',
      user: 'Priyam Sharma (CSE)',
      action: 'completed handover of 1.5L Kettle at Hostel Block 2',
      time: 'Yesterday',
      type: 'DONATE',
      points: '+50 PTS'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section */}
      <div className="relative p-6 sm:p-8 bg-brand-chartreuse border-3 border-brand-black rounded-neo shadow-hard-card overflow-hidden">
        {/* Tape decoration */}
        <div className="absolute -top-3 right-8 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase bg-brand-black text-white px-2 py-0.5 rounded">
                CAMPUS DASHBOARD
              </span>
              <span className="font-hand text-base font-bold text-brand-black">
                {currentUser?.community || 'ADTU - Main Campus (Panikhaiti)'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading tracking-tight">
              Welcome back, {currentUser?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800">
              Department: {currentUser?.department || 'Faculty of Engineering & Tech'} • Level: <strong className="underline">{currentUser?.level || 'Campus Champion'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/resources/share"
              className="px-4 py-2 bg-brand-black text-brand-chartreuse font-black text-xs uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-800 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Share a Resource</span>
            </Link>
            <Link
              to="/resources"
              className="px-4 py-2 bg-white text-brand-black font-black text-xs uppercase tracking-wider border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-100 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Resources</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Four Required Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1: Active Listings */}
        <StatCard
          label="Active Listings"
          value={activeListings.length}
          subtext="Pinned notices on board"
          icon={Layers}
          color="bg-white"
          noteHandwritten="In circulation"
        />

        {/* 2: Incoming Requests */}
        <StatCard
          label="Incoming Requests"
          value={incomingRequests.length}
          subtext="From campus peers"
          icon={Inbox}
          color="bg-brand-paper"
          noteHandwritten="Action needed"
        />

        {/* 3: Completed Shares */}
        <StatCard
          label="Completed Shares"
          value={completedSharesCount}
          subtext="Items passed forward"
          icon={CheckCircle2}
          color="bg-white"
          noteHandwritten="Zero waste 🌿"
        />

        {/* 4: RePoints Earned */}
        <StatCard
          label="RePoints Earned"
          value={`${currentUser?.rePoints || 0} PTS`}
          subtext="+85 pts this semester"
          icon={Sparkles}
          color="bg-brand-chartreuse/30"
          noteHandwritten="Eco tier 1"
        />
      </div>

      {/* 3. Quick Actions Section (4 explicit actions) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black uppercase font-heading text-brand-black tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 stroke-[2.5]" />
            Quick Actions
          </h3>
          <span className="text-xs font-mono font-bold uppercase text-neutral-600">
            One-Click Shortcuts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Share a Resource */}
          <Link
            to="/resources/share"
            className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard brutal-btn hover:bg-brand-chartreuse/20 transition group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-brand-chartreuse border-2 border-brand-black rounded shadow-hard-sm group-hover:rotate-6 transition-transform">
                <PlusCircle className="w-5 h-5 text-brand-black stroke-[2.5]" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-black group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="font-heading font-black text-sm uppercase text-brand-black">
                1. Share a Resource
              </h4>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                Pin textbooks, lab coats or gadgets (+35 RePoints)
              </p>
            </div>
          </Link>

          {/* Action 2: Explore Resources */}
          <Link
            to="/resources"
            className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard brutal-btn hover:bg-brand-blue/20 transition group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-brand-blue border-2 border-brand-black rounded shadow-hard-sm group-hover:rotate-6 transition-transform">
                <Compass className="w-5 h-5 text-brand-black stroke-[2.5]" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-black group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="font-heading font-black text-sm uppercase text-brand-black">
                2. Explore Resources
              </h4>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                Browse 580+ active notices pinned across ADTU
              </p>
            </div>
          </Link>

          {/* Action 3: My Requests */}
          <Link
            to="/dashboard/requests"
            className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard brutal-btn hover:bg-brand-orange/20 transition group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-brand-orange border-2 border-brand-black rounded shadow-hard-sm group-hover:rotate-6 transition-transform">
                <Inbox className="w-5 h-5 text-brand-black stroke-[2.5]" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-black group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="font-heading font-black text-sm uppercase text-brand-black">
                3. My Requests
              </h4>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                Coordinate meetups, approvals & handovers
              </p>
            </div>
          </Link>

          {/* Action 4: My Profile */}
          <Link
            to="/dashboard/profile"
            className="p-4 bg-white border-2 border-brand-black rounded-neo shadow-hard brutal-btn hover:bg-brand-pink/20 transition group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-brand-pink border-2 border-brand-black rounded shadow-hard-sm group-hover:rotate-6 transition-transform">
                <User className="w-5 h-5 text-brand-black stroke-[2.5]" />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-black group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="font-heading font-black text-sm uppercase text-brand-black">
                4. My Profile
              </h4>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                View eco-badges & redeem RePoints for canteen coupons
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Incoming Requests Section */}
      <div className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-brand-black pb-3">
          <div>
            <h3 className="text-xl font-black uppercase font-heading text-brand-black flex items-center gap-2">
              <Inbox className="w-5 h-5 text-brand-black stroke-[2.5]" />
              Incoming Requests ({incomingRequests.length})
            </h3>
            <p className="text-xs text-neutral-600 font-medium">
              Peers requesting your items. Accept to arrange meetup and earn RePoints.
            </p>
          </div>

          <Link
            to="/dashboard/requests"
            className="text-xs font-black uppercase text-brand-black hover:underline flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="py-6 text-center text-xs font-bold text-neutral-500">
            No pending incoming requests right now. Your items are visible on the campus noticeboard!
          </div>
        ) : (
          <div className="divide-y divide-brand-black/10">
            {incomingRequests.map((req) => (
              <div key={req.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={req.requester?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'}
                    alt={req.requester?.name}
                    className="w-10 h-10 rounded-full border border-brand-black object-cover mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-brand-black">
                        {req.requester?.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-brand-paper px-1.5 py-0.5 border border-brand-black rounded">
                        {req.requester?.department}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-black mt-0.5">
                      Requested: <strong className="underline">{req.resourceTitle}</strong> ({req.sharingType})
                    </p>
                    <p className="text-xs text-neutral-600 mt-1 italic">
                      "{req.message}"
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] font-semibold text-neutral-700">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>Preferred: {req.preferredTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => updateRequestStatus(req.id, 'ACCEPTED')}
                    className="px-3.5 py-1.5 bg-brand-chartreuse text-brand-black font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm flex items-center gap-1 hover:bg-yellow-300"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => updateRequestStatus(req.id, 'REJECTED')}
                    className="px-3 py-1.5 bg-white text-brand-urgent font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-red-50 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. My Recent Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black uppercase font-heading text-brand-black">
              My Recent Listings ({myListings.length})
            </h3>
            <p className="text-xs text-neutral-600 font-medium">
              Items you currently have pinned on the noticeboard.
            </p>
          </div>

          <Link
            to="/dashboard/listings"
            className="text-xs font-black uppercase text-brand-black hover:underline flex items-center gap-1"
          >
            <span>Manage All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myListings.slice(0, 3).map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              isOwner={true}
              onSelect={(item) => setSelectedResource(item)}
              showActions={true}
              actionButtonLabel="Manage Listing"
            />
          ))}
        </div>
      </div>

      {/* 6. Recent Community Activity Section */}
      <div className="bg-white border-2 border-brand-black rounded-neo shadow-hard-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-brand-black pb-2">
          <div>
            <h3 className="font-heading font-black text-base uppercase text-brand-black flex items-center gap-2">
              <Repeat className="w-4 h-4 stroke-[2.5]" />
              Recent Community Activity
            </h3>
            <p className="text-xs text-neutral-600 font-medium">
              Live updates across Assam Down Town University campus
            </p>
          </div>
          <Link to="/community" className="text-xs font-black uppercase text-brand-black hover:underline">
            Campus Hub →
          </Link>
        </div>

        <div className="divide-y divide-brand-black/10">
          {communityActivities.map((act) => (
            <div key={act.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  act.type === 'DONATE' ? 'bg-brand-pink' :
                  act.type === 'BORROW' ? 'bg-brand-blue' : 'bg-brand-orange'
                }`} />
                <span className="font-bold text-brand-black">{act.user}</span>
                <span className="text-neutral-700">{act.action}</span>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <span className="font-mono text-[10px] text-neutral-500">{act.time}</span>
                <span className="font-heading font-black text-[11px] text-brand-black bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded">
                  {act.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Details Modal */}
      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        isOwner={true}
      />
    </div>
  );
};
