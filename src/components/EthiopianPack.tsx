import React, { useState } from 'react';
import { LogoItem, PlayerStats } from '../types';
import { LOGO_DATABASE, REVEAL_STAGES } from '../data/logos';
import { LogoCanvas } from './LogoCanvas';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Trophy, CheckCircle, HelpCircle, ArrowRight, Heart } from 'lucide-react';

interface EthiopianPackProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToMenu: () => void;
}

export const EthiopianPack: React.FC<EthiopianPackProps> = ({
  stats,
  onUpdateStats,
  onBackToMenu,
}) => {
  const ethiopianLogos = LOGO_DATABASE.filter((l) => l.region === 'ethiopia');
  const [deck, setDeck] = useState<LogoItem[]>(() => {
    return [...ethiopianLogos].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stage, setStage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
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
      sound.playCorrect(currentIndex + 1);
      setStatusEffect('correct');
      setScore((prev) => prev + pointsAwarded);
      setCorrectCount((prev) => prev + 1);
      setScorePopup(pointsAwarded);
    } else {
      sound.playWrong();
      setStatusEffect('wrong');
    }

    setTimeout(() => {
      setStatusEffect('idle');
      setSelectedOption(null);
      setScorePopup(null);

      if (currentIndex + 1 < deck.length) {
        setCurrentIndex((prev) => prev + 1);
        setStage(1);
      } else {
        setIsGameOver(true);
        sound.playVictory();
        confetti({ particleCount: 100, spread: 70 });
        onUpdateStats((prev) => ({
          ...prev,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          totalScore: prev.totalScore + score + pointsAwarded,
          coins: prev.coins + Math.round((score + pointsAwarded) / 2),
        }));
      }
    }, 1100);
  };

  const handleRestart = () => {
    setDeck([...ethiopianLogos].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setStage(1);
    setScore(0);
    setCorrectCount(0);
    setStatusEffect('idle');
    setSelectedOption(null);
    setIsGameOver(false);
  };

  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 text-center animate-fade-in">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
            <span>🇪🇹</span> Ethiopian Heritage Master
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">የኢትዮጵያ ብራንዶች አጠናቀቁ!</h2>
          <p className="text-xs text-slate-400 font-medium">You completed all featured Ethiopian brands!</p>
        </div>

        <div className="rounded-3xl bg-[#111827] border border-slate-700 p-6 space-y-5 shadow-2xl">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Ethiopian Score</span>
            <div className="text-5xl font-mono font-black text-emerald-400 mt-1">{score}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-2xl font-mono font-black text-emerald-400">{correctCount}/{deck.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Identified</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090F] border border-slate-800">
              <div className="text-2xl font-mono font-black text-yellow-400">+{Math.round(score / 2)}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Gold Coins</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Pack</span>
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
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-base">🇪🇹</span>
          <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Ethiopian Local Pack</span>
        </div>

        <div className="text-xs font-mono font-black text-slate-300">
          {currentIndex + 1} <span className="text-slate-500 font-normal">/ {deck.length}</span>
        </div>

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

      {/* Clue & Fun Info Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-3 text-xs text-slate-300 leading-relaxed text-center shadow-md">
        <span className="text-yellow-400 font-black uppercase tracking-wider text-[11px] mr-1.5">Hint:</span> {currentLogo.clue}
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-2.5">
        {currentLogo.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentLogo.name;
          const showAnswer = statusEffect !== 'idle';

          let btnStyle = 'bg-[#111827] hover:bg-slate-800 border-slate-700 text-white';
          if (showAnswer) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg';
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
