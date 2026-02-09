// Particle Effects System
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface ParticlesProps {
  count: number;
  origin: { x: number; y: number };
  colors: string[];
  onComplete?: () => void;
}

export default function ParticleExplosion({
  count,
  origin,
  colors,
  onComplete,
}: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 3 + Math.random() * 5;
      return {
        id: `particle-${i}`,
        x: origin.x,
        y: origin.y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        velocity: {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity,
        },
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [count, origin, colors, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: particle.x + particle.velocity.x * 60,
              y: particle.y + particle.velocity.y * 60 + 200,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
            }}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface SparklesProps {
  show: boolean;
  count?: number;
}

export function Sparkles({ show, count = 30 }: SparklesProps) {
  if (!show) return null;

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <ParticleExplosion
      count={count}
      origin={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
      colors={colors}
    />
  );
}

interface FloatingTextProps {
  text: string;
  show: boolean;
  color?: string;
}

export function FloatingText({ text, show, color = '#4ADE80' }: FloatingTextProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0, opacity: 0, scale: 0.5 }}
        animate={{
          y: -100,
          opacity: [0, 1, 0],
          scale: [0.5, 1.2, 1],
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-50"
        style={{ color }}
      >
        <div className="text-6xl font-bold drop-shadow-2xl">
          {text}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface PulseEffectProps {
  show: boolean;
  color?: string;
  size?: number;
}

export function PulseEffect({ show, color = 'rgba(59, 130, 246, 0.5)', size = 200 }: PulseEffectProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0.8, 0, 0] }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
    </AnimatePresence>
  );
}
