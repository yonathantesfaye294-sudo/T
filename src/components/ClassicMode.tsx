import React, { useState, useEffect, useRef } from 'react';
import { LogoItem, PlayerStats, DistortionType } from '../types';
import { LOGO_DATABASE, REVEAL_STAGES } from '../data/logos';
import { LogoCanvas } from './LogoCanvas';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Heart, Zap, Sparkles, HelpCircle, Eye, Snowflake, RotateCcw, Award } from 'lucide-react';

interface ClassicModeProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToMenu: () => void;
}

export const ClassicMode: React.FC<ClassicModeProps> = ({
  stats,
  onUpdateStats,
  onBackToMenu,
}) => {
  const [level, setLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [deck, setDeck] = useState<LogoItem[]>(() => {
    return [...LOGO_DATABASE].sort(() => Math.random() - 0.5);
  });
  const [stage, setStage] = useState<number>(1);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [isTimerFrozen, setIsTimerFrozen] = useState<boolean>(false);
  const [statusEffect, setStatusEffect] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [scorePopup, setScorePopup] = useState<number | null>(null);

  const currentLogo = deck[(level - 1) % deck.length];

  // Rotate distortion style per level for fun variety
  const distortionType: DistortionType =
    level % 3 === 0 ? 'tiles' : level % 4 === 0 ? 'silhouette' : 'blur';

  const handleManualReveal = () => {
    if (stage < 4 && statusEffect === 'idle') {
      sound.playReveal();
      setStage((prev) => Math.min(4, prev + 1));
    }
  };

  const handleGuess = (option: string) => {
    if (statusEffect !== 'idle' || isGameOver) return;
    setSelectedOption(option);

    const isCorrect = option === currentLogo.name;
    const stageInfo = REVEAL_STAGES.find((s) => s.stage === stage) || REVEAL_STAGES[3];
    const pointsAwarded = isCorrect ? stageInfo.points : 0;

    if (isCorrect) {
      sound.playCorrect(level);
      setStatusEffect('correct');
      setScore((prev) => prev + pointsAwarded);
      setScorePopup(pointsAwarded);
    } else {
      sound.playWrong();
      setStatusEffect('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => {
          setIsGameOver(true);
          sound.playWrong();
        }, 800);
        return;
      }
    }

    setTimeout(() => {
      setStatusEffect('idle');
      setSelectedOption(null);
      setScorePopup(null);
      setEliminatedOptions([]);
      setIsTimerFrozen(false);

      if (level < 15) {
        setLevel((prev) => prev + 1);
        setStage(1);
      } else {
        // Completed all 15 levels!
        setIsGameOver(true);
        sound.playVictory();
        confetti({ particleCount: 100, spread: 70 });
      }
    }, 1000);
  };

  // 50/50 Lifeline
  const useFiftyFifty = () => {
    if (eliminatedOptions.length > 0 || statusEffect !== 'idle') return;
    sound.playPowerup();
    const wrongs = currentLogo.options.filter((o) => o !== currentLogo.name);
    // Eliminate 2 random wrongs
    const toEliminate = wrongs.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Clue Stage Powerup (free unblur)
  const useRevealClue = () => {
    if (stage >= 4 || statusEffect !== 'idle') return;
    sound.playPowerup();
    setStage((prev) => Math.min(4, prev + 1));
  };

  const handleRestart = () => {
    setDeck([...LOGO_DATABASE].sort(() => Math.random() - 0.5));
    setLevel(1);
    setLives(3);
    setScore(0);
    setStage(1);
    setEliminatedOptions([]);
    setIsTimerFrozen(false);
    setStatusEffect('idle');
    setSelectedOption(null);
    setIsGameOver(false);
  };

  if (isGameOver) {
    const isWin = lives > 0 && level >= 15;
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 text-center animate-fade-in">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            Classic Mode Result
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
            {isWin ? 'Master Cleared! 🏆' : 'Game Over'}
          </h2>
        </div>

        <div className="rounded-3xl bg-[#111827] border border-slate-700 p-6 space-y-5 shadow-2xl">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Points</span>
            <div className="text-5xl font-mono font-black text-yellow-400 mt-1">{score}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-xl font-mono font-black text-blue-400">{level}/15</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Levels Cleared</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-xl font-mono font-black text-yellow-400">+{Math.round(score / 3)}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Coins Earned</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={onBackToMenu}
              className="py-3 px-5 rounded-2xl bg-[#1F2937] hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 cursor-pointer"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">LEVEL</span>
          <span className="text-sm font-black text-white italic">{level} <span className="text-slate-500 font-normal">/ 15</span></span>
        </div>

        {/* Lives (Hearts) */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              className={`w-5 h-5 transition-all ${
                heart <= lives
                  ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'text-slate-700 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* Score */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">PTS:</span>
          <span className="text-sm font-mono font-black text-yellow-400">{score}</span>
        </div>
      </div>

      {/* Canvas */}
      <LogoCanvas
        logo={currentLogo}
        stage={stage}
        distortionType={distortionType}
        onManualReveal={handleManualReveal}
        canRevealMore={stage < 4}
        statusEffect={statusEffect}
        scorePopup={scorePopup}
      />

      {/* Power-up Action Bar */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={useFiftyFifty}
          disabled={eliminatedOptions.length > 0 || statusEffect !== 'idle'}
          className="flex-1 py-2 px-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[11px] font-black uppercase tracking-wider">50/50</span>
        </button>

        <button
          type="button"
          onClick={useRevealClue}
          disabled={stage >= 4 || statusEffect !== 'idle'}
          className="flex-1 py-2 px-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-black uppercase tracking-wider">Reveal More</span>
        </button>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-2.5">
        {currentLogo.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentLogo.name;
          const isEliminated = eliminatedOptions.includes(option);
          const showAnswer = statusEffect !== 'idle';

          let btnStyle = 'bg-[#111827] hover:bg-slate-800 border-slate-700 text-white';
          if (showAnswer) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg';
            } else if (isSelected) {
              btnStyle = 'bg-rose-600 border-rose-400 text-white';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-40';
            }
          }

          if (isEliminated) {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-800/40 bg-slate-900/30 text-slate-600 text-xs font-bold flex items-center justify-center line-through opacity-40 min-h-[52px]"
              >
                {option}
              </div>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={statusEffect !== 'idle'}
              onClick={() => handleGuess(option)}
              className={`p-3.5 rounded-2xl border text-sm font-bold transition-all active:scale-95 shadow-md flex items-center justify-center text-center cursor-pointer min-h-[52px] leading-tight ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
