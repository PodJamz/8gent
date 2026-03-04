'use client';

import { useState, useEffect } from 'react';
import { GAME_COMPONENTS } from '@/lib/schooltube/games';
import type { Reel } from '@/lib/schooltube/data';

type GamePlayerProps = {
  reel: Reel;
  primaryColor: string;
  onClose: () => void;
};

export function GamePlayer({ reel, primaryColor, onClose }: GamePlayerProps) {
  const [score, setScore] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    setScore(0);
    setShowComplete(false);
    setGameKey((k) => k + 1);
  }, [reel]);

  const handleScore = () => {
    setScore((s) => s + 10);
  };

  const handleComplete = () => {
    setShowComplete(true);
  };

  const handleRestart = () => {
    setScore(0);
    setShowComplete(false);
    setGameKey((k) => k + 1);
  };

  const GameComponent = GAME_COMPONENTS[reel.gameType || 'counting'];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 safe-top">
        <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
          <span className="text-xl font-bold" style={{ color: primaryColor }}>
            Score: {score}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRestart}
            className="h-12 w-12 rounded-2xl bg-white/90 hover:bg-white shadow-lg flex items-center justify-center"
          >
            <span className="text-xl">🔄</span>
          </button>
          <button
            onClick={onClose}
            className="h-12 w-12 rounded-2xl bg-white/90 hover:bg-white shadow-lg flex items-center justify-center"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>
      </div>

      {/* Game title */}
      <h2 className="text-xl font-bold text-center text-white mb-3 drop-shadow-md px-4">
        {reel.title}
      </h2>

      {/* Game content */}
      <div className="flex-1 bg-white rounded-t-3xl p-4 shadow-2xl overflow-hidden safe-bottom">
        {!showComplete && GameComponent && (
          <GameComponent key={gameKey} onScore={handleScore} onComplete={handleComplete} />
        )}

        {showComplete && (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <div className="text-5xl animate-pulse">🏆</div>

            <h3 className="text-3xl font-bold" style={{ color: primaryColor }}>
              Amazing!
            </h3>
            <p className="text-xl text-gray-600">
              You scored <span className="font-bold" style={{ color: primaryColor }}>{score}</span> points!
            </p>

            <div className="flex gap-2 text-4xl">
              {['🎉', '😄', '🥳', '⭐', '🎊'].map((emoji, i) => (
                <span
                  key={i}
                  className="animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleRestart}
                className="px-8 py-4 text-lg font-bold rounded-2xl text-white shadow-lg active:scale-95 transition-transform"
                style={{ backgroundColor: primaryColor }}
              >
                Play Again 🎮
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 text-lg font-bold rounded-2xl border-2 shadow-lg active:scale-95 transition-transform"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Done ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
