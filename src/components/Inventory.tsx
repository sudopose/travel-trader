'use client';

import { motion } from 'framer-motion';
import { Package, SortAsc, ShoppingCart, Package2 } from 'lucide-react';
import { GameState, Season } from '@/lib/game-data';
import { sortInventory, getGoodById, calculatePrice, getLocationById } from '@/lib/game-logic';

interface InventoryProps {
  gameState: GameState;
  season: Season;
  weather?: any;
}

export default function Inventory({ gameState, season, weather }: InventoryProps) {
  const ownedItems = Object.entries(gameState.inventory).filter(([_, count]) => count > 0);

  if (ownedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto text-slate-600 text-4xl mb-4" />
        <p className="text-slate-500">Your inventory is empty.</p>
        <p className="text-slate-600 text-sm">Visit the market to buy goods!</p>
      </div>
    );
  }

  const sortedInventory = Object.entries(sortInventory(gameState, 'category').inventory);
  const currentLocation = getLocationById(gameState.currentLocation);

  return (
    <div className="space-y-4">
      {/* Organization Options */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {}}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <SortAsc size={14} />
          Sort by Category
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {}}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <ShoppingCart size={14} />
          Sort by Value
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {}}
          className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Package2 size={14} />
          Bundle for Travel
        </motion.button>
      </div>

      {/* Inventory Slots Grid */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2">
            <Package size={20} className="mr-2" />
            Your Inventory ({ownedItems.length} items)
          </h2>
          <div className="text-sm text-slate-400">
            {Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0)}/{gameState.inventorySlots} slots
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${(Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0) / gameState.inventorySlots) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="space-y-2">
        {sortedInventory.map(([goodId, count], index) => {
          const good = getGoodById(goodId);
          if (!good || count === 0) return null;

          const price = calculatePrice(good, currentLocation!, gameState.events, season, weather);
          const isGoodDeal = price < good.basePrice;
          const isBadDeal = price > good.basePrice * 1.3;

          return (
            <motion.div
              key={goodId}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl p-4 border ${
                isGoodDeal ? 'border-green-500/50' : isBadDeal ? 'border-red-500/50' : 'border-slate-700/50'
              } hover:border-blue-500/50 transition-all`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{good.emoji}</span>
                  <div>
                    <div className="font-semibold text-white text-base md:text-lg">
                      {good.name}
                    </div>
                    <div className="text-xs text-slate-400 capitalize mb-1">
                      {good.category}
                    </div>
                    <div className="text-xs text-slate-500">
                      Base price: {good.basePrice}🪙
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold mb-2 ${
                    isGoodDeal ? 'text-green-400' : isBadDeal ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {price}🪙
                  </div>
                  <div className={`text-xs mb-2 ${isGoodDeal ? 'text-green-400' : isBadDeal ? 'text-red-400' : 'text-slate-500'}`}>
                    {isGoodDeal ? '💰 Good deal!' : isBadDeal ? '⚠️ Overpriced!' : '📍 Market price'}
                  </div>
                  <div className="bg-blue-600/30 px-3 py-1 rounded-full">
                    <span className="text-blue-300 font-bold text-sm">
                      {count} x
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
