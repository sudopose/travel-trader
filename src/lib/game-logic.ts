import {
  GameState,
  Good,
  Location,
  MarketEvent,
  GOODS,
  LOCATIONS,
  MARKET_EVENTS,
  INITIAL_MONEY,
} from './game-data';

export function getInitialGameState(): GameState {
  return {
    money: INITIAL_MONEY,
    inventory: {},
    currentLocation: 'istanbul',
    unlockedLocations: ['istanbul'],
    turns: 0,
    events: [],
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
  events: MarketEvent[]
): number {
  const locationGood = location.goods.find((g) => g.goodId === good.id);
  const multiplier = locationGood ? locationGood.baseMultiplier : 1;

  let eventMultiplier = 1;
  for (const event of events) {
    if (event.affectedGood === 'all' || event.affectedGood === good.id || event.affectedGood === good.category) {
      eventMultiplier *= event.priceMultiplier;
    }
  }

  // Add some randomness
  const randomFactor = 1 + (Math.random() - 0.5) * good.volatility * 0.3;

  return Math.round(good.basePrice * multiplier * eventMultiplier * randomFactor);
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

  const price = calculatePrice(good, location, state.events);
  const totalCost = price * quantity;

  if (totalCost > state.money) {
    return { error: `Not enough money! You need ${totalCost}, have ${state.money}` };
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

  if ((state.inventory[goodId] || 0) < quantity) {
    return { error: `Not enough ${good.name}! You have ${state.inventory[goodId] || 0}` };
  }

  const price = calculatePrice(good, location, state.events);
  const totalRevenue = price * quantity;

  const newState = { ...state };
  newState.money += totalRevenue;
  newState.inventory[goodId] = Math.max(0, newState.inventory[goodId]! - quantity);
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

  const travelCost = targetLocation.travelCost;
  if (travelCost > state.money) {
    return { error: `Not enough money to travel! Need ${travelCost}🪙` };
  }

  const newState = { ...state };
  newState.money -= travelCost;
  newState.currentLocation = locationId;
  newState.turns += 1;

  // Process events
  newState.events = newState.events
    .map((e) => ({ ...e, remainingTurns: e.remainingTurns - 1 }))
    .filter((e) => e.remainingTurns > 0);

  // Maybe trigger a new event
  if (Math.random() < 0.25 && newState.turns > 0) {
    const newEventTemplate = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
    const newEvent: MarketEvent = {
      ...newEventTemplate,
      remainingTurns: newEventTemplate.duration,
    };
    newState.events.push(newEvent);
    newState.history.push({
      type: 'event',
      message: `📢 ${newEvent.description}`,
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
    return { error: `Need ${location.unlockCost}🪙 to unlock ${location.name}` };
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

export function getGoodById(id: string): Good | undefined {
  return GOODS.find((g) => g.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
