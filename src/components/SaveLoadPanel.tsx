'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, Download, Upload, Clock, Play, X } from 'lucide-react';
import { SaveData, getSaveSlots, loadGame, deleteSave, formatTimestamp, hasAutoSave, loadAutoSave, exportSave, importSave } from '@/lib/save-system';

interface SaveLoadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (saveData: SaveData) => void;
  currentMoney: number;
  currentLevel: number;
}

export default function SaveLoadPanel({
  isOpen,
  onClose,
  onLoad,
  currentMoney,
  currentLevel,
}: SaveLoadPanelProps) {
  const [activeTab, setActiveTab] = useState<'save' | 'load' | 'import-export'>('load');
  const slots = getSaveSlots();

  const handleLoad = (slot: number) => {
    const saveData = loadGame(slot);
    if (saveData) {
      onLoad(saveData);
      onClose();
    }
  };

  const handleDelete = (slot: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this save slot?')) {
      deleteSave(slot);
    }
  };

  const handleExport = () => {
    const data = exportSave();
    if (data) {
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `travel-trader-save-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        if (importSave(data)) {
          alert('Import successful!');
        } else {
          alert('Import failed. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 border-l border-slate-800 overflow-y-auto z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800 p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💾</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Save & Load</h2>
                    <p className="text-xs text-slate-400">Manage your game saves</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { id: 'load' as const, label: 'Load Game', icon: Upload },
                  { id: 'save' as const, label: 'Save Game', icon: Save },
                  { id: 'import-export' as const, label: 'Import/Export', icon: Download },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'load' && (
                  <motion.div
                    key="load"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {/* Auto Save */}
                    {hasAutoSave() && (
                      <div
                        onClick={() => {
                          const saveData = loadAutoSave();
                          if (saveData) {
                            onLoad(saveData);
                            onClose();
                          }
                        }}
                        className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl p-4 cursor-pointer hover:from-green-900/50 hover:to-emerald-900/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <Play className="text-green-400 mt-1" size={24} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white">Auto Save</h3>
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                Latest
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              Automatically saved game state
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Slots */}
                    <h3 className="text-sm font-semibold text-slate-400">Save Slots</h3>
                    {slots.map((save, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => save && handleLoad(idx)}
                        className={`relative rounded-xl p-4 border cursor-pointer transition-all ${
                          save
                            ? 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-900/70'
                            : 'bg-slate-900/20 border-slate-800 border-dashed'
                        }`}
                      >
                        {save ? (
                          <>
                            <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">📦</div>
                              <div>
                                <h4 className="font-bold text-white">Slot {idx + 1}</h4>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatTimestamp(save.timestamp)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDelete(idx, e)}
                              className="text-slate-400 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-yellow-400">💰 {save.gameState.money} gold</span>
                            <span className="text-blue-400">📊 Level {save.progression.level}</span>
                            <span className="text-purple-400">🏆 {save.progression.achievementsUnlocked.length} achievements</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-20 text-slate-500">
                          <div className="text-center">
                            <Save size={32} className="mx-auto mb-2" />
                            <p className="text-sm">Empty Slot</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'save' && (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4">
                      <h3 className="font-bold text-white mb-2">Current Progress</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-yellow-400">💰 {currentMoney} gold</span>
                        <span className="text-blue-400">📊 Level {currentLevel}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-400">Save To Slot</h3>
                    {slots.map((save, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => {
                          // TODO: Implement save to slot
                          alert(`Save to slot ${idx + 1} - not yet implemented`);
                        }}
                        className={`relative rounded-xl p-4 border cursor-pointer transition-all ${
                          save
                            ? 'bg-slate-900/50 border-slate-700 hover:border-yellow-700 hover:bg-slate-900/70'
                            : 'bg-slate-900/20 border-slate-800 border-dashed hover:border-yellow-700 hover:bg-slate-900/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Save className="text-slate-400" size={24} />
                            <div>
                              <h4 className="font-bold text-white">Slot {idx + 1}</h4>
                              {save && (
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatTimestamp(save.timestamp)}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">
                            Overwrite
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'import-export' && (
                  <motion.div
                    key="import-export"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {/* Export */}
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Download size={20} />
                        Export Save
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Export your save to a file for backup or sharing
                      </p>
                      <button
                        onClick={handleExport}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Export to File
                      </button>
                    </div>

                    {/* Import */}
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Upload size={20} />
                        Import Save
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Import a save from a file
                      </p>
                      <input
                        type="file"
                        accept=".txt"
                        onChange={handleImport}
                        className="hidden"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload size={18} />
                        Import from File
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
