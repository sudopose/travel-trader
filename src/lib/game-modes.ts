// Game Modes System
export type GameMode = 'career' | 'speedrun' | 'survival' | 'puzzle' | 'sandbox';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  startingMoney: number;
  startingInventory: Record<string, number>;
  unlockedLocations: string[];
  maxTurns?: number;
  winCondition?: string;
  loseCondition?: string;
  timeLimit?: number; // seconds
}

export interface GameModeState {
  mode: GameMode;
  config: GameModeConfig;
  timeRemaining?: number;
  turnsRemaining?: number;
  isGameOver: boolean;
  gameResult?: 'win' | 'lose' | 'continue';
  score?: number;
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  sandbox: {
    id: 'sandbox',
    name: 'Sandbox Mode',
    description: 'Free play with no limits. Build your fortune at your own pace.',
    emoji: '🏝️',
    difficulty: 'easy',
    startingMoney: 200,
    startingInventory: {},
    unlockedLocations: ['istanbul'],
  },
  career: {
    id: 'career',
    name: 'Career Mode',
    description: '10-year campaign! Survive 40 seasons and build a trading empire.',
    emoji: '🏆',
    difficulty: 'medium',
    startingMoney: 100,
    startingInventory: { wheat: 2, rice: 1 },
    unlockedLocations: ['istanbul'],
    maxTurns: 40,
    winCondition: 'Reach 5000 gold in 40 seasons',
    loseCondition: 'Bankruptcy! Money < -1000',
  },
  speedrun: {
    id: 'speedrun',
    name: 'Speed Run',
    description: 'Reach 5000 gold in 50 turns! Every decision counts.',
    emoji: '⚡',
    difficulty: 'hard',
    startingMoney: 150,
    startingInventory: { spices: 2 },
    unlockedLocations: ['istanbul', 'mumbai', 'cairo'],
    maxTurns: 50,
    winCondition: 'Reach 5000 gold in 50 turns',
    loseCondition: 'Time runs out',
  },
  survival: {
    id: 'survival',
    name: 'Survival Mode',
    description: 'Start with 50 gold. Survive 20 turns to reach 200 gold.',
    emoji: '🔥',
    difficulty: 'extreme',
    startingMoney: 50,
    startingInventory: {},
    unlockedLocations: ['istanbul'],
    maxTurns: 20,
    winCondition: 'Reach 200 gold in 20 turns',
    loseCondition: 'Money reaches 0',
  },
  puzzle: {
    id: 'puzzle',
    name: 'Puzzle Mode',
    description: 'Full inventory, specific prices. Maximize profit in limited moves.',
    emoji: '🧩',
    difficulty: 'medium',
    startingMoney: 500,
    startingInventory: {
      silk: 5,
      gold: 3,
      spices: 4,
      diamonds: 1,
    },
    unlockedLocations: ['istanbul', 'venice', 'cairo'],
    maxTurns: 10,
    winCondition: 'Profit 2000 in 10 turns',
    loseCondition: 'Time runs out',
  },
};

export function createGameModeState(mode: GameMode): GameModeState {
  const config = GAME_MODES[mode];

  return {
    mode,
    config,
    timeRemaining: config.timeLimit,
    turnsRemaining: config.maxTurns,
    isGameOver: false,
  };
}

export function checkWinCondition(state: GameModeState, currentMoney: number, currentTurns: number): boolean {
  if (state.mode === 'career') {
    return currentMoney >= 5000 && currentTurns <= (state.config.maxTurns || 0);
  }

  if (state.mode === 'speedrun') {
    return currentMoney >= 5000;
  }

  if (state.mode === 'survival') {
    return currentMoney >= 200;
  }

  if (state.mode === 'puzzle') {
    return currentMoney >= 7000; // 5000 start + 2000 profit
  }

  return false;
}

export function checkLoseCondition(state: GameModeState, currentMoney: number, currentTurns: number): boolean {
  if (state.mode === 'career') {
    return currentMoney < -1000;
  }

  if (state.mode === 'survival') {
    return currentMoney <= 0;
  }

  if (state.mode === 'speedrun' || state.mode === 'puzzle') {
    return currentTurns >= (state.config.maxTurns || 0);
  }

  return false;
}

export function calculateScore(state: GameModeState, currentMoney: number, currentTurns: number): number {
  switch (state.mode) {
    case 'career':
      return Math.floor(currentMoney + (40 - currentTurns) * 10);
    case 'speedrun':
      return Math.floor(currentMoney * (50 - currentTurns) / 10);
    case 'survival':
      return Math.floor((currentMoney - 50) * 10);
    case 'puzzle':
      return Math.floor((currentMoney - 500) * 5);
    case 'sandbox':
    default:
      return currentMoney;
  }
}

export function getModeDisplayName(mode: GameMode): string {
  return GAME_MODES[mode].name;
}

export function getModeEmoji(mode: GameMode): string {
  return GAME_MODES[mode].emoji;
}

export function getModeDifficulty(mode: GameMode): string {
  return GAME_MODES[mode].difficulty;
}
