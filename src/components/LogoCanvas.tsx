import React, { useState, useEffect } from 'react';
import { LogoItem, DistortionType } from '../types';
import { REVEAL_STAGES } from '../data/logos';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, Zap } from 'lucide-react';

interface LogoCanvasProps {
  logo: LogoItem;
  stage: number; // 1 to 4
  revealedTiles?: boolean[];
  distortionType?: DistortionType;
  onManualReveal?: () => void;
  canRevealMore?: boolean;
  statusEffect?: 'idle' | 'correct' | 'wrong';
  scorePopup?: number | null;
}

export const LogoCanvas: React.FC<LogoCanvasProps> = ({
  logo,
  stage,
  distortionType = 'blur',
  onManualReveal,
  canRevealMore = true,
  statusEffect = 'idle',
  scorePopup = null,
}) => {
  const currentStageInfo = REVEAL_STAGES.find((s) => s.stage === stage) || REVEAL_STAGES[0];
  const [scratchTiles, setScratchTiles] = useState<boolean[]>(Array(16).fill(false));

  // Reset scratch tiles when logo changes or stage upgrades
  useEffect(() => {
    if (stage === 1) {
      // In stage 1, only 2-3 random tiles revealed if in tile mode
      const initial = Array(16).fill(false);
      initial[5] = true;
      initial[10] = true;
      setScratchTiles(initial);
    } else if (stage === 2) {
      const s2 = Array(16).fill(false);
      [1, 5, 6, 9, 10, 14].forEach((idx) => (s2[idx] = true));
      setScratchTiles(s2);
    } else if (stage === 3) {
      const s3 = Array(16).fill(true);
      s3[0] = false;
      s3[3] = false;
      s3[12] = false;
      s3[15] = false;
      setScratchTiles(s3);
    } else {
      setScratchTiles(Array(16).fill(true));
    }
  }, [logo.id, stage]);

  const handleTileClick = (idx: number) => {
    if (statusEffect !== 'idle') return;
    if (!scratchTiles[idx]) {
      const updated = [...scratchTiles];
      updated[idx] = true;
      setScratchTiles(updated);
    }
  };

  // Calculate optical blur filter
  const blurAmount = statusEffect === 'correct' ? 0 : currentStageInfo.blurPx;
  const isSilhouette = distortionType === 'silhouette' && stage < 3 && statusEffect !== 'correct';

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square flex flex-col items-center justify-center select-none">
      {/* Outer Glow & Card Container */}
      <div
        className={`relative w-full h-full rounded-3xl p-6 flex items-center justify-center transition-all duration-500 overflow-hidden border ${
          statusEffect === 'correct'
            ? 'bg-emerald-950/50 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.35)] scale-105'
            : statusEffect === 'wrong'
            ? 'bg-rose-950/50 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.35)] animate-shake'
            : 'bg-[#111827] border-slate-700 shadow-2xl backdrop-blur-xl'
        }`}
      >
        {/* Background Ambient Radial Gradient */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${logo.colorTheme || '#FACC15'}, transparent 70%)`,
          }}
        />

        {/* Scanline Grid for Retro Arcade Feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        {/* Stage & Multiplier Badge */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
          <span
            className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#1F2937] text-white border border-slate-600 backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-md"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            Stage {stage}/4: {currentStageInfo.label}
          </span>
          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
            +{currentStageInfo.points} PTS
          </span>
        </div>

        {/* SVG Logo Rendering Layer */}
        <div
          className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transition-all duration-500 transform"
          style={{
            filter: isSilhouette
              ? 'brightness(0) contrast(200%)'
              : `blur(${blurAmount}px) saturate(${stage === 1 ? 0.7 : 1})`,
            transform: statusEffect === 'correct' ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {logo.svgRender({ stage })}
        </div>

        {/* Optional Tile Scratch Matrix Overlay */}
        {distortionType === 'tiles' && stage < 4 && statusEffect !== 'correct' && (
          <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-1.5 z-10 p-2">
            {scratchTiles.map((revealed, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleTileClick(idx)}
                whileHover={{ scale: revealed ? 1 : 0.96 }}
                whileTap={{ scale: 0.92 }}
                className={`rounded-xl transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                  revealed
                    ? 'bg-transparent border border-white/5 opacity-0 pointer-events-none'
                    : 'bg-slate-800/95 hover:bg-slate-700/90 border border-slate-700 text-slate-400 cursor-pointer shadow-md'
                }`}
              >
                {!revealed && <Sparkles className="w-3.5 h-3.5 text-slate-500" />}
              </motion.button>
            ))}
          </div>
        )}

        {/* Floating Score Popup */}
        <AnimatePresence>
          {scorePopup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1.25 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute z-30 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xl shadow-2xl border-2 border-yellow-200"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              +{scorePopup} PTS!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wrong Feedback Splash */}
        {statusEffect === 'wrong' && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-950/60 backdrop-blur-sm z-30 text-rose-300 font-black text-xl tracking-wider uppercase border border-rose-500/50 rounded-3xl">
            ✗ MISSED!
          </div>
        )}

        {/* Bottom Reveal Prompt */}
        {canRevealMore && stage < 4 && statusEffect === 'idle' && onManualReveal && (
          <button
            type="button"
            onClick={onManualReveal}
            className="absolute bottom-3 inset-x-4 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Reveal More Clue</span>
            <span className="text-amber-400 font-bold">(-25 pts penalty)</span>
          </button>
        )}
      </div>
    </div>
  );
};
