'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, RotateCcw, Home, Star } from 'lucide-react';
import { GameModeState, GameMode } from '@/lib/game-modes';

interface GameOverOverlayProps {
  gameModeState: GameModeState;
  score?: number;
  onRestart: () => void;
  onHome: () => void;
}

export default function GameOverOverlay({ gameModeState, score, onRestart, onHome }: GameOverOverlayProps) {
  const isWin = gameModeState.gameResult === 'win';
  const isLose = gameModeState.gameResult === 'lose';

  return (
    <AnimatePresence>
      {(isWin || isLose) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`max-w-md w-full rounded-2xl p-8 border-2 ${
              isWin ? 'bg-gradient-to-br from-yellow-900/90 to-amber-900/90 border-yellow-500' : 'bg-slate-900 border-slate-700'
            }`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {isWin ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-8xl"
                >
                  🏆
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-8xl"
                >
                  💀
                </motion.div>
              )}
            </div>

            {/* Title */}
            <h1 className={`text-4xl font-bold text-center mb-3 ${
              isWin ? 'text-yellow-300' : 'text-slate-300'
            }`}>
              {isWin ? 'Victory!' : 'Game Over'}
            </h1>

            {/* Message */}
            <p className="text-slate-300 text-center mb-6 text-lg">
              {isWin
                ? `You completed ${gameModeState.config.name}!`
                : 'Better luck next time...'}
            </p>

            {/* Score */}
            {score !== undefined && (
              <div className="bg-black/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Star className="text-yellow-400" size={24} />
                  <div>
                    <div className="text-sm text-slate-400">Final Score</div>
                    <div className="text-3xl font-bold text-white">{score}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-3 mb-8">
              {gameModeState.turnsRemaining !== undefined && (
                <div className="flex justify-between text-slate-400">
                  <span>Turns Remaining:</span>
                  <span className="text-white font-semibold">{gameModeState.turnsRemaining}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Mode:</span>
                <span className="text-white font-semibold">{gameModeState.config.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Difficulty:</span>
                <span className={`font-semibold ${
                  gameModeState.config.difficulty === 'easy' ? 'text-green-400' :
                  gameModeState.config.difficulty === 'medium' ? 'text-yellow-400' :
                  gameModeState.config.difficulty === 'hard' ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {gameModeState.config.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRestart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw size={20} />
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onHome}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={20} />
                Main Menu
              </motion.button>
            </div>

            {/* Close button */}
            <button
              onClick={() => {}}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
