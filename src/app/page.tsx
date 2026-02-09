'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Globe, RotateCcw, Wallet, Users, Target, Menu, Settings, Star, Trophy, Save, ShoppingCart } from 'lucide-react';
import { triggerClickHaptic, triggerSuccessHaptic, triggerErrorHaptic, triggerPurchaseHaptic, triggerTravelHaptic } from '@/lib/haptics';
import { playSound } from '@/lib/sounds';
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
import MultiplayerPanel from '@/components/MultiplayerPanel';
import SplitScreenLayout from '@/components/SplitScreenLayout';
import TeamGoalsPanel from '@/components/TeamGoalsPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { Sparkles, FloatingText } from '@/components/ui/ParticleEffects';
import StartScreen from '@/components/StartScreen';
import GameOverOverlay from '@/components/GameOverOverlay';
import ProgressionPanel from '@/components/ProgressionPanel';
import SaveLoadPanel from '@/components/SaveLoadPanel';
import LeaderboardPanel from '@/components/LeaderboardPanel';
import InventoryUpgradesPanel from '@/components/InventoryUpgradesPanel';
import { GameMode, createGameModeState, checkWinCondition, checkLoseCondition, calculateScore, getModeEmoji, getModeDisplayName, GAME_MODES } from '@/lib/game-modes';
import {
  createPlayerProgression,
  getLevelForXP,
  calculateXPFromTrade,
  checkAchievement,
  ACHIEVEMENTS,
  LEVELS,
  PlayerProgression,
} from '@/lib/progression';
import { SaveData, saveGame, loadAutoSave, getSaveSlots } from '@/lib/save-system';
import { LeaderboardEntry, saveLeaderboardEntry, updateStats } from '@/lib/leaderboards';
import {
  MultiplayerState,
  createMultiplayerState,
  Role,
  TEAM_GOALS_TEMPLATES,
  switchMode,
  addPlayer,
  assignRole,
  advanceHotseatTurn,
  updateTeamGoals,
} from '@/lib/multiplayer-data';

type Tab = 'market' | 'travel' | 'inventory' | 'history';

export default function Home() {
  const [gameState, setGameState] = useState(getInitialGameState());
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>(createMultiplayerState());
  const [showMultiplayerPanel, setShowMultiplayerPanel] = useState(false);
  const [showTeamGoals, setShowTeamGoals] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [player1View, setPlayer1View] = useState<Tab>('market');
  const [player2View, setPlayer2View] = useState<Tab>('travel');

  // Game Modes state
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameModeState, setGameModeState] = useState(createGameModeState('sandbox'));

  // Progression state
  const [progression, setProgression] = useState<PlayerProgression>(createPlayerProgression());
  const [showProgressionPanel, setShowProgressionPanel] = useState(false);
  const [profitPerTrade, setProfitPerTrade] = useState(0);

  // Phase 7 state
  const [showSaveLoadPanel, setShowSaveLoadPanel] = useState(false);
  const [showLeaderboardPanel, setShowLeaderboardPanel] = useState(false);
  const [showInventoryUpgradesPanel, setShowInventoryUpgradesPanel] = useState(false);
  const [playerName, setPlayerName] = useState('Trader');
  const [inventoryUpgrade, setInventoryUpgrade] = useState<any | undefined>(undefined);
  const [inventoryUpgradeLevel, setInventoryUpgradeLevel] = useState(0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });

    // Play sound and haptics
    playSound(type === 'success' ? 'notification' : 'error');
    type === 'success' ? triggerSuccessHaptic() : triggerErrorHaptic();

    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuy = (goodId: string) => {
    const result = buyGood(gameState, goodId, 1);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      const oldMoney = gameState.money;
      setGameState(result);
      playSound('buy');
      triggerPurchaseHaptic();
      showNotification('success', 'Purchased!');
    }
  };

  const handleSell = (goodId: string) => {
    const oldMoney = gameState.money;
    const result = sellGood(gameState, goodId, 1);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      const newMoney = result.money;
      const profit = newMoney - oldMoney;
      setGameState(result);
      playSound('sell');
      triggerSuccessHaptic();
      showNotification('success', 'Sold!');

      // Update progression from trade
      updateProgressionFromTrade(profit);
    }
  };

  const handleTravel = (locationId: string) => {
    const result = travelTo(gameState, locationId);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      setGameState(result);
      playSound('travel');
      triggerTravelHaptic();
      showNotification('success', 'Traveled!');

      // Check location-related achievements
      updateProgressionFromTravel(0);
    }
  };

  const handleUnlock = (locationId: string) => {
    const result = unlockLocation(gameState, locationId);
    if (typeof result === 'string' || 'error' in result) {
      showNotification('error', typeof result === 'string' ? result : result.error);
    } else {
      setGameState(result);
      playSound('unlock');
      triggerSuccessHaptic();
      setCelebration('🎉');
      setTimeout(() => setCelebration(null), 2000);
      showNotification('success', 'Unlocked!');
    }
  };

  // Progression helper functions
  const updateProgressionFromTrade = (profit: number) => {
    setProfitPerTrade(profit);

    const xpGain = calculateXPFromTrade(profit);
    const newXP = progression.xp + xpGain;
    const newLevel = getLevelForXP(newXP);
    const currentLevelData = LEVELS.find(l => l.level === progression.level);
    const newLevelData = LEVELS.find(l => l.level === newLevel);

    // Calculate XP to next level correctly (XP earned in current level)
    const xpInCurrentLevel = newXP - (currentLevelData?.xpRequired || 0);
    const xpToNextLevel = newLevelData ? newLevelData.xpRequired - newXP : 0;

    const newProgression: PlayerProgression = {
      ...progression,
      xp: newXP,
      level: newLevel,
      xpToNext: xpToNextLevel,
      totalTrades: progression.totalTrades + 1,
      goldEarned: progression.goldEarned + profit,
    };

    // Check achievements
    const newlyUnlocked: string[] = [];
    ACHIEVEMENTS.forEach(achievement => {
      if (!progression.achievementsUnlocked.includes(achievement.id)) {
        const unlocked = checkAchievement(
          achievement,
          newProgression.totalTrades,
          newProgression.goldEarned,
          gameState.unlockedLocations.length,
          profit,
          gameState.turns,
          gameModeState.config.maxTurns,
        );
        if (unlocked) {
          newlyUnlocked.push(achievement.id);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      newProgression.achievementsUnlocked = [
        ...progression.achievementsUnlocked,
        ...newlyUnlocked,
      ];
      showNotification('success', `🏆 ${newlyUnlocked.length} achievement${newlyUnlocked.length > 1 ? 's' : ''} unlocked!`);
      playSound('goalComplete');
      triggerSuccessHaptic();
    }

    // Level up notification
    if (newLevel > progression.level) {
      showNotification('success', `🎉 Level up! Now level ${newLevel}`);
      playSound('goalComplete');
      triggerSuccessHaptic();
      setCelebration('⬆️');
      setTimeout(() => setCelebration(null), 2000);
    }

    setProgression(newProgression);

    // Auto-save
    saveGame(gameState, newProgression);
  };

  const updateProgressionFromTravel = (distance: number) => {
    // Simple travel XP (optional)
    // const xpGain = Math.floor(distance / 100);
    // setProgression(prev => ({
    //   ...prev,
    //   xp: prev.xp + xpGain,
    // }));

    // Check location achievements
    const newlyUnlocked: string[] = [];
    ACHIEVEMENTS.forEach(achievement => {
      if (!progression.achievementsUnlocked.includes(achievement.id)) {
        const unlocked = checkAchievement(
          achievement,
          progression.totalTrades,
          progression.goldEarned,
          gameState.unlockedLocations.length,
          profitPerTrade,
          gameState.turns,
          gameModeState.config.maxTurns,
        );
        if (unlocked) {
          newlyUnlocked.push(achievement.id);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setProgression(prev => ({
        ...prev,
        achievementsUnlocked: [...prev.achievementsUnlocked, ...newlyUnlocked],
      }));
      showNotification('success', `🏆 ${newlyUnlocked.length} achievement${newlyUnlocked.length > 1 ? 's' : ''} unlocked!`);
      playSound('goalComplete');
      triggerSuccessHaptic();
    }
  };

  const handleReset = () => {
    if (confirm('Start a new game? All progress will be lost.')) {
      if (gameMode) {
        // Restart with current game mode
        handleRestartGame();
      } else {
        // New game with default
        setGameState(getInitialGameState());
        showNotification('success', 'New game started!');
      }
    }
  };

  // Game Mode handlers
  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    const modeState = createGameModeState(mode);
    setGameModeState(modeState);
    setShowStartScreen(false);

    // Initialize game state with mode-specific settings
    let initialGameState = getInitialGameState();
    initialGameState.money = modeState.config.startingMoney;
    initialGameState.inventory = modeState.config.startingInventory;
    initialGameState.unlockedLocations = modeState.config.unlockedLocations;

    setGameState(initialGameState);
    playSound('click');
    triggerClickHaptic();
    showNotification('success', `Started ${modeState.config.name}!`);
  };

  const handleRestartGame = () => {
    if (!gameMode) return;

    const modeState = createGameModeState(gameMode);
    setGameModeState(modeState);

    // Reinitialize game state with mode-specific settings
    let initialGameState = getInitialGameState();
    initialGameState.money = modeState.config.startingMoney;
    initialGameState.inventory = modeState.config.startingInventory;
    initialGameState.unlockedLocations = modeState.config.unlockedLocations;

    setGameState(initialGameState);
    setActiveTab('market');
    playSound('click');
    triggerClickHaptic();
    showNotification('success', 'Game restarted!');
  };

  const handleHomeMenu = () => {
    setShowStartScreen(true);
    setGameMode(null);
    setGameModeState(createGameModeState('sandbox'));
    setGameState(getInitialGameState());
    playSound('click');
    triggerClickHaptic();
  };

  // Multiplayer handlers
  const handleSwitchMode = (mode: 'single' | 'split' | 'hotseat') => {
    setMultiplayerState(switchMode(multiplayerState, mode));
  };

  const handleAddPlayer = (name: string, role: Role) => {
    setMultiplayerState(addPlayer(multiplayerState, name, role));
  };

  const handleAssignRole = (playerId: string, role: Role) => {
    setMultiplayerState(assignRole(multiplayerState, playerId, role));
  };

  const handleAdvanceHotseat = () => {
    setMultiplayerState(advanceHotseatTurn(multiplayerState));
    showNotification('success', `Turn passed to ${multiplayerState.players[(multiplayerState.currentPlayerIndex + 1) % multiplayerState.players.length]?.name}`);
  };

  const handleAddGoal = (goalTemplateId: string) => {
    const template = TEAM_GOALS_TEMPLATES.find(t => t.id === goalTemplateId);
    if (template && multiplayerState.teamGoals.length < 3) {
      setMultiplayerState({
        ...multiplayerState,
        teamGoals: [
          ...multiplayerState.teamGoals,
          {
            ...template,
            current: 0,
            completed: false,
          },
        ],
      });
    }
  };

  const handleStartSplitScreen = () => {
    if (multiplayerState.players.length >= 2) {
      setShowMultiplayerPanel(false);
      showNotification('success', 'Split-screen mode activated!');
    } else {
      showNotification('error', 'Need at least 2 players for split-screen mode');
    }
  };

  // Phase 7 handlers
  const handleLoadGame = (saveData: SaveData) => {
    setGameState(saveData.gameState);
    setProgression(saveData.progression);
    showNotification('success', 'Game loaded successfully!');
    setShowSaveLoadPanel(false);
    playSound('click');
    triggerClickHaptic();
  };

  const handlePurchaseUpgrade = (upgradeType: any, level: number) => {
    // TODO: Implement inventory upgrade logic
    showNotification('success', `Upgrade purchased! Level ${level}`);
    setShowInventoryUpgradesPanel(false);
    playSound('unlock');
    triggerSuccessHaptic();
  };

  const usedSlots = Object.values(gameState.inventory).reduce((sum, count) => sum + count, 0);
  const seasonDisplay = SEASON_DISPLAY[gameState.season];
  const currentLocation = getLocationById(gameState.currentLocation);

  // Check win/lose conditions for game modes
  useEffect(() => {
    if (showStartScreen || !gameMode) return;

    const isWin = checkWinCondition(gameModeState, gameState.money, gameState.turns);
    const isLose = checkLoseCondition(gameModeState, gameState.money, gameState.turns);

    if (isWin || isLose) {
      const score = calculateScore(gameModeState, gameState.money, gameState.turns);
      const turnsRemaining = gameModeState.config.maxTurns ? gameModeState.config.maxTurns - gameState.turns : undefined;

      setGameModeState({
        ...gameModeState,
        isGameOver: true,
        gameResult: isWin ? 'win' : 'lose',
        score,
        turnsRemaining,
      });

      // Save to leaderboard
      const leaderboardEntry: LeaderboardEntry = {
        id: `${Date.now()}-${Math.random()}`,
        playerName,
        gameMode: gameMode || 'sandbox',
        score,
        gold: gameState.money,
        turns: gameState.turns,
        achievements: progression.achievementsUnlocked.length,
        level: progression.level,
        timestamp: Date.now(),
        date: new Date().toISOString(),
      };

      saveLeaderboardEntry(leaderboardEntry);
      updateStats(leaderboardEntry);

      // Auto-save
      saveGame(gameState, progression);

      if (isWin) {
        playSound('goalComplete');
        triggerSuccessHaptic();
        setCelebration('🎉');
        setTimeout(() => setCelebration(null), 2000);
      } else {
        playSound('error');
        triggerErrorHaptic();
      }
    }
  }, [gameState.turns, gameState.money, showStartScreen, gameMode, gameModeState]);

  // Update team goals whenever game state changes
  const updatedMultiplayerState = updateTeamGoals(multiplayerState, gameState);

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
        {multiplayerState.mode === 'single' ? (
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMultiplayerPanel(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            title="Multiplayer"
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold">Multiplayer</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTeamGoals(!showTeamGoals)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showTeamGoals ? 'bg-yellow-600' : 'bg-slate-800 hover:bg-slate-700'
            } text-white`}
          >
            <Target className="w-5 h-5" />
            <span className="text-sm font-semibold">Team Goals</span>
            {updatedMultiplayerState.teamGoals.filter(g => g.completed).length > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {updatedMultiplayerState.teamGoals.filter(g => g.completed).length}
              </span>
            )}
          </motion.button>
        )}
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          title={gameMode ? 'Restart Mode' : 'New Game'}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowSettings(true);
            triggerClickHaptic();
            playSound('click');
          }}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowProgressionPanel(true);
            triggerClickHaptic();
            playSound('click');
          }}
          className="bg-purple-800 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors relative"
          title="Progression"
        >
          <Trophy className="w-5 h-5" />
          {progression.achievementsUnlocked.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {progression.achievementsUnlocked.length}
            </span>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowSaveLoadPanel(true);
            triggerClickHaptic();
            playSound('click');
          }}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          title="Save / Load"
        >
          <Save className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowLeaderboardPanel(true);
            triggerClickHaptic();
            playSound('click');
          }}
          className="bg-yellow-800 hover:bg-yellow-700 text-white p-2 rounded-lg transition-colors"
          title="Leaderboards"
        >
          <Trophy className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowInventoryUpgradesPanel(true);
            triggerClickHaptic();
            playSound('click');
          }}
          className="bg-green-800 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
          title="Inventory Upgrades"
        >
          <ShoppingCart className="w-5 h-5" />
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

      {/* Tab Navigation - Only show in single player mode */}
      {multiplayerState.mode === 'single' && (
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
      )}

      {/* Tab Content - Single Player */}
      {multiplayerState.mode === 'single' && (
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
      )}

      {/* Split Screen Layout */}
      {multiplayerState.mode === 'split' && updatedMultiplayerState.players.length >= 2 && (
        <SplitScreenLayout
          gameState={gameState}
          season={gameState.season}
          weather={gameState.weather}
          player1={updatedMultiplayerState.players[0]}
          player2={updatedMultiplayerState.players[1]}
          player1View={player1View}
          player2View={player2View}
          onPlayer1ChangeView={setPlayer1View}
          onPlayer2ChangeView={setPlayer2View}
        />
      )}

      {/* Hot Seat Mode - Same as single player but with turn indicator */}
      {multiplayerState.mode === 'hotseat' && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/50 rounded-2xl p-4 md:p-6 border border-slate-800"
        >
          <div className="mb-4 p-3 bg-yellow-900/30 rounded-xl border border-yellow-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{updatedMultiplayerState.players[updatedMultiplayerState.currentPlayerIndex]?.avatar}</span>
                <div>
                  <div className="text-white font-semibold">
                    {updatedMultiplayerState.players[updatedMultiplayerState.currentPlayerIndex]?.name}
                  </div>
                  <div className="text-xs text-yellow-400">
                    {updatedMultiplayerState.players[updatedMultiplayerState.currentPlayerIndex]?.role === 'trader' && '🤝 Trader - Can buy/sell'}
                    {updatedMultiplayerState.players[updatedMultiplayerState.currentPlayerIndex]?.role === 'navigator' && '🧭 Navigator - Can travel/unlock'}
                    {updatedMultiplayerState.players[updatedMultiplayerState.currentPlayerIndex]?.role === 'merchant' && '💰 Merchant - Can view trends'}
                    {updatedMultiplayerState.players[updatedMultiplayerState.currentPlayerIndex]?.role === 'free' && '🎭 Free Agent - Can do everything'}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdvanceHotseat}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Next Turn
              </motion.button>
            </div>
          </div>

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
      )}

      {/* Footer */}
      <div className="text-center text-slate-500 text-xs py-4">
        {multiplayerState.mode === 'single' ? (
          <>
            {gameMode && gameMode !== 'sandbox' ? (
              <>
                <p>
                  {getModeEmoji(gameMode)} {getModeDisplayName(gameMode)} | Turn: {gameState.turns}
                  {gameModeState.config.maxTurns && ` / ${gameModeState.config.maxTurns}`} | Inventory: {usedSlots}/{gameState.inventorySlots} slots
                </p>
                <p className="mt-1">💡 Phase 6 Complete - Progression System Ready!</p>
              </>
            ) : (
              <>
                <p>Turn: {gameState.turns} | Inventory: {usedSlots}/{gameState.inventorySlots} slots</p>
                <p className="mt-1">💡 Phase 6 Complete - Progression System Ready!</p>
              </>
            )}
          </>
        ) : (
          <>
            {multiplayerState.mode === 'hotseat' && (
              <p className="text-lg font-bold text-white mb-2">
                Current Turn: {multiplayerState.players[multiplayerState.currentPlayerIndex]?.avatar} {multiplayerState.players[multiplayerState.currentPlayerIndex]?.name}
              </p>
            )}
            <p>Turn: {gameState.turns} | Inventory: {usedSlots}/{gameState.inventorySlots} slots | {multiplayerState.players.length} Players</p>
            <p className="mt-1">💡 {multiplayerState.mode === 'split' ? 'Split-screen mode active' : 'Hot-seat mode active'} | Phase 6 Complete!</p>
          </>
        )}
      </div>

      {/* Multiplayer Panel */}
      <AnimatePresence>
        {showMultiplayerPanel && (
          <MultiplayerPanel
            multiplayerState={updatedMultiplayerState}
            onClose={() => setShowMultiplayerPanel(false)}
            onSwitchMode={handleSwitchMode}
            onAddPlayer={handleAddPlayer}
            onAssignRole={handleAssignRole}
            onAdvanceHotseat={handleAdvanceHotseat}
            onAddGoal={handleAddGoal}
            onStartSplitScreen={handleStartSplitScreen}
          />
        )}
      </AnimatePresence>

      {/* Team Goals Panel (Slide-over) */}
      <AnimatePresence>
        {showTeamGoals && multiplayerState.mode !== 'single' && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 h-full w-80 bg-slate-900/95 border-l border-slate-700 p-4 overflow-y-auto z-40"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Team Goals</h2>
              <button
                onClick={() => setShowTeamGoals(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <TeamGoalsPanel goals={updatedMultiplayerState.teamGoals} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          triggerClickHaptic();
          playSound('click');
        }}
      />

      {/* Progression Panel */}
      <ProgressionPanel
        isOpen={showProgressionPanel}
        onClose={() => {
          setShowProgressionPanel(false);
          triggerClickHaptic();
          playSound('click');
        }}
        progression={progression}
        maxTurns={gameModeState.config.maxTurns}
        profitPerTrade={profitPerTrade}
      />

      {/* Save/Load Panel */}
      <SaveLoadPanel
        isOpen={showSaveLoadPanel}
        onClose={() => {
          setShowSaveLoadPanel(false);
          triggerClickHaptic();
          playSound('click');
        }}
        onLoad={handleLoadGame}
        currentMoney={gameState.money}
        currentLevel={progression.level}
      />

      {/* Leaderboard Panel */}
      <LeaderboardPanel
        isOpen={showLeaderboardPanel}
        onClose={() => {
          setShowLeaderboardPanel(false);
          triggerClickHaptic();
          playSound('click');
        }}
      />

      {/* Inventory Upgrades Panel */}
      <InventoryUpgradesPanel
        isOpen={showInventoryUpgradesPanel}
        onClose={() => {
          setShowInventoryUpgradesPanel(false);
          triggerClickHaptic();
          playSound('click');
        }}
        currentMoney={gameState.money}
        currentUpgrade={inventoryUpgrade}
        currentUpgradeLevel={inventoryUpgradeLevel}
        onPurchase={handlePurchaseUpgrade}
      />

      {/* Celebration Effects */}
      <Sparkles show={celebration !== null} count={50} />
      <FloatingText
        text={celebration || ''}
        show={celebration !== null}
        color="#FFD700"
      />

      {/* Start Screen */}
      <StartScreen
        show={showStartScreen}
        onSelectMode={handleSelectGameMode}
      />

      {/* Game Over Overlay */}
      <GameOverOverlay
        gameModeState={gameModeState}
        score={gameModeState.score}
        onRestart={handleRestartGame}
        onHome={handleHomeMenu}
      />
    </main>
  );
}
