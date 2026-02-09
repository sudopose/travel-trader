'use client';

import { motion } from 'framer-motion';
import { Coins, MapPin, Package } from 'lucide-react';
import { Weather, Season } from '@/lib/game-data';
import { SEASON_DISPLAY } from '@/lib/game-data';

interface GameBoardProps {
  money: number;
  location: { name: string; emoji: string };
  turns: number;
  season: Season;
  weather?: Weather;
  inventoryCount: number;
  inventorySlots: number;
}

export default function GameBoard({
  money,
  location,
  turns,
  season,
  weather,
  inventoryCount,
  inventorySlots,
}: GameBoardProps) {
  const seasonInfo = SEASON_DISPLAY[season];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-4 md:p-6 shadow-2xl border border-blue-500/30"
    >
      {/* Location and Money */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl md:text-4xl"
          >
            {location.emoji}
          </motion.div>
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs md:text-sm">
              <MapPin size={14} />
              <span>{location.name}</span>
            </div>
            <div className="text-xs md:text-sm text-blue-300">Turn {turns}</div>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="flex items-center gap-2 bg-yellow-500/20 rounded-xl px-4 py-2 border border-yellow-500/50"
        >
          <Coins className="text-yellow-400" size={20} />
          <span className="text-xl md:text-2xl font-bold text-yellow-300">{money}</span>
        </motion.div>
      </div>

      {/* Season, Weather, Inventory */}
      <div className="grid grid-cols-3 gap-2">
        {/* Season */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 flex items-center gap-2 justify-center"
        >
          <span className="text-lg">{seasonInfo.emoji}</span>
          <span className="text-xs text-slate-300 font-semibold">{seasonInfo.name}</span>
        </motion.div>

        {/* Weather */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={`rounded-lg p-2 border flex items-center gap-2 justify-center ${
            weather
              ? 'bg-orange-900/30 border-orange-500/50'
              : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <span className="text-lg">{weather ? weather.emoji : '☀️'}</span>
          <span className="text-xs text-slate-300 font-semibold">
            {weather ? weather.name : 'Clear'}
          </span>
        </motion.div>

        {/* Inventory */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 flex items-center gap-2 justify-center"
        >
          <Package className="text-blue-400" size={16} />
          <span className="text-xs text-slate-300 font-semibold">
            {inventoryCount}/{inventorySlots}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
