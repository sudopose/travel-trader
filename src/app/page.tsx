'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Globe, X, RotateCcw } from 'lucide-react';
import GameBoard from '@/components/GameBoard';
import Market from '@/components/Market';
import Travel from '@/components/Travel';
import Events from '@/components/Events';
import History from '@/components/History';
import {
  getInitialGameState,
  buyGood,
  sellGood,
  travelTo,
  unlockLocation,
  getLocationById,
} from '@/lib/game-logic';

type Tab = 'market' | 'travel' | 'inventory' | 'history';

export default function Home() {
  const [gameState, setGameState] = useState(getInitialGameState());
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuy = (goodId: string) => {
    const result = buyGood(gameState, goodId, 1);
    if ('error' in result) {
      showNotification('error', result.error);
    } else {
      setGameState(result);
      showNotification('success', 'Purchased!');
    }
  };

  const handleSell = (goodId: string) => {
    const result = sellGood(gameState, goodId, 1);
    if ('error' in result) {
      showNotification('error', result.error);
    } else {
      setGameState(result);
      showNotification('success', 'Sold!');
    }
  };

  const handleTravel = (locationId: string) => {
    const result = travelTo(gameState, locationId);
    if ('error' in result) {
      showNotification('error', result.error);
    } else {
      setGameState(result);
      showNotification('success', `Traveled to ${getLocationById(locationId)?.name}!`);
    }
  };

  const handleUnlock = (locationId: string) => {
    const result = unlockLocation(gameState, locationId);
    if ('error' in result) {
      showNotification('error', result.error);
    } else {
      setGameState(result);
      showNotification('success', `Unlocked ${getLocationById(locationId)?.name}!`);
    }
  };

  const handleReset = () => {
    if (confirm('Start a new game? All progress will be lost.')) {
      setGameState(getInitialGameState());
      showNotification('success', 'New game started!');
    }
  };

  const location = getLocationById(gameState.currentLocation)!;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Globe className="text-blue-400" />
          <span className="tracking-wide">Travel Trader</span>
        </h1>

      {/* Buttons */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          title="New Game"
          >
            <RotateCcw size={20} />
          </motion.button>

        {/* Link to Guide */}
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/how-to-play'}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <Package size={20} className="mr-2" />
            <span className="font-semibold">How to Play</span>
          </motion.button>
      </div>

      {/* Game Board */}
      <GameBoard
        money={gameState.money}
        location={{ name: location.name, emoji: location.emoji }}
        turns={gameState.turns}
      />

      {/* Events */}
      <Events events={gameState.events} />

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 rounded-xl p-4 border ${
                notification.type === 'error'
                  ? 'bg-red-900/90 border-red-500'
                  : 'bg-green-900/90 border-green-500'
              }`}
          >
            <div className="flex items-start gap-2">
              {notification.type === 'error' ? (
                  <X className="text-red-400 mt-0.5" size={16} />
                ) : (
                  <Package className="text-green-400 mt-0.5" size={16} />
                )}
              <p className="text-sm text-white mt-0.5">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {[
          { id: 'market' as Tab, label: 'Market', icon: '🛒' },
          { id: 'travel' as Tab, label: 'Travel', icon: '✈️' },
          { id: 'inventory' as Tab, label: `Inventory (${totalItems})`, icon: '📦' },
          { id: 'history' as Tab, label: 'History', icon: '📜' },
        ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-semibold text-sm md:text-base">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900/50 rounded-2xl p-4 md:p-6 border border-slate-800"
      >
          {activeTab === 'market' && (
            <Market
              location={location}
              events={gameState.events}
              onBuy={handleBuy}
              onSell={handleSell}
              inventory={gameState.inventory}
            />
          )}

          {activeTab === 'travel' && (
            <Travel
              currentLocation={gameState.currentLocation}
              unlockedLocations={gameState.unlockedLocations}
              onTravel={handleTravel}
              onUnlock={handleUnlock}
              money={gameState.money}
            />
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                <Package size={20} className="mr-2" />
                Your Inventory
              </h2>
              {Object.entries(gameState.inventory).length === 0 ? (
                <div className="text-slate-500 text-center py-8">
                  Your inventory is empty. Visit the market to buy goods!
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(gameState.inventory)
                    .filter(([_, count]) => count > 0)
                    .map(([goodId, count], index) => (
                      <motion.div
                        key={goodId}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl p-3 border border-slate-700/50 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {(() => {
                              const goods = ['🌾', '🍚', '🌶️', '🧵', '🪙', '🍵', '☁️', '🛁️', '🪨', '☕', '💎', '🦴', '🌿'];
                              const idx = ['wheat', 'rice', 'spices', 'silk', 'gold', 'tea', 'cotton', 'coffee', 'diamonds', 'ivory'].indexOf(goodId);
                              return idx >= 0 ? goods[idx] : '📦';
                            })()}
                          </span>
                          <div className="capitalize text-white text-sm md:text-base">{goodId}</div>
                          <div className="bg-blue-600/30 px-3 py-1 rounded-full">
                            <span className="text-blue-300 font-bold">{count}</span>
                          </div>
                        </motion.div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && <History history={gameState.history} />}
        </motion.div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-xs py-4">
        <p>💡 Tip: Discuss strategies together! Buy low, sell high, and watch for market events!</p>
      </div>
    </main>
  );
}
