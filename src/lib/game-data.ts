export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter'
}

export interface Weather {
  id: string;
  name: string;
  emoji: string;
  description: string;
  priceModifier: number; // Global price modifier
  travelCostModifier: number; // Multiplier for travel costs
  duration: number; // turns
  remainingTurns: number;
}

export interface Good {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  volatility: number; // How much price can fluctuate
  category: 'food' | 'spices' | 'luxury' | 'materials' | 'special' | 'rare';
  seasonalPreference?: Season; // Which season this good prefers (lower price in this season)
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
  weather?: Weather;
  season: Season;
  inventorySlots: number; // Current carrying capacity
  maxInventorySlots: number; // Maximum carrying capacity
  history: GameHistoryEntry[];
}

export interface GameHistoryEntry {
  type: 'buy' | 'sell' | 'travel' | 'event' | 'weather' | 'season';
  message: string;
  turn: number;
}

// Expanded goods (from 10 to 20)
export const GOODS: Good[] = [
  // Food (8 items)
  { id: 'wheat', name: 'Wheat', emoji: '🌾', basePrice: 10, volatility: 0.3, category: 'food', seasonalPreference: Season.SUMMER },
  { id: 'rice', name: 'Rice', emoji: '🍚', basePrice: 8, volatility: 0.25, category: 'food', seasonalPreference: Season.AUTUMN },
  { id: 'apples', name: 'Apples', emoji: '🍎', basePrice: 12, volatility: 0.3, category: 'food', seasonalPreference: Season.AUTUMN },
  { id: 'carrots', name: 'Carrots', emoji: '🥕', basePrice: 9, volatility: 0.25, category: 'food', seasonalPreference: Season.SPRING },
  { id: 'bananas', name: 'Bananas', emoji: '🍌', basePrice: 15, volatility: 0.35, category: 'food' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', basePrice: 14, volatility: 0.3, category: 'food', seasonalPreference: Season.AUTUMN },
  { id: 'herbs', name: 'Herbs', emoji: '🌿', basePrice: 20, volatility: 0.4, category: 'food', seasonalPreference: Season.SPRING },
  { id: 'leafy_greens', name: 'Leafy Greens', emoji: '🥬', basePrice: 11, volatility: 0.35, category: 'food', seasonalPreference: Season.SPRING },

  // Spices (6 items)
  { id: 'chili', name: 'Chili', emoji: '🌶️', basePrice: 30, volatility: 0.5, category: 'spices' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', basePrice: 25, volatility: 0.4, category: 'spices' },
  { id: 'onion', name: 'Onion', emoji: '🧅', basePrice: 15, volatility: 0.3, category: 'spices' },
  { id: 'mint', name: 'Mint', emoji: '🌱', basePrice: 35, volatility: 0.45, category: 'spices', seasonalPreference: Season.SUMMER },
  { id: 'pine', name: 'Pine', emoji: '🌲', basePrice: 40, volatility: 0.5, category: 'spices' },
  { id: 'lavender', name: 'Lavender', emoji: '💜', basePrice: 45, volatility: 0.5, category: 'spices', seasonalPreference: Season.SUMMER },

  // Luxury (7 items)
  { id: 'silk', name: 'Silk', emoji: '🧵', basePrice: 80, volatility: 0.4, category: 'luxury' },
  { id: 'gold', name: 'Gold', emoji: '🪙', basePrice: 200, volatility: 0.6, category: 'luxury' },
  { id: 'diamonds', name: 'Diamonds', emoji: '💎', basePrice: 500, volatility: 0.7, category: 'luxury' },
  { id: 'ivory', name: 'Ivory', emoji: '🦴', basePrice: 150, volatility: 0.5, category: 'luxury' },
  { id: 'crowns', name: 'Crowns', emoji: '👑', basePrice: 300, volatility: 0.65, category: 'luxury' },
  { id: 'rubies', name: 'Rubies', emoji: '❤️', basePrice: 400, volatility: 0.7, category: 'luxury' },
  { id: 'emeralds', name: 'Emeralds', emoji: '💚', basePrice: 450, volatility: 0.7, category: 'luxury' },

  // Materials (5 items)
  { id: 'cotton', name: 'Cotton', emoji: '☁️', basePrice: 15, volatility: 0.2, category: 'materials' },
  { id: 'wood', name: 'Wood', emoji: '🪵', basePrice: 12, volatility: 0.2, category: 'materials', seasonalPreference: Season.WINTER },
  { id: 'stone', name: 'Stone', emoji: '🪨', basePrice: 18, volatility: 0.15, category: 'materials' },
  { id: 'papyrus', name: 'Papyrus', emoji: '📜', basePrice: 22, volatility: 0.35, category: 'materials' },
  { id: 'honey', name: 'Honey', emoji: '🍯', basePrice: 28, volatility: 0.4, category: 'materials', seasonalPreference: Season.SUMMER },

  // Special (3 items)
  { id: 'caravans', name: 'Caravans', emoji: '🐪', basePrice: 100, volatility: 0.5, category: 'special' },
  { id: 'maps', name: 'Maps', emoji: '🗺️', basePrice: 60, volatility: 0.3, category: 'special' },
  { id: 'horses', name: 'Horses', emoji: '🐴', basePrice: 80, volatility: 0.4, category: 'special' },

  // Rare (2 items)
  { id: 'dragonfruit', name: 'Dragonfruit', emoji: '🐉', basePrice: 120, volatility: 0.6, category: 'rare' },
  { id: 'sakura', name: 'Sakura Blossoms', emoji: '🌸', basePrice: 150, volatility: 0.5, category: 'rare', seasonalPreference: Season.SPRING },
];

// Weather types
export const WEATHER_TYPES: Omit<Weather, 'remainingTurns'>[] = [
  {
    id: 'storm',
    name: 'Storm',
    emoji: '⛈️',
    description: 'A fierce storm is brewing! Travel costs increase.',
    priceModifier: 1.1,
    travelCostModifier: 2.0,
    duration: 2,
  },
  {
    id: 'drought',
    name: 'Drought',
    emoji: '☀️',
    description: 'Severe drought! Food prices are rising.',
    priceModifier: 1.3,
    travelCostModifier: 1.5,
    duration: 3,
  },
  {
    id: 'fog',
    name: 'Fog',
    emoji: '🌫️',
    description: 'Thick fog rolls in. Trade is sluggish.',
    priceModifier: 0.9,
    travelCostModifier: 1.2,
    duration: 2,
  },
  {
    id: 'bloom',
    name: 'Bloom',
    emoji: '🌺',
    description: 'Nature blooms! Goods are plentiful and cheap.',
    priceModifier: 0.8,
    travelCostModifier: 1.0,
    duration: 2,
  },
];

export const LOCATIONS: Location[] = [
  // Original 5 locations (all unlocked initially)
  {
    id: 'istanbul',
    name: 'Istanbul',
    emoji: '🕌',
    goods: [
      { goodId: 'chili', baseMultiplier: 0.8 },
      { goodId: 'silk', baseMultiplier: 1.2 },
      { goodId: 'gold', baseMultiplier: 1.0 },
      { goodId: 'carpets', baseMultiplier: 1.0 },
    ],
    travelCost: 0,
    unlocked: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    emoji: '🕌',
    goods: [
      { goodId: 'chili', baseMultiplier: 0.6 },
      { goodId: 'silk', baseMultiplier: 0.8 },
      { goodId: 'spices', baseMultiplier: 0.7 },
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
      { goodId: 'chili', baseMultiplier: 1.3 },
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
      { goodId: 'chili', baseMultiplier: 1.6 },
      { goodId: 'gold', baseMultiplier: 1.2 },
      { goodId: 'glass', baseMultiplier: 1.3 },
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

  // New locations (6 original unlockable + 8 new unlockable = 14 total unlockable)
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
  // NEW LOCATIONS
  {
    id: 'singapore',
    name: 'Singapore',
    emoji: '🦁',
    goods: [
      { goodId: 'spices', baseMultiplier: 0.7 },
      { goodId: 'silk', baseMultiplier: 0.9 },
      { goodId: 'honey', baseMultiplier: 0.8 },
      { goodId: 'rubies', baseMultiplier: 1.1 },
    ],
    travelCost: 70,
    unlocked: false,
    unlockCost: 800,
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    emoji: '🏙️',
    goods: [
      { goodId: 'silk', baseMultiplier: 0.8 },
      { goodId: 'gold', baseMultiplier: 1.1 },
      { goodId: 'spices', baseMultiplier: 0.9 },
      { goodId: 'electronic', baseMultiplier: 1.3 },
    ],
    travelCost: 75,
    unlocked: false,
    unlockCost: 1500,
  },
  {
    id: 'capetown',
    name: 'Cape Town',
    emoji: '🏔️',
    goods: [
      { goodId: 'diamonds', baseMultiplier: 0.7 },
      { goodId: 'gold', baseMultiplier: 0.9 },
      { goodId: 'ivory', baseMultiplier: 0.8 },
      { goodId: 'wine', baseMultiplier: 0.8 },
    ],
    travelCost: 80,
    unlocked: false,
    unlockCost: 1200,
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    emoji: '🎭',
    goods: [
      { goodId: 'coffee', baseMultiplier: 0.6 },
      { goodId: 'sugar', baseMultiplier: 0.7 },
      { goodId: 'gold', baseMultiplier: 1.1 },
      { goodId: 'diamonds', baseMultiplier: 1.0 },
    ],
    travelCost: 85,
    unlocked: false,
    unlockCost: 900,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    emoji: '🦘',
    goods: [
      { goodId: 'wool', baseMultiplier: 0.7 },
      { goodId: 'gold', baseMultiplier: 0.9 },
      { goodId: 'pearls', baseMultiplier: 0.8 },
      { goodId: 'wine', baseMultiplier: 0.7 },
    ],
    travelCost: 90,
    unlocked: false,
    unlockCost: 2000,
  },
  {
    id: 'moscow',
    name: 'Moscow',
    emoji: '🏰',
    goods: [
      { goodId: 'fur', baseMultiplier: 0.7 },
      { goodId: 'gold', baseMultiplier: 1.1 },
      { goodId: 'wood', baseMultiplier: 0.8 },
      { goodId: 'caviar', baseMultiplier: 0.9 },
    ],
    travelCost: 95,
    unlocked: false,
    unlockCost: 1100,
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    emoji: '🌋',
    goods: [
      { goodId: 'fish', baseMultiplier: 0.7 },
      { goodId: 'wool', baseMultiplier: 0.9 },
      { goodId: 'diamonds', baseMultiplier: 1.2 },
      { goodId: 'sulfur', baseMultiplier: 0.6 },
    ],
    travelCost: 100,
    unlocked: false,
    unlockCost: 1300,
  },
  {
    id: 'newdelhi',
    name: 'New Delhi',
    emoji: '🕌',
    goods: [
      { goodId: 'spices', baseMultiplier: 0.5 },
      { goodId: 'silk', baseMultiplier: 0.8 },
      { goodId: 'tea', baseMultiplier: 0.6 },
      { goodId: 'honey', baseMultiplier: 0.7 },
    ],
    travelCost: 55,
    unlocked: false,
    unlockCost: 600,
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
export const INITIAL_INVENTORY_SLOTS = 20;
export const MAX_INVENTORY_SLOTS = 20;

export const SEASON_DISPLAY = {
  [Season.SPRING]: { name: 'Spring', emoji: '🌸' },
  [Season.SUMMER]: { name: 'Summer', emoji: '☀️' },
  [Season.AUTUMN]: { name: 'Autumn', emoji: '🍂' },
  [Season.WINTER]: { name: 'Winter', emoji: '❄️' },
};
