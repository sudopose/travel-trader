// Save/Load System - LocalStorage Persistence
import { GameState } from './game-data';

export interface SaveData {
  gameState: GameState;
  progression: any; // PlayerProgression from progression.ts
  timestamp: number;
  version: string;
}

const SAVE_KEY = 'travel-trader-save';
const SLOTS_KEY = 'travel-trader-slots';
const MAX_SLOTS = 5;

export const CURRENT_VERSION = '2.0.0';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

export function saveGame(
  gameState: GameState,
  progression: any,
  slot: number = 0
): boolean {
  if (!isBrowser) return false;

  try {
    const saveData: SaveData = {
      gameState,
      progression,
      timestamp: Date.now(),
      version: CURRENT_VERSION,
    };

    const slots = getSaveSlots();
    slots[slot] = saveData;

    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));

    return true;
  } catch (error) {
    console.error('Save failed:', error);
    return false;
  }
}

export function loadGame(slot: number = 0): SaveData | null {
  if (!isBrowser) return null;

  try {
    const slots = getSaveSlots();

    if (!slots[slot]) {
      return null;
    }

    return slots[slot];
  } catch (error) {
    console.error('Load failed:', error);
    return null;
  }
}

export function loadAutoSave(): SaveData | null {
  if (!isBrowser) return null;

  try {
    const data = localStorage.getItem(SAVE_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Auto-save load failed:', error);
    return null;
  }
}

export function getSaveSlots(): (SaveData | null)[] {
  if (!isBrowser) return Array(MAX_SLOTS).fill(null);

  try {
    const data = localStorage.getItem(SLOTS_KEY);

    if (!data) {
      return Array(MAX_SLOTS).fill(null);
    }

    const slots = JSON.parse(data);
    return Array(MAX_SLOTS).fill(null).map((_, idx) => slots[idx] || null);
  } catch (error) {
    console.error('Get slots failed:', error);
    return Array(MAX_SLOTS).fill(null);
  }
}

export function deleteSave(slot: number): boolean {
  if (!isBrowser) return false;

  try {
    const slots = getSaveSlots();
    slots[slot] = null;
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));

    // Clear auto-save if this was slot 0
    if (slot === 0) {
      localStorage.removeItem(SAVE_KEY);
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

export function exportSave(): string | null {
  if (!isBrowser) return null;

  try {
    const data = localStorage.getItem(SAVE_KEY);

    if (!data) {
      return null;
    }

    return btoa(data); // Base64 encode
  } catch (error) {
    console.error('Export failed:', error);
    return null;
  }
}

export function importSave(base64Data: string): boolean {
  if (!isBrowser) return false;

  try {
    const data = JSON.parse(atob(base64Data));

    if (!data.gameState || !data.progression) {
      throw new Error('Invalid save data');
    }

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));

    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
}

export function hasAutoSave(): boolean {
  if (!isBrowser) return false;
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function getSaveTimestamp(slot: number): number | null {
  if (!isBrowser) return null;

  const slots = getSaveSlots();
  return slots[slot]?.timestamp || null;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export function clearAllSaves(): boolean {
  if (!isBrowser) return false;

  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SLOTS_KEY);
    return true;
  } catch (error) {
    console.error('Clear all saves failed:', error);
    return false;
  }
}
