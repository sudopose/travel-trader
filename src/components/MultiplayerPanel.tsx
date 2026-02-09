'use client';

import { motion } from 'framer-motion';
import { X, Users, Shield, Compass, Briefcase, Play, RotateCcw, Trophy } from 'lucide-react';
import {
  MultiplayerState,
  Role,
  ROLE_DESCRIPTIONS,
  TEAM_GOALS_TEMPLATES,
  AVATARS,
} from '@/lib/multiplayer-data';

interface MultiplayerPanelProps {
  multiplayerState: MultiplayerState;
  onClose: () => void;
  onSwitchMode: (mode: 'single' | 'split' | 'hotseat') => void;
  onAddPlayer: (name: string, role: Role) => void;
  onAssignRole: (playerId: string, role: Role) => void;
  onAdvanceHotseat: () => void;
  onAddGoal: (goalTemplateId: string) => void;
  onStartSplitScreen: () => void;
}

export default function MultiplayerPanel({
  multiplayerState,
  onClose,
  onSwitchMode,
  onAddPlayer,
  onAssignRole,
  onAdvanceHotseat,
  onAddGoal,
  onStartSplitScreen,
}: MultiplayerPanelProps) {
  const currentMode = multiplayerState.mode;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-blue-400" />
            Multiplayer Setup
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
              Game Mode
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onSwitchMode('single')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentMode === 'single'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-2">👤</div>
                <div className="text-white font-semibold text-sm">Single Player</div>
              </button>

              <button
                onClick={() => onSwitchMode('split')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentMode === 'split'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="text-white font-semibold text-sm">Split Screen</div>
                <div className="text-xs text-slate-400 mt-1">Play together</div>
              </button>

              <button
                onClick={() => onSwitchMode('hotseat')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentMode === 'hotseat'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-white font-semibold text-sm">Hot Seat</div>
                <div className="text-xs text-slate-400 mt-1">Take turns</div>
              </button>
            </div>
          </div>

          {/* Players Section */}
          {currentMode !== 'single' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide flex justify-between items-center">
                Players ({multiplayerState.players.length}/4)
              </h3>

              <div className="space-y-3">
                {multiplayerState.players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`bg-slate-800/50 rounded-xl p-3 border ${
                      currentMode === 'hotseat' && index === multiplayerState.currentPlayerIndex
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            {player.isHost && <Shield size={12} className="text-blue-400" />}
                            {ROLE_DESCRIPTIONS[player.role].name}
                          </div>
                        </div>
                      </div>

                      <select
                        value={player.role}
                        onChange={(e) => onAssignRole(player.id, e.target.value as Role)}
                        className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="trader">🤝 Trader</option>
                        <option value="navigator">🧭 Navigator</option>
                        <option value="merchant">💰 Merchant</option>
                        <option value="free">🎭 Free Agent</option>
                      </select>
                    </div>
                  </div>
                ))}

                {multiplayerState.players.length < 4 && (
                  <button
                    onClick={() => {
                      const name = prompt('Enter player name:');
                      if (name) {
                        const role = prompt(
                          'Choose role (trader/navigator/merchant):',
                          'trader'
                        ) as Role;
                        if (role && ['trader', 'navigator', 'merchant'].includes(role)) {
                          onAddPlayer(name, role);
                        }
                      }
                    }}
                    className="w-full py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-all"
                  >
                    + Add Player
                  </button>
                )}
              </div>

              {/* Hot Seat Controls */}
              {currentMode === 'hotseat' && (
                <button
                  onClick={onAdvanceHotseat}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  Next Turn: {multiplayerState.players[multiplayerState.currentPlayerIndex]?.name}
                </button>
              )}
            </div>
          )}

          {/* Team Goals */}
          {currentMode !== 'single' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide flex justify-between items-center">
                Team Goals
                <span className="text-xs text-slate-500">{multiplayerState.teamGoals.length}/3</span>
              </h3>

              <div className="space-y-2">
                {multiplayerState.teamGoals.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm">
                    Select team goals below
                  </div>
                ) : (
                  multiplayerState.teamGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`bg-slate-800/50 rounded-xl p-3 border ${
                        goal.completed ? 'border-green-500 bg-green-500/10' : 'border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            {goal.completed && <Trophy size={16} className="text-green-400" />}
                            {goal.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{goal.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{goal.current}/{goal.target}</div>
                          <div className="text-xs text-green-400">+{goal.reward}🪙</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            goal.completed ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {multiplayerState.teamGoals.length < 3 && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="text-xs text-slate-500 mb-2">Add a goal:</div>
                  {TEAM_GOALS_TEMPLATES
                    .filter(template => !multiplayerState.teamGoals.find(g => g.id === template.id))
                    .slice(0, 2)
                    .map(template => (
                      <button
                        key={template.id}
                        onClick={() => onAddGoal(template.id)}
                        className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg text-left transition-colors flex items-center justify-between"
                      >
                        <span>{template.title}</span>
                        <span className="text-xs text-slate-400">+{template.reward}🪙</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Start Button */}
          {currentMode !== 'single' && (
            <button
              onClick={onStartSplitScreen}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Play size={20} />
              Start Game
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
