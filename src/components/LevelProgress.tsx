'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { getLevelData, getLevelProgress, Level } from '@/lib/progression';

interface LevelProgressProps {
  level: Level;
  xp: number;
  xpToNext: number;
  showDetails?: boolean;
}

export default function LevelProgress({ level, xp, xpToNext, showDetails = false }: LevelProgressProps) {
  const levelData = getLevelData(level);
  const progress = getLevelProgress(xp, level);
  const nextLevelData = getLevelData(Math.min(level + 1, 10) as Level);

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      {/* Level Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{levelData.emoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Level</span>
              <span className="text-2xl font-bold text-white">{level}</span>
            </div>
            <div className="text-sm text-slate-400 font-medium">{levelData.title}</div>
          </div>
        </div>
        {level < 10 && (
          <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full">
            <TrendingUp className="text-blue-400" size={16} />
            <span className="text-sm text-blue-400 font-semibold">
              {xpToNext} XP to next
            </span>
          </div>
        )}
      </div>

      {/* XP Bar */}
      {level < 10 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{xp} XP</span>
            <span>{nextLevelData.xpRequired} XP</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            />
          </div>
          <div className="text-center text-xs text-slate-400 mt-1">
            {progress}% complete
          </div>
        </div>
      )}

      {/* Level Info (if showDetails) */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 pt-3 border-t border-slate-800"
        >
          <p className="text-sm text-slate-300 mb-2">{levelData.description}</p>
          {levelData.unlocks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {levelData.unlocks.map((unlock, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full"
                >
                  {unlock}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Max Level Badge */}
      {level === 10 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mt-3 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-900/50 px-4 py-2 rounded-full border border-yellow-700/50">
            <Star className="text-yellow-400" size={18} />
            <span className="text-yellow-400 font-bold">MAX LEVEL!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
