import { BattlePassTier } from '../types';

export const BATTLE_PASS_TIERS: BattlePassTier[] = [
  {
    tier: 1,
    requiredXp: 100,
    freeReward: { name: '200 Gold Coins', type: 'coins', amount: 200, icon: '🪙' },
    premiumReward: { name: 'Cyberpunk Distortion Filter', type: 'theme', icon: '🌌' },
  },
  {
    tier: 2,
    requiredXp: 250,
    freeReward: { name: '2x Reveal Hints', type: 'powerup', amount: 2, icon: '👁️' },
    premiumReward: { name: '50 Diamonds', type: 'gems', amount: 50, icon: '💎' },
  },
  {
    tier: 3,
    requiredXp: 500,
    freeReward: { name: '500 Gold Coins', type: 'coins', amount: 500, icon: '🪙' },
    premiumReward: { name: 'Ethiopian Vintage Heritage Pack', type: 'pack', icon: '🇪🇹' },
  },
  {
    tier: 4,
    requiredXp: 800,
    freeReward: { name: '2x Fifty-Fifty Hints', type: 'powerup', amount: 2, icon: '⚡' },
    premiumReward: { name: 'Neon Arcade Theme', type: 'theme', icon: '🕹️' },
  },
  {
    tier: 5,
    requiredXp: 1200,
    freeReward: { name: '1,000 Gold Coins', type: 'coins', amount: 1000, icon: '🪙' },
    premiumReward: { name: 'Master Identifier Badge', type: 'exclusive_title', icon: '👑' },
  },
];

export const STORE_ITEMS = [
  {
    id: 'pack_ethiopian_pro',
    title: 'Ethiopian Brands Master Pack',
    category: 'Pack',
    description: 'Unlock 25+ exclusive Ethiopian companies, heritage institutions & Premier League clubs',
    cost: { type: 'coins' as const, amount: 800 },
    icon: '🇪🇹',
    badge: 'Popular',
  },
  {
    id: 'pack_luxury_cars',
    title: 'Automotive & Supercars Pack',
    category: 'Pack',
    description: 'Ferrari, Porsche, Koenigsegg, Bugatti, Aston Martin & iconic luxury badges',
    cost: { type: 'coins' as const, amount: 600 },
    icon: '🏎️',
    badge: 'Trending',
  },
  {
    id: 'theme_matrix',
    title: 'Digital Matrix Theme',
    category: 'Theme',
    description: 'Emerald phosphor terminal aesthetics and glitch distortion transitions',
    cost: { type: 'gems' as const, amount: 40 },
    icon: '🟩',
    badge: 'Cosmetic',
  },
  {
    id: 'theme_solar_gold',
    title: 'Royal Gold Theme',
    category: 'Theme',
    description: 'High-roller gilded frame with gold particle chimes',
    cost: { type: 'gems' as const, amount: 50 },
    icon: '✨',
    badge: 'Cosmetic',
  },
  {
    id: 'powerup_bundle_pro',
    title: 'Pro Sleuth Power-Up Bundle',
    category: 'Booster',
    description: '5x Reveal Stage, 5x Fifty-Fifty, 5x Time Freeze',
    cost: { type: 'coins' as const, amount: 400 },
    icon: '🎒',
    badge: 'Best Value',
  },
];
