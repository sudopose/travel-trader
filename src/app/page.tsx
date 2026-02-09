'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Globe, RotateCcw, Wallet } from 'lucide-react';
import {
  getInitialGameState,
  processEvents,
  buyGood,
  sellGood,
  travelTo,
  unlockLocation,
  getLocationById,
} from '@/lib/game-logic';
import { SEASON_DISPLAY } from '@/lib/game-data';
import Market from '@/components/Market';
import Travel from '@/components/Travel';
import Inventory from '@/components/Inventory';
import History from '@/components/History';

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
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      setGameState(result);
      showNotification('success', 'Purchased!');
    }
  };

  const handleSell = (goodId: string) => {
    const result = sellGood(gameState, goodId, 1);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      setGameState(result);
      showNotification('success', 'Sold!');
    }
  };

  const handleTravel = (locationId: string) => {
    const result = travelTo(gameState, locationId);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      setGameState(result);
      showNotification('success', 'Traveled!');
    }
  };

  const handleUnlock = (locationId: string) => {
    const result = unlockLocation(gameState, locationId);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      setGameState(result);
      showNotification('success', 'Unlocked!');
    }
  };

  const handleReset = () => {
    if (confirm('Start a new game? All progress will be lost.')) {
      setGameState(getInitialGameState());
      showNotification('success', 'New game started!');
    }
  };

  const usedSlots = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
  const seasonDisplay = SEASON_DISPLAY[gameState.season];
  const currentLocation = getLocationById(gameState.currentLocation);

  // Process events for display (not mutating state)
  const processedState = processEvents(gameState);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Globe className="text-blue-400" />
          <span className="tracking-wide">Travel Trader</span>
        </h1>
      </div>

      {/* Season & Weather Indicator */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl">
          <span className="text-2xl">{seasonDisplay.emoji}</span>
          <span className="text-white font-semibold">{seasonDisplay.name}</span>
        </div>

        {processedState.weather && (
          <div className="flex items-center gap-2 bg-yellow-900/80 px-4 py-2 rounded-xl">
            <span className="text-2xl">{processedState.weather.emoji}</span>
            <span className="text-white font-semibold">{processedState.weather.name}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          title="New Game"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Money Display */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-900/80 to-amber-900/80 px-6 py-3 rounded-xl border border-yellow-700/50">
          <Wallet className="text-yellow-400" size={20} />
          <span className="text-white font-bold text-xl">{gameState.money}</span>
          <span className="text-yellow-400">🪙</span>
        </div>
      </div>

      {/* Active Events */}
      {(gameState.events.length > 0 || gameState.weather) && (
        <div className="bg-slate-900/50 rounded-2xl p-4 mb-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>📢</span> Active Events
          </h2>
          <div className="space-y-2">
            {gameState.events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-600"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{event.description.charAt(0)}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{event.description}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      Ends in {event.remainingTurns} turn{event.remainingTurns !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {gameState.weather && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/50"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{gameState.weather.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{gameState.weather.description}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      Ends in {gameState.weather.remainingTurns} turn{gameState.weather.remainingTurns !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

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
          { id: 'inventory' as Tab, label: `Inventory (${usedSlots}/${gameState.inventorySlots})`, icon: '📦' },
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
        {activeTab === 'market' && currentLocation && (
          <Market
            location={currentLocation}
            events={gameState.events}
            onBuy={handleBuy}
            onSell={handleSell}
            inventory={gameState.inventory}
            season={gameState.season}
            weather={gameState.weather}
          />
        )}

        {activeTab === 'travel' && (
          <Travel
            currentLocation={gameState.currentLocation}
            unlockedLocations={gameState.unlockedLocations}
            onTravel={handleTravel}
            onUnlock={handleUnlock}
            money={gameState.money}
            weather={gameState.weather}
          />
        )}

        {activeTab === 'inventory' && (
          <Inventory
            gameState={gameState}
            season={gameState.season}
            weather={gameState.weather}
          />
        )}

        {activeTab === 'history' && (
          <History
            history={gameState.history}
          />
        )}
      </motion.div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-xs py-4">
        <p>Turn: {gameState.turns} | Inventory: {usedSlots}/{gameState.inventorySlots} slots</p>
        <p className="mt-1">💡 Phase 2 Complete - Advanced Features Ready!</p>
      </div>
    </main>
  );
}
