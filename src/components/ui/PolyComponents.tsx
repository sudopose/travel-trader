// Polished UI Components
'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-lg
        border border-white/10
        rounded-2xl
        p-6
        shadow-xl
        shadow-black/20
        ${onClick ? 'cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

interface GradientButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  disabled?: boolean;
  className?: string;
}

export function GradientButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: GradientButtonProps) {
  const variants = {
    primary: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    secondary: 'from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800',
    success: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
    danger: 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
    warning: 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700',
  };

  return (
    <motion.button
      whileHover={{ scale: !disabled ? 1.02 : 1 }}
      whileTap={{ scale: !disabled ? 0.98 : 1 }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        bg-gradient-to-r ${variants[variant]}
        text-white
        font-semibold
        px-6
        py-3
        rounded-xl
        shadow-lg
        transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'gold' | 'items' | 'turns' | 'locations';
}

export function StatCard({ label, value, icon, variant = 'gold' }: StatCardProps) {
  const variants = {
    gold: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    items: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    turns: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    locations: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        bg-gradient-to-br ${variants[variant]}
        backdrop-blur-md
        border
        rounded-xl
        p-4
        flex items-center gap-3
      `}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-white/70 text-sm font-medium">{label}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
      </div>
    </motion.div>
  );
}

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || <div className="text-2xl font-bold text-white">{progress}%</div>}
      </div>
    </div>
  );
}

interface ConfettiProps {
  show: boolean;
}

export function Confetti({ show }: ConfettiProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            scale: Math.random() + 0.5,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 1.5 + Math.random(),
            ease: 'easeOut',
            delay: Math.random() * 0.3,
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][
              Math.floor(Math.random() * 6)
            ],
          }}
        />
      ))}
    </div>
  );
}
