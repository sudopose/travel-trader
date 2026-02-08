'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { MarketEvent } from '@/lib/game-data';

interface EventsProps {
  events: MarketEvent[];
}

export default function Events({ events }: EventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={`${event.id}-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-3 border border-orange-500/50"
          >
            <div className="flex items-start gap-2">
              <Bell className="text-orange-400 mt-0.5" size={16} />
              <div className="flex-1">
                <p className="text-sm text-orange-200">{event.description}</p>
                <p className="text-xs text-orange-400 mt-1">
                  {event.remainingTurns} turn{event.remainingTurns !== 1 ? 's' : ''} remaining
                </p>
              </div>
              <span className="text-orange-400 font-bold text-lg">
                {event.priceMultiplier > 1 ? '⬆️' : '⬇️'}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
