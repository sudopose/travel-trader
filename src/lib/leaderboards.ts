// Leaderboards System - Local Rankings
export interface LeaderboardEntry {
  id: string;
  playerName: string;
  gameMode: string;
  score: number;
  gold: number;
  turns: number;
  achievements: number;
  level: number;
  timestamp: number;
  date: string;
}

export interface LeaderboardStats {
  totalGames: number;
  totalGoldEarned: number;
  totalAchievements: number;
  highestLevel: number;
  bestScore: number;
  averageScore: number;
}

const LEADERBOARD_KEY = 'travel-trader-leaderboard';
const STATS_KEY = 'travel-trader-stats';

const MAX_ENTRIES = 50;

export function saveLeaderboardEntry(entry: LeaderboardEntry): boolean {
  try {
    const leaderboard = getLeaderboard();

    leaderboard.push(entry);

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top MAX_ENTRIES
    const trimmed = leaderboard.slice(0, MAX_ENTRIES);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));

    return true;
  } catch (error) {
    console.error('Save leaderboard failed:', error);
    return false;
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Get leaderboard failed:', error);
    return [];
  }
}

export function getLeaderboardByMode(gameMode: string): LeaderboardEntry[] {
  const leaderboard = getLeaderboard();
  return leaderboard.filter(entry => entry.gameMode === gameMode);
}

export function getTopEntries(limit: number = 10, gameMode?: string): LeaderboardEntry[] {
  let leaderboard = getLeaderboard();

  if (gameMode) {
    leaderboard = leaderboard.filter(entry => entry.gameMode === gameMode);
  }

  return leaderboard.slice(0, limit);
}

export function getPlayerRank(playerName: string, gameMode?: string): number {
  const leaderboard = gameMode ? getLeaderboardByMode(gameMode) : getLeaderboard();
  const index = leaderboard.findIndex(entry => entry.playerName === playerName);

  return index === -1 ? -1 : index + 1;
}

export function updateStats(entry: LeaderboardEntry): boolean {
  try {
    const stats = getStats();

    stats.totalGames += 1;
    stats.totalGoldEarned += entry.gold;
    stats.totalAchievements += entry.achievements;
    stats.highestLevel = Math.max(stats.highestLevel, entry.level);
    stats.bestScore = Math.max(stats.bestScore, entry.score);
    stats.averageScore = (stats.averageScore * (stats.totalGames - 1) + entry.score) / stats.totalGames;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));

    return true;
  } catch (error) {
    console.error('Update stats failed:', error);
    return false;
  }
}

export function getStats(): LeaderboardStats {
  try {
    const data = localStorage.getItem(STATS_KEY);

    if (!data) {
      return {
        totalGames: 0,
        totalGoldEarned: 0,
        totalAchievements: 0,
        highestLevel: 1,
        bestScore: 0,
        averageScore: 0,
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Get stats failed:', error);
    return {
      totalGames: 0,
      totalGoldEarned: 0,
      totalAchievements: 0,
      highestLevel: 1,
      bestScore: 0,
      averageScore: 0,
    };
  }
}

export function clearLeaderboard(): boolean {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
    return true;
  } catch (error) {
    console.error('Clear leaderboard failed:', error);
    return false;
  }
}

export function formatScore(score: number): string {
  if (score >= 1000000) {
    return `${(score / 1000000).toFixed(1)}M`;
  }
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}K`;
  }
  return score.toString();
}

export function getMedal(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

export function getModeDisplayName(mode: string): string {
  const names: Record<string, string> = {
    career: 'Career Mode',
    speedrun: 'Speed Run',
    survival: 'Survival',
    puzzle: 'Puzzle',
    sandbox: 'Sandbox',
  };
  return names[mode] || mode;
}

export function clearStats(): boolean {
  try {
    localStorage.removeItem(STATS_KEY);
    return true;
  } catch (error) {
    console.error('Clear stats failed:', error);
    return false;
  }
}
