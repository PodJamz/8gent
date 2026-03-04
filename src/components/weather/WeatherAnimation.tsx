'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { WeatherConditionType } from './types';

interface WeatherAnimationProps {
  condition: WeatherConditionType;
  className?: string;
}

// Rain animation component
function RainAnimation() {
  const drops = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.4,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map(drop => (
        <motion.div
          key={drop.id}
          className="absolute w-0.5 h-4 rounded-full"
          style={{
            left: drop.left,
            background: 'linear-gradient(to bottom, transparent, rgba(200, 220, 255, 0.6))',
            opacity: drop.opacity,
          }}
          initial={{ y: -20 }}
          animate={{ y: '100vh' }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Sun animation component
function SunAnimation() {
  const rays = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      rotation: i * 30,
    })), []
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        className="relative w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {/* Sun rays */}
        {rays.map(ray => (
          <motion.div
            key={ray.id}
            className="absolute top-1/2 left-1/2 w-1 h-16 -ml-0.5 origin-bottom"
            style={{
              transform: `rotate(${ray.rotation}deg) translateY(-100%)`,
              background: 'linear-gradient(to top, rgba(255, 220, 100, 0.6), transparent)',
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: ray.id * 0.1 }}
          />
        ))}

        {/* Sun core */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 220, 100, 0.8), rgba(255, 180, 50, 0.4))',
            boxShadow: '0 0 40px rgba(255, 200, 100, 0.5)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

// Cloud animation component
function CloudAnimation() {
  const clouds = useMemo(() => [
    { id: 1, top: '10%', size: 1.2, duration: 30, delay: 0 },
    { id: 2, top: '25%', size: 0.8, duration: 25, delay: 5 },
    { id: 3, top: '40%', size: 1, duration: 35, delay: 10 },
    { id: 4, top: '20%', size: 0.6, duration: 28, delay: 15 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            top: cloud.top,
            transform: `scale(${cloud.size})`,
          }}
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <CloudShape />
        </motion.div>
      ))}
    </div>
  );
}

function CloudShape() {
  return (
    <div className="relative">
      <div
        className="w-20 h-8 rounded-full"
        style={{ background: 'rgba(255, 255, 255, 0.3)' }}
      />
      <div
        className="absolute -top-3 left-4 w-10 h-10 rounded-full"
        style={{ background: 'rgba(255, 255, 255, 0.25)' }}
      />
      <div
        className="absolute -top-2 left-10 w-8 h-8 rounded-full"
        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
      />
    </div>
  );
}

// Storm animation component
function StormAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark clouds */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/40 to-transparent" />

      {/* Rain */}
      <RainAnimation />

      {/* Lightning flashes */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 0.8, 0, 0.5, 0, 0, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
      />
    </div>
  );
}

// Snow animation component
function SnowAnimation() {
  const flakes = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      size: 2 + Math.random() * 4,
      sway: 20 + Math.random() * 30,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map(flake => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white/70"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
          }}
          initial={{ y: -10, x: 0 }}
          animate={{
            y: '100vh',
            x: [0, flake.sway, 0, -flake.sway, 0],
          }}
          transition={{
            y: { duration: flake.duration, delay: flake.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: flake.duration * 0.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </div>
  );
}

// Fog animation component
function FogAnimation() {
  const fogLayers = useMemo(() => [
    { id: 1, opacity: 0.2, duration: 20, y: '20%' },
    { id: 2, opacity: 0.15, duration: 25, y: '40%' },
    { id: 3, opacity: 0.25, duration: 18, y: '60%' },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fogLayers.map(layer => (
        <motion.div
          key={layer.id}
          className="absolute w-[200%] h-24"
          style={{
            top: layer.y,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${layer.opacity}), transparent)`,
          }}
          initial={{ x: '-50%' }}
          animate={{ x: '0%' }}
          transition={{
            duration: layer.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Background gradients for each weather condition
const WEATHER_BACKGROUNDS: Record<WeatherConditionType, string> = {
  sunny: 'linear-gradient(180deg, #87CEEB 0%, #FFE4B5 100%)',
  cloudy: 'linear-gradient(180deg, #8E9EAB 0%, #B8C6DB 100%)',
  rainy: 'linear-gradient(180deg, #536976 0%, #292E49 100%)',
  stormy: 'linear-gradient(180deg, #232526 0%, #414345 100%)',
  snowy: 'linear-gradient(180deg, #E6DADA 0%, #274046 100%)',
  foggy: 'linear-gradient(180deg, #757F9A 0%, #D7DDE8 100%)',
};

export function WeatherAnimation({ condition, className = '' }: WeatherAnimationProps) {
  const AnimationComponent = {
    sunny: SunAnimation,
    cloudy: CloudAnimation,
    rainy: RainAnimation,
    stormy: StormAnimation,
    snowy: SnowAnimation,
    foggy: FogAnimation,
  }[condition];

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ background: WEATHER_BACKGROUNDS[condition] }}
    >
      <AnimationComponent />
    </div>
  );
}

// Export background colors for use elsewhere
export { WEATHER_BACKGROUNDS };
