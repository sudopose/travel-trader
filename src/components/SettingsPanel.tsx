'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Smartphone, Palette } from 'lucide-react';
import { isSoundEnabled, setSoundVolume, toggleSound, setSoundVolume as setSoundVol } from '@/lib/sounds';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [volume, setVolumeState] = useState(0.3);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toggleSound();
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    setSoundVol(newVolume);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Palette className="text-purple-400" />
                Settings
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Settings */}
            <div className="p-6 space-y-6">
              {/* Sound Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? (
                      <Volume2 className="text-blue-400" size={24} />
                    ) : (
                      <VolumeX className="text-slate-500" size={24} />
                    )}
                    <div>
                      <div className="text-white font-semibold">Sound Effects</div>
                      <div className="text-sm text-slate-400">
                        {soundEnabled ? 'Enabled' : 'Muted'}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleSound}
                    className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                      soundEnabled
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                    }`}
                  >
                    {soundEnabled ? 'On' : 'Off'}
                  </motion.button>
                </div>

                {/* Volume Slider */}
                {soundEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pl-10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm">Volume</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:bg-blue-500
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:hover:bg-blue-400"
                      />
                      <span className="text-slate-400 text-sm w-12 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Haptics Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className={hapticsEnabled ? 'text-purple-400' : 'text-slate-500'} size={24} />
                  <div>
                    <div className="text-white font-semibold">Haptic Feedback</div>
                    <div className="text-sm text-slate-400">
                      Vibration on interactions
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHapticsEnabled(!hapticsEnabled)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                    hapticsEnabled
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                  }`}
                >
                  {hapticsEnabled ? 'On' : 'Off'}
                </motion.button>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700 pt-6">
                <div className="text-sm text-slate-400">
                  <div className="font-semibold text-slate-300 mb-2">About</div>
                  <div className="space-y-1">
                    <div>Travel Trader v2.0</div>
                    <div>Multiplayer Co-op Trading Game</div>
                    <div className="mt-3 text-slate-500">
                      Built with Next.js, Framer Motion & Tailwind CSS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Close Settings
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
