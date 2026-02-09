import {
  GameState,
  Good,
  Location,
  MarketEvent,
  Weather,
  Season,
  GOODS,
  LOCATIONS,
  MARKET_EVENTS,
  WEATHER_TYPES,
  EVENT_CHAINS,
  INITIAL_MONEY,
  INITIAL_INVENTORY_SLOTS,
  MAX_INVENTORY_SLOTS,
  SEASON_DISPLAY,
} from './game-data';

export function getInitialGameState(): GameState {
  return {
    money: INITIAL_MONEY,
    inventory: {},
    currentLocation: 'istanbul',
    unlockedLocations: ['istanbul'],
    turns: 0,
    events: [],
    season: Season.SPRING,
    inventorySlots: INITIAL_INVENTORY_SLOTS,
    maxInventorySlots: MAX_INVENTORY_SLOTS,
    importantItems: [],
    history: [
      {
        type: 'event',
        message: 'Welcome to Travel Trader! Start your journey in Istanbul.',
        turn: 0,
      },
    ],
  };
}

export function calculatePrice(
  good: Good,
  location: Location,
  events: MarketEvent[],
  season: Season,
  weather?: Weather
): number {
  const locationGood = location.goods.find((g) => g.goodId === good.id);
  const multiplier = locationGood ? locationGood.baseMultiplier : 1;

  // Seasonal modifier
  let seasonalMultiplier = 1;
  if (good.seasonalPreference === season) {
    // Goods are cheaper in their preferred season (more supply)
    seasonalMultiplier = 0.8;
  } else if (
    (good.seasonalPreference === Season.SPRING && season === Season.WINTER) ||
    (good.seasonalPreference === Season.SUMMER && season === Season.SPRING) ||
    (good.seasonalPreference === Season.AUTUMN && season === Season.SUMMER) ||
    (good.seasonalPreference === Season.WINTER && season === Season.AUTUMN)
  ) {
    // Goods are more expensive in opposite season (less supply)
    seasonalMultiplier = 1.2;
  }

  // Weather modifier
  let weatherMultiplier = 1;
  if (weather) {
    weatherMultiplier = weather.priceModifier;
  }

  // Market events
  let eventMultiplier = 1;
  for (const event of events) {
    if (
      event.affectedGood === 'all' ||
      event.affectedGood === good.id ||
      event.affectedGood === good.category
    ) {
      eventMultiplier *= event.priceMultiplier;
    }
  }

  // Add some randomness
  const randomFactor = 1 + (Math.random() - 0.5) * good.volatility * 0.3;

  return Math.round(
    good.basePrice *
      multiplier *
      seasonalMultiplier *
      weatherMultiplier *
      eventMultiplier *
      randomFactor
  );
}

export function calculateTravelCost(
  locationId: string,
  weather?: Weather
): number {
  const location = LOCATIONS.find((l) => l.id === locationId);
  if (!location) return 0;

  let cost = location.travelCost;

  // Weather affects travel cost
  if (weather) {
    cost = Math.round(cost * weather.travelCostModifier);
  }

  return cost;
}

export function getCurrentInventoryCount(state: GameState): number {
  return Object.values(state.inventory).reduce((sum, count) => sum + count, 0);
}

export function getUsedInventorySlots(state: GameState): number {
  return Object.values(state.inventory).reduce((sum, count) => sum + count, 0);
}

export function addToInventory(
  state: GameState,
  goodId: string,
  quantity: number
): { canAdd: boolean; reason?: string } {
  const currentCount = getUsedInventorySlots(state);
  const newCount = currentCount + quantity;

  if (newCount > state.inventorySlots) {
    return {
      canAdd: false,
      reason: `Inventory full! Used: ${currentCount}/${state.inventorySlots}`,
    };
  }

  return { canAdd: true };
}

export function removeFromInventory(
  state: GameState,
  goodId: string,
  quantity: number
): { canRemove: boolean; reason?: string } {
  const currentCount = state.inventory[goodId] || 0;

  if (currentCount < quantity) {
    return {
      canRemove: false,
      reason: `Not enough ${goodId}! Have ${currentCount}, need ${quantity}`,
    };
  }

  return { canRemove: true };
}

export function sortInventoryBasic(state: GameState): GameState {
  const newState = { ...state };
  const sortedEntries = Object.entries(newState.inventory).sort((a, b) => {
    const goodA = GOODS.find((g) => g.id === a[0]);
    const goodB = GOODS.find((g) => g.id === b[0]);

    if (!goodA || !goodB) return 0;

    // Sort by category first, then by name
    if (goodA.category !== goodB.category) {
      return goodA.category.localeCompare(goodB.category);
    }
    return goodA.name.localeCompare(goodB.name);
  });

  const newInventory: Record<string, number> = {};
  sortedEntries.forEach(([key, value]) => {
    newInventory[key] = value;
  });

  newState.inventory = newInventory;
  return newState;
}

export function buyGood(
  state: GameState,
  goodId: string,
  quantity: number
): GameState | { error: string } {
  const location = LOCATIONS.find((l) => l.id === state.currentLocation);
  if (!location) return { error: 'Invalid location' };

  const good = GOODS.find((g) => g.id === goodId);
  if (!good) return { error: 'Invalid good' };

  // Check inventory space
  const inventoryCheck = addToInventory(state, goodId, quantity);
  if (!inventoryCheck.canAdd) {
    return { error: inventoryCheck.reason };
  }

  const price = calculatePrice(good, location, state.events, state.season, state.weather);
  const totalCost = price * quantity;

  if (totalCost > state.money) {
    return {
      error: `Not enough money! You need ${totalCost}, have ${state.money}`,
    };
  }

  const newState = { ...state };
  newState.money -= totalCost;
  newState.inventory[goodId] = (newState.inventory[goodId] || 0) + quantity;
  newState.history.push({
    type: 'buy',
    message: `Bought ${quantity} ${good.emoji} ${good.name} for ${totalCost}🪙`,
    turn: state.turns,
  });

  return newState;
}

export function sellGood(
  state: GameState,
  goodId: string,
  quantity: number
): GameState | { error: string } {
  const location = LOCATIONS.find((l) => l.id === state.currentLocation);
  if (!location) return { error: 'Invalid location' };

  const good = GOODS.find((g) => g.id === goodId);
  if (!good) return { error: 'Invalid good' };

  // Check inventory
  const inventoryCheck = removeFromInventory(state, goodId, quantity);
  if (!inventoryCheck.canRemove) {
    return { error: inventoryCheck.reason };
  }

  const price = calculatePrice(good, location, state.events, state.season, state.weather);
  const totalRevenue = price * quantity;

  const newState = { ...state };
  newState.money += totalRevenue;
  newState.inventory[goodId] = Math.max(0, newState.inventory[goodId]! - quantity);

  // Clean up empty inventory slots
  if (newState.inventory[goodId] === 0) {
    delete newState.inventory[goodId];
  }

  newState.history.push({
    type: 'sell',
    message: `Sold ${quantity} ${good.emoji} ${good.name} for ${totalRevenue}🪙`,
    turn: state.turns,
  });

  return newState;
}

export function travelTo(state: GameState, locationId: string): GameState | { error: string } {
  const currentLocation = LOCATIONS.find((l) => l.id === state.currentLocation);
  const targetLocation = LOCATIONS.find((l) => l.id === locationId);

  if (!currentLocation || !targetLocation) return { error: 'Invalid location' };
  if (locationId === state.currentLocation) return { error: 'Already at this location' };

  if (!state.unlockedLocations.includes(locationId)) {
    return { error: 'Location not unlocked yet!' };
  }

  const travelCost = calculateTravelCost(locationId, state.weather);
  if (travelCost > state.money) {
    return { error: `Not enough money to travel! Need ${travelCost}🪙` };
  }

  let newState = { ...state };
  newState.money -= travelCost;
  newState.currentLocation = locationId;
  newState.turns += 1;

  // Update season every 4 turns
  const seasonOrder = [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER];
  const seasonIndex = seasonOrder.indexOf(newState.season);
  if (newState.turns % 4 === 0) {
    newState.season = seasonOrder[(seasonIndex + 1) % seasonOrder.length];
    newState.history.push({
      type: 'season',
      message: `🌸 Season changed to ${SEASON_DISPLAY[newState.season].emoji} ${SEASON_DISPLAY[newState.season].name}!`,
      turn: newState.turns,
    });
  }

  // Process weather
  if (newState.weather) {
    newState.weather.remainingTurns -= 1;
    if (newState.weather.remainingTurns <= 0) {
      newState.weather = undefined;
      newState.history.push({
        type: 'weather',
        message: '☀️ Weather has cleared.',
        turn: newState.turns,
      });
    }
  }

  // Maybe trigger a new weather event (20% chance, but not if already has weather)
  if (!newState.weather && Math.random() < 0.2 && newState.turns > 0) {
    const newWeatherTemplate = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
    const newWeather: Weather = {
      ...newWeatherTemplate,
      remainingTurns: newWeatherTemplate.duration,
    };
    newState.weather = newWeather;
    newState.history.push({
      type: 'weather',
      message: `🌡️ ${newWeather.description}`,
      turn: newState.turns,
    });
  }

  // Process events
  newState.events = newState.events
    .map((e) => ({ ...e, remainingTurns: e.remainingTurns - 1 }))
    .filter((e) => e.remainingTurns > 0);

  // Process events - trigger new events
  newState = processEvents(newState);

  // Update season every 4 turns
  if (newState.turns % 4 === 0) {
    const seasonIndex = seasonOrder.indexOf(newState.season);
    newState.season = seasonOrder[(seasonIndex + 1) % seasonOrder.length];
    newState.history.push({
      type: 'season',
      message: `🌸 Season changed to ${SEASON_DISPLAY[newState.season].emoji} ${SEASON_DISPLAY[newState.season].name}!`,
      turn: newState.turns,
    });
  }

  newState.history.push({
    type: 'travel',
    message: `Traveled to ${targetLocation.emoji} ${targetLocation.name} (-${travelCost}🪙)`,
    turn: newState.turns,
  });

  return newState;
}

export function unlockLocation(
  state: GameState,
  locationId: string
): GameState | { error: string } {
  const location = LOCATIONS.find((l) => l.id === locationId);
  if (!location) return { error: 'Invalid location' };
  if (state.unlockedLocations.includes(locationId)) return { error: 'Already unlocked' };
  if (location.unlocked) return { error: 'Already unlocked' };

  if (!location.unlockCost) return { error: 'Cannot unlock this location' };
  if (location.unlockCost > state.money) {
    return {
      error: `Need ${location.unlockCost}🪙 to unlock ${location.name}`,
    };
  }

  const newState = { ...state };
  newState.money -= location.unlockCost;
  newState.unlockedLocations.push(locationId);

  // Update location to unlocked
  const locationIndex = LOCATIONS.findIndex((l) => l.id === locationId);
  if (locationIndex >= 0) {
    LOCATIONS[locationIndex].unlocked = true;
  }

  newState.history.push({
    type: 'event',
    message: `🎉 Unlocked ${location.emoji} ${location.name}!`,
    turn: state.turns,
  });

  return newState;
}

// Advanced Events System
export function getActiveEvents(
  events: MarketEvent[],
  season: Season
): MarketEvent[] {
  return events.filter((event) => {
    // Filter seasonal events
    if (event.isSeasonal && event.season !== season) {
      return false;
    }
    // Keep only active events
    return event.remainingTurns > 0;
  });
}

export function triggerEventChain(state: GameState): GameState | null {
  const chains = Object.values(EVENT_CHAINS);

  for (const chain of chains) {
    if (Math.random() < chain.triggerChance && state.turns > 0) {
      // Trigger the event chain
      let result = { ...state };

      for (const chainEvent of chain.events) {
        const eventTemplate = MARKET_EVENTS.find(
          (e) => e.id === chainEvent.eventId
        );
        if (eventTemplate) {
          const newEvent: MarketEvent = {
            ...eventTemplate,
            remainingTurns: chainEvent.weight * chain.duration,
          };
          result.events.push(newEvent);
          result.history.push({
            type: 'event',
            message: `📢 ${newEvent.description}`,
            turn: result.turns,
          });
        }
      }

      return result;
    }
  }

  return null;
}

export function getRandomDailyEvent(season: Season): MarketEvent | undefined {
  const dailyEvents = MARKET_EVENTS.filter((e) => e.isDaily);
  const activeSeasonalEvents = dailyEvents.filter((e) => e.isSeasonal && e.season === season);

  const pool = [...activeSeasonalEvents, ...dailyEvents];
  if (pool.length === 0) return undefined;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomRareEvent(season: Season): MarketEvent | undefined {
  const rareEvents = MARKET_EVENTS.filter((e) => e.isRare);
  const activeSeasonalRareEvents = rareEvents.filter((e) => e.isSeasonal && e.season === season);

  const pool = [...activeSeasonalRareEvents, ...rareEvents];
  if (pool.length === 0) return undefined;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getEventEffectMultiplier(
  event: MarketEvent,
  affectedGood?: string
): number {
  if (event.affectedGood === 'all') {
    return event.priceMultiplier;
  }

  if (event.affectedGood === 'random') {
    // Randomly select a good
    const goodKeys = GOODS.map((g) => g.id);
    const randomGood = goodKeys[Math.floor(Math.random() * goodKeys.length)];
    if (randomGood === affectedGood) {
      return event.priceMultiplier;
    }
    return 1;
  }

  if (event.affectedGood === affectedGood) {
    return event.priceMultiplier;
  }

  return 1;
}

export function filterEventsByCategory(
  events: MarketEvent[],
  category: string
): MarketEvent[] {
  return events.filter((e) => {
    const good = GOODS.find((g) => g.id === e.affectedGood);
    return good && good.category === category;
  });
}

// Volatility Meter
export function calculateMarketVolatility(events: MarketEvent[]): number {
  const totalVolatility = events.reduce((sum, event) => {
    if (event.affectedGood === 'all' || event.affectedGood === 'random') {
      return sum + Math.abs(event.priceMultiplier - 1);
    }
    return sum;
  }, 0);

  // Normalize to 0-100 scale
  return Math.min(100, Math.round((totalVolatility / 5) * 100));
}

// Inventory Organization
export function sortInventory(
  state: GameState,
  sortBy: 'value' | 'name' | 'category' = 'category'
): GameState {
  const newState = { ...state };
  const sortedEntries = Object.entries(newState.inventory).sort((a, b) => {
    const goodA = GOODS.find((g) => g.id === a[0]);
    const goodB = GOODS.find((g) => g.id === b[0]);

    if (!goodA || !goodB) return 0;

    switch (sortBy) {
      case 'value':
        const priceA = calculatePrice(goodA, getLocationById(state.currentLocation), state.events, state.season, state.weather);
        const priceB = calculatePrice(goodB, getLocationById(state.currentLocation), state.events, state.season, state.weather);
        return priceB - priceA;
      case 'name':
        return goodA.name.localeCompare(goodB.name);
      case 'category':
      default:
        return goodA.category.localeCompare(goodB.category);
    }
  });

  const newInventory: Record<string, number> = {};
  sortedEntries.forEach(([key, value]) => {
    newInventory[key] = value;
  });

  newState.inventory = newInventory;
  return newState;
}

// Event Processing
export function processEvents(state: GameState): GameState {
  let newState = { ...state };

  // Trigger daily events (15% chance)
  if (Math.random() < 0.15 && newState.turns > 0) {
    const dailyEvent = getRandomDailyEvent(newState.season);
    if (dailyEvent) {
      const newEvent: MarketEvent = {
        ...dailyEvent,
        remainingTurns: dailyEvent.duration,
      };
      newState.events.push(newEvent);
      newState.history.push({
        type: 'event',
        message: `📢 ${newEvent.description}`,
        turn: newState.turns,
      });
    }
  }

  // Trigger rare events (1% chance)
  if (Math.random() < 0.01 && newState.turns > 0) {
    const rareEvent = getRandomRareEvent(newState.season);
    if (rareEvent) {
      const newEvent: MarketEvent = {
        ...rareEvent,
        remainingTurns: rareEvent.duration,
      };
      newState.events.push(newEvent);
      newState.history.push({
        type: 'event',
        message: `⚡ ${newEvent.description}`,
        turn: newState.turns,
      });
    }
  }

  // Trigger event chains (2% chance)
  const chainResult = triggerEventChain(newState);
  if (chainResult) {
    newState = chainResult;
  }

  return newState;
}

export function bundleInventoryForTravel(
  state: GameState
): Record<string, number> {
  // Group items for efficient travel (prioritize valuable goods)
  const bundle: Record<string, number> = {};

  Object.entries(state.inventory).forEach(([goodId, count]) => {
    if (count > 0) {
      const good = GOODS.find((g) => g.id === goodId);
      if (good) {
        // Prioritize: Luxury > Special > Rare > Materials > Spices > Food
        const priority = {
          luxury: 1,
          special: 2,
          rare: 3,
          materials: 4,
          spices: 5,
          food: 6,
        };
        const currentPriority = priority[good.category] || 99;

        // Only add if better priority or already in bundle
        if (!bundle[goodId] || priority[GOODS.find((g) => g.id === goodId)?.category || 'food'] <= currentPriority) {
          bundle[goodId] = (bundle[goodId] || 0) + count;
        }
      }
    }
  });

  return bundle;
}

export function markImportantItems(
  state: GameState,
  importantItems: string[]
): GameState {
  const newState = { ...state };
  newState.importantItems = importantItems;
  return newState;
}

export function filterImportantItems(
  state: GameState
): string[] {
  return state.importantItems || [];
}

export function getGoodById(id: string): Good | undefined {
  return GOODS.find((g) => g.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

export function getSeasonDisplay(season: Season): { name: string; emoji: string } {
  return SEASON_DISPLAY[season];
}

// Volatility Meter
  const volatility = calculateMarketVolatility(events);

  if (volatility < 20) return 'low';
  if (volatility < 50) return 'medium';
  return 'high';
}
