// Inventory Upgrades System
export type InventoryUpgradeType = 'cart' | 'wagon' | 'ship' | 'flying-camel';

export interface InventoryUpgrade {
  id: InventoryUpgradeType;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  slots: number;
  travelCostMultiplier: number;
  perk?: string; // Special ability
  level: number; // Upgrade level (1-3)
}

export interface InventoryState {
  baseSlots: number;
  currentSlots: number;
  upgrade?: InventoryUpgradeType;
  upgradeLevel: number;
}

export const INVENTORY_UPGRADES: Record<InventoryUpgradeType, InventoryUpgrade[]> = {
  cart: [
    {
      id: 'cart',
      name: 'Merchant Cart',
      emoji: '🛒',
      description: 'Basic cart for more storage',
      cost: 200,
      slots: 40,
      travelCostMultiplier: 1.5,
      level: 1,
    },
    {
      id: 'cart',
      name: 'Improved Cart',
      emoji: '🛒',
      description: 'Upgraded cart with better wheels',
      cost: 400,
      slots: 50,
      travelCostMultiplier: 1.4,
      level: 2,
    },
    {
      id: 'cart',
      name: 'Master Cart',
      emoji: '🛒',
      description: 'Premium cart for maximum efficiency',
      cost: 800,
      slots: 60,
      travelCostMultiplier: 1.3,
      level: 3,
    },
  ],
  wagon: [
    {
      id: 'wagon',
      name: 'Trade Wagon',
      emoji: '🚜',
      description: 'Large wagon for bulk trading',
      cost: 500,
      slots: 60,
      travelCostMultiplier: 1.8,
      level: 1,
    },
    {
      id: 'wagon',
      name: 'Heavy Wagon',
      emoji: '🚜',
      description: 'Reinforced wagon for heavy loads',
      cost: 1000,
      slots: 75,
      travelCostMultiplier: 1.6,
      level: 2,
    },
    {
      id: 'wagon',
      name: 'Luxury Wagon',
      emoji: '🚜',
      description: 'Master-class wagon with premium features',
      cost: 2000,
      slots: 90,
      travelCostMultiplier: 1.4,
      level: 3,
    },
  ],
  ship: [
    {
      id: 'ship',
      name: 'Merchant Ship',
      emoji: '⛵',
      description: 'Ship for ocean trading routes',
      cost: 1500,
      slots: 100,
      travelCostMultiplier: 1.0,
      level: 1,
      perk: 'No extra travel cost',
    },
    {
      id: 'ship',
      name: 'Trade Ship',
      emoji: '🚢',
      description: 'Large ship for bulk ocean trade',
      cost: 3000,
      slots: 120,
      travelCostMultiplier: 1.0,
      level: 2,
      perk: 'No extra travel cost + faster travel',
    },
    {
      id: 'ship',
      name: 'Flagship',
      emoji: '🚢',
      description: 'Ultimate ocean trading vessel',
      cost: 5000,
      slots: 150,
      travelCostMultiplier: 0.8,
      level: 3,
      perk: 'No travel cost + fastest speed',
    },
  ],
  'flying-camel': [
    {
      id: 'flying-camel',
      name: 'Flying Camel',
      emoji: '🐪',
      description: 'Mythical mount (unlock via achievement)',
      cost: 0,
      slots: 200,
      travelCostMultiplier: 0.5,
      level: 1,
      perk: 'Instant travel + unlimited storage',
    },
  ],
};

export function getUpgradeSlots(upgradeType: InventoryUpgradeType, level: number): number {
  const upgrades = INVENTORY_UPGRADES[upgradeType];
  const upgrade = upgrades.find(u => u.level === level);

  return upgrade?.slots || 20; // Default base slots
}

export function getTravelCostModifier(upgradeType?: InventoryUpgradeType): number {
  if (!upgradeType) return 1.0;

  const upgrades = INVENTORY_UPGRADES[upgradeType];
  const highestLevel = upgrades[upgrades.length - 1];

  return highestLevel?.travelCostMultiplier || 1.0;
}

export function getNextUpgrade(upgradeType: InventoryUpgradeType, currentLevel: number): InventoryUpgrade | null {
  const upgrades = INVENTORY_UPGRADES[upgradeType];
  return upgrades.find(u => u.level === currentLevel + 1) || null;
}

export function getMaxUpgradeLevel(upgradeType: InventoryUpgradeType): number {
  return INVENTORY_UPGRADES[upgradeType].length;
}

export function getUpgradeCost(upgradeType: InventoryUpgradeType, level: number): number {
  const upgrades = INVENTORY_UPGRADES[upgradeType];
  const upgrade = upgrades.find(u => u.level === level);

  return upgrade?.cost || 0;
}

export function canAffordUpgrade(upgradeType: InventoryUpgradeType, level: number, money: number): boolean {
  return getUpgradeCost(upgradeType, level) <= money;
}

export function createInventoryState(): InventoryState {
  return {
    baseSlots: 20,
    currentSlots: 20,
    upgrade: undefined,
    upgradeLevel: 0,
  };
}

export function calculateTotalSlots(baseSlots: number, upgrades: number): number {
  return baseSlots + (upgrades * 5); // Each upgrade adds 5 slots
}

export function getUpgradeEmoji(upgradeType: InventoryUpgradeType): string {
  const emojis: Record<InventoryUpgradeType, string> = {
    cart: '🛒',
    wagon: '🚜',
    ship: '⛵',
    'flying-camel': '🐪',
  };
  return emojis[upgradeType];
}
