// Progression System - Levels, XP, Perks, Achievements

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type PerkTier = 'basic' | 'premium' | 'epic';
export type AchievementCategory = 'trading' | 'travel' | 'wealth' | 'milestone' | 'special';

export interface LevelData {
  level: Level;
  xpRequired: number;
  xpFromPrevious: number;
  title: string;
  description: string;
  emoji: string;
  unlocks: string[];
}

export interface Perk {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: PerkTier;
  effect: string; // Description of what the perk does
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  xpReward: number;
  requirement: {
    type: 'total_trades' | 'gold_earned' | 'locations_unlocked' | 'profit_per_trade' | 'special';
    value: number;
    description: string;
  };
  unlocked: boolean;
}

export interface PlayerProgression {
  level: Level;
  xp: number;
  xpToNext: number;
  totalTrades: number;
  goldEarned: number;
  locationsUnlocked: number;
  perksUnlocked: string[];
  achievementsUnlocked: string[];
  lastLogin: number;
  currentStreak: number;
  bestStreak: number;
}

// Level data
export const LEVELS: LevelData[] = [
  {
    level: 1,
    xpRequired: 0,
    xpFromPrevious: 0,
    title: "Novice Trader",
    description: "Just starting your trading journey",
    emoji: "🌱",
    unlocks: [],
  },
  {
    level: 2,
    xpRequired: 100,
    xpFromPrevious: 100,
    title: "Apprentice",
    description: "Complete your first 10 trades",
    emoji: "📦",
    unlocks: ["5% profit perk"],
  },
  {
    level: 3,
    xpRequired: 250,
    xpFromPrevious: 150,
    title: "Merchant",
    description: "Reach 250 XP and master the basics",
    emoji: "⚖️",
    unlocks: ["10% profit perk", "Basic travel perk"],
  },
  {
    level: 4,
    xpRequired: 500,
    xpFromPrevious: 250,
    title: "Skilled Trader",
    description: "Reach 500 XP and become a skilled merchant",
    emoji: "💎",
    unlocks: ["15% profit perk", "Unlock 1 extra city", "Inventory slot +5"],
  },
  {
    level: 5,
    xpRequired: 1000,
    xpFromPrevious: 500,
    title: "Expert Trader",
    description: "Reach 1000 XP and become an expert",
    emoji: "🏆",
    unlocks: ["20% profit perk", "All cities unlocked", "Inventory slot +10"],
  },
  {
    level: 6,
    xpRequired: 2000,
    xpFromPrevious: 1000,
    title: "Master Trader",
    description: "Reach 2000 XP and become a master",
    emoji: "👑",
    unlocks: ["25% profit perk", "All cities unlocked", "Inventory slot +15", "Access to special goods"],
  },
  {
    level: 7,
    xpRequired: 3500,
    xpFromPrevious: 1500,
    title: "Grand Master",
    description: "Reach 3500 XP and achieve grand master status",
    emoji: "🏰",
    unlocks: ["30% profit perk", "All cities unlocked", "Inventory slot +20", "Access to rare goods"],
  },
  {
    level: 8,
    xpRequired: 5000,
    xpFromPrevious: 1500,
    title: "Legendary Trader",
    description: "Reach 5000 XP and become a legend",
    emoji: "🏅",
    unlocks: ["40% profit perk", "All cities unlocked", "Inventory slot +25", "Exclusive achievements"],
  },
  {
    level: 9,
    xpRequired: 7500,
    xpFromPrevious: 2500,
    title: "Trading Tycoon",
    description: "Reach 7500 XP and become a tycoon",
    emoji: "🏭",
    unlocks: ["50% profit perk", "All cities unlocked", "Inventory slot +30", "Exclusive legendary goods"],
  },
  {
    level: 10,
    xpRequired: 10000,
    xpFromPrevious: 2500,
    title: "World-Class Merchant",
    description: "Reach 10000 XP and join the world-class merchants",
    emoji: "🌍",
    unlocks: ["75% profit perk", "All cities unlocked", "Inventory slot +35", "Everything unlocked"],
  },
];

// Perks data
export const PERKS: Perk[] = [
  // Basic Tier
  {
    id: 'profit_basic',
    name: 'Profit Margins',
    description: '+5% on all sell prices',
    emoji: '💰',
    tier: 'basic',
    effect: 'You earn 5% more gold on every sale',
  },
  {
    id: 'discount_basic',
    name: 'Volume Discounts',
    description: 'Buy goods in bulk (5+)',
    emoji: '📦',
    tier: 'basic',
    effect: 'Get 10% discount when buying 5+ items',
  },
  {
    id: 'travel_basic',
    name: 'Travel Light',
    description: '-20% travel costs',
    emoji: '✈️',
    tier: 'basic',
    effect: 'All travel costs are reduced by 20%',
  },

  // Premium Tier
  {
    id: 'profit_premium',
    name: 'Gold Rush',
    description: '+15% on all sell prices',
    emoji: '💎',
    tier: 'premium',
    effect: 'You earn 15% more gold on every sale',
  },
  {
    id: 'discount_premium',
    name: 'Merchant Network',
    description: 'Buy goods in bulk (3+)',
    emoji: '📦',
    tier: 'premium',
    effect: 'Get 15% discount when buying 3+ items',
  },
  {
    id: 'travel_premium',
    name: 'Travel Pro',
    description: '-40% travel costs',
    emoji: '✈️',
    tier: 'premium',
    effect: 'All travel costs are reduced by 40%',
  },
  {
    id: 'inventory_plus',
    name: 'Inventory Expansion',
    description: '+10 inventory slots',
    emoji: '📦',
    tier: 'premium',
    effect: 'Your inventory capacity increases by 10 slots',
  },
  {
    id: 'event_insight',
    name: 'Market Insider',
    description: 'See future event schedule',
    emoji: '📊',
    tier: 'premium',
    effect: 'See upcoming events 3 turns in advance',
  },

  // Epic Tier
  {
    id: 'profit_epic',
    name: 'Wealth Magnet',
    description: '+25% on all sell prices',
    emoji: '👑',
    tier: 'epic',
    effect: 'You earn 25% more gold on every sale',
  },
  {
    id: 'discount_epic',
    name: 'Wholesale King',
    description: 'Buy goods in bulk (1+)',
    emoji: '📦',
    tier: 'epic',
    effect: 'Get 20% discount when buying any quantity',
  },
  {
    id: 'travel_epic',
    name: 'Global Traveler',
    description: '-60% travel costs',
    emoji: '✈️',
    tier: 'epic',
    effect: 'All travel costs are reduced by 60%',
  },
  {
    id: 'inventory_epic',
    name: 'Warehouse',
    description: '+20 inventory slots',
    emoji: '📦',
    tier: 'epic',
    effect: 'Your inventory capacity increases by 20 slots',
  },
  {
    id: 'market_master',
    name: 'Market Oracle',
    description: 'See all price trends',
    emoji: '🔮',
    tier: 'epic',
    effect: 'View price history for all goods at all cities',
  },
  {
    id: 'event_prediction',
    name: 'Prophecy System',
    description: 'Predict rare events',
    emoji: '🔮',
    tier: 'epic',
    effect: 'See upcoming rare events 5 turns in advance',
  },
];

// Achievements data
export const ACHIEVEMENTS: Achievement[] = [
  // Trading Category
  {
    id: 'first_trade',
    title: 'First Trade',
    description: 'Complete your very first trade',
    emoji: '🔄',
    category: 'trading',
    xpReward: 10,
    requirement: {
      type: 'total_trades',
      value: 1,
      description: 'Make 1 trade',
    },
    unlocked: false,
  },
  {
    id: 'ten_trades',
    title: 'Trading Regular',
    description: 'Complete 10 trades',
    emoji: '📊',
    category: 'trading',
    xpReward: 50,
    requirement: {
      type: 'total_trades',
      value: 10,
      description: 'Complete 10 trades',
    },
    unlocked: false,
  },
  {
    id: 'fifty_trades',
    title: 'Trading Enthusiast',
    description: 'Complete 50 trades',
    emoji: '📈',
    category: 'trading',
    xpReward: 200,
    requirement: {
      type: 'total_trades',
      value: 50,
      description: 'Complete 50 trades',
    },
    unlocked: false,
  },
  {
    id: 'profit_hundred',
    title: 'Hundred Profit',
    description: 'Earn 100 profit in one trade',
    emoji: '💰',
    category: 'trading',
    xpReward: 100,
    requirement: {
      type: 'profit_per_trade',
      value: 100,
      description: 'Make 100+ profit in a single trade',
    },
    unlocked: false,
  },
  {
    id: 'profit_fivehundred',
    title: 'Big Winner',
    description: 'Earn 500+ profit in one trade',
    emoji: '💎',
    category: 'trading',
    xpReward: 250,
    requirement: {
      type: 'profit_per_trade',
      value: 500,
      description: 'Make 500+ profit in a single trade',
    },
    unlocked: false,
  },

  // Travel Category
  {
    id: 'world_explorer',
    title: 'World Explorer',
    description: 'Visit 10 different cities',
    emoji: '🌍',
    category: 'travel',
    xpReward: 100,
    requirement: {
      type: 'locations_unlocked',
      value: 10,
      description: 'Unlock 10 different cities',
    },
    unlocked: false,
  },
  {
    id: 'globetrotter',
    title: 'Global Trotter',
    description: 'Visit all 14 cities',
    emoji: '🌎',
    category: 'travel',
    xpReward: 300,
    requirement: {
      type: 'locations_unlocked',
      value: 14,
      description: 'Visit all 14 cities',
    },
    unlocked: false,
  },
  {
    id: 'season_master',
    title: 'Season Master',
    description: 'Survive all 4 seasons (40 turns)',
    emoji: '🏆',
    category: 'travel',
    xpReward: 500,
    requirement: {
      type: 'special',
      value: 40,
      description: 'Survive 40 turns (complete all seasons)',
    },
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach level 5 in under 30 turns',
    emoji: '⚡',
    category: 'travel',
    xpReward: 200,
    requirement: {
      type: 'special',
      value: 30,
      description: 'Reach level 5 in under 30 turns',
    },
    unlocked: false,
  },

  // Wealth Category
  {
    id: 'first_gold_100',
    title: 'Gold Digger',
    description: 'Reach 100 gold for the first time',
    emoji: '💰',
    category: 'wealth',
    xpReward: 50,
    requirement: {
      type: 'gold_earned',
      value: 100,
      description: 'Accumulate 100 gold total',
    },
    unlocked: false,
  },
  {
    id: 'gold_500',
    title: 'Half-Grand',
    description: 'Reach 500 gold',
    emoji: '💎',
    category: 'wealth',
    xpReward: 150,
    requirement: {
      type: 'gold_earned',
      value: 500,
      description: 'Accumulate 500 gold total',
    },
    unlocked: false,
  },
  {
    id: 'gold_1000',
    title: 'Gold Tycoon',
    description: 'Reach 1000 gold',
    emoji: '🏆',
    category: 'wealth',
    xpReward: 300,
    requirement: {
      type: 'gold_earned',
      value: 1000,
      description: 'Accumulate 1000 gold total',
    },
    unlocked: false,
  },
  {
    id: 'gold_5000',
    title: 'Trading Empire',
    description: 'Reach 5000 gold',
    emoji: '👑',
    category: 'wealth',
    xpReward: 500,
    requirement: {
      type: 'gold_earned',
      value: 5000,
      description: 'Accumulate 5000 gold total',
    },
    unlocked: false,
  },
  {
    id: 'billionaire',
    title: 'Billionaire',
    description: 'Reach 10000 gold',
    emoji: '🏰',
    category: 'wealth',
    xpReward: 1000,
    requirement: {
      type: 'gold_earned',
      value: 10000,
      description: 'Accumulate 10000 gold total',
    },
    unlocked: false,
  },

  // Milestone Category
  {
    id: 'level_2',
    title: 'Rising Star',
    description: 'Reach level 2 (Apprentice)',
    emoji: '⭐',
    category: 'milestone',
    xpReward: 50,
    requirement: {
      type: 'special',
      value: 2,
      description: 'Reach level 2',
    },
    unlocked: false,
  },
  {
    id: 'level_5',
    title: 'Expert',
    description: 'Reach level 5 (Expert Trader)',
    emoji: '💎',
    category: 'milestone',
    xpReward: 100,
    requirement: {
      type: 'special',
      value: 5,
      description: 'Reach level 5',
    },
    unlocked: false,
  },
  {
    id: 'level_10',
    title: 'Legend',
    description: 'Reach level 10 (World-Class Merchant)',
    emoji: '🏅',
    category: 'milestone',
    xpReward: 300,
    requirement: {
      type: 'special',
      value: 10,
      description: 'Reach level 10',
    },
    unlocked: false,
  },

  // Special Category
  {
    id: 'bankruptcy_survivor',
    title: 'Bankruptcy Survivor',
    description: 'Drop below 0 gold and recover',
    emoji: '💪',
    category: 'special',
    xpReward: 100,
    requirement: {
      type: 'special',
      value: 1,
      description: 'Drop below 0 gold and recover to positive',
    },
    unlocked: false,
  },
  {
    id: 'perfect_trade',
    title: 'Perfect Trade',
    description: 'Buy and sell at exact same price',
    emoji: '🎯',
    category: 'special',
    xpReward: 50,
    requirement: {
      type: 'special',
      value: 1,
      description: 'Buy and sell at exact same price in one transaction',
    },
    unlocked: false,
  },
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Reach 5000 gold in under 50 turns',
    emoji: '⚡',
    category: 'special',
    xpReward: 300,
    requirement: {
      type: 'special',
      value: 1,
      description: 'Reach 5000 gold in under 50 turns',
    },
    unlocked: false,
  },
  {
    id: 'millionaire_instant',
    title: 'Instant Millionaire',
    description: 'Reach 10000 gold in under 20 turns',
    emoji: '🏰',
    category: 'special',
    xpReward: 500,
    requirement: {
      type: 'special',
      value: 1,
      description: 'Reach 10000 gold in under 20 turns',
    },
    unlocked: false,
  },
];

export function getLevelForXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

export function getLevelData(level: Level): LevelData {
  return LEVELS.find(l => l.level === level) || LEVELS[0];
}

export function getPerksForLevel(level: Level): Perk[] {
  const levelData = getLevelData(level);
  const unlockIds = levelData.unlocks.map(unlock => {
    if (unlock.includes('5% profit perk')) return 'profit_basic';
    if (unlock.includes('10% profit perk')) return 'profit_premium';
    if (unlock.includes('15% profit perk')) return 'profit_epic';
    if (unlock.includes('25% profit perk')) return 'profit_epic';
    if (unlock.includes('20% profit perk')) return 'profit_epic';
    if (unlock.includes('30% profit perk')) return 'profit_epic';
    if (unlock.includes('40% profit perk')) return 'profit_epic';
    if (unlock.includes('50% profit perk')) return 'profit_epic';
    if (unlock.includes('75% profit perk')) return 'profit_epic';
    if (unlock.includes('Basic travel perk')) return 'travel_basic';
    if (unlock.includes('Premium travel perk')) return 'travel_premium';
    if (unlock.includes('Access to special goods')) return 'profit_epic';
    if (unlock.includes('Access to rare goods')) return 'profit_epic';
  });

  const uniqueUnlockIds = Array.from(new Set(unlockIds));
  return uniqueUnlockIds
    .map(id => PERKS.find(p => p.id === id))
    .filter((p): p is Perk => p !== undefined);
}

export function calculateXPFromTrade(profit: number): number {
  // 1 XP per 10 gold profit
  return Math.floor(profit / 10);
}

export function calculateXPFromTravel(distance: number): number {
  // 1 XP per 100 distance (travel cost)
  return Math.floor(distance / 100);
}

export function getLevelProgress(currentXP: number, currentLevel: Level): number {
  const levelData = getLevelData(currentLevel);
  const nextLevel = Math.min(currentLevel + 1, 10) as Level;
  const nextLevelData = getLevelData(nextLevel);

  if (currentLevel === 10) return 100;

  const xpInLevel = currentXP - levelData.xpRequired;
  const xpToNext = nextLevelData.xpRequired - currentXP;

  return Math.floor((xpInLevel / xpToNext) * 100);
}

export function checkAchievement(
  achievement: Achievement,
  totalTrades: number,
  goldEarned: number,
  locationsUnlocked: number,
  profitPerTrade: number,
  currentTurn: number,
  maxTurns?: number
): boolean {
  if (achievement.unlocked) return false;

  const { type, value, description } = achievement.requirement;

  switch (type) {
    case 'total_trades':
      return totalTrades >= value;
    case 'gold_earned':
      return goldEarned >= value;
    case 'locations_unlocked':
      return locationsUnlocked >= value;
    case 'profit_per_trade':
      return profitPerTrade >= value;
    case 'special':
      if (description === 'Reach level 5 in under 30 turns') {
        if (maxTurns && currentTurn <= maxTurns) return true;
        return false;
      }
      return true;
      default:
        return true;
  }
  return false;
}

export function createPlayerProgression(): PlayerProgression {
  return {
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalTrades: 0,
    goldEarned: 0,
    locationsUnlocked: 1,
    perksUnlocked: [],
    achievementsUnlocked: [],
    lastLogin: Date.now(),
    currentStreak: 0,
    bestStreak: 0,
  };
}
