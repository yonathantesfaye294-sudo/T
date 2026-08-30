import type { ReactNode } from 'react';

export type GameMode = 'daily' | 'rush' | 'classic' | 'streak' | 'ethiopian' | 'battle';

export type DistortionType = 'blur' | 'pixelate' | 'tiles' | 'silhouette' | 'slices' | 'matrix';

export interface LogoItem {
  id: string;
  name: string;
  category: 'Tech' | 'Sports' | 'Automotive' | 'Food & Beverage' | 'Finance' | 'Aviation' | 'Telecom' | 'Retail' | 'Entertainment' | 'Ethiopian Brands';
  region: 'global' | 'ethiopia';
  options: string[]; // 4 choice options (including the correct name)
  clue: string;
  funFact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  colorTheme: string;
  // SVG drawing configuration / vector paths
  svgRender: (opts: { stage: number; revealedTiles?: boolean[] }) => ReactNode;
}

export interface RevealStageInfo {
  stage: number;
  label: string;
  blurPx: number;
  pixelation: number;
  points: number;
  description: string;
}

export interface DailyResult {
  date: string; // YYYY-MM-DD
  score: number;
  maxPossible: number;
  correctCount: number;
  totalLogos: number;
  timeSpentSeconds: number;
  stageDistribution: number[]; // e.g. [3, 4, 2, 1] for stages 1, 2, 3, 4
  percentile: number; // e.g. 96.2 for "Top 3.8%"
  completedAt: number;
  history: {
    logoId: string;
    logoName: string;
    stageGuessed: number;
    pointsAwarded: number;
    wasCorrect: boolean;
  }[];
}

export interface PlayerStats {
  totalGamesPlayed: number;
  totalScore: number;
  highestStreak: number;
  currentStreak: number;
  dailyStreak: number;
  lastDailyDate: string | null;
  coins: number;
  gems: number;
  perfectStage1Guesses: number;
  rushHighScore: number;
  classicCompletedLevels: number;
  battleWins: number;
  battleLosses: number;
  unlockedThemes: string[];
  unlockedPacks: string[];
  activeTheme: string;
  powerUps: {
    revealStage: number;
    fiftyFifty: number;
    freezeTimer: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  streak?: number;
  country: string;
  badge?: string;
  timeAgo?: string;
  isCurrentUser?: boolean;
}

export interface BattlePassTier {
  tier: number;
  requiredXp: number;
  freeReward: {
    name: string;
    type: 'coins' | 'gems' | 'powerup' | 'badge';
    amount?: number;
    icon: string;
  };
  premiumReward: {
    name: string;
    type: 'theme' | 'pack' | 'gems' | 'exclusive_title';
    amount?: number;
    icon: string;
  };
}
