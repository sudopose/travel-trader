'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { GameMode, GameModeConfig, GAME_MODES } from '@/lib/game-modes';

interface StartScreenProps {
  show: boolean;
  onSelectMode: (mode: GameMode) => void;
}

export default function StartScreen({ show, onSelectMode }: StartScreenProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 z-50 flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full">
            {/* Title */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center mb-12"
            >
              <div className="text-6xl mb-4">🌍✈️</div>
              <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Travel Trader
              </h1>
              <p className="text-xl text-slate-400">
                Build your fortune across the world
              </p>
            </motion.div>

            {/* Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.values(GAME_MODES).map((mode, index) => (
                <motion.button
                  key={mode.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectMode(mode.id)}
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group text-left"
                >
                  {/* Emoji */}
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {mode.emoji}
                  </div>

                  {/* Mode Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {mode.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 mb-4">
                    {mode.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>💰</span>
                      {mode.startingMoney} gold
                    </span>
                    {mode.maxTurns && (
                      <span className="flex items-center gap-1">
                        <span>🔄</span>
                        {mode.maxTurns} turns
                      </span>
                    )}
                  </div>

                  {/* Difficulty Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    mode.difficulty === 'easy' ? 'bg-green-500/30 text-green-400' :
                    mode.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-400' :
                    mode.difficulty === 'hard' ? 'bg-orange-500/30 text-orange-400' :
                    'bg-red-500/30 text-red-400'
                  }`}>
                    {mode.difficulty.toUpperCase()}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20 rounded-b-2xl flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Play size={18} />
                      <span>Play</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer Info */}
            <div className="text-center text-slate-500 text-sm">
              <p>🎮 Travel Trader v2.0 - Multiplayer Co-op Edition</p>
              <p className="mt-1">Build your fortune, unlock cities, become a trading tycoon</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
