import { Season } from './game-data';
import { EVENT_CHAINS, MARKET_EVENTS } from './game-data';

export interface MarketEvent {
  id: string;
  description: string;
  affectedGood: string | 'all';
  priceMultiplier: number;
  duration: number;
  remainingTurns: number;
  isSeasonal?: boolean;
  season?: Season;
  isDaily?: boolean;
  isRare?: boolean;
  volatility?: number;
  travelCostModifier?: number;
}

export interface EventChain {
  id: string;
  description: string;
  events: Array<{ eventId: string; weight: number }>;
  triggerChance: number;
  duration: number;
}

export interface EventSystem {
  events: MarketEvent[];
  chains: EventChain[];
  currentChain: EventChain | null;
  chainProgress: number; // 0-1 progress through current chain
}

export function createEventSystem(): EventSystem {
  return {
    events: [],
    chains: Object.values(EVENT_CHAINS),
    currentChain: null,
    chainProgress: 0,
  };
}

export function addEvent(system: EventSystem, event: Omit<MarketEvent, 'remainingTurns'>): EventSystem {
  return {
    ...system,
    events: [
      ...system.events,
      {
        ...event,
        remainingTurns: event.duration,
      },
    ],
  };
}

export function updateEventSystem(system: EventSystem): EventSystem {
  // Decrement remaining turns
  let events = system.events.map((e) => ({
    ...e,
    remainingTurns: Math.max(0, e.remainingTurns - 1),
  }));

  // Remove expired events
  events = events.filter((e) => e.remainingTurns > 0);

  return {
    ...system,
    events,
  };
}

export function triggerEvent(system: EventSystem, event: Omit<MarketEvent, 'remainingTurns'>): EventSystem {
  return addEvent(system, event);
}

export function triggerRandomDailyEvent(system: EventSystem): EventSystem {
  // Filter events that are daily and not expired
  const availableDailyEvents = MARKET_EVENTS.filter(
    (e) => e.isDaily && e.duration > 0
  );

  if (availableDailyEvents.length === 0) {
    return system;
  }

  // 15% chance to trigger a daily event
  if (Math.random() > 0.15) {
    return system;
  }

  // Select random daily event
  const event = availableDailyEvents[Math.floor(Math.random() * availableDailyEvents.length)];

  return triggerEvent(system, {
    id: event.id,
    description: event.description,
    affectedGood: event.affectedGood,
    priceMultiplier: event.priceMultiplier,
    duration: event.duration,
    isSeasonal: event.isSeasonal,
    season: event.season,
    isDaily: event.isDaily,
    isRare: event.isRare,
    travelCostModifier: event.travelCostModifier,
  });
}

export function triggerRandomSeasonalEvent(system: EventSystem, currentSeason: Season): EventSystem {
  // Filter seasonal events for current season
  const availableSeasonalEvents = MARKET_EVENTS.filter(
    (e) => e.isSeasonal && e.season === currentSeason && e.duration > 0
  );

  if (availableSeasonalEvents.length === 0) {
    return system;
  }

  // 20% chance to trigger a seasonal event
  if (Math.random() > 0.20) {
    return system;
  }

  // Select random seasonal event
  const event = availableSeasonalEvents[Math.floor(Math.random() * availableSeasonalEvents.length)];

  return triggerEvent(system, {
    id: event.id,
    description: event.description,
    affectedGood: event.affectedGood,
    priceMultiplier: event.priceMultiplier,
    duration: event.duration,
    isSeasonal: event.isSeasonal,
    season: event.season,
    isDaily: event.isDaily,
    isRare: event.isRare,
    travelCostModifier: event.travelCostModifier,
  });
}

export function triggerRareEvent(system: EventSystem): EventSystem {
  // 1% chance per turn to trigger a rare event
  if (Math.random() > 0.01) {
    return system;
  }

  // Filter rare events
  const availableRareEvents = MARKET_EVENTS.filter(
    (e) => e.isRare && e.duration > 0
  );

  if (availableRareEvents.length === 0) {
    return system;
  }

  // Select random rare event
  const event = availableRareEvents[Math.floor(Math.random() * availableRareEvents.length)];

  return triggerEvent(system, {
    id: event.id,
    description: event.description,
    affectedGood: event.affectedGood,
    priceMultiplier: event.priceMultiplier,
    duration: event.duration,
    isSeasonal: event.isSeasonal,
    season: event.season,
    isDaily: event.isDaily,
    isRare: event.isRare,
    travelCostModifier: event.travelCostModifier,
  });
}

export function triggerEventChain(system: EventSystem): EventSystem | null {
  // Check if we have an active chain
  if (!system.currentChain) {
    // Try to trigger a new chain
    if (Math.random() > 0.03) { // 3% chance
      return null;
    }

    // Select random chain from array
    const chainsArray = system.chains;
    const chain = chainsArray[Math.floor(Math.random() * chainsArray.length)];

    return {
      ...system,
      currentChain: chain,
      chainProgress: 0,
    };
  }

  // Progress through current chain
  return {
    ...system,
    chainProgress: Math.min(1, system.chainProgress + 1),
  };
}

export function getCurrentEvent(system: EventSystem): MarketEvent | null {
  // Get the most recently added event from system events
  if (system.events.length > 0) {
    return system.events[system.events.length - 1];
  }

  return null;
}

export function getEventImpact(system: EventSystem, goodId: string): number {
  // Get the most recent event affecting this good
  for (let i = system.events.length - 1; i >= 0; i--) {
    const event = system.events[i];
    if (event.affectedGood === goodId || event.affectedGood === 'all') {
      return event.priceMultiplier;
    }
  }

  return 1;
}

export function getGlobalEventImpact(system: EventSystem): number {
  // Get the most recent event affecting everything
  for (let i = system.events.length - 1; i >= 0; i--) {
    const event = system.events[i];
    if (event.affectedGood === 'all') {
      return event.priceMultiplier;
    }
  }

  return 1;
}

export function getVolatilityLevel(system: EventSystem): 'low' | 'medium' | 'high' {
  const eventCount = system.events.length;
  const hasRareEvent = system.events.some((e) => e.isRare);
  const activeChains = system.currentChain ? 1 : 0;

  if (eventCount < 2 || (!hasRareEvent && !activeChains)) {
    return 'low';
  }

  if (eventCount < 5 || (hasRareEvent && !activeChains)) {
    return 'medium';
  }

  return 'high';
}

export function getEventDuration(system: EventSystem): number {
  // Find the longest active event
  if (system.events.length === 0) return 0;

  return Math.max(...system.events.map((e) => e.remainingTurns));
}
