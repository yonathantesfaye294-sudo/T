import React from 'react';
import { PlayerStats } from '../types';
import { X, BarChart2, Zap, Flame, Trophy, Award, Swords, Sparkles, CheckCircle2 } from 'lucide-react';

interface StatsModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Career Records</h3>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Logo Identification Telemetry</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
          <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Total Points</span>
            </div>
            <div className="text-2xl font-mono font-black text-yellow-400">
              {stats.totalScore.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Highest Streak</span>
            </div>
            <div className="text-2xl font-mono font-black text-rose-400">
              {stats.highestStreak}x
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Rush Record</span>
            </div>
            <div className="text-2xl font-mono font-black text-yellow-400">
              {stats.rushHighScore.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Stage 1 Solves</span>
            </div>
            <div className="text-2xl font-mono font-black text-purple-400">
              {stats.perfectStage1Guesses}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Swords className="w-3.5 h-3.5 text-emerald-400" />
              <span>1v1 Battles</span>
            </div>
            <div className="text-xl font-mono font-black text-emerald-400">
              {stats.battleWins}W / {stats.battleLosses}L
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily Streak</span>
            </div>
            <div className="text-2xl font-mono font-black text-cyan-400">
              {stats.dailyStreak} Days
            </div>
          </div>
        </div>

        {/* Total Games Played footer */}
        <div className="p-3.5 rounded-2xl bg-[#07090F] border border-slate-800 text-center text-xs text-slate-300">
          🎮 Total Games Completed: <strong className="text-white font-mono">{stats.totalGamesPlayed}</strong>
        </div>
      </div>
    </div>
  );
};
