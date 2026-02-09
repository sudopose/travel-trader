'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, CheckCircle2, Info } from 'lucide-react';
import { Perk, PERKS, PerkTier } from '@/lib/progression';

interface PerksPanelProps {
  unlockedPerks: string[];
  availablePerks: Perk[];
}

export default function PerksPanel({ unlockedPerks, availablePerks }: PerksPanelProps) {
  const tierColors: Record<PerkTier, string> = {
    basic: 'bg-green-900/30 text-green-400 border-green-700/50',
    premium: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
    epic: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
  };

  const tierEmojis: Record<PerkTier, string> = {
    basic: '📦',
    premium: '💎',
    epic: '👑',
  };

  const isUnlocked = (perkId: string) => unlockedPerks.includes(perkId);

  return (
    <div className="space-y-4">
      {/* Unlocked Perks */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Unlock className="text-green-400" size={20} />
          Unlocked Perks ({unlockedPerks.length})
        </h3>
        {unlockedPerks.length === 0 ? (
          <div className="bg-slate-900/50 rounded-xl p-6 text-center border border-slate-800">
            <Lock className="text-slate-600 mx-auto mb-2" size={32} />
            <p className="text-slate-400 text-sm">No perks unlocked yet</p>
            <p className="text-slate-500 text-xs mt-1">Level up to unlock perks!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {unlockedPerks.map((perkId, idx) => {
              const perk = PERKS.find(p => p.id === perkId);
              if (!perk) return null;

              return (
                <motion.div
                  key={perkId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl border ${tierColors[perk.tier]} backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{perk.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white">{perk.name}</h4>
                        <CheckCircle2 className="text-green-400" size={16} />
                      </div>
                      <p className="text-sm text-slate-300">{perk.effect}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Perks */}
      {availablePerks.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="text-yellow-400" size={20} />
            Available Perks ({availablePerks.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {availablePerks.map((perk, idx) => (
              <motion.div
                key={perk.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border ${tierColors[perk.tier]} backdrop-blur-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl opacity-50">{perk.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white/70">{perk.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {tierEmojis[perk.tier]} {perk.tier}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{perk.effect}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Perks Catalog */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Info className="text-blue-400" size={20} />
          All Perks ({PERKS.length})
        </h3>
        <div className="space-y-3">
          {(['basic', 'premium', 'epic'] as PerkTier[]).map((tier) => (
            <div key={tier}>
              <h4 className="text-sm font-semibold text-slate-400 mb-2 capitalize flex items-center gap-2">
                {tierEmojis[tier]} {tier} Tier
              </h4>
              <div className="space-y-2">
                {PERKS.filter(p => p.tier === tier).map((perk, idx) => (
                  <motion.div
                    key={perk.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-3 rounded-lg border ${
                      isUnlocked(perk.id)
                        ? 'bg-slate-900/50 border-slate-700'
                        : 'bg-slate-900/20 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{isUnlocked(perk.id) ? perk.emoji : '🔒'}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-medium ${isUnlocked(perk.id) ? 'text-white' : 'text-slate-500'}`}>
                            {perk.name}
                          </h5>
                          {isUnlocked(perk.id) && (
                            <CheckCircle2 className="text-green-400" size={14} />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{perk.effect}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
