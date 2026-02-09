export type Role = 'trader' | 'navigator' | 'merchant' | 'free';

export type MultiplayerMode = 'single' | 'split' | 'hotseat';

export interface Player {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  isHost: boolean;
}

export interface TeamGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: 'gold' | 'cities' | 'turns' | 'profit';
  completed: boolean;
  reward: number;
}

export interface MultiplayerState {
  mode: MultiplayerMode;
  players: Player[];
  currentPlayerIndex: number; // For hot-seat mode
  teamGoals: TeamGoal[];
  sharedInventory: Record<string, number>;
  sharedMoney: number;
}

export const ROLE_DESCRIPTIONS = {
  trader: {
    name: 'Trader',
    emoji: '🤝',
    description: 'Can buy and sell goods, manage inventory',
    permissions: ['buy', 'sell', 'inventory_view', 'inventory_sort'],
  },
  navigator: {
    name: 'Navigator',
    emoji: '🧭',
    description: 'Can travel and unlock new locations',
    permissions: ['travel', 'unlock', 'map_view', 'route_plan'],
  },
  merchant: {
    name: 'Merchant',
    emoji: '💰',
    description: 'Can view market trends and access loans',
    permissions: ['market_trends', 'loans', 'price_history', 'volatility_view'],
  },
  free: {
    name: 'Free Agent',
    emoji: '🎭',
    description: 'Can do everything',
    permissions: ['buy', 'sell', 'inventory_view', 'inventory_sort', 'travel', 'unlock', 'map_view', 'route_plan', 'market_trends', 'loans', 'price_history', 'volatility_view'],
  },
};

export const TEAM_GOALS_TEMPLATES = [
  {
    id: 'gold_tyrcoon',
    title: 'Gold Tycoon',
    description: 'Accumulate 5000 gold together',
    target: 5000,
    unit: 'gold' as const,
    reward: 1000,
  },
  {
    id: 'world_explorer',
    title: 'World Explorer',
    description: 'Unlock 8 different cities',
    target: 8,
    unit: 'cities' as const,
    reward: 500,
  },
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Reach 3000 gold in 20 turns',
    target: 3000,
    unit: 'gold' as const,
    reward: 1500,
  },
  {
    id: 'profit_master',
    title: 'Profit Master',
    description: 'Make 2000 profit in one trade',
    target: 2000,
    unit: 'profit' as const,
    reward: 800,
  },
  {
    id: 'efficient_trader',
    title: 'Efficient Trader',
    description: 'Complete 50 trades',
    target: 50,
    unit: 'turns' as const,
    reward: 600,
  },
];

export const AVATARS = [
  '🧑‍💼', '👩‍💼', '🧔', '👩‍🦰', '👨‍🦱', '👩‍🦳', '🧑‍🦳', '👨‍🦰',
];

export function createMultiplayerState(): MultiplayerState {
  return {
    mode: 'single',
    players: [],
    currentPlayerIndex: 0,
    teamGoals: [],
    sharedInventory: {},
    sharedMoney: 0,
  };
}

export function addPlayer(
  state: MultiplayerState,
  name: string,
  role: Role,
  isHost: boolean = false
): MultiplayerState {
  const newPlayer: Player = {
    id: `player_${Date.now()}`,
    name,
    role,
    avatar: AVATARS[state.players.length % AVATARS.length],
    isHost,
  };

  return {
    ...state,
    players: [...state.players, newPlayer],
  };
}

export function switchMode(state: MultiplayerState, mode: MultiplayerMode): MultiplayerState {
  // When switching to split or hotseat, auto-setup 2 players if none exist
  let newState = { ...state, mode };

  if ((mode === 'split' || mode === 'hotseat') && newState.players.length === 0) {
    newState = addPlayer(newState, 'Player 1', 'trader', true);
    newState = addPlayer(newState, 'Player 2', 'navigator', false);
  }

  return newState;
}

export function updateTeamGoals(
  state: MultiplayerState,
  gameState: any
): MultiplayerState {
  const updatedGoals = state.teamGoals.map(goal => {
    let current = goal.current;

    switch (goal.unit) {
      case 'gold':
        current = gameState.money;
        break;
      case 'cities':
        current = gameState.unlockedLocations.length;
        break;
      case 'turns':
        // Count trades from history
        const trades = gameState.history.filter((h: any) => h.type === 'buy' || h.type === 'sell').length;
        current = trades;
        break;
      case 'profit':
        // Calculate max single trade profit from history
        current = 0;
        gameState.history.forEach((h: any) => {
          if (h.type === 'sell' && h.message.includes('for')) {
            const match = h.message.match(/for (\d+)🪙/);
            if (match) {
              current = Math.max(current, parseInt(match[1]));
            }
          }
        });
        break;
    }

    return {
      ...goal,
      current,
      completed: current >= goal.target,
    };
  });

  return {
    ...state,
    teamGoals: updatedGoals,
  };
}

export function assignRole(
  state: MultiplayerState,
  playerId: string,
  role: Role
): MultiplayerState {
  return {
    ...state,
    players: state.players.map(p =>
      p.id === playerId ? { ...p, role } : p
    ),
  };
}

export function advanceHotseatTurn(state: MultiplayerState): MultiplayerState {
  return {
    ...state,
    currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
  };
}

export function hasPermission(player: Player, permission: string): boolean {
  const rolePerms = ROLE_DESCRIPTIONS[player.role]?.permissions || [];
  return rolePerms.includes(permission);
}

export function getCurrentPlayer(state: MultiplayerState): Player | null {
  if (state.players.length === 0) return null;
  return state.players[state.currentPlayerIndex];
}

export function getCompletedGoals(state: MultiplayerState): TeamGoal[] {
  return state.teamGoals.filter(g => g.completed);
}

export function getUncompletedGoals(state: MultiplayerState): TeamGoal[] {
  return state.teamGoals.filter(g => !g.completed);
}
