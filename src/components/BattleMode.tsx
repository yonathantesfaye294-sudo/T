import React, { useState, useEffect, useRef } from 'react';
import { LogoItem, PlayerStats } from '../types';
import { LOGO_DATABASE, REVEAL_STAGES } from '../data/logos';
import { LogoCanvas } from './LogoCanvas';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Swords, RotateCcw, Trophy, User, Bot, Sparkles, Timer } from 'lucide-react';

interface BattleModeProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToMenu: () => void;
}

export const BattleMode: React.FC<BattleModeProps> = ({
  stats,
  onUpdateStats,
  onBackToMenu,
}) => {
  // Pick 7 shared battle logos
  const [battleDeck] = useState<LogoItem[]>(() => {
    return [...LOGO_DATABASE].sort(() => Math.random() - 0.5).slice(0, 7);
  });

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [stage, setStage] = useState<number>(1);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [p1Guessed, setP1Guessed] = useState<boolean>(false);
  const [p2Guessed, setP2Guessed] = useState<boolean>(false);
  const [p1Choice, setP1Choice] = useState<string | null>(null);
  const [p2Choice, setP2Choice] = useState<string | null>(null);
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [statusEffect, setStatusEffect] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentLogo = battleDeck[currentRound % battleDeck.length];
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive reveal over time
  useEffect(() => {
    if (isGameOver || isRoundOver) return;

    const timer = setInterval(() => {
      setStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(timer);
  }, [currentRound, isGameOver, isRoundOver]);

  // AI Opponent Simulated Reaction
  useEffect(() => {
    if (isGameOver || isRoundOver || p2Guessed) return;

    // AI takes between 2s to 6s depending on difficulty
    const aiDelay = 2000 + Math.random() * 4000;
    aiTimerRef.current = setTimeout(() => {
      const willBeCorrect = Math.random() > 0.3; // 70% accuracy
      let aiPick = currentLogo.name;
      if (!willBeCorrect) {
        const wrongs = currentLogo.options.filter((o) => o !== currentLogo.name);
        aiPick = wrongs[Math.floor(Math.random() * wrongs.length)];
      }

      const stageInfo = REVEAL_STAGES.find((s) => s.stage === stage) || REVEAL_STAGES[3];
      const pts = willBeCorrect ? stageInfo.points : 0;

      setP2Choice(aiPick);
      setP2Guessed(true);
      if (willBeCorrect) {
        setP2Score((prev) => prev + pts);
      }
    }, aiDelay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [currentRound, stage, isGameOver, isRoundOver, p2Guessed, currentLogo]);

  // Handle Player 1 Guess
  const handleP1Guess = (option: string) => {
    if (p1Guessed || isRoundOver || isGameOver) return;
    setP1Choice(option);
    setP1Guessed(true);

    const isCorrect = option === currentLogo.name;
    const stageInfo = REVEAL_STAGES.find((s) => s.stage === stage) || REVEAL_STAGES[3];
    const pointsAwarded = isCorrect ? stageInfo.points : 0;

    if (isCorrect) {
      sound.playCorrect(currentRound + 1);
      setStatusEffect('correct');
      setP1Score((prev) => prev + pointsAwarded);
    } else {
      sound.playWrong();
      setStatusEffect('wrong');
    }

    // End round after both have made a choice or wait briefly
    setIsRoundOver(true);

    setTimeout(() => {
      if (currentRound + 1 < battleDeck.length) {
        setCurrentRound((prev) => prev + 1);
        setStage(1);
        setP1Guessed(false);
        setP2Guessed(false);
        setP1Choice(null);
        setP2Choice(null);
        setIsRoundOver(false);
        setStatusEffect('idle');
      } else {
        endBattle();
      }
    }, 2000);
  };

  const endBattle = () => {
    setIsGameOver(true);
    const p1Won = p1Score > p2Score;
    if (p1Won) {
      sound.playVictory();
      confetti({ particleCount: 100, spread: 70 });
    } else {
      sound.playWrong();
    }

    onUpdateStats((prev) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalScore: prev.totalScore + p1Score,
      battleWins: p1Won ? prev.battleWins + 1 : prev.battleWins,
      battleLosses: !p1Won ? prev.battleLosses + 1 : prev.battleLosses,
      coins: prev.coins + (p1Won ? 150 : 50),
    }));
  };

  if (isGameOver) {
    const p1Won = p1Score > p2Score;
    const isTie = p1Score === p2Score;

    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 text-center animate-fade-in">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest">
            <Swords className="w-3.5 h-3.5" />
            1v1 Match Result
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
            {p1Won ? 'VICTORY! 👑' : isTie ? 'MATCH TIED! 🤝' : 'DEFEATED! ⚔️'}
          </h2>
        </div>

        <div className="rounded-3xl bg-[#111827] border border-slate-700 p-6 space-y-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Player 1 Card */}
            <div className={`p-4 rounded-2xl border ${p1Won ? 'bg-yellow-400/10 border-yellow-400/50 shadow-lg' : 'bg-[#07090F] border-slate-800'}`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-yellow-400 text-black flex items-center justify-center font-black">
                <User className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-2">You</div>
              <div className="text-3xl font-mono font-black text-yellow-400 mt-1">{p1Score}</div>
            </div>

            {/* AI Opponent Card */}
            <div className={`p-4 rounded-2xl border ${!p1Won && !isTie ? 'bg-rose-500/10 border-rose-500/50 shadow-lg' : 'bg-[#07090F] border-slate-800'}`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-purple-600 text-white flex items-center justify-center font-black">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-2">Rival AI</div>
              <div className="text-3xl font-mono font-black text-purple-400 mt-1">{p2Score}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToMenu}
              className="flex-1 py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-yellow-400/20"
            >
              Continue to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* 1v1 Versus Top Status */}
      <div className="grid grid-cols-3 items-center bg-[#111827] border border-slate-800 rounded-2xl px-4 py-3 shadow-xl">
        {/* P1 Score */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
            P1
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">You</div>
            <div className="text-sm font-mono font-black text-yellow-400">{p1Score}</div>
          </div>
        </div>

        {/* Round */}
        <div className="text-center">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Round</span>
          <div className="text-xs font-mono font-black text-white">{currentRound + 1} / {battleDeck.length}</div>
        </div>

        {/* AI Score */}
        <div className="flex items-center justify-end gap-2 text-right">
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Rival AI</div>
            <div className="text-sm font-mono font-black text-purple-400">{p2Score}</div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs">
            <Bot className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Shared Logo Canvas */}
      <LogoCanvas
        logo={currentLogo}
        stage={stage}
        distortionType="blur"
        statusEffect={statusEffect}
        canRevealMore={false}
      />

      {/* Opponent Status Indicator */}
      <div className="flex items-center justify-between text-xs px-2 text-slate-400">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Turn to Guess</span>
        <span className={p2Guessed ? 'text-emerald-400 font-black text-xs uppercase tracking-wider' : 'text-purple-400 animate-pulse text-xs font-bold'}>
          {p2Guessed ? '✓ Rival has locked in guess' : '⏳ Rival is thinking...'}
        </span>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-2.5">
        {currentLogo.options.map((option, idx) => {
          const isSelected = p1Choice === option;
          const isCorrect = option === currentLogo.name;
          const showAnswer = isRoundOver;

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
              disabled={p1Guessed || isRoundOver}
              onClick={() => handleP1Guess(option)}
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
