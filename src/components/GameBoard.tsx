'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins, MapPin, Scroll } from 'lucide-react';

interface GameBoardProps {
  money: number;
  location: { name: string; emoji: string };
  turns: number;
}

export default function GameBoard({ money, location, turns }: GameBoardProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-4 md:p-6 shadow-2xl border border-blue-500/30"
    >
      <div className="flex justify-between items-center gap-4">
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
    </motion.div>
  );
}
