import React, { useState } from 'react';
import { PlayerStats, LeaderboardEntry } from '../types';
import { X, Trophy, Medal, Flame, Globe, Calendar, Clock } from 'lucide-react';

interface LeaderboardModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  stats,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'alltime'>('daily');

  const dailyLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'Abebe_Bikila99', score: 985, country: '🇪🇹', badge: '🥇 1st' },
    { rank: 2, username: 'ApexHunter_99', score: 975, country: '🇺🇸', badge: '🥈 2nd' },
    { rank: 3, username: 'Tsedey_Addis', score: 960, country: '🇪🇹', badge: '🥉 3rd' },
    { rank: 4, username: 'LogoNinja_JP', score: 940, country: '🇯🇵' },
    { rank: 5, username: 'PixelMaster_UK', score: 925, country: '🇬🇧' },
    { rank: 6, username: 'Haile_G', score: 910, country: '🇪🇹' },
    { rank: 7, username: 'BrandWhiz', score: 890, country: '🇨🇦' },
    { rank: 8, username: 'You', score: stats.totalScore > 0 ? Math.min(stats.totalScore, 885) : 820, country: '🇪🇹', isCurrentUser: true },
    { rank: 9, username: 'QuizMaster_DE', score: 810, country: '🇩🇪' },
    { rank: 10, username: 'NordicRacer', score: 790, country: '🇸🇪' },
  ];

  const weeklyLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'Abebe_Bikila99', score: 6840, country: '🇪🇹', badge: '👑 Legend' },
    { rank: 2, username: 'BrandWhiz', score: 6420, country: '🇨🇦' },
    { rank: 3, username: 'Tsedey_Addis', score: 6290, country: '🇪🇹' },
    { rank: 4, username: 'You', score: Math.max(stats.totalScore, 4200), country: '🇪🇹', isCurrentUser: true },
    { rank: 5, username: 'PixelMaster_UK', score: 4110, country: '🇬🇧' },
  ];

  const allTimeLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'Abebe_Bikila99', score: 48950, country: '🇪🇹', streak: 45, badge: '⭐ Hall of Fame' },
    { rank: 2, username: 'LogoNinja_JP', score: 42100, country: '🇯🇵', streak: 38 },
    { rank: 3, username: 'BrandWhiz', score: 39500, country: '🇨🇦', streak: 31 },
    { rank: 14, username: 'You', score: stats.totalScore, country: '🇪🇹', streak: stats.highestStreak, isCurrentUser: true },
  ];

  const currentList =
    activeTab === 'daily'
      ? dailyLeaderboard
      : activeTab === 'weekly'
      ? weeklyLeaderboard
      : allTimeLeaderboard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Global Leaderboard</h3>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Daily, Weekly & All-Time</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1F2937] hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Filter */}
        <div className="grid grid-cols-3 gap-1 bg-[#07090F] p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
              activeTab === 'daily'
                ? 'bg-yellow-400 text-black shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily 10</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
              activeTab === 'weekly'
                ? 'bg-yellow-400 text-black shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Weekly</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alltime')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${
              activeTab === 'alltime'
                ? 'bg-yellow-400 text-black shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All-Time</span>
          </button>
        </div>

        {/* Ranking List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {currentList.map((entry) => (
            <div
              key={`${entry.rank}-${entry.username}`}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
                entry.isCurrentUser
                  ? 'bg-yellow-400/15 border-yellow-400/60 text-yellow-200 shadow-md scale-[1.01]'
                  : entry.rank === 1
                  ? 'bg-gradient-to-r from-yellow-400/10 to-transparent border-yellow-400/30 text-white'
                  : 'bg-slate-800/40 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 text-center font-black text-xs font-mono ${
                    entry.rank === 1
                      ? 'text-yellow-400 text-sm'
                      : entry.rank === 2
                      ? 'text-slate-300'
                      : entry.rank === 3
                      ? 'text-amber-500'
                      : 'text-slate-500'
                  }`}
                >
                  #{entry.rank}
                </span>

                <span className="text-base">{entry.country}</span>

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold truncate ${entry.isCurrentUser ? 'text-yellow-300' : 'text-white'}`}>
                      {entry.username}
                    </span>
                    {entry.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                        {entry.badge}
                      </span>
                    )}
                  </div>
                  {entry.streak && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-rose-400" />
                      {entry.streak} streak
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-mono font-black text-sm text-yellow-400">
                  {entry.score.toLocaleString()}
                </span>
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-widest">PTS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
