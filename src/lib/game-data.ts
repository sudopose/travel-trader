export interface Good {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  volatility: number; // How much price can fluctuate
  category: 'food' | 'spices' | 'luxury' | 'materials';
}

export interface Location {
  id: string;
  name: string;
  emoji: string;
  goods: { goodId: string; baseMultiplier: number }[];
  travelCost: number;
  unlocked: boolean;
  unlockCost?: number;
}

export interface MarketEvent {
  id: string;
  description: string;
  affectedGood: string | 'all';
  priceMultiplier: number;
  duration: number; // turns
  remainingTurns: number;
}

export interface GameState {
  money: number;
  inventory: Record<string, number>;
  currentLocation: string;
  unlockedLocations: string[];
  turns: number;
  events: MarketEvent[];
  history: GameHistoryEntry[];
}

export interface GameHistoryEntry {
  type: 'buy' | 'sell' | 'travel' | 'event';
  message: string;
  turn: number;
}

// Game data
export const GOODS: Good[] = [
  { id: 'wheat', name: 'Wheat', emoji: '🌾', basePrice: 10, volatility: 0.3, category: 'food' },
  { id: 'rice', name: 'Rice', emoji: '🍚', basePrice: 8, volatility: 0.25, category: 'food' },
  { id: 'spices', name: 'Spices', emoji: '🌶️', basePrice: 50, volatility: 0.5, category: 'spices' },
  { id: 'silk', name: 'Silk', emoji: '🧵', basePrice: 80, volatility: 0.4, category: 'luxury' },
  { id: 'gold', name: 'Gold', emoji: '🪙', basePrice: 200, volatility: 0.6, category: 'luxury' },
  { id: 'tea', name: 'Tea', emoji: '🍵', basePrice: 30, volatility: 0.35, category: 'food' },
  { id: 'cotton', name: 'Cotton', emoji: '☁️', basePrice: 15, volatility: 0.2, category: 'materials' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', basePrice: 25, volatility: 0.4, category: 'food' },
  { id: 'diamonds', name: 'Diamonds', emoji: '💎', basePrice: 500, volatility: 0.7, category: 'luxury' },
  { id: 'ivory', name: 'Ivory', emoji: '🦴', basePrice: 150, volatility: 0.5, category: 'luxury' },
];

export const LOCATIONS: Location[] = [
  {
    id: 'istanbul',
    name: 'Istanbul',
    emoji: '🕌',
    goods: [
      { goodId: 'spices', baseMultiplier: 0.8 },
      { goodId: 'silk', baseMultiplier: 1.2 },
      { goodId: 'gold', baseMultiplier: 1.0 },
      { goodId: 'tea', baseMultiplier: 0.9 },
    ],
    travelCost: 0,
    unlocked: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    emoji: '🕌',
    goods: [
      { goodId: 'spices', baseMultiplier: 0.6 },
      { goodId: 'silk', baseMultiplier: 0.8 },
      { goodId: 'tea', baseMultiplier: 0.7 },
      { goodId: 'cotton', baseMultiplier: 0.9 },
    ],
    travelCost: 20,
    unlocked: true,
  },
  {
    id: 'cairo',
    name: 'Cairo',
    emoji: '🏜️',
    goods: [
      { goodId: 'gold', baseMultiplier: 0.9 },
      { goodId: 'spices', baseMultiplier: 1.3 },
      { goodId: 'cotton', baseMultiplier: 0.8 },
      { goodId: 'ivory', baseMultiplier: 0.7 },
    ],
    travelCost: 30,
    unlocked: true,
  },
  {
    id: 'venice',
    name: 'Venice',
    emoji: '🚢',
    goods: [
      { goodId: 'silk', baseMultiplier: 1.5 },
      { goodId: 'spices', baseMultiplier: 1.6 },
      { goodId: 'gold', baseMultiplier: 1.2 },
      { goodId: 'tea', baseMultiplier: 1.4 },
    ],
    travelCost: 40,
    unlocked: true,
  },
  {
    id: 'beijing',
    name: 'Beijing',
    emoji: '🏯',
    goods: [
      { goodId: 'silk', baseMultiplier: 0.7 },
      { goodId: 'tea', baseMultiplier: 0.5 },
      { goodId: 'gold', baseMultiplier: 1.0 },
      { goodId: 'cotton', baseMultiplier: 1.1 },
    ],
    travelCost: 50,
    unlocked: false,
    unlockCost: 500,
  },
  {
    id: 'newyork',
    name: 'New York',
    emoji: '🗽',
    goods: [
      { goodId: 'gold', baseMultiplier: 1.4 },
      { goodId: 'diamonds', baseMultiplier: 1.2 },
      { goodId: 'coffee', baseMultiplier: 1.1 },
      { goodId: 'cotton', baseMultiplier: 1.0 },
    ],
    travelCost: 60,
    unlocked: false,
    unlockCost: 1000,
  },
];

export const MARKET_EVENTS: Omit<MarketEvent, 'remainingTurns'>[] = [
  {
    id: 'harvest',
    description: 'Bountiful harvest! Food prices are down.',
    affectedGood: 'all',
    priceMultiplier: 0.7,
    duration: 3,
  },
  {
    id: 'shortage',
    description: 'Shortage! Prices are soaring.',
    affectedGood: 'all',
    priceMultiplier: 1.5,
    duration: 2,
  },
  {
    id: 'spice_discovery',
    description: 'New spice route discovered! Spices are abundant.',
    affectedGood: 'spices',
    priceMultiplier: 0.5,
    duration: 4,
  },
  {
    id: 'gold_rush',
    description: 'Gold rush! Gold prices are up.',
    affectedGood: 'gold',
    priceMultiplier: 1.8,
    duration: 3,
  },
  {
    id: 'luxury_demand',
    description: 'Nobles demand luxury goods!',
    affectedGood: 'luxury',
    priceMultiplier: 1.4,
    duration: 3,
  },
];

export const INITIAL_MONEY = 200;
