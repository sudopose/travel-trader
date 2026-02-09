'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, CheckCircle2, Lock } from 'lucide-react';
import {
  INVENTORY_UPGRADES,
  InventoryUpgrade,
  InventoryUpgradeType,
  getUpgradeCost,
  getNextUpgrade,
  getMaxUpgradeLevel,
  getUpgradeEmoji,
  canAffordUpgrade,
} from '@/lib/inventory-upgrades';

interface InventoryUpgradesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMoney: number;
  currentUpgrade?: InventoryUpgradeType;
  currentUpgradeLevel: number;
  onPurchase: (upgradeType: InventoryUpgradeType, level: number) => void;
}

export default function InventoryUpgradesPanel({
  isOpen,
  onClose,
  currentMoney,
  currentUpgrade,
  currentUpgradeLevel,
  onPurchase,
}: InventoryUpgradesPanelProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<InventoryUpgradeType | null>(null);

  const upgradeTypes: InventoryUpgradeType[] = ['cart', 'wagon', 'ship', 'flying-camel'];

  const handlePurchase = (upgradeType: InventoryUpgradeType, level: number) => {
    const cost = getUpgradeCost(upgradeType, level);

    if (cost > currentMoney) {
      alert(`Not enough money! Need ${cost} gold.`);
      return;
    }

    if (confirm(`Purchase ${INVENTORY_UPGRADES[upgradeType][level - 1].name} for ${cost} gold?`)) {
      onPurchase(upgradeType, level);
    }
  };

  const getUpgradeStatus = (upgradeType: InventoryUpgradeType) => {
    if (upgradeType === 'flying-camel') {
      return { status: 'locked' as const, message: 'Unlock via achievement' };
    }

    const maxLevel = getMaxUpgradeLevel(upgradeType);
    const isOwned = currentUpgrade === upgradeType;
    const currentLevel = isOwned ? currentUpgradeLevel : 0;

    if (currentLevel >= maxLevel) {
      return { status: 'maxed' as const, message: 'Fully upgraded' };
    }

    const nextLevel = currentLevel + 1;
    const nextUpgrade = getNextUpgrade(upgradeType, currentLevel);
    const canAfford = nextUpgrade ? canAffordUpgrade(upgradeType, nextLevel, currentMoney) : false;

    if (canAfford) {
      return { status: 'available' as const, message: `Upgrade to level ${nextLevel}` };
    } else {
      return {
        status: 'expensive' as const,
        message: `Need ${nextUpgrade?.cost || 0} gold`,
      };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 border-l border-slate-800 overflow-y-auto z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800 p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🛒</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Inventory Upgrades</h2>
                    <p className="text-xs text-slate-400">Increase your carrying capacity</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Current Upgrade Display */}
              {currentUpgrade && (
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getUpgradeEmoji(currentUpgrade)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">
                          {INVENTORY_UPGRADES[currentUpgrade][currentUpgradeLevel - 1].name}
                        </h3>
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Level {currentUpgradeLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {INVENTORY_UPGRADES[currentUpgrade][currentUpgradeLevel - 1].perk || 'Currently equipped'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Available Upgrades</h3>
              <div className="space-y-3">
                {upgradeTypes.map((upgradeType, idx) => {
                  const upgrade = INVENTORY_UPGRADES[upgradeType][0];
                  const nextUpgrade = getNextUpgrade(upgradeType, currentUpgrade === upgradeType ? currentUpgradeLevel : 0);
                  const status = getUpgradeStatus(upgradeType);

                  return (
                    <motion.div
                      key={upgradeType}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border ${
                        currentUpgrade === upgradeType
                          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{getUpgradeEmoji(upgradeType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-white">{upgrade.name}</h4>
                            {status.status === 'maxed' && (
                              <CheckCircle2 className="text-green-400" size={20} />
                            )}
                            {status.status === 'locked' && (
                              <Lock className="text-red-400" size={20} />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{upgrade.description}</p>

                          {/* Stats */}
                          <div className="flex items-center gap-3 text-xs mb-2">
                            <span className="text-green-400">📦 +{upgrade.slots - 20} slots</span>
                            {upgrade.travelCostMultiplier < 1.0 ? (
                              <span className="text-blue-400">🚀 -{Math.round((1 - upgrade.travelCostMultiplier) * 100)}% travel</span>
                            ) : upgrade.travelCostMultiplier > 1.0 ? (
                              <span className="text-orange-400">🐢 +{Math.round((upgrade.travelCostMultiplier - 1) * 100)}% travel</span>
                            ) : (
                              <span className="text-blue-400">🚀 No travel penalty</span>
                            )}
                          </div>

                          {/* Upgrade Levels */}
                          {status.status !== 'locked' && (
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 3 }).map((_, level) => (
                                <div
                                  key={level}
                                  className={`h-2 w-full rounded-full ${
                                    level < (currentUpgrade === upgradeType ? currentUpgradeLevel : 0)
                                      ? 'bg-blue-600'
                                      : 'bg-slate-800'
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Purchase Button */}
                          {status.status === 'available' && nextUpgrade && (
                            <button
                              onClick={() => handlePurchase(upgradeType, nextUpgrade.level)}
                              disabled={!canAffordUpgrade(upgradeType, nextUpgrade.level, currentMoney)}
                              className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                                canAffordUpgrade(upgradeType, nextUpgrade.level, currentMoney)
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart size={16} />
                              Upgrade to Level {nextUpgrade.level} ({nextUpgrade.cost} gold)
                            </button>
                          )}

                          {status.status === 'expensive' && (
                            <div className="text-center text-sm text-orange-400">
                              <span>{status.message}</span>
                            </div>
                          )}

                          {status.status === 'locked' && (
                            <div className="text-center text-sm text-red-400">
                              <span>{status.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
