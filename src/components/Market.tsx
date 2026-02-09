'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { Good, Location, MarketEvent, Season, Weather } from '@/lib/game-data';
import { getGoodById, calculatePrice } from '@/lib/game-logic';

interface MarketProps {
  location: Location;
  events: MarketEvent[];
  onBuy: (goodId: string) => void;
  onSell: (goodId: string) => void;
  inventory: Record<string, number>;
  season: Season;
  weather?: Weather;
}

export default function Market({ location, events, onBuy, onSell, inventory, season, weather }: MarketProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2">
        <ShoppingCart size={20} />
        Market
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {location.goods.map((locationGood, index) => {
          const good = getGoodById(locationGood.goodId);
          if (!good) return null;

          const price = calculatePrice(good, location, events, season, weather);
          const owned = inventory[good.id] || 0;

          // Check if price is higher or lower than base
          const isGoodDeal = price < good.basePrice;
          const isBadDeal = price > good.basePrice * 1.3;

          return (
            <motion.div
              key={good.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-3 border border-slate-700/50 hover:border-blue-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{good.emoji}</span>
                  <div>
                    <div className="font-semibold text-white text-sm md:text-base">{good.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{good.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isGoodDeal && <TrendingDown size={14} className="text-green-400" />}
                  {isBadDeal && <TrendingUp size={14} className="text-red-400" />}
                  <span
                    className={`text-lg font-bold ${
                      isGoodDeal ? 'text-green-400' : isBadDeal ? 'text-red-400' : 'text-yellow-400'
                    }`}
                  >
                    {price}🪙
                  </span>
                </div>
              </div>

              {isGoodDeal && (
                <div className="text-xs text-green-400 mb-2">💰 Good deal!</div>
              )}

              <div className="text-xs text-slate-400 mb-2">
                You have: <span className="text-white font-semibold">{owned}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBuy(good.id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  Buy 1
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSell(good.id)}
                  disabled={owned === 0}
                  className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    owned === 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Sell 1
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
