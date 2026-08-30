import React, { useState } from 'react';
import { LogoItem, PlayerStats } from '../types';
import { LOGO_DATABASE, REVEAL_STAGES } from '../data/logos';
import { LogoCanvas } from './LogoCanvas';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Flame, RotateCcw, Trophy, Sparkles, Zap } from 'lucide-react';

interface StreakModeProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToMenu: () => void;
}

export const StreakMode: React.FC<StreakModeProps> = ({
  stats,
  onUpdateStats,
  onBackToMenu,
}) => {
  const [deck, setDeck] = useState<LogoItem[]>(() => {
    return [...LOGO_DATABASE].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [stage, setStage] = useState<number>(1);
  const [statusEffect, setStatusEffect] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [scorePopup, setScorePopup] = useState<number | null>(null);

  const currentLogo = deck[currentIndex % deck.length];

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
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setScore((prev) => prev + pointsAwarded);
      setScorePopup(pointsAwarded);
      setStatusEffect('correct');
      sound.playCorrect(newStreak);

      if (newStreak % 5 === 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      setTimeout(() => {
        setStatusEffect('idle');
        setSelectedOption(null);
        setScorePopup(null);
        setCurrentIndex((prev) => prev + 1);
        setStage(1);
      }, 700);
    } else {
      sound.playWrong();
      setStatusEffect('wrong');

      setTimeout(() => {
        setIsGameOver(true);
        onUpdateStats((prev) => ({
          ...prev,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          totalScore: prev.totalScore + score,
          highestStreak: Math.max(prev.highestStreak, currentStreak),
          coins: prev.coins + Math.round(score / 3),
        }));
      }, 1000);
    }
  };

  const handleRestart = () => {
    setDeck([...LOGO_DATABASE].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setCurrentStreak(0);
    setScore(0);
    setStage(1);
    setStatusEffect('idle');
    setSelectedOption(null);
    setIsGameOver(false);
  };

  if (isGameOver) {
    const isNewBest = currentStreak > stats.highestStreak;
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 text-center animate-fade-in">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5" />
            Streak Broken!
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">Sudden Death</h2>
        </div>

        <div className="rounded-3xl bg-[#111827] border border-slate-700 p-6 space-y-5 shadow-2xl">
          {isNewBest && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-400 text-black font-black text-xs uppercase tracking-wider animate-bounce shadow-md">
              <Sparkles className="w-4 h-4" /> New Best Streak!
            </div>
          )}

          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Consecutive Streak</span>
            <div className="text-6xl font-mono font-black text-rose-400 mt-1 flex items-center justify-center gap-2">
              <Flame className="w-10 h-10 fill-rose-500 text-rose-500" />
              <span>{currentStreak}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-2xl font-mono font-black text-yellow-400">{score}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Points Earned</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-2xl font-mono font-black text-cyan-400">{stats.highestStreak}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">All-Time Best</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
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
        {/* Current Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs animate-pulse uppercase tracking-wider">
          <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>{currentStreak} Streak</span>
        </div>

        {/* High Streak Indicator */}
        <div className="text-xs text-slate-400 font-bold">
          Best: <span className="text-yellow-400 font-mono font-bold">{Math.max(currentStreak, stats.highestStreak)}</span>
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
        distortionType="blur"
        onManualReveal={handleManualReveal}
        canRevealMore={stage < 4}
        statusEffect={statusEffect}
        scorePopup={scorePopup}
      />

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {currentLogo.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentLogo.name;
          const showAnswer = statusEffect !== 'idle';

          let btnStyle = 'bg-[#111827] hover:bg-slate-800 border-slate-700 text-white';
          if (showAnswer) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white';
            } else if (isSelected) {
              btnStyle = 'bg-rose-600 border-rose-400 text-white';
            }
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
