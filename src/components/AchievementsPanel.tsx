'use client';

import { motion } from 'framer-motion';
import { Trophy, Lock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Achievement, AchievementCategory, ACHIEVEMENTS } from '@/lib/progression';

interface AchievementsPanelProps {
  unlockedAchievements: string[];
  totalTrades: number;
  goldEarned: number;
  locationsUnlocked: number;
  currentTurn: number;
  maxTurns?: number;
  profitPerTrade: number;
  currentLevel: number;
}

export default function AchievementsPanel({
  unlockedAchievements,
  totalTrades,
  goldEarned,
  locationsUnlocked,
  currentTurn,
  maxTurns,
  profitPerTrade,
  currentLevel,
}: AchievementsPanelProps) {
  const categoryIcons: Record<AchievementCategory, string> = {
    trading: '🔄',
    travel: '🌍',
    wealth: '💰',
    milestone: '🏆',
    special: '⭐',
  };

  const categoryColors: Record<AchievementCategory, string> = {
    trading: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
    travel: 'bg-green-900/30 text-green-400 border-green-700/50',
    wealth: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
    milestone: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
    special: 'bg-pink-900/30 text-pink-400 border-pink-700/50',
  };

  const isUnlocked = (achievementId: string) => unlockedAchievements.includes(achievementId);

  const checkProgress = (achievement: Achievement): number => {
    if (isUnlocked(achievement.id)) return 100;

    const { type, value, description } = achievement.requirement;

    switch (type) {
      case 'total_trades':
        return Math.min((totalTrades / value) * 100, 99);
      case 'gold_earned':
        return Math.min((goldEarned / value) * 100, 99);
      case 'locations_unlocked':
        return Math.min((locationsUnlocked / value) * 100, 99);
      case 'profit_per_trade':
        return Math.min((profitPerTrade / value) * 100, 99);
      case 'special':
        if (description === 'Reach level 5 in under 30 turns') {
          if (maxTurns && currentTurn <= 30 && currentLevel >= 5) return 100;
          return Math.min((currentLevel / 5) * 100, 99);
        }
        if (description === 'Reach level 5') {
          return Math.min((currentLevel / 5) * 100, 99);
        }
        if (description === 'Reach level 10') {
          return Math.min((currentLevel / 10) * 100, 99);
        }
        return 0;
      default:
        return 0;
    }
  };

  const groupedAchievements = ACHIEVEMENTS.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<AchievementCategory, Achievement[]>);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercent = Math.floor((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className={`p-4 rounded-xl border ${categoryColors.milestone} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            <div>
              <h3 className="text-xl font-bold text-white">
                {unlockedCount} / {totalCount}
              </h3>
              <p className="text-sm text-slate-400">Achievements Unlocked</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{completionPercent}%</div>
            <p className="text-xs text-slate-400">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full"
          />
        </div>
      </div>

      {/* Recent Unlocks */}
      {unlockedCount > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-400 mb-2">🎉 Recent Unlocks</h4>
          <div className="grid grid-cols-1 gap-2">
            {ACHIEVEMENTS
              .filter(a => isUnlocked(a.id))
              .slice(-3)
              .reverse()
              .map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-3 rounded-lg border ${categoryColors[achievement.category]} backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{achievement.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-white">{achievement.title}</h5>
                        <CheckCircle2 className="text-green-400" size={14} />
                      </div>
                      <p className="text-xs text-slate-400">+{achievement.xpReward} XP</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* All Achievements by Category */}
      {Object.entries(groupedAchievements).map(([category, achievements]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-slate-400 mb-2 capitalize flex items-center gap-2">
            {categoryIcons[category as AchievementCategory]} {category}
            <span className="text-xs text-slate-500">
              ({achievements.filter(a => isUnlocked(a.id)).length}/{achievements.length})
            </span>
          </h4>
          <div className="space-y-2">
            {achievements.map((achievement, idx) => {
              const progress = checkProgress(achievement);
              const unlocked = isUnlocked(achievement.id);

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    unlocked
                      ? 'bg-slate-900/50 border-slate-700'
                      : 'bg-slate-900/20 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{unlocked ? achievement.emoji : '🔒'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className={`font-medium ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                          {achievement.title}
                        </h5>
                        {unlocked && (
                          <CheckCircle2 className="text-green-400" size={14} />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{achievement.description}</p>

                      {/* Progress Bar for Incomplete Achievements */}
                      {!unlocked && progress > 0 && (
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{achievement.requirement.description}</span>
                            <span>{Math.floor(progress)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* XP Reward */}
                      <div className="mt-2 flex items-center gap-2">
                        <TrendingUp className="text-yellow-400" size={12} />
                        <span className="text-xs text-yellow-400 font-medium">
                          +{achievement.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
