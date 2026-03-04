'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Dock } from '@/components/dock/Dock';

/**
 * Intuition Game - Kid-friendly telepathy/guessing game
 *
 * Simplified version of the main 8gent Intuition game.
 * Child guesses which card has the hidden image.
 */

const IMAGES = ['🌟', '🌈', '🦋', '🌺', '🐬', '🎈', '🍎', '🌙'];

export default function IntuitionPage() {
  const { settings } = useApp();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(10);
  const [targetCard, setTargetCard] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState('🌟');
  const [showResult, setShowResult] = useState(false);

  const primaryColor = settings.primaryColor || '#4CAF50';

  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setScore(0);
    nextRound();
  };

  const nextRound = () => {
    setSelectedCard(null);
    setShowResult(false);
    setTargetCard(Math.floor(Math.random() * 4));
    setCurrentImage(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
  };

  const handleCardSelect = (index: number) => {
    if (showResult) return;

    setSelectedCard(index);
    setShowResult(true);

    if (index === targetCard) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after delay
    setTimeout(() => {
      if (round >= totalRounds) {
        setGameState('result');
      } else {
        setRound((prev) => prev + 1);
        nextRound();
      }
    }, 1500);
  };

  const getResultMessage = () => {
    const percentage = (score / totalRounds) * 100;
    if (percentage >= 50) return { emoji: '🌟', text: 'Amazing intuition!' };
    if (percentage >= 30) return { emoji: '✨', text: 'Great job!' };
    return { emoji: '💫', text: 'Keep practicing!' };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl safe-top"
        style={{ backgroundColor: `${primaryColor}F2` }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[18px] font-semibold text-white">Intuition</span>
          {gameState === 'playing' && (
            <span className="text-white/80 text-[15px]">
              Round {round}/{totalRounds}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        {/* Intro Screen */}
        {gameState === 'intro' && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Intuition</h1>
            <p className="text-purple-300/80 mb-8 max-w-xs mx-auto">
              Use your mind to sense which card has the hidden picture!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-2xl text-white text-lg font-semibold shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Start Game
            </button>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === 'playing' && (
          <div className="w-full max-w-sm">
            {/* Score */}
            <div className="text-center mb-6">
              <span className="text-purple-300/80 text-lg">Score: </span>
              <span className="text-white text-2xl font-bold">{score}</span>
            </div>

            {/* Target Image Preview */}
            <div className="text-center mb-8">
              <p className="text-purple-300/80 mb-2">Find the hidden:</p>
              <span className="text-6xl">{currentImage}</span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => {
                const isTarget = index === targetCard;
                const isSelected = index === selectedCard;
                const showImage = showResult && isTarget;

                return (
                  <button
                    key={index}
                    onClick={() => handleCardSelect(index)}
                    disabled={showResult}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-5xl transition-all duration-300 ${
                      showResult
                        ? isTarget
                          ? 'bg-green-500/80 scale-105'
                          : isSelected
                            ? 'bg-red-500/80'
                            : 'bg-white/20'
                        : 'bg-white/20 hover:bg-white/30 active:scale-95'
                    }`}
                  >
                    {showImage ? currentImage : '❓'}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showResult && (
              <div className="text-center mt-6">
                <p className="text-2xl">
                  {selectedCard === targetCard ? '🎉 Correct!' : '😅 Try again!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {gameState === 'result' && (
          <div className="text-center">
            <span className="text-7xl mb-4 block">{getResultMessage().emoji}</span>
            <h2 className="text-3xl font-bold text-white mb-2">{getResultMessage().text}</h2>
            <p className="text-purple-300/80 text-xl mb-2">
              {score} out of {totalRounds}
            </p>
            <p className="text-purple-300/60 mb-8">
              {Math.round((score / totalRounds) * 100)}% accuracy
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-2xl text-white text-lg font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Dock */}
      <Dock primaryColor={primaryColor} />
    </div>
  );
}
