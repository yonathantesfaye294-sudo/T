import { LogoItem, DailyResult } from '../types';
import { LOGO_DATABASE } from '../data/logos';

// Simple seeded pseudo-random number generator (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyLogos(dateStr: string = getTodayDateString()): LogoItem[] {
  // Convert date string into integer hash
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const prng = mulberry32(Math.abs(hash) + 12345);

  // Shuffle copy of database deterministically
  const pool = [...LOGO_DATABASE];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Ensure at least 3 Ethiopian brands in the daily 10 challenge
  const ethiopian = pool.filter((l) => l.region === 'ethiopia');
  const globalLogos = pool.filter((l) => l.region === 'global');

  const selected: LogoItem[] = [];
  // Pick 3 ethiopian
  selected.push(...ethiopian.slice(0, 3));
  // Pick 7 global
  selected.push(...globalLogos.slice(0, 7));

  // Final shuffle of the 10
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected.slice(0, 10);
}

// Calculate realistic percentile based on score (max 1000)
export function calculateDailyPercentile(score: number, correctCount: number): number {
  if (score >= 950) return 99.4; // Top 0.6%
  if (score >= 900) return 97.8; // Top 2.2%
  if (score >= 820) return 96.0; // Top 4.0%
  if (score >= 750) return 91.5; // Top 8.5%
  if (score >= 650) return 84.0; // Top 16.0%
  if (score >= 500) return 72.0; // Top 28.0%
  if (score >= 350) return 55.0; // Top 45.0%
  return Math.max(12, Math.round((correctCount / 10) * 45));
}

// Generate Wordle-like shareable result
export function generateShareSnippet(result: DailyResult): string {
  const dateFormatted = result.date;
  const topPercent = (100 - result.percentile).toFixed(1);
  const squares = result.history
    .map((h) => {
      if (!h.wasCorrect) return '🟥';
      if (h.stageGuessed === 1) return '🟩';
      if (h.stageGuessed === 2) return '🟨';
      if (h.stageGuessed === 3) return '🟧';
      return '🟦';
    })
    .join('');

  return `⚡ LOGO RUSH DAILY #${dateFormatted}\n🏆 Score: ${result.score.toLocaleString()} PTS (Top ${topPercent}%)\n🎯 ${result.correctCount}/10 Correct\n${squares}\nPlay at: https://logorush.game`;
}
