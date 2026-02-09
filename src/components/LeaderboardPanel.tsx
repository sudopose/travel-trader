'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Target, Award, X, Filter } from 'lucide-react';
import {
  LeaderboardEntry,
  getLeaderboard,
  getTopEntries,
  getMedal,
  formatScore,
  getModeDisplayName,
  getStats,
  LeaderboardStats,
} from '@/lib/leaderboards';

type FilterMode = 'all' | 'career' | 'speedrun' | 'survival' | 'puzzle' | 'sandbox';

interface LeaderboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardPanel({ isOpen, onClose }: LeaderboardPanelProps) {
  const [filter, setFilter] = useState<FilterMode>('all');
  const stats = getStats();
  const leaderboard = getTopEntries(50);
  const filteredLeaderboard = filter === 'all' ? leaderboard : leaderboard.filter(e => e.gameMode === filter);

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
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Leaderboards</h2>
                    <p className="text-xs text-slate-400">Top players & stats</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all' as const, label: 'All' },
                  { id: 'career' as const, label: 'Career' },
                  { id: 'speedrun' as const, label: 'Speed Run' },
                  { id: 'survival' as const, label: 'Survival' },
                  { id: 'puzzle' as const, label: 'Puzzle' },
                  { id: 'sandbox' as const, label: 'Sandbox' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setFilter(mode.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === mode.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Stats Overview */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Your Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
                    <div className="text-xs text-slate-400">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{formatScore(stats.bestScore)}</div>
                    <div className="text-xs text-slate-400">Best Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.totalGoldEarned.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Total Gold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.totalAchievements}</div>
                    <div className="text-xs text-slate-400">Achievements</div>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                <Trophy size={16} />
                Top Scores ({filteredLeaderboard.length})
              </h3>
              <div className="space-y-2">
                {filteredLeaderboard.length === 0 ? (
                  <div className="bg-slate-900/50 rounded-xl p-8 text-center">
                    <Trophy className="text-slate-600 mx-auto mb-2" size={48} />
                    <p className="text-slate-400 text-sm">No entries yet</p>
                    <p className="text-slate-500 text-xs mt-1">Play a game to appear on the leaderboard!</p>
                  </div>
                ) : (
                  filteredLeaderboard.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-3 rounded-lg border ${
                        idx < 3
                          ? 'bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-yellow-700/50'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank */}
                        <div className="w-8 text-center">
                          {idx < 3 ? (
                            <span className="text-2xl">{getMedal(idx + 1)}</span>
                          ) : (
                            <span className="text-lg font-bold text-slate-400">#{idx + 1}</span>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{entry.playerName}</h4>
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                              {getModeDisplayName(entry.gameMode)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span>💰 {entry.gold} gold</span>
                            <span>📊 Level {entry.level}</span>
                            <span>🏆 {entry.achievements} achievements</span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-yellow-400">{formatScore(entry.score)}</div>
                          <div className="text-xs text-slate-500">{entry.turns} turns</div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
