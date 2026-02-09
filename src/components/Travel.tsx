'use client';

import { motion } from 'framer-motion';
import { Plane, Lock, Map, CloudSun } from 'lucide-react';
import { Location, Weather } from '@/lib/game-data';

interface TravelProps {
  currentLocation: string;
  unlockedLocations: string[];
  onTravel: (locationId: string) => void;
  onUnlock: (locationId: string) => void;
  money: number;
  weather?: Weather;
}

export default function Travel({
  currentLocation,
  unlockedLocations,
  onTravel,
  onUnlock,
  money,
  weather,
}: TravelProps) {
  // Calculate travel cost modifier from weather
  const getAdjustedCost = (baseCost: number) => {
    if (!weather) return baseCost;
    return Math.round(baseCost * weather.travelCostModifier);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2">
        <Map size={20} />
        Travel
        {weather && weather.travelCostModifier > 1 && (
          <span className="text-xs bg-orange-900/50 text-orange-300 px-2 py-1 rounded-full flex items-center gap-1">
            <CloudSun size={12} />
            Weather +{(weather.travelCostModifier - 1) * 100}%
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {[
          {
            id: 'istanbul',
            name: 'Istanbul',
            emoji: '🕌',
            cost: 0,
            unlockCost: null,
          },
          {
            id: 'mumbai',
            name: 'Mumbai',
            emoji: '🕌',
            cost: 20,
            unlockCost: null,
          },
          {
            id: 'cairo',
            name: 'Cairo',
            emoji: '🏜️',
            cost: 30,
            unlockCost: null,
          },
          {
            id: 'venice',
            name: 'Venice',
            emoji: '🚢',
            cost: 40,
            unlockCost: null,
          },
          {
            id: 'newdelhi',
            name: 'New Delhi',
            emoji: '🕌',
            cost: 55,
            unlockCost: 600,
          },
          {
            id: 'beijing',
            name: 'Beijing',
            emoji: '🏯',
            cost: 50,
            unlockCost: 500,
          },
          {
            id: 'singapore',
            name: 'Singapore',
            emoji: '🦁',
            cost: 70,
            unlockCost: 800,
          },
          {
            id: 'hongkong',
            name: 'Hong Kong',
            emoji: '🏙️',
            cost: 75,
            unlockCost: 1500,
          },
          {
            id: 'capetown',
            name: 'Cape Town',
            emoji: '🏔️',
            cost: 80,
            unlockCost: 1200,
          },
          {
            id: 'rio',
            name: 'Rio de Janeiro',
            emoji: '🎭',
            cost: 85,
            unlockCost: 900,
          },
          {
            id: 'sydney',
            name: 'Sydney',
            emoji: '🦘',
            cost: 90,
            unlockCost: 2000,
          },
          {
            id: 'moscow',
            name: 'Moscow',
            emoji: '🏰',
            cost: 95,
            unlockCost: 1100,
          },
          {
            id: 'reykjavik',
            name: 'Reykjavik',
            emoji: '🌋',
            cost: 100,
            unlockCost: 1300,
          },
          {
            id: 'newyork',
            name: 'New York',
            emoji: '🗽',
            cost: 60,
            unlockCost: 1000,
          },
        ].map((loc, index) => {
          const isUnlocked = unlockedLocations.includes(loc.id);
          const isCurrent = currentLocation === loc.id;
          const adjustedCost = getAdjustedCost(loc.cost);
          const canTravel = money >= adjustedCost && isUnlocked && !isCurrent;
          const canUnlock = loc.unlockCost && money >= loc.unlockCost && !isUnlocked;

          return (
            <motion.div
              key={loc.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-xl p-3 border transition-all ${
                isCurrent
                  ? 'bg-blue-900/50 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{loc.emoji}</span>
                  <div>
                    <div className="font-semibold text-white text-sm md:text-base">
                      {loc.name}
                    </div>
                    {isCurrent ? (
                      <div className="text-xs text-blue-300">📍 You are here</div>
                    ) : isUnlocked ? (
                      <div className="text-xs text-slate-400">
                        Cost: {adjustedCost}🪙
                        {weather && weather.travelCostModifier > 1 && adjustedCost !== loc.cost && (
                          <span className="text-orange-400 ml-1">(+{(weather.travelCostModifier - 1) * 100}%)</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        Unlock: {loc.unlockCost}🪙
                      </div>
                    )}
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-xs text-blue-300 bg-blue-900/50 px-3 py-1 rounded-full">
                    Current
                  </span>
                ) : isUnlocked ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onTravel(loc.id)}
                    disabled={!canTravel}
                    className={`text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-1 ${
                      canTravel
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Plane size={14} />
                    Travel
                  </motion.button>
                ) : canUnlock ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUnlock(loc.id)}
                    className="text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Lock size={14} />
                    Unlock
                  </motion.button>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
                    <Lock size={14} />
                    Locked
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
