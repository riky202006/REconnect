import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResources } from '../../context/ResourceContext';
import { Modal } from '../../components/common/Modal';
import { COMMUNITIES } from '../../constants';
import {
  User,
  Sparkles,
  Award,
  Calendar,
  MapPin,
  ShieldCheck,
  Edit3,
  Gift,
  ArrowUpRight,
  TrendingUp,
  Leaf,
  Coffee,
  BookOpen,
  CheckCircle2,
  Lock,
  Trophy,
  Star,
  Heart,
  Globe,
  FileText,
  Clock,
  Zap,
  ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { currentUser, updateUser, addRePoints } = useAuth();
  const { transactions } = useResources();

  // Edit Profile Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [community, setCommunity] = useState(currentUser?.community || COMMUNITIES[0]);
  const [hostel, setHostel] = useState(currentUser?.hostel || '');

  // Ledger Filter
  const [ledgerFilter, setLedgerFilter] = useState('ALL'); // 'ALL' | 'EARNED' | 'REDEEMED'

  // Available rewards for redemption
  const availableRewards = [
    {
      id: 'rw_canteen',
      title: 'ADTU Central Canteen Voucher (₹100)',
      pointsCost: 150,
      icon: Coffee,
      desc: 'Valid on meals, snacks & beverages at Panikhaiti canteen'
    },
    {
      id: 'rw_print',
      title: 'Campus Printing & Xerox Credits (50 Pages)',
      pointsCost: 100,
      icon: BookOpen,
      desc: 'Redeemable at Library Digital Center for project reports'
    },
    {
      id: 'rw_swag',
      title: 'Eco-Champion Metal Water Bottle',
      pointsCost: 300,
      icon: Leaf,
      desc: 'Insulated campus branded reusable bottle'
    }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({
      name,
      department,
      community,
      hostel
    });
    setIsEditOpen(false);
    toast.success('Profile updated successfully!', {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        fontWeight: 'bold',
        background: '#DDF247',
        color: '#121411'
      }
    });
  };

  const handleRedeemReward = (reward) => {
    if ((currentUser?.rePoints || 0) < reward.pointsCost) {
      toast.error(`Insufficient RePoints! You need ${reward.pointsCost} PTS to redeem this reward.`);
      return;
    }
    addRePoints(-reward.pointsCost, `Redeemed: ${reward.title}`);
    toast.success(`Redeemed ${reward.title}! Check your student email for voucher code.`, {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        background: '#DDF247',
        color: '#121411',
        fontWeight: 'bold'
      }
    });
  };

  // Canonical Badges with dynamic earned check
  const itemsSharedCount = currentUser?.stats?.itemsShared || 14;
  const itemsExchangedCount = currentUser?.stats?.itemsExchanged || 3;
  const co2Saved = currentUser?.stats?.co2SavedKg || 42.8;

  const BADGES_CONFIG = [
    {
      id: 'badge_first_share',
      name: 'First Share',
      icon: Leaf,
      emoji: '🌱',
      description: 'Listed and shared your very first campus resource.',
      isEarned: itemsSharedCount >= 1,
      requirement: 'Share at least 1 item'
    },
    {
      id: 'badge_community_helper',
      name: 'Community Helper',
      icon: Star,
      emoji: '⭐',
      description: 'Helped 5+ fellow students with study materials or essentials.',
      isEarned: itemsSharedCount >= 5,
      requirement: 'Share 5+ items'
    },
    {
      id: 'badge_resource_champion',
      name: 'Resource Champion',
      icon: Trophy,
      emoji: '🏆',
      description: 'Passed on 10+ resources to extend product lifecycles on campus.',
      isEarned: itemsSharedCount >= 10,
      requirement: 'Share 10+ items'
    },
    {
      id: 'badge_generous_giver',
      name: 'Generous Giver',
      icon: Heart,
      emoji: '💝',
      description: 'Active across both donations and fair peer exchanges.',
      isEarned: itemsSharedCount + itemsExchangedCount >= 15,
      requirement: '15+ total shares & exchanges'
    },
    {
      id: 'badge_eco_warrior',
      name: 'Eco Warrior',
      icon: Globe,
      emoji: '🌍',
      description: 'Saved over 30 kg of carbon emissions from landfill diversion.',
      isEarned: co2Saved >= 30,
      requirement: 'Prevent 30+ kg CO2'
    }
  ];

  // Rewards Ledger History
  const history = currentUser?.rewardsHistory || [];
  const filteredHistory = history.filter((item) => {
    if (ledgerFilter === 'EARNED') return item.points > 0 || item.type === 'earn';
    if (ledgerFilter === 'REDEEMED') return item.points < 0 || item.type === 'redeem';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Profile Header ID Card */}
      <div className="relative p-6 sm:p-8 bg-white border-3 border-brand-black rounded-neo shadow-hard-card overflow-hidden">
        {/* Tape decoration */}
        <div className="absolute -top-3 left-10 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                }
                alt={currentUser?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-brand-black object-cover shadow-hard-sm"
              />
              <div
                className="absolute bottom-0 right-0 p-1 bg-brand-chartreuse border-2 border-brand-black rounded-full"
                title="Verified Campus Student"
              >
                <ShieldCheck className="w-4 h-4 text-brand-black" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-brand-black font-heading leading-tight">
                  {currentUser?.name}
                </h1>
                <span className="px-2 py-0.5 bg-brand-chartreuse text-brand-black text-[10px] font-mono font-black uppercase border border-brand-black rounded">
                  {currentUser?.level || 'Campus Champion'}
                </span>
              </div>

              <p className="text-xs font-semibold text-neutral-700">
                {currentUser?.email}
              </p>
              <p className="text-xs text-neutral-600 font-medium">
                {currentUser?.department}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-urgent" />
                  {currentUser?.community}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  Member since {currentUser?.joinedDate || 'August 2025'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setName(currentUser?.name || '');
              setDepartment(currentUser?.department || '');
              setCommunity(currentUser?.community || COMMUNITIES[0]);
              setHostel(currentUser?.hostel || '');
              setIsEditOpen(true);
            }}
            className="px-4 py-2 bg-brand-chartreuse text-brand-black font-heading font-black text-xs uppercase border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300 flex items-center gap-1.5 self-start sm:self-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* RePoints & Contribution Statistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* RePoints Balance Card */}
        <div className="p-6 bg-brand-chartreuse border-3 border-brand-black rounded-neo shadow-hard-card flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black uppercase bg-brand-black text-white px-2 py-0.5 rounded inline-block">
              CURRENT BALANCE
            </span>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="font-heading font-black text-4xl sm:text-5xl text-brand-black leading-none">
                {currentUser?.rePoints || 0}
              </span>
              <span className="font-heading font-bold text-lg text-brand-black uppercase">
                RePoints
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-800 pt-1">
              Earned solely through verified physical handovers on campus.
            </p>
          </div>

          <div className="pt-4 border-t-2 border-brand-black/20 mt-4 flex justify-between items-center text-xs font-bold text-brand-black">
            <span>Community Rank</span>
            <span className="font-mono text-sm px-2 py-0.5 bg-brand-black text-brand-chartreuse rounded">
              #3 in ADTU
            </span>
          </div>
        </div>

        {/* Total Resources Shared */}
        <div className="p-5 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded bg-brand-paper border border-brand-black flex items-center justify-center mb-2">
              <Leaf className="w-4 h-4 text-brand-black" />
            </div>
            <span className="font-heading font-black text-3xl text-brand-black">
              {currentUser?.stats?.itemsShared || 14}
            </span>
            <p className="text-xs font-bold uppercase text-neutral-600">Total Resources Shared</p>
            <p className="text-[11px] text-neutral-500">Noticeboard listings handed to peers</p>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded border border-brand-black overflow-hidden mt-3">
            <div className="bg-brand-chartreuse h-full border-r border-brand-black" style={{ width: '70%' }} />
          </div>
        </div>

        {/* Successful Contributions */}
        <div className="p-5 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded bg-brand-blue border border-brand-black flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4 text-brand-black" />
            </div>
            <span className="font-heading font-black text-3xl text-brand-black">
              {(currentUser?.stats?.itemsShared || 14) + (currentUser?.stats?.itemsBorrowed || 6)}
            </span>
            <p className="text-xs font-bold uppercase text-neutral-600">Successful Contributions</p>
            <p className="text-[11px] text-neutral-500">100% verified handover score</p>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded border border-brand-black overflow-hidden mt-3">
            <div className="bg-brand-blue h-full border-r border-brand-black" style={{ width: '85%' }} />
          </div>
        </div>

        {/* CO2 Landfill Avoidance */}
        <div className="p-5 bg-white border-2 border-brand-black rounded-neo shadow-hard-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded bg-brand-orange border border-brand-black flex items-center justify-center mb-2">
              <Globe className="w-4 h-4 text-brand-black" />
            </div>
            <span className="font-heading font-black text-3xl text-brand-black">
              {currentUser?.stats?.co2SavedKg || 42.8} kg
            </span>
            <p className="text-xs font-bold uppercase text-neutral-600">CO2e Emissions Saved</p>
            <p className="text-[11px] text-neutral-500">Equivalent to 2.1 trees planted</p>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded border border-brand-black overflow-hidden mt-3">
            <div className="bg-brand-orange h-full border-r border-brand-black" style={{ width: '86%' }} />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-brand-black pb-3">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
              <Award className="w-6 h-6 stroke-[2.5]" />
              Community Achievement Badges
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Earned for real sustainability contributions in the ADTU campus.
            </p>
          </div>
          <span className="text-xs font-mono font-black uppercase px-2.5 py-1 bg-brand-chartreuse border border-brand-black rounded">
            {BADGES_CONFIG.filter((b) => b.isEarned).length} of {BADGES_CONFIG.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BADGES_CONFIG.map((badge) => {
            const isEarned = badge.isEarned;
            const IconComponent = badge.icon;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-neo border-2 transition-all flex flex-col justify-between space-y-3 relative ${
                  isEarned
                    ? 'bg-brand-paper border-brand-black shadow-hard-sm'
                    : 'bg-neutral-100 border-neutral-300 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{badge.emoji}</span>
                    {isEarned ? (
                      <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 bg-brand-chartreuse border border-brand-black rounded">
                        Earned
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-neutral-300 text-neutral-700 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-black text-base uppercase text-brand-black leading-tight">
                    {badge.name}
                  </h3>
                  <p className="text-[11px] text-neutral-600 mt-1 font-medium leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-black/10 text-[10px] font-mono text-neutral-500 font-semibold">
                  {badge.requirement}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RePoints Ledger (History of real contributions) */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-brand-black pb-3">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
              <FileText className="w-6 h-6 stroke-[2.5]" />
              RePoints Activity Ledger
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Transparent log of points earned from completed handovers and redeemed vouchers.
            </p>
          </div>

          {/* Ledger Filter Tabs */}
          <div className="flex bg-brand-paper border-2 border-brand-black rounded p-1 self-start sm:self-auto">
            <button
              onClick={() => setLedgerFilter('ALL')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                ledgerFilter === 'ALL'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setLedgerFilter('EARNED')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                ledgerFilter === 'EARNED'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Earned (+)
            </button>
            <button
              onClick={() => setLedgerFilter('REDEEMED')}
              className={`px-3 py-1 text-xs font-black uppercase rounded transition ${
                ledgerFilter === 'REDEEMED'
                  ? 'bg-brand-black text-white'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Redeemed (-)
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-paper border-b-2 border-brand-black font-heading font-black uppercase text-neutral-700">
              <tr>
                <th className="p-3">Activity / Contribution</th>
                <th className="p-3">Date</th>
                <th className="p-3">Reference</th>
                <th className="p-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/10 font-medium">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-neutral-500 font-semibold">
                    No ledger entries found for this filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => {
                  const isPositive = item.points > 0 || item.type === 'earn';

                  return (
                    <tr key={item.id || idx} className="hover:bg-brand-bg/50 transition">
                      <td className="p-3 font-semibold text-brand-black flex items-center gap-2">
                        {isPositive ? (
                          <div className="w-5 h-5 rounded-full bg-brand-chartreuse border border-brand-black flex items-center justify-center shrink-0">
                            <ArrowUpRight className="w-3 h-3 text-brand-black" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-100 border border-brand-urgent flex items-center justify-center shrink-0">
                            <ArrowDownRight className="w-3 h-3 text-brand-urgent" />
                          </div>
                        )}
                        <span>{item.action}</span>
                      </td>
                      <td className="p-3 font-mono text-neutral-600">{item.date}</td>
                      <td className="p-3 font-mono text-[11px] text-neutral-500">
                        {item.reference || `TXN-REF-${item.id?.slice(0, 6)}`}
                      </td>
                      <td
                        className={`p-3 text-right font-mono font-black text-sm ${
                          isPositive ? 'text-green-700' : 'text-brand-urgent'
                        }`}
                      >
                        {isPositive ? `+${item.points}` : item.points} PTS
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rewards Redemption Catalog */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="border-b-2 border-brand-black pb-3">
          <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
            <Gift className="w-6 h-6 stroke-[2.5]" />
            Redeem RePoints on Campus
          </h2>
          <p className="text-xs text-neutral-600 font-medium">
            Turn your circular sharing points into real campus perks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableRewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = (currentUser?.rePoints || 0) >= reward.pointsCost;

            return (
              <div
                key={reward.id}
                className="p-5 border-2 border-brand-black rounded-neo shadow-hard-sm bg-brand-bg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-9 h-9 rounded bg-white border border-brand-black flex items-center justify-center shadow-hard-sm">
                      <Icon className="w-5 h-5 text-brand-black" />
                    </div>
                    <span className="font-heading font-black text-base text-brand-black bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded">
                      {reward.pointsCost} PTS
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-lg uppercase text-brand-black leading-snug">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium">
                    {reward.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 px-3 text-xs font-black uppercase rounded border-2 border-brand-black brutal-btn shadow-hard-sm transition flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-brand-chartreuse hover:bg-yellow-300 text-brand-black'
                      : 'bg-neutral-200 text-neutral-400 border-neutral-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{canAfford ? 'Redeem Voucher' : 'Not Enough Points'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Campus Profile"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-brand-black mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border-2 border-brand-black rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-brand-black mb-1">
              Department & Semester
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Faculty of Engineering (CSE - 6th Sem)"
              required
              className="w-full px-3 py-2 bg-white border-2 border-brand-black rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-brand-black mb-1">
              Campus Community
            </label>
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-brand-black rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            >
              {COMMUNITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-brand-black mb-1">
              Hostel / Campus Residence
            </label>
            <input
              type="text"
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              placeholder="e.g. Boys Hostel Block 2, Room 304"
              className="w-full px-3 py-2 bg-white border-2 border-brand-black rounded text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-black uppercase bg-brand-chartreuse border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-yellow-300"
            >
              Save Profile Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="py-2 px-4 text-xs font-black uppercase bg-brand-paper border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};