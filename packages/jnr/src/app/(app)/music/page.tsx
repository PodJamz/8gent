'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Dock } from '@/components/dock/Dock';

/**
 * Music Page - Simple Music Player
 */

// Demo tracks
const DEMO_TRACKS = [
  { id: '1', title: 'Happy Song', artist: 'Kids Music', emoji: '😊', duration: '2:30' },
  { id: '2', title: 'Dance Time', artist: 'Kids Music', emoji: '💃', duration: '3:15' },
  { id: '3', title: 'Calm Waves', artist: 'Relaxing', emoji: '🌊', duration: '4:00' },
  { id: '4', title: 'Animal Friends', artist: 'Kids Music', emoji: '🐶', duration: '2:45' },
  { id: '5', title: 'Rainbow Colors', artist: 'Learning', emoji: '🌈', duration: '3:00' },
];

export default function MusicPage() {
  const { settings } = useApp();
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const primaryColor = settings.primaryColor || '#4CAF50';

  const handlePlay = (trackId: string) => {
    if (currentTrack === trackId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const current = DEMO_TRACKS.find((t) => t.id === currentTrack);

  return (
    <div className="h-screen flex flex-col bg-[#f2f2f7] overflow-hidden">
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl safe-top"
        style={{ backgroundColor: `${primaryColor}F2` }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[18px] font-semibold text-white">
            {settings.childName ? `${settings.childName}'s Music` : 'Music'}
          </span>
        </div>
      </header>

      {/* Now Playing */}
      {current && (
        <div className="px-4 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                isPlaying ? 'animate-bounce' : ''
              }`}
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              {current.emoji}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-black">{current.title}</p>
              <p className="text-gray-500 text-sm">{current.artist}</p>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-2">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide mb-2">All Songs</p>
        </div>
        <div className="bg-white mx-4 rounded-2xl overflow-hidden">
          {DEMO_TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => handlePlay(track.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-gray-50 ${
                index !== DEMO_TRACKS.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: currentTrack === track.id ? `${primaryColor}20` : '#f2f2f7',
                }}
              >
                {track.emoji}
              </div>
              <div className="flex-1">
                <p
                  className="font-medium"
                  style={{ color: currentTrack === track.id ? primaryColor : 'black' }}
                >
                  {track.title}
                </p>
                <p className="text-gray-500 text-sm">{track.artist} · {track.duration}</p>
              </div>
              {currentTrack === track.id && isPlaying && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full animate-pulse"
                      style={{
                        backgroundColor: primaryColor,
                        height: `${12 + i * 4}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="px-4 py-6 text-center">
          <p className="text-gray-400 text-sm">
            Upload music in Settings to add your own songs
          </p>
        </div>
      </div>

      {/* Dock */}
      <Dock primaryColor={primaryColor} />
    </div>
  );
}
