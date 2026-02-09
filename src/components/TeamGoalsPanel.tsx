'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Zap } from 'lucide-react';
import { TeamGoal } from '@/lib/multiplayer-data';

interface TeamGoalsPanelProps {
  goals: TeamGoal[];
  onGoalRewardClaimed?: (goalId: string) => void;
}

export default function TeamGoalsPanel({ goals, onGoalRewardClaimed }: TeamGoalsPanelProps) {
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="space-y-4">
      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Target size={16} className="text-blue-400" />
            Active Goals
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {activeGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-slate-800/50 rounded-xl p-3 border border-slate-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white font-medium">{goal.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{goal.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">{goal.current}/{goal.target}</div>
                      <div className="text-xs text-green-400">+{goal.reward}🪙</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" />
            Completed ({completedGoals.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {completedGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-900/20 rounded-xl p-3 border border-green-700/50"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Trophy size={20} className="text-green-400" />
                      <div>
                        <div className="text-white font-medium">{goal.title}</div>
                        <div className="text-xs text-green-400 mt-1">+{goal.reward}🪙 claimed</div>
                      </div>
                    </div>
                    <Zap size={20} className="text-yellow-400" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* No Goals */}
      {goals.length === 0 && (
        <div className="text-center py-8">
          <Target className="mx-auto text-slate-600 text-4xl mb-4" />
          <p className="text-slate-500">No team goals yet</p>
          <p className="text-slate-600 text-sm mt-1">Set goals from multiplayer menu</p>
        </div>
      )}
    </div>
  );
}
