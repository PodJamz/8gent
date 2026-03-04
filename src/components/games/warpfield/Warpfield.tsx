'use client';

import { useState, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { MusicProvider, useMusic } from '@/context/MusicContext';
import { tracks } from '@/data/tracks';
import WarpfieldParticles from './WarpfieldParticles';
import WarpfieldControls from './WarpfieldControls';
import * as THREE from 'three';
import Link from 'next/link';
import { ArrowLeft, Maximize2, Minimize2, Play, Music } from 'lucide-react';

// Audio analyzer hook that connects directly to the music context
function useSimpleAudioAnalyzer() {
  const { audioRef, isPlaying } = useMusic();
  const [audioData, setAudioData] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
    beatIntensity: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const audioContextRef = { current: null as AudioContext | null };
  const analyserRef = { current: null as AnalyserNode | null };
  const sourceRef = { current: null as MediaElementAudioSourceNode | null };
  const animationRef = { current: null as number | null };
  const lastBassRef = { current: 0 };
  const beatIntensityRef = { current: 0 };

  const initialize = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isInitialized) return false;

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create analyser
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect audio element to analyser
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      sourceRef.current = source;

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
      return false;
    }
  }, [audioRef, isInitialized]);

  // Analysis loop
  useEffect(() => {
    if (!isInitialized || !analyserRef.current) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);

    const analyze = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(frequencyData);

      // Calculate frequency bands
      const binCount = frequencyData.length;
      const getAverage = (start: number, end: number) => {
        let sum = 0;
        for (let i = start; i < Math.min(end, binCount); i++) {
          sum += frequencyData[i];
        }
        return sum / (end - start) / 255;
      };

      const bass = getAverage(0, Math.floor(binCount * 0.1));
      const mid = getAverage(Math.floor(binCount * 0.1), Math.floor(binCount * 0.5));
      const treble = getAverage(Math.floor(binCount * 0.5), binCount);

      // Overall energy
      let totalEnergy = 0;
      for (let i = 0; i < binCount; i++) {
        totalEnergy += frequencyData[i];
      }
      const energy = totalEnergy / (binCount * 255);

      // Beat detection
      const bassThreshold = lastBassRef.current * 1.3;
      const isBeat = bass > bassThreshold && bass > 0.3;
      if (isBeat) {
        beatIntensityRef.current = Math.min(1, bass * 1.5);
      } else {
        beatIntensityRef.current *= 0.95;
      }
      lastBassRef.current = bass;

      if (isPlaying) {
        setAudioData({
          bass,
          mid,
          treble,
          energy,
          beatIntensity: beatIntensityRef.current,
        });
      } else {
        setAudioData({
          bass: 0,
          mid: 0,
          treble: 0,
          energy: 0,
          beatIntensity: 0,
        });
      }

      animationRef.current = requestAnimationFrame(analyze);
    };

    animationRef.current = requestAnimationFrame(analyze);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, isPlaying]);

  return { audioData, isInitialized, initialize };
}

function WarpfieldScene({
  influenceRadius,
  maxDistortion,
  dampingFactor,
  particleColor,
  secondaryColor,
  audioData,
}: {
  influenceRadius: number;
  maxDistortion: number;
  dampingFactor: number;
  particleColor: THREE.Color;
  secondaryColor: THREE.Color;
  audioData: {
    bass: number;
    mid: number;
    treble: number;
    energy: number;
    beatIntensity: number;
  };
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={4}
        maxDistance={15}
        enablePan={false}
      />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff6b35" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ff88" />

      {/* Main particle system */}
      <Suspense fallback={null}>
        <WarpfieldParticles
          particleCount={5000}
          baseRadius={3}
          influenceRadius={influenceRadius / 100}
          maxDistortion={maxDistortion}
          dampingFactor={dampingFactor}
          particleColor={particleColor}
          secondaryColor={secondaryColor}
          audioData={audioData}
        />
      </Suspense>
    </>
  );
}

function WarpfieldInner() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { isPlaying, togglePlay, currentTrack, selectTrack } = useMusic();
  const { audioData, isInitialized, initialize } = useSimpleAudioAnalyzer();

  // Control states
  const [influenceRadius, setInfluenceRadius] = useState(117);
  const [maxDistortion, setMaxDistortion] = useState(0.33);
  const [dampingFactor, setDampingFactor] = useState(0.92);
  const [particleColor, setParticleColor] = useState(new THREE.Color('#ff6b35'));
  const [secondaryColor, setSecondaryColor] = useState(new THREE.Color('#00ff88'));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleStart = () => {
    // Initialize audio on user gesture
    const success = initialize();
    if (success) {
      togglePlay();
    }
    setHasStarted(true);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Start Screen */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Music className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Warpfield</h1>
            <p className="text-white/60 max-w-md mx-auto">
              An audio-reactive particle experience. Particles respond to music:
              highs add jitter, mids expand size, bass creates wavefronts.
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl text-white font-semibold text-lg flex items-center gap-3 mx-auto hover:scale-105 transition-transform"
            >
              <Play className="w-6 h-6" />
              Start Experience
            </button>
            <p className="text-white/40 text-sm">Tap to enable audio and begin</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Link
          href="/games"
          className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>

        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Controls Panel */}
      {hasStarted && (
        <WarpfieldControls
          influenceRadius={influenceRadius}
          setInfluenceRadius={setInfluenceRadius}
          maxDistortion={maxDistortion}
          setMaxDistortion={setMaxDistortion}
          dampingFactor={dampingFactor}
          setDampingFactor={setDampingFactor}
          particleColor={particleColor}
          setParticleColor={setParticleColor}
          secondaryColor={secondaryColor}
          setSecondaryColor={setSecondaryColor}
          audioData={audioData}
          isInitialized={isInitialized}
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <WarpfieldScene
          influenceRadius={influenceRadius}
          maxDistortion={maxDistortion}
          dampingFactor={dampingFactor}
          particleColor={particleColor}
          secondaryColor={secondaryColor}
          audioData={audioData}
        />
      </Canvas>

      {/* Title overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <h1 className="text-white/20 text-2xl font-light tracking-widest">WARPFIELD</h1>
        <p className="text-white/10 text-xs mt-1">physics + music + art</p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 text-right">
        <p className="text-white/30 text-xs">Drag to rotate</p>
        <p className="text-white/30 text-xs">Scroll to zoom</p>
      </div>
    </div>
  );
}

export default function Warpfield() {
  return (
    <MusicProvider>
      <WarpfieldInner />
    </MusicProvider>
  );
}
