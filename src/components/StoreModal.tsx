import React, { useState, useEffect } from 'react';
import { PlayerStats } from '../types';
import { STORE_ITEMS } from '../data/battlePass';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { X, PlaySquare, Sparkles, Check, Lock, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

interface StoreModalProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onClose: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  stats,
  onUpdateStats,
  onClose,
}) => {
  const [adPlaying, setAdPlaying] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(5);
  const [adRewardGranted, setAdRewardGranted] = useState<boolean>(false);
  const [purchasedIds, setPurchasedIds] = useState<string[]>(stats.unlockedPacks || []);

  // Ad simulation countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adPlaying && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (adPlaying && adCountdown === 0) {
      // Ad finished!
      setAdPlaying(false);
      setAdRewardGranted(true);
      sound.playVictory();
      confetti({ particleCount: 60, spread: 60 });

      onUpdateStats((prev) => ({
        ...prev,
        coins: prev.coins + 200,
        gems: prev.gems + 5,
        powerUps: {
          ...prev.powerUps,
          revealStage: prev.powerUps.revealStage + 2,
        },
      }));

      setTimeout(() => setAdRewardGranted(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [adPlaying, adCountdown, onUpdateStats]);

  const handleWatchAd = () => {
    setAdCountdown(5);
    setAdPlaying(true);
  };

  const handleBuyItem = (item: typeof STORE_ITEMS[0]) => {
    const isAffordable =
      item.cost.type === 'coins'
        ? stats.coins >= item.cost.amount
        : stats.gems >= item.cost.amount;

    if (!isAffordable) {
      sound.playWrong();
      return;
    }

    sound.playVictory();
    confetti({ particleCount: 50, spread: 50 });

    onUpdateStats((prev) => {
      const newCoins = item.cost.type === 'coins' ? prev.coins - item.cost.amount : prev.coins;
      const newGems = item.cost.type === 'gems' ? prev.gems - item.cost.amount : prev.gems;
      return {
        ...prev,
        coins: newCoins,
        gems: newGems,
        unlockedPacks: [...prev.unlockedPacks, item.id],
      };
    });

    setPurchasedIds((prev) => [...prev, item.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Logo Rush Market</h3>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Free Rewards & Special Brand Packs</p>
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

        {/* Currency Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#07090F] border border-slate-800">
          <div className="flex items-center gap-2 font-bold text-sm text-yellow-400">
            <span>🪙</span>
            <span className="font-mono text-white">{stats.coins.toLocaleString()} Coins</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
            <span>💎</span>
            <span className="font-mono text-white">{stats.gems.toLocaleString()} Diamonds</span>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Rewarded Ad Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-400/40">
                  Daily Rewarded Ad
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  Watch 5s Clip → Get +200 Coins & +5 Diamonds!
                </h4>
                <p className="text-xs text-purple-200/80">Also awards 2 free clue reveals</p>
              </div>
              <span className="text-2xl">📺</span>
            </div>

            {adPlaying ? (
              <div className="p-3 rounded-xl bg-[#07090F] border border-purple-400 flex items-center justify-between text-xs text-white">
                <span className="animate-pulse flex items-center gap-2">
                  <PlaySquare className="w-4 h-4 text-purple-400" />
                  Sponsor Clip Playing...
                </span>
                <span className="font-mono font-black text-yellow-400">{adCountdown}s</span>
              </div>
            ) : adRewardGranted ? (
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Reward Claimed!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleWatchAd}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-101 active:scale-99"
              >
                <PlaySquare className="w-4 h-4" />
                <span>Watch Short Clip (5s)</span>
              </button>
            )}
          </div>

          {/* Store Items List */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo Packs & Items</h4>
            {STORE_ITEMS.map((item) => {
              const isOwned = purchasedIds.includes(item.id);
              const canAfford =
                item.cost.type === 'coins'
                  ? stats.coins >= item.cost.amount
                  : stats.gems >= item.cost.amount;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl p-2 rounded-xl bg-[#07090F] border border-slate-700 flex-shrink-0">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h5>
                        {item.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isOwned ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Owned
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleBuyItem(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                          canAfford
                            ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span>{item.cost.type === 'coins' ? '🪙' : '💎'}</span>
                        <span className="font-mono">{item.cost.amount}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
