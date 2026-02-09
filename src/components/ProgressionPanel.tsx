'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, TrendingUp, Crown, X } from 'lucide-react';
import LevelProgress from '@/components/LevelProgress';
import PerksPanel from '@/components/PerksPanel';
import AchievementsPanel from '@/components/AchievementsPanel';
import { Level, getPerksForLevel, PlayerProgression } from '@/lib/progression';

type ProgressionTab = 'overview' | 'perks' | 'achievements';

interface ProgressionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  progression: PlayerProgression;
  maxTurns?: number;
  profitPerTrade: number;
}

export default function ProgressionPanel({
  isOpen,
  onClose,
  progression,
  maxTurns,
  profitPerTrade,
}: ProgressionPanelProps) {
  const [activeTab, setActiveTab] = useState<ProgressionTab>('overview');

  const availablePerks = getPerksForLevel(progression.level);

  const tabs = [
    { id: 'overview' as ProgressionTab, label: 'Overview', icon: Award },
    { id: 'perks' as ProgressionTab, label: 'Perks', icon: Crown },
    { id: 'achievements' as ProgressionTab, label: 'Achievements', icon: TrendingUp },
  ];

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
                  <div className="text-3xl">📊</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Progression</h2>
                    <p className="text-xs text-slate-400">Track your journey</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-20">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Level Progress */}
                    <LevelProgress
                      level={progression.level}
                      xp={progression.xp}
                      xpToNext={progression.xpToNext}
                      showDetails
                    />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="text-2xl mb-1">🔄</div>
                        <div className="text-lg font-bold text-white">{progression.totalTrades}</div>
                        <div className="text-xs text-slate-400">Total Trades</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="text-2xl mb-1">💰</div>
                        <div className="text-lg font-bold text-white">{progression.goldEarned}</div>
                        <div className="text-xs text-slate-400">Gold Earned</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="text-2xl mb-1">🌍</div>
                        <div className="text-lg font-bold text-white">{progression.locationsUnlocked}</div>
                        <div className="text-xs text-slate-400">Cities Visited</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="text-2xl mb-1">🏆</div>
                        <div className="text-lg font-bold text-white">{progression.achievementsUnlocked.length}</div>
                        <div className="text-xs text-slate-400">Achievements</div>
                      </div>
                    </div>

                    {/* Best Streak */}
                    {progression.bestStreak > 0 && (
                      <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-700/50">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🔥</div>
                          <div>
                            <div className="text-sm text-yellow-400">Best Streak</div>
                            <div className="text-2xl font-bold text-white">{progression.bestStreak} trades</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'perks' && (
                  <motion.div
                    key="perks"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <PerksPanel
                      unlockedPerks={progression.perksUnlocked}
                      availablePerks={availablePerks}
                    />
                  </motion.div>
                )}

                {activeTab === 'achievements' && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AchievementsPanel
                      unlockedAchievements={progression.achievementsUnlocked}
                      totalTrades={progression.totalTrades}
                      goldEarned={progression.goldEarned}
                      locationsUnlocked={progression.locationsUnlocked}
                      currentTurn={progression.totalTrades} // Using totalTrades as proxy for turns
                      maxTurns={maxTurns}
                      profitPerTrade={profitPerTrade}
                      currentLevel={progression.level}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
