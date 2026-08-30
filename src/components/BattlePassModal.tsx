import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { BATTLE_PASS_TIERS } from '../data/battlePass';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { X, Award, Sparkles, Check, Lock, Star } from 'lucide-react';

interface BattlePassModalProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onClose: () => void;
}

export const BattlePassModal: React.FC<BattlePassModalProps> = ({
  stats,
  onUpdateStats,
  onClose,
}) => {
  const [hasPremiumPass, setHasPremiumPass] = useState<boolean>(false);
  const playerXp = Math.min(1500, stats.totalScore);
  const currentTier = playerXp >= 1200 ? 5 : playerXp >= 800 ? 4 : playerXp >= 500 ? 3 : playerXp >= 250 ? 2 : playerXp >= 100 ? 1 : 0;

  const handleUnlockPremium = () => {
    if (stats.gems < 30) {
      sound.playWrong();
      return;
    }
    sound.playVictory();
    confetti({ particleCount: 80, spread: 60 });
    setHasPremiumPass(true);
    onUpdateStats((prev) => ({
      ...prev,
      gems: prev.gems - 30,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Season 1: Brand Champions</h3>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Earn XP & Unlock Tiers</p>
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

        {/* XP Progress Bar */}
        <div className="p-4 rounded-2xl bg-[#07090F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tier {currentTier} of 5</span>
            <span className="text-yellow-400 font-mono font-black">{playerXp} / 1,200 XP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
              style={{ width: `${Math.min(100, (playerXp / 1200) * 100)}%` }}
            />
          </div>
        </div>

        {/* Premium Pass Banner */}
        {!hasPremiumPass && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border border-yellow-400/30 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-yellow-300 uppercase tracking-widest flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                Unlock Premium Pass
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Get exclusive Ethiopian Vintage pack, shaders & extra gems
              </p>
            </div>
            <button
              type="button"
              onClick={handleUnlockPremium}
              className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer flex-shrink-0"
            >
              <span>💎 30</span>
              <span>Unlock</span>
            </button>
          </div>
        )}

        {/* Tiers List */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {BATTLE_PASS_TIERS.map((tier) => {
            const isUnlocked = playerXp >= tier.requiredXp;

            return (
              <div
                key={tier.tier}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-[#07090F]/60 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${
                    isUnlocked ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    T{tier.tier}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{tier.freeReward.icon}</span>
                      <span>{tier.freeReward.name}</span>
                    </div>
                    <div className="text-[11px] text-yellow-300 flex items-center gap-1 mt-0.5">
                      <span>★ Premium: {tier.premiumReward.icon} {tier.premiumReward.name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" /> {tier.requiredXp} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
