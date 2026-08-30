import React, { useState, useEffect, useRef } from 'react';
import { LogoItem, DailyResult, PlayerStats } from '../types';
import { getDailyLogos, getTodayDateString, calculateDailyPercentile, generateShareSnippet } from '../utils/dailySeed';
import { REVEAL_STAGES } from '../data/logos';
import { LogoCanvas } from './LogoCanvas';
import { GmailShareModal } from './GmailShareModal';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Timer, Zap, CheckCircle2, XCircle, Share2, Award, ArrowRight, RotateCcw, Sparkles, HelpCircle, Trophy, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyChallengeProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToMenu: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  stats,
  onUpdateStats,
  onBackToMenu,
}) => {
  const todayStr = getTodayDateString();
  const dailyLogosRef = useRef<LogoItem[]>(getDailyLogos(todayStr));
  const dailyLogos = dailyLogosRef.current;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(18); // 18s per logo
  const [totalScore, setTotalScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [history, setHistory] = useState<DailyResult['history']>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [statusEffect, setStatusEffect] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scorePopup, setScorePopup] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showGmailModal, setShowGmailModal] = useState<boolean>(false);

  const currentLogo = dailyLogos[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if today was already completed
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`logorush_daily_${todayStr}`);
      return !!saved;
    }
    return false;
  });

  const [savedResult, setSavedResult] = useState<DailyResult | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`logorush_daily_${todayStr}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Main countdown timer per logo
  useEffect(() => {
    if (isGameOver || alreadyCompletedToday || statusEffect !== 'idle') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired -> treat as wrong
          handleGuess('');
          return 0;
        }

        // As time passes, automatically advance stage for higher clue visibility if needed
        if (prev === 14 && currentStage < 2) {
          setCurrentStage(2);
          sound.playReveal();
        } else if (prev === 9 && currentStage < 3) {
          setCurrentStage(3);
          sound.playReveal();
        } else if (prev === 4 && currentStage < 4) {
          setCurrentStage(4);
          sound.playReveal();
        }

        if (prev <= 4) {
          sound.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentStage, isGameOver, alreadyCompletedToday, statusEffect]);

  // Handle Manual Reveal Request (player wants clearer clue, sacrificing points)
  const handleManualReveal = () => {
    if (currentStage < 4 && statusEffect === 'idle') {
      sound.playReveal();
      setCurrentStage((prev) => Math.min(4, prev + 1));
    }
  };

  // Handle Guess Selection
  const handleGuess = (optionName: string) => {
    if (statusEffect !== 'idle' || isGameOver) return;

    setSelectedOption(optionName);
    const isCorrect = optionName === currentLogo.name;
    const stageInfo = REVEAL_STAGES.find((s) => s.stage === currentStage) || REVEAL_STAGES[3];
    const pointsAwarded = isCorrect ? stageInfo.points : 0;

    if (isCorrect) {
      if (currentStage === 1) {
        sound.playJackpot();
      } else {
        sound.playCorrect(currentStage === 1 ? 3 : 1);
      }
      setStatusEffect('correct');
      setScorePopup(pointsAwarded);
      setTotalScore((prev) => prev + pointsAwarded);
      setCorrectCount((prev) => prev + 1);
    } else {
      sound.playWrong();
      setStatusEffect('wrong');
    }

    const roundEntry = {
      logoId: currentLogo.id,
      logoName: currentLogo.name,
      stageGuessed: currentStage,
      pointsAwarded,
      wasCorrect: isCorrect,
    };

    const newHistory = [...history, roundEntry];
    setHistory(newHistory);

    // Pause briefly to show the reveal and feedback
    setTimeout(() => {
      setStatusEffect('idle');
      setSelectedOption(null);
      setScorePopup(null);

      if (currentIndex + 1 < dailyLogos.length) {
        setCurrentIndex((prev) => prev + 1);
        setCurrentStage(1);
        setTimeLeft(18);
      } else {
        finishGame(newHistory, isCorrect ? totalScore + pointsAwarded : totalScore, isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1200);
  };

  // Complete Game & calculate percentile
  const finishGame = (finalHistory: DailyResult['history'], finalScore: number, finalCorrect: number) => {
    setIsGameOver(true);
    sound.playVictory();

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#eab308'],
    });

    const percentile = calculateDailyPercentile(finalScore, finalCorrect);
    const result: DailyResult = {
      date: todayStr,
      score: finalScore,
      maxPossible: 1000,
      correctCount: finalCorrect,
      totalLogos: 10,
      timeSpentSeconds: 180 - timeLeft,
      stageDistribution: [1, 2, 3, 4].map(
        (st) => finalHistory.filter((h) => h.wasCorrect && h.stageGuessed === st).length
      ),
      percentile,
      completedAt: Date.now(),
      history: finalHistory,
    };

    setSavedResult(result);
    setAlreadyCompletedToday(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`logorush_daily_${todayStr}`, JSON.stringify(result));
    }

    // Update player global stats
    onUpdateStats((prev) => {
      const isNewDailyDay = prev.lastDailyDate !== todayStr;
      const newDailyStreak = isNewDailyDay ? prev.dailyStreak + 1 : prev.dailyStreak;
      const earnedCoins = Math.round(finalScore / 2);
      const earnedGems = finalCorrect >= 8 ? 10 : 3;

      return {
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        totalScore: prev.totalScore + finalScore,
        dailyStreak: newDailyStreak,
        lastDailyDate: todayStr,
        coins: prev.coins + earnedCoins,
        gems: prev.gems + earnedGems,
        perfectStage1Guesses:
          prev.perfectStage1Guesses +
          finalHistory.filter((h) => h.wasCorrect && h.stageGuessed === 1).length,
      };
    });
  };

  // Copy shareable snippet
  const handleShare = () => {
    const res = savedResult || {
      date: todayStr,
      score: totalScore,
      maxPossible: 1000,
      correctCount,
      totalLogos: 10,
      timeSpentSeconds: 60,
      stageDistribution: [0, 0, 0, 0],
      percentile: calculateDailyPercentile(totalScore, correctCount),
      completedAt: Date.now(),
      history,
    };

    const snippet = generateShareSnippet(res);
    navigator.clipboard.writeText(snippet).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    });
  };

  // If already finished today, render end-game summary screen directly
  if (alreadyCompletedToday && savedResult) {
    const topPercentage = (100 - savedResult.percentile).toFixed(1);
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Daily Challenge Completed
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            Daily Logo <span className="text-amber-400">#{savedResult.date}</span>
          </h2>
          <p className="text-sm text-slate-400">
            Come back tomorrow for the next global daily challenge!
          </p>
        </div>

        {/* Big Score Card with Percentile Ranking */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Your Total Score</span>
            <div className="text-5xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 mt-1">
              {savedResult.score.toLocaleString()} <span className="text-2xl font-bold text-slate-400">/ 1,000</span>
            </div>
          </div>

          {/* Standout Ranking Badge */}
          <div className="inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 shadow-inner">
            <div className="flex items-center gap-2 text-lg sm:text-xl font-black">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>You scored in the Top {topPercentage}% today!</span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1">
              Better than {savedResult.percentile.toFixed(1)}% of 14,820 players worldwide
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {savedResult.correctCount}/10
              </div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Accuracy</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {stats.dailyStreak} Days
              </div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Active Streak</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xl sm:text-2xl font-black text-purple-400">
                {savedResult.stageDistribution[0]} Logos
              </div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Stage 1 Jackpots</div>
            </div>
          </div>

          {/* Wordle-Style Visual History Squares */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logo Clue Breakdown</div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {savedResult.history.map((h, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border ${
                    !h.wasCorrect
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : h.stageGuessed === 1
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : h.stageGuessed === 2
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : h.stageGuessed === 3
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-slate-700/40 text-slate-300 border-slate-600'
                  }`}
                  title={`${h.logoName}: ${h.wasCorrect ? `+${h.pointsAwarded} pts (Stage ${h.stageGuessed})` : 'Missed'}`}
                >
                  {h.wasCorrect ? `S${h.stageGuessed}` : '✗'}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowGmailModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-400 hover:to-rose-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send via Gmail</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Score'}</span>
            </button>

            <button
              type="button"
              onClick={onBackToMenu}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all hover:scale-102 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Explore Modes</span>
            </button>
          </div>
        </div>

        {/* Detailed Brand Review List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Today's 10 Featured Brands & Fun Facts</span>
          </h3>
          <div className="space-y-2.5">
            {dailyLogos.map((logo, idx) => {
              const hist = savedResult.history.find((h) => h.logoId === logo.id);
              return (
                <div
                  key={logo.id}
                  className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start gap-3 hover:bg-slate-800/70 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 p-1 flex-shrink-0 flex items-center justify-center">
                    {logo.svgRender({ stage: 4 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">{logo.name}</span>
                        {logo.region === 'ethiopia' && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            🇪🇹 ETHIOPIA
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                          hist?.wasCorrect
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {hist?.wasCorrect ? `+${hist.pointsAwarded} pts` : 'Missed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      💡 {logo.funFact}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gmail Share Modal */}
        {showGmailModal && (
          <GmailShareModal
            result={savedResult}
            onClose={() => setShowGmailModal(false)}
          />
        )}
      </div>
    );
  }

  // Active Game View
  return (
    <div className="max-w-md mx-auto p-3 sm:p-4 space-y-4">
      {/* Top Bar: Progress & Time Countdown */}
      <div className="flex items-center justify-between gap-3 bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 shadow-xl">
        {/* Logo Counter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ROUND</span>
          <span className="text-sm font-black text-white italic">
            {currentIndex + 1} <span className="text-slate-500 font-normal">/ 10</span>
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 font-mono text-sm font-black px-3 py-1 rounded-xl border transition-colors ${
            timeLeft <= 4
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-[#1F2937] text-yellow-400 border-slate-700'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">POT:</span>
          <span className="text-sm font-mono font-black text-yellow-400">{totalScore}</span>
        </div>
      </div>

      {/* Distortion Logo Canvas */}
      <LogoCanvas
        logo={currentLogo}
        stage={currentStage}
        distortionType="blur"
        onManualReveal={handleManualReveal}
        canRevealMore={currentStage < 4}
        statusEffect={statusEffect}
        scorePopup={scorePopup}
      />

      {/* Risk-Reward Prompt */}
      <div className="text-center">
        <p className="text-xs text-slate-400 font-medium">
          {currentStage === 1
            ? '🔥 80% Blurred! Guess now for MAX 100 PTS or reveal more.'
            : currentStage === 2
            ? '⚡ 50% Blurred — 75 PTS reward'
            : currentStage === 3
            ? '👁️ Mild Focus — 50 PTS reward'
            : '✅ Full View — 25 PTS'}
        </p>
      </div>

      {/* 4 Choices Options Pad */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {currentLogo.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentLogo.name;
          const showAnswer = statusEffect !== 'idle';

          let btnStyle = 'bg-[#111827] hover:bg-slate-800 border-slate-700/80 text-white';
          if (showAnswer) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-rose-600 border-rose-400 text-white animate-shake';
            } else {
              btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={statusEffect !== 'idle'}
              onClick={() => handleGuess(option)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-sm sm:text-base font-bold transition-all transform active:scale-95 shadow-md flex items-center justify-center text-center cursor-pointer min-h-[56px] leading-tight ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Clue Prompt Box */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 text-center flex items-center justify-center gap-1.5 shadow-md">
        <HelpCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
        <span className="truncate">Category: <strong className="text-slate-200">{currentLogo.category}</strong> ({currentLogo.region === 'ethiopia' ? 'Ethiopian Brand 🇪🇹' : 'World Brand 🌍'})</span>
      </div>
    </div>
  );
};
