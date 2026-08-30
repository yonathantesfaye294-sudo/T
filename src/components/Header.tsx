import React from 'react';
import { PlayerStats } from '../types';
import { Volume2, VolumeX, Trophy, ShoppingBag, Award, BarChart2, Flame, Mail, Download } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  stats: PlayerStats;
  onOpenLeaderboard: () => void;
  onOpenStore: () => void;
  onOpenBattlePass: () => void;
  onOpenStats: () => void;
  onOpenGmailHub: () => void;
  onOpenInstall: () => void;
  user: any;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onGoHome: () => void;
  activeMode: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onOpenLeaderboard,
  onOpenStore,
  onOpenBattlePass,
  onOpenStats,
  onOpenGmailHub,
  onOpenInstall,
  user,
  isSoundOn,
  onToggleSound,
  onGoHome,
  activeMode,
}) => {
  return (
    <header className="w-full sticky top-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-[#111827] border border-[#1F2937] p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md">
        {/* Brand Logo / Home Button */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black text-2xl shadow-lg shadow-yellow-400/20 group-hover:scale-105 transition-transform flex-shrink-0">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
                Logo <span className="text-yellow-400">Rush</span>
              </h1>
              {activeMode && (
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                  {activeMode}
                </span>
              )}
            </div>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mt-0.5 hidden xs:block">
              Guess & Reveal Trivia
            </p>
          </div>
        </button>

        {/* Right Section: Rank, Stats, Modals & Google Account */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Daily Rank Tag */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
              Global Rank
            </span>
            <span className="text-base sm:text-lg font-mono text-yellow-400 font-black">
              TOP 4%
            </span>
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-700/80"></div>

          {/* Player Economy Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-bold">
            {/* Daily Streak */}
            {stats.dailyStreak > 0 && (
              <div
                className="flex items-center gap-1.5 bg-[#1F2937] px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-600 text-amber-300"
                title="Daily Consecutive Streak"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                <span className="font-mono">{stats.dailyStreak}d</span>
              </div>
            )}

            {/* Coins */}
            <button
              type="button"
              onClick={onOpenStore}
              className="flex items-center gap-1.5 bg-[#1F2937] hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-600 text-yellow-400 transition-all hover:scale-105 cursor-pointer"
            >
              <span>🪙</span>
              <span className="font-mono text-white">{stats.coins.toLocaleString()}</span>
            </button>

            {/* Diamonds */}
            <button
              type="button"
              onClick={onOpenStore}
              className="hidden sm:flex items-center gap-1.5 bg-[#1F2937] hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-600 text-cyan-300 transition-all hover:scale-105 cursor-pointer"
            >
              <span>💎</span>
              <span className="font-mono text-white">{stats.gems.toLocaleString()}</span>
            </button>
          </div>

          {/* Google / Gmail Auth Button */}
          <button
            type="button"
            onClick={onOpenGmailHub}
            title={user ? `Connected as ${user.email} (Gmail Active)` : 'Connect Gmail Account'}
            className="flex items-center gap-2 bg-[#1F2937] hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 px-2.5 sm:px-3 py-1.5 rounded-full transition-all cursor-pointer group"
          >
            {user ? (
              <>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google'}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full border border-slate-600 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px]">
                    G
                  </div>
                )}
                <span className="hidden md:inline-block text-xs font-bold text-slate-200 max-w-[90px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="hidden sm:inline-block text-xs font-bold text-slate-300 group-hover:text-white">
                  Gmail
                </span>
              </>
            )}
          </button>

          {/* Quick Access Icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenInstall}
              title="Install App / Play Offline"
              className="p-2 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-bold">Install</span>
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              title="Leaderboards"
              className="p-2 rounded-xl bg-[#1F2937]/80 hover:bg-[#1F2937] border border-slate-700 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenBattlePass}
              title="Battle Pass"
              className="hidden sm:block p-2 rounded-xl bg-[#1F2937]/80 hover:bg-[#1F2937] border border-slate-700 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenStats}
              title="Player Statistics"
              className="p-2 rounded-xl bg-[#1F2937]/80 hover:bg-[#1F2937] border border-slate-700 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenStore}
              title="Store"
              className="p-2 rounded-xl bg-[#1F2937]/80 hover:bg-[#1F2937] border border-slate-700 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              title={isSoundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSoundOn
                  ? 'bg-[#1F2937]/80 hover:bg-[#1F2937] text-slate-300 border-slate-700 hover:text-white'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

