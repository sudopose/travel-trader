'use client';

import { motion } from 'framer-motion';
import { Scroll } from 'lucide-react';
import { GameHistoryEntry } from '@/lib/game-data';

interface HistoryProps {
  history: GameHistoryEntry[];
}

export default function History({ history }: HistoryProps) {
  const recentHistory = history.slice(-10).reverse();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2">
        <Scroll size={20} />
        Recent Activity
      </h2>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {recentHistory.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-4">No recent activity</div>
        ) : (
          recentHistory.map((entry, index) => {
            const bgClass =
              entry.type === 'buy'
                ? 'bg-green-900/30 border-green-800/50'
                : entry.type === 'sell'
                ? 'bg-red-900/30 border-red-800/50'
                : entry.type === 'travel'
                ? 'bg-blue-900/30 border-blue-800/50'
                : 'bg-purple-900/30 border-purple-800/50';

            return (
              <motion.div
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`${bgClass} rounded-lg p-2 border`}
              >
                <div className="text-xs text-slate-400 mb-1">Turn {entry.turn}</div>
                <div className="text-sm text-slate-200">{entry.message}</div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
