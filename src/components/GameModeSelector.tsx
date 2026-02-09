'use client';

import { motion } from 'framer-motion';
import { Trophy, Timer, Zap, Flame, Puzzle, Play } from 'lucide-react';
import { GameMode, GameModeConfig, GAME_MODES } from '@/lib/game-modes';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  selectedMode?: GameMode;
}

export default function GameModeSelector({ onSelectMode, selectedMode }: GameModeSelectorProps) {
  const modes = Object.values(GAME_MODES) as GameModeConfig[];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'hard':
        return 'text-orange-400 bg-orange-500/20';
      case 'extreme':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Mode</h2>
        <p className="text-slate-400">Select a game mode to start your trading adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode, index) => {
          const isSelected = selectedMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(mode.id)}
              className={`
                relative bg-slate-800/50 rounded-2xl p-6 border-2 text-left transition-all
                ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}
              `}
            >
              {/* Icon & Name */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{mode.emoji}</div>
                {isSelected && (
                  <div className="bg-blue-500 rounded-full p-1">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Mode Name */}
              <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-4">{mode.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">💰</span>
                  <span className="text-slate-300">{mode.startingMoney} gold start</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(mode.difficulty)}`}>
                    {mode.difficulty.toUpperCase()}
                  </span>
                </div>
                {mode.maxTurns && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">🔄</span>
                      <span className="text-slate-300">{mode.maxTurns} turns max</span>
                    </div>
                    {mode.startingInventory && Object.keys(mode.startingInventory).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">📦</span>
                        <span className="text-slate-300">{Object.values(mode.startingInventory).reduce((a, b) => a + b, 0)} items</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Win/Lose Conditions */}
              {(mode.winCondition || mode.loseCondition) && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                  {mode.winCondition && (
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-slate-400">{mode.winCondition}</span>
                    </div>
                  )}
                  {mode.loseCondition && (
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-red-400 mt-0.5">✗</span>
                      <span className="text-slate-400">{mode.loseCondition}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Difficulty Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(mode.difficulty)}`}>
                {mode.difficulty}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Start Button */}
      {selectedMode && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode(selectedMode)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all"
        >
          Start {GAME_MODES[selectedMode].name}!
        </motion.button>
      )}
    </div>
  );
}
