import React, { useState, useEffect } from 'react';
import { GameMode, PlayerStats } from './types';
import { Header } from './components/Header';
import { DailyChallenge } from './components/DailyChallenge';
import { RushMode } from './components/RushMode';
import { ClassicMode } from './components/ClassicMode';
import { StreakMode } from './components/StreakMode';
import { EthiopianPack } from './components/EthiopianPack';
import { BattleMode } from './components/BattleMode';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StoreModal } from './components/StoreModal';
import { BattlePassModal } from './components/BattlePassModal';
import { StatsModal } from './components/StatsModal';
import { GmailHubModal } from './components/GmailHubModal';
import { GmailShareModal } from './components/GmailShareModal';
import { InstallModal } from './components/InstallModal';
import { initAuth } from './services/firebaseAuth';
import { sound } from './utils/sound';
import { getTodayDateString } from './utils/dailySeed';
import {
  Zap,
  Flame,
  Brain,
  Globe,
  Swords,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_STATS: PlayerStats = {
  totalGamesPlayed: 0,
  totalScore: 0,
  highestStreak: 0,
  currentStreak: 0,
  dailyStreak: 0,
  lastDailyDate: null,
  coins: 450,
  gems: 15,
  perfectStage1Guesses: 0,
  rushHighScore: 0,
  classicCompletedLevels: 0,
  battleWins: 0,
  battleLosses: 0,
  unlockedThemes: ['default'],
  unlockedPacks: ['default'],
  activeTheme: 'default',
  powerUps: {
    revealStage: 3,
    fiftyFifty: 3,
    freezeTimer: 2,
  },
};

export default function App() {
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [stats, setStats] = useState<PlayerStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('logorush_player_stats');
      if (saved) {
        try {
          return { ...INITIAL_STATS, ...JSON.parse(saved) };
        } catch {
          return INITIAL_STATS;
        }
      }
    }
    return INITIAL_STATS;
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => sound.isEnabled());
  const [activeModal, setActiveModal] = useState<'leaderboard' | 'store' | 'battlepass' | 'stats' | 'gmailhub' | 'gmailshare' | 'install' | null>(null);

  // Demo interactive distortion preview on home screen
  const [previewStage, setPreviewStage] = useState<number>(1);

  // Sync stats to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('logorush_player_stats', JSON.stringify(stats));
    }
  }, [stats]);

  // Listen to Google Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setIsSoundOn(newState);
  };

  const handleSelectMode = (mode: GameMode) => {
    sound.playReveal();
    setActiveMode(mode);
  };

  const todayStr = getTodayDateString();
  const isDailyCompleted = typeof window !== 'undefined' && !!localStorage.getItem(`logorush_daily_${todayStr}`);
  const dailyResultObj = typeof window !== 'undefined' ? localStorage.getItem(`logorush_daily_${todayStr}`) : null;
  const savedDailyParsed = dailyResultObj ? JSON.parse(dailyResultObj) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans pb-12">
      {/* Top Navigation Bar */}
      <Header
        stats={stats}
        onOpenLeaderboard={() => setActiveModal('leaderboard')}
        onOpenStore={() => setActiveModal('store')}
        onOpenBattlePass={() => setActiveModal('battlepass')}
        onOpenStats={() => setActiveModal('stats')}
        onOpenGmailHub={() => setActiveModal('gmailhub')}
        onOpenInstall={() => setActiveModal('install')}
        user={currentUser}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onGoHome={() => setActiveMode(null)}
        activeMode={activeMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 sm:pt-6">
        <AnimatePresence mode="wait">
          {activeMode === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <DailyChallenge
                stats={stats}
                onUpdateStats={setStats}
                onBackToMenu={() => setActiveMode(null)}
              />
            </motion.div>
          )}

          {activeMode === 'rush' && (
            <motion.div
              key="rush"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <RushMode
                stats={stats}
                onUpdateStats={setStats}
                onBackToMenu={() => setActiveMode(null)}
              />
            </motion.div>
          )}

          {activeMode === 'classic' && (
            <motion.div
              key="classic"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ClassicMode
                stats={stats}
                onUpdateStats={setStats}
                onBackToMenu={() => setActiveMode(null)}
              />
            </motion.div>
          )}

          {activeMode === 'streak' && (
            <motion.div
              key="streak"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <StreakMode
                stats={stats}
                onUpdateStats={setStats}
                onBackToMenu={() => setActiveMode(null)}
              />
            </motion.div>
          )}

          {activeMode === 'ethiopian' && (
            <motion.div
              key="ethiopian"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <EthiopianPack
                stats={stats}
                onUpdateStats={setStats}
                onBackToMenu={() => setActiveMode(null)}
              />
            </motion.div>
          )}

          {activeMode === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <BattleMode
                stats={stats}
                onUpdateStats={setStats}
                onBackToMenu={() => setActiveMode(null)}
              />
            </motion.div>
          )}

          {/* Home / Mode Selector Bento Grid Dashboard */}
          {!activeMode && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 1. Hero Bento Card: Daily Challenge (col-span-12 lg:col-span-8) */}
                <section className="md:col-span-12 lg:col-span-8 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 shadow-2xl min-h-[360px]">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start w-full relative z-10">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Daily Challenge
                      </span>
                      <span className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
                        Today's Seed #{todayStr}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-yellow-400 text-xs uppercase font-bold tracking-widest mb-1">
                        Pot Value
                      </span>
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-yellow-400">
                        1,000 PTS
                      </span>
                    </div>
                  </div>

                  {/* Center Stage: Interactive Distortion Demo & Glow */}
                  <div className="my-6 relative flex flex-col items-center justify-center z-10">
                    <div className="absolute w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative w-52 h-32 sm:w-64 sm:h-36 rounded-2xl bg-black/40 border border-slate-700/60 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden shadow-inner">
                      <div
                        className="w-24 h-24 flex items-center justify-center transition-all duration-300"
                        style={{
                          filter: `blur(${previewStage === 1 ? 14 : previewStage === 2 ? 7 : previewStage === 3 ? 3 : 0}px)`,
                        }}
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                          <path d="M 15 55 C 30 70 50 72 65 62 C 80 52 88 35 90 20 C 75 55 50 60 30 50 Z" />
                        </svg>
                      </div>

                      {/* Floating Stage Indicator */}
                      <div className="absolute bottom-2.5">
                        <span className="bg-yellow-400 text-black px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                          {previewStage === 1
                            ? '80% Blurred (100 PTS)'
                            : previewStage === 2
                            ? '50% Blurred (75 PTS)'
                            : previewStage === 3
                            ? '25% Blurred (50 PTS)'
                            : 'Fully Visible (25 PTS)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 relative z-10">
                    <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
                      {[1, 2, 3, 4].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setPreviewStage(st);
                            sound.playReveal();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            previewStage === st
                              ? 'bg-slate-700 text-yellow-400 border border-slate-600'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Stage {st}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectMode('daily')}
                      className="w-full sm:w-auto bg-white hover:bg-slate-100 text-black py-3 px-8 rounded-xl font-black transition-all text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <span>{isDailyCompleted ? 'View Daily Results' : 'Play Daily Challenge'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </section>

                {/* 2. Modes Bento Card (col-span-12 lg:col-span-4) */}
                <div className="md:col-span-12 lg:col-span-4 bg-[#111827] border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black uppercase italic text-slate-400 text-xs tracking-widest">
                      Arcade Modes
                    </h3>
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      Hot
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Rush Mode */}
                    <button
                      type="button"
                      onClick={() => handleSelectMode('rush')}
                      className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/60 transition-all group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">⚡</span>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-yellow-400 transition-colors">
                            Rush Mode
                          </div>
                          <div className="text-[10px] text-slate-400">30 Logos • 60s Blitz</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-yellow-400 font-bold">
                        Best: {stats.rushHighScore}p
                      </span>
                    </button>

                    {/* Streak Mode */}
                    <button
                      type="button"
                      onClick={() => handleSelectMode('streak')}
                      className="flex items-center justify-between bg-yellow-400/10 hover:bg-yellow-400/15 p-3 rounded-xl border border-yellow-400/30 transition-all group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🔥</span>
                        <div>
                          <div className="font-bold text-sm text-yellow-400">Streak Sudden Death</div>
                          <div className="text-[10px] text-yellow-400/70">One mistake ends run</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-yellow-400 font-bold">
                        Record: {stats.highestStreak}x
                      </span>
                    </button>

                    {/* 1v1 Battle */}
                    <button
                      type="button"
                      onClick={() => handleSelectMode('battle')}
                      className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/60 transition-all group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">👥</span>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
                            1v1 Battle
                          </div>
                          <div className="text-[10px] text-slate-400">Same logos vs Rival</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-purple-400 font-bold">
                        {stats.battleWins} Wins
                      </span>
                    </button>

                    {/* Classic Quiz */}
                    <button
                      type="button"
                      onClick={() => handleSelectMode('classic')}
                      className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/60 transition-all group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🧠</span>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                            Classic Quiz
                          </div>
                          <div className="text-[10px] text-slate-400">15 Levels • 3 Lives</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-bold">Play</span>
                    </button>
                  </div>
                </div>

                {/* 3. Ethiopian Local Special Bento Card (col-span-12 md:col-span-6 lg:col-span-4) */}
                <div
                  onClick={() => handleSelectMode('ethiopian')}
                  className="md:col-span-6 lg:col-span-4 bg-gradient-to-br from-emerald-950/60 via-[#111827] to-yellow-950/40 border border-yellow-600/30 rounded-3xl p-5 relative overflow-hidden group flex flex-col justify-between shadow-xl cursor-pointer hover:border-yellow-400/60 transition-all min-h-[190px]"
                >
                  <div className="relative z-10 h-full flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-black uppercase italic text-yellow-400 text-xs tracking-widest">
                          Local Special
                        </h3>
                        <span className="text-lg">🇪🇹</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black leading-tight text-white italic mt-1">
                        ETHIOPIAN<br />BRANDS
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        CBE, Ethiopian Airlines, Telebirr, Awash, Walia & iconic institutions!
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-emerald-400">የሀገር ውስጥ ብራንዶች</span>
                      <button
                        type="button"
                        className="bg-yellow-400 group-hover:bg-yellow-300 text-black text-[10px] font-black uppercase py-2 px-4 rounded-xl shadow-lg transition-all"
                      >
                        Play Local
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Season Progress & Battle Pass Bento Card (col-span-12 md:col-span-6 lg:col-span-8) */}
                <div className="md:col-span-6 lg:col-span-8 bg-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full sm:w-auto">
                    {/* Season Progress */}
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                        Season Progress
                      </span>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black italic text-white">LVL {stats.level}</span>
                        <span className="text-slate-500 text-xs font-bold">/ 50</span>
                      </div>
                      <div className="w-full sm:w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-500 rounded-full"
                          style={{ width: `${Math.min(100, (stats.xp % 500) / 5)}%` }}
                        />
                      </div>
                    </div>

                    <div className="hidden sm:block h-16 w-px bg-slate-800"></div>

                    {/* Battle Pass Info */}
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                        Battle Pass Season 1
                      </span>
                      <span className="text-sm font-bold text-slate-200 mb-1.5">
                        Unlock Distortion Shaders & Pack Rewards
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-black text-yellow-300">
                          PREMIUM
                        </span>
                        <span className="text-[10px] text-yellow-400 font-mono font-bold">
                          6 DAYS LEFT
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveModal('battlepass')}
                      className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black uppercase py-3 px-5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      View Pass Tiers
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      {activeModal === 'leaderboard' && (
        <LeaderboardModal stats={stats} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'store' && (
        <StoreModal
          stats={stats}
          onUpdateStats={setStats}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'battlepass' && (
        <BattlePassModal
          stats={stats}
          onUpdateStats={setStats}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'stats' && (
        <StatsModal stats={stats} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'gmailhub' && (
        <GmailHubModal
          stats={stats}
          onClose={() => setActiveModal(null)}
          onOpenGmailShare={() => setActiveModal('gmailshare')}
        />
      )}

      {activeModal === 'gmailshare' && (
        <GmailShareModal
          result={savedDailyParsed}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'install' && (
        <InstallModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
