import React, { useState, useEffect, useRef } from 'react';
import { LogoItem, PlayerStats } from '../types';
import { LOGO_DATABASE } from '../data/logos';
import { LogoCanvas } from './LogoCanvas';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Zap, Timer, Flame, RotateCcw, Trophy, ArrowRight, Sparkles } from 'lucide-react';

interface RushModeProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToMenu: () => void;
}

export const RushMode: React.FC<RushModeProps> = ({
  stats,
  onUpdateStats,
  onBackToMenu,
}) => {
  // Shuffle all 30 logos
  const [deck, setDeck] = useState<LogoItem[]>(() => {
    return [...LOGO_DATABASE].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stage, setStage] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds speedrun
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [statusEffect, setStatusEffect] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [scorePopup, setScorePopup] = useState<number | null>(null);

  const currentLogo = deck[currentIndex % deck.length];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 60-second speed clock
  useEffect(() => {
    if (isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        if (prev <= 5) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver]);

  // Subtle auto-reveal timer per logo in rush mode (faster pace)
  useEffect(() => {
    if (isGameOver || statusEffect !== 'idle') return;

    const revealTimer = setInterval(() => {
      setStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(revealTimer);
  }, [currentIndex, isGameOver, statusEffect]);

  const handleGuess = (option: string) => {
    if (statusEffect !== 'idle' || isGameOver) return;
    setSelectedOption(option);

    const isCorrect = option === currentLogo.name;
    const basePts = stage === 1 ? 100 : stage === 2 ? 75 : stage === 3 ? 50 : 25;
    const comboMult = streak >= 5 ? 2.0 : streak >= 3 ? 1.5 : 1.0;
    const awarded = isCorrect ? Math.round(basePts * comboMult) : 0;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + awarded);
      setScorePopup(awarded);
      setStatusEffect('correct');
      sound.playCorrect(newStreak);
    } else {
      setStreak(0);
      setStatusEffect('wrong');
      sound.playWrong();
    }

    // Instant fast transition for rush mode (350ms)
    setTimeout(() => {
      setStatusEffect('idle');
      setSelectedOption(null);
      setScorePopup(null);
      setCurrentIndex((prev) => prev + 1);
      setStage(1);
    }, 350);
  };

  const endGame = () => {
    setIsGameOver(true);
    sound.playVictory();

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    onUpdateStats((prev) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalScore: prev.totalScore + score,
      rushHighScore: Math.max(prev.rushHighScore, score),
      highestStreak: Math.max(prev.highestStreak, maxStreak),
      coins: prev.coins + Math.round(score / 3),
    }));
  };

  const handleRestart = () => {
    setDeck([...LOGO_DATABASE].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setStage(1);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setStatusEffect('idle');
    setSelectedOption(null);
    setIsGameOver(false);
  };

  if (isGameOver) {
    const isNewHighScore = score > stats.rushHighScore;
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
            <Zap className="w-3.5 h-3.5" />
            Rush Mode Complete
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">Time's Up!</h2>
        </div>

        <div className="rounded-3xl bg-[#111827] border border-slate-700 p-6 space-y-5 shadow-2xl">
          {isNewHighScore && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-400 text-black font-black text-xs uppercase tracking-wider animate-bounce shadow-md">
              <Sparkles className="w-4 h-4" /> New High Score!
            </div>
          )}

          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Final Rush Score</span>
            <div className="text-5xl font-mono font-black text-yellow-400 mt-1">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-xl font-mono font-black text-emerald-400">{correctCount}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Logos Solved</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-xl font-mono font-black text-orange-400">{maxStreak}x</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Best Combo</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-xl font-mono font-black text-yellow-400">+{Math.round(score / 3)}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Coins Won</div>
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
      {/* Rush Header Status */}
      <div className="flex items-center justify-between gap-2 bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 shadow-xl">
        {/* Speed Timer */}
        <div
          className={`flex items-center gap-1.5 font-mono text-sm font-black px-3 py-1 rounded-xl border ${
            timeLeft <= 10
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-[#1F2937] text-yellow-400 border-slate-700'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>

        {/* Combo Multiplier */}
        {streak >= 2 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 font-black text-xs animate-bounce uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{streak >= 5 ? '3.0x COMBO' : streak >= 3 ? '2.0x COMBO' : '1.5x COMBO'}</span>
          </div>
        )}

        {/* Live Score */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">SCORE:</span>
          <span className="text-sm font-mono font-black text-yellow-400">{score}</span>
        </div>
      </div>

      {/* Logo Canvas */}
      <LogoCanvas
        logo={currentLogo}
        stage={stage}
        distortionType="blur"
        statusEffect={statusEffect}
        scorePopup={scorePopup}
        canRevealMore={false}
      />

      {/* Options */}
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
