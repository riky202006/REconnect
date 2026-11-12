import React, { useState, useEffect } from 'react';
import { mockLeaderboard } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import {
  Trophy,
  Medal,
  Sparkles,
  Users,
  Award,
  TrendingUp,
  Flame,
  Crown,
  ChevronUp,
  MapPin,
  Leaf,
  CheckCircle2
} from 'lucide-react';

export const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState('monthly'); // 'weekly' | 'monthly' | 'alltime'
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [rawLeaderboard, setRawLeaderboard] = useState(mockLeaderboard);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const live = await userService.getLeaderboard(timeframe);
        if (live && Array.isArray(live) && live.length > 0) {
          setRawLeaderboard(live);
        }
      } catch (e) {}
    }
    fetchLeaderboard();
  }, [timeframe]);

  // Multiplier or simulated points depending on timeframe
  const getPoints = (basePoints) => {
    if (timeframe === 'weekly') return Math.round(basePoints * 0.28);
    if (timeframe === 'monthly') return Math.round(basePoints * 0.72);
    return basePoints;
  };

  const getContributions = (baseContribs) => {
    if (timeframe === 'weekly') return Math.max(1, Math.round(baseContribs * 0.3));
    if (timeframe === 'monthly') return Math.max(1, Math.round(baseContribs * 0.7));
    return baseContribs;
  };

  // Adjust and sort leaderboard
  const list = rawLeaderboard
    .map((u, i) => ({
      ...u,
      community: u.community || 'ADTU - Main Campus (Panikhaiti)',
      calculatedPoints: getPoints(u.points),
      calculatedContributions: getContributions(u.itemsShared)
    }))
    .filter((u) => {
      if (selectedDept === 'ALL') return true;
      return u.department?.toLowerCase().includes(selectedDept.toLowerCase());
    })
    .sort((a, b) => b.calculatedPoints - a.calculatedPoints)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const topThree = list.slice(0, 3);
  const remaining = list.slice(3);

  // Check current user position
  const currentUserEntry = list.find(
    (u) =>
      u.name.toLowerCase() === currentUser?.name?.toLowerCase() ||
      u.name.toLowerCase().includes('priyam')
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 bg-brand-chartreuse border-3 border-brand-black rounded-neo shadow-hard-card overflow-hidden">
        {/* Tape decoration */}
        <div className="absolute -top-3 right-8 w-24 h-6 tape-strip rotate-2 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black uppercase bg-brand-black text-white px-2 py-0.5 rounded inline-block">
              ADTU HONOUR BOARD
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-brand-black font-heading leading-tight">
              Community Champions
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800">
              Small contributions. Big community impact.
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-white border-2 border-brand-black rounded shadow-hard-sm p-1 self-start md:self-auto">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded transition ${
                timeframe === 'weekly'
                  ? 'bg-brand-black text-white shadow-hard-sm'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded transition ${
                timeframe === 'monthly'
                  ? 'bg-brand-black text-white shadow-hard-sm'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded transition ${
                timeframe === 'alltime'
                  ? 'bg-brand-black text-white shadow-hard-sm'
                  : 'text-neutral-700 hover:text-brand-black'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>
      </div>

      {/* Your Rank Highlight Banner */}
      {currentUserEntry && (
        <div className="p-4 bg-brand-paper border-2 border-brand-black rounded-neo shadow-hard-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-chartreuse border-2 border-brand-black flex items-center justify-center font-heading font-black text-base shadow-hard-sm">
              #{currentUserEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base uppercase text-brand-black">
                  Your Current Standing
                </span>
                <span className="text-[10px] font-mono font-bold uppercase bg-brand-chartreuse px-2 py-0.5 border border-brand-black rounded">
                  {timeframe} Rank
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-medium">
                You have contributed{' '}
                <span className="font-bold text-brand-black">
                  {currentUserEntry.calculatedContributions} items
                </span>{' '}
                and hold{' '}
                <span className="font-bold text-brand-black">
                  {currentUserEntry.calculatedPoints} RePoints
                </span>.
              </p>
            </div>
          </div>

          <div className="text-xs font-bold font-hand text-brand-black text-base self-end sm:self-center">
            "Keep sharing to climb to #1! 🌱"
          </div>
        </div>
      )}

      {/* Podium for Top 3 */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 items-end">
          {/* Rank 2 (Silver) */}
          <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-5 text-center space-y-3 relative order-2 md:order-1">
            <div className="w-10 h-10 mx-auto bg-neutral-200 border-2 border-brand-black rounded-full flex items-center justify-center font-heading font-black text-lg shadow-hard-sm">
              2
            </div>
            <img
              src={topThree[1].avatar}
              alt={topThree[1].name}
              className="w-16 h-16 mx-auto rounded-full border-2 border-brand-black object-cover shadow-hard-sm"
            />
            <div>
              <h3 className="font-heading font-black text-lg uppercase text-brand-black leading-tight">
                {topThree[1].name}
              </h3>
              <p className="text-[11px] text-neutral-600 font-semibold">{topThree[1].department}</p>
              <p className="text-[10px] text-neutral-500 font-medium flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-urgent" />
                {topThree[1].community}
              </p>
            </div>
            <div className="p-2.5 bg-brand-paper border-2 border-brand-black rounded">
              <span className="font-heading font-black text-2xl text-brand-black">
                {topThree[1].calculatedPoints} PTS
              </span>
              <p className="text-[11px] text-neutral-700 font-bold">
                {topThree[1].calculatedContributions} contributions
              </p>
            </div>
            <span className="text-xs font-bold text-neutral-700 block">{topThree[1].badge}</span>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="bg-brand-chartreuse border-3 border-brand-black rounded-neo shadow-hard-xl p-6 text-center space-y-3 relative order-1 md:order-2 md:-translate-y-4">
            {/* Crown decoration */}
            <div className="w-8 h-8 mx-auto -mb-2 text-brand-black flex items-center justify-center">
              <Crown className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="w-12 h-12 mx-auto bg-brand-black text-brand-chartreuse border-2 border-brand-black rounded-full flex items-center justify-center font-heading font-black text-2xl shadow-hard-sm">
              1
            </div>

            <img
              src={topThree[0].avatar}
              alt={topThree[0].name}
              className="w-20 h-20 mx-auto rounded-full border-3 border-brand-black object-cover shadow-hard-sm"
            />
            <div>
              <h3 className="font-heading font-black text-xl uppercase text-brand-black leading-tight">
                {topThree[0].name}
              </h3>
              <p className="text-xs text-neutral-800 font-bold">{topThree[0].department}</p>
              <p className="text-[11px] text-neutral-700 font-medium flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-urgent" />
                {topThree[0].community}
              </p>
            </div>
            <div className="p-3 bg-white border-2 border-brand-black rounded shadow-hard-sm">
              <span className="font-heading font-black text-3xl text-brand-black">
                {topThree[0].calculatedPoints} PTS
              </span>
              <p className="text-xs text-neutral-800 font-black">
                {topThree[0].calculatedContributions} contributions
              </p>
            </div>
            <span className="text-xs font-black text-brand-black uppercase bg-brand-paper px-2 py-1 border border-brand-black rounded inline-block">
              {topThree[0].badge}
            </span>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-5 text-center space-y-3 relative order-3">
            <div className="w-10 h-10 mx-auto bg-amber-100 border-2 border-brand-black rounded-full flex items-center justify-center font-heading font-black text-lg shadow-hard-sm">
              3
            </div>
            <img
              src={topThree[2].avatar}
              alt={topThree[2].name}
              className="w-16 h-16 mx-auto rounded-full border-2 border-brand-black object-cover shadow-hard-sm"
            />
            <div>
              <h3 className="font-heading font-black text-lg uppercase text-brand-black leading-tight">
                {topThree[2].name}
              </h3>
              <p className="text-[11px] text-neutral-600 font-semibold">{topThree[2].department}</p>
              <p className="text-[10px] text-neutral-500 font-medium flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-urgent" />
                {topThree[2].community}
              </p>
            </div>
            <div className="p-2.5 bg-brand-paper border-2 border-brand-black rounded">
              <span className="font-heading font-black text-2xl text-brand-black">
                {topThree[2].calculatedPoints} PTS
              </span>
              <p className="text-[11px] text-neutral-700 font-bold">
                {topThree[2].calculatedContributions} contributions
              </p>
            </div>
            <span className="text-xs font-bold text-neutral-700 block">{topThree[2].badge}</span>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white border-3 border-brand-black rounded-neo shadow-hard-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-brand-black pb-3">
          <div>
            <h2 className="font-heading font-black text-2xl uppercase text-brand-black flex items-center gap-2">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
              Full Campus Standings
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Rankings update after verified physical handovers on the campus noticeboard.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-neutral-600">
            Showing {list.length} Champions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-paper border-b-2 border-brand-black font-heading font-black uppercase text-neutral-800">
              <tr>
                <th className="p-3 w-16 text-center">Rank</th>
                <th className="p-3">User & Community</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Contributions</th>
                <th className="p-3 text-right">RePoints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/10 font-medium">
              {list.map((u) => {
                const isCurrentUser =
                  u.name.toLowerCase() === currentUser?.name?.toLowerCase() ||
                  u.name.toLowerCase().includes('priyam');

                return (
                  <tr
                    key={u.rank}
                    className={`transition ${
                      isCurrentUser
                        ? 'bg-brand-chartreuse/30 font-bold border-l-4 border-l-brand-black'
                        : 'hover:bg-brand-bg/50'
                    }`}
                  >
                    {/* Rank */}
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-heading font-black text-sm border-2 ${
                          u.rank === 1
                            ? 'bg-brand-chartreuse text-brand-black border-brand-black shadow-hard-sm'
                            : u.rank === 2
                            ? 'bg-neutral-200 text-brand-black border-brand-black'
                            : u.rank === 3
                            ? 'bg-amber-100 text-brand-black border-brand-black'
                            : 'bg-white text-neutral-700 border-neutral-300'
                        }`}
                      >
                        {u.rank}
                      </span>
                    </td>

                    {/* User */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full border-2 border-brand-black object-cover shrink-0 shadow-hard-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-sm uppercase text-brand-black">
                              {u.name}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-brand-chartreuse border border-brand-black rounded">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-urgent shrink-0" />
                            {u.community}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-3 text-neutral-700 font-semibold">{u.department}</td>

                    {/* Contributions */}
                    <td className="p-3 text-center font-mono font-bold text-sm">
                      {u.calculatedContributions}
                    </td>

                    {/* Points */}
                    <td className="p-3 text-right">
                      <span className="font-heading font-black text-base text-brand-black px-2 py-0.5 bg-brand-paper border border-brand-black rounded">
                        {u.calculatedPoints} PTS
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};