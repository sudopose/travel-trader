'use client';

import { motion } from 'framer-motion';
import { Player, Role } from '@/lib/multiplayer-data';
import { GameState, Season } from '@/lib/game-data';

interface SplitScreenLayoutProps {
  gameState: GameState;
  season: Season;
  weather?: any;
  player1: Player;
  player2: Player;
  player1View: 'market' | 'travel' | 'inventory' | 'history';
  player2View: 'market' | 'travel' | 'inventory' | 'history';
  onPlayer1ChangeView: (view: 'market' | 'travel' | 'inventory' | 'history') => void;
  onPlayer2ChangeView: (view: 'market' | 'travel' | 'inventory' | 'history') => void;
}

export default function SplitScreenLayout({
  gameState,
  season,
  weather,
  player1,
  player2,
  player1View,
  player2View,
  onPlayer1ChangeView,
  onPlayer2ChangeView,
}: SplitScreenLayoutProps) {
  const RoleBadge = ({ role }: { role: Role }) => {
    const roleInfo = {
      trader: { icon: '🤝', color: 'bg-blue-500/20 text-blue-400' },
      navigator: { icon: '🧭', color: 'bg-purple-500/20 text-purple-400' },
      merchant: { icon: '💰', color: 'bg-yellow-500/20 text-yellow-400' },
      free: { icon: '🎭', color: 'bg-green-500/20 text-green-400' },
    }[role];

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${roleInfo.color} flex items-center gap-1`}>
        {roleInfo.icon}
      </span>
    );
  };

  const PlayerView = ({
    player,
    view,
    onChangeView,
  }: {
    player: Player;
    view: 'market' | 'travel' | 'inventory' | 'history';
    onChangeView: (view: 'market' | 'travel' | 'inventory' | 'history') => void;
  }) => {
    const tabs = [
      { id: 'market' as const, label: 'Market', icon: '🛒' },
      { id: 'travel' as const, label: 'Travel', icon: '✈️' },
      { id: 'inventory' as const, label: 'Inventory', icon: '📦' },
      { id: 'history' as const, label: 'History', icon: '📜' },
    ];

    return (
      <div className="flex flex-col h-full">
        {/* Player Header */}
        <div className="bg-slate-800/50 p-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{player.avatar}</span>
              <div>
                <div className="text-white font-semibold">{player.name}</div>
                <RoleBadge role={player.role} />
              </div>
            </div>
            {player.isHost && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Host</span>
            )}
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 p-2 bg-slate-900/50 border-b border-slate-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeView(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                view === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="text-center text-slate-500">
              <p className="text-sm">{view.charAt(0).toUpperCase() + view.slice(1)} View</p>
              <p className="text-xs mt-1">
                {view === 'market' && 'Trade goods at current location'}
                {view === 'travel' && 'Plan and execute travel routes'}
                {view === 'inventory' && 'Manage shared inventory'}
                {view === 'history' && 'Review game events'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] grid grid-cols-2 gap-4">
      {/* Player 1 Panel */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col"
      >
        <PlayerView player={player1} view={player1View} onChangeView={onPlayer1ChangeView} />
      </motion.div>

      {/* Player 2 Panel */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col"
      >
        <PlayerView player={player2} view={player2View} onChangeView={onPlayer2ChangeView} />
      </motion.div>
    </div>
  );
}
