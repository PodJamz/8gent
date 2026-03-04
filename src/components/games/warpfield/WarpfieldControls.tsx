'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Volume2, VolumeX, Palette, ChevronDown, ChevronUp, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { tracks } from '@/data/tracks';
import * as THREE from 'three';

interface WarpfieldControlsProps {
  influenceRadius: number;
  setInfluenceRadius: (v: number) => void;
  maxDistortion: number;
  setMaxDistortion: (v: number) => void;
  dampingFactor: number;
  setDampingFactor: (v: number) => void;
  particleColor: THREE.Color;
  setParticleColor: (c: THREE.Color) => void;
  secondaryColor: THREE.Color;
  setSecondaryColor: (c: THREE.Color) => void;
  audioData: {
    bass: number;
    mid: number;
    treble: number;
    energy: number;
    beatIntensity: number;
  };
  isInitialized: boolean;
}

const colorPresets = [
  { name: 'Fire', primary: '#ff6b35', secondary: '#f7c548' },
  { name: 'Ocean', primary: '#00b4d8', secondary: '#48cae4' },
  { name: 'Forest', primary: '#2d6a4f', secondary: '#95d5b2' },
  { name: 'Neon', primary: '#ff00ff', secondary: '#00ffff' },
  { name: 'Sunset', primary: '#f72585', secondary: '#7209b7' },
  { name: 'Matrix', primary: '#00ff41', secondary: '#008f11' },
  { name: 'Gold', primary: '#ffd700', secondary: '#ff8c00' },
  { name: 'Ice', primary: '#a8dadc', secondary: '#457b9d' },
];

export default function WarpfieldControls({
  influenceRadius,
  setInfluenceRadius,
  maxDistortion,
  setMaxDistortion,
  dampingFactor,
  setDampingFactor,
  particleColor,
  setParticleColor,
  secondaryColor,
  setSecondaryColor,
  audioData,
  isInitialized,
}: WarpfieldControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isPlaying, togglePlay, currentTrack, skipToNext, skipToPrevious, selectTrack } = useMusic();
  const [showTrackList, setShowTrackList] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 right-4 z-10"
    >
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-w-[280px] max-w-[320px]">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Warpfield</h3>
              <p className="text-white/50 text-xs">Audio Reactive Controls</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/50" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/50" />
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pb-4 space-y-4">
                {/* Music Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Music</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${isInitialized ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {isInitialized ? 'Audio Active' : 'Initializing...'}
                    </span>
                  </div>

                  {/* Current Track */}
                  <button
                    onClick={() => setShowTrackList(!showTrackList)}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <p className="text-white text-sm font-medium truncate">{currentTrack?.title || 'No track'}</p>
                    <p className="text-white/40 text-xs truncate">{currentTrack?.artist || 'Select a track'}</p>
                  </button>

                  {/* Track List */}
                  <AnimatePresence>
                    {showTrackList && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1 max-h-40 overflow-y-auto"
                      >
                        {tracks.map((track) => (
                          <button
                            key={track.id}
                            onClick={() => {
                              selectTrack(track);
                              setShowTrackList(false);
                            }}
                            className={`w-full p-2 rounded-lg text-left transition-colors ${
                              currentTrack?.id === track.id
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-white/5 hover:bg-white/10 text-white/70'
                            }`}
                          >
                            <p className="text-sm truncate">{track.title}</p>
                            <p className="text-xs opacity-60 truncate">{track.artist}</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={skipToPrevious}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className={`p-4 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={skipToNext}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Audio Levels Visualizer */}
                  {isInitialized && (
                    <div className="grid grid-cols-5 gap-1 p-2 bg-white/5 rounded-lg">
                      {[
                        { label: 'Bass', value: audioData.bass, color: 'bg-red-500' },
                        { label: 'Low', value: audioData.mid * 0.5, color: 'bg-orange-500' },
                        { label: 'Mid', value: audioData.mid, color: 'bg-yellow-500' },
                        { label: 'High', value: audioData.treble * 0.7, color: 'bg-green-500' },
                        { label: 'Treble', value: audioData.treble, color: 'bg-cyan-500' },
                      ].map((band) => (
                        <div key={band.label} className="flex flex-col items-center gap-1">
                          <div className="w-full h-12 bg-black/50 rounded overflow-hidden flex flex-col-reverse">
                            <motion.div
                              className={`w-full ${band.color}`}
                              animate={{ height: `${Math.min(100, band.value * 100)}%` }}
                              transition={{ duration: 0.05 }}
                            />
                          </div>
                          <span className="text-[9px] text-white/40">{band.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10" />

                {/* Color Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Particle Color
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setParticleColor(new THREE.Color(preset.primary));
                          setSecondaryColor(new THREE.Color(preset.secondary));
                        }}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-white/30 transition-all"
                        title={preset.name}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-white/0 group-hover:text-white/90 transition-colors bg-black/0 group-hover:bg-black/50">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10" />

                {/* Sliders */}
                <div className="space-y-3">
                  {/* Influence Radius */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Influence Radius</span>
                      <span className="text-orange-400 text-xs font-mono">{influenceRadius.toFixed(0)}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={influenceRadius}
                      onChange={(e) => setInfluenceRadius(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
                        [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Max Distortion */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Max Distortion</span>
                      <span className="text-orange-400 text-xs font-mono">{(maxDistortion * 100).toFixed(0)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={maxDistortion * 100}
                      onChange={(e) => setMaxDistortion(Number(e.target.value) / 100)}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
                        [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Damping Factor */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Damping Factor</span>
                      <span className="text-orange-400 text-xs font-mono">{dampingFactor.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="99"
                      value={dampingFactor * 100}
                      onChange={(e) => setDampingFactor(Number(e.target.value) / 100)}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
                        [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                </div>

                {/* How It Works */}
                <div className="p-2 bg-white/5 rounded-lg space-y-1">
                  <p className="text-white/50 text-[10px]">
                    <span className="text-cyan-400">Highs</span> → jitter velocity
                  </p>
                  <p className="text-white/50 text-[10px]">
                    <span className="text-yellow-400">Mids</span> → particle size
                  </p>
                  <p className="text-white/50 text-[10px]">
                    <span className="text-red-400">Bass</span> → wavefront pulse
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
