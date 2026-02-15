'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { GALLERY_IMAGES } from '@/lib/gallery-images';

const TOTAL_ROUNDS = 50;
const COLORS = [
  { name: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-400', ring: 'ring-red-400' },
  { name: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-400', ring: 'ring-green-400' },
  { name: 'blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-400', ring: 'ring-blue-400' },
  { name: 'yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-400', ring: 'ring-yellow-400' },
];

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = 'intuition_leaderboard';

function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveToLeaderboard(entry: LeaderboardEntry) {
  const current = getLeaderboard();
  current.push(entry);
  current.sort((a, b) => b.score - a.score);
  const top20 = current.slice(0, 20);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top20));
  return top20;
}

export default function IntuitionGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result' | 'leaderboard'>('intro');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCard, setCorrectCard] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [revealedImages, setRevealedImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Initialize random card and image for each round
  const initRound = useCallback(() => {
    const randomCard = Math.floor(Math.random() * 4);
    setCorrectCard(randomCard);
    setSelectedCard(null);
    setShowResult(false);

    // Pick a random image from gallery
    const availableImages = GALLERY_IMAGES.filter(img => !revealedImages.includes(img.src));
    const imagePool = availableImages.length > 0 ? availableImages : GALLERY_IMAGES;
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
    setCurrentImage(randomImage.src);
  }, [revealedImages]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setRevealedImages([]);
    initRound();
  };

  // Haptic feedback
  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Handle card selection
  const selectCard = (index: number) => {
    if (showResult) return;

    setSelectedCard(index);
    setShowResult(true);

    const isCorrect = index === correctCard;

    if (isCorrect) {
      // Success vibration - short burst
      vibrate([50, 30, 50]);
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      setRevealedImages(prev => [...prev, currentImage]);
    } else {
      // Fail vibration - long buzz
      vibrate(200);
      setStreak(0);
    }

    // Move to next round after delay
    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setGameState('result');
        setLeaderboard(getLeaderboard());
      } else {
        setRound(r => r + 1);
        initRound();
      }
    }, isCorrect ? 1500 : 1000);
  };

  // Submit score to leaderboard
  const submitScore = () => {
    if (!playerName.trim()) return;
    const newLeaderboard = saveToLeaderboard({
      name: playerName.trim(),
      score,
      date: new Date().toISOString().split('T')[0],
    });
    setLeaderboard(newLeaderboard);
    setGameState('leaderboard');
  };

  // Calculate percentage and rating
  const percentage = Math.round((score / TOTAL_ROUNDS) * 100);
  const chanceLevel = 25; // 1 in 4 = 25%
  const rating = percentage >= 40 ? 'Psychic!' : percentage >= 30 ? 'Gifted' : percentage >= 25 ? 'Average' : 'Keep practicing';

  // Load leaderboard on mount
  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  // Initialize round when game starts
  useEffect(() => {
    if (gameState === 'playing' && round === 1) {
      initRound();
    }
  }, [gameState, round, initRound]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">

        {/* INTRO SCREEN */}
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">Intuition</h1>
              <p className="text-purple-300/70 mb-8 max-w-sm mx-auto">
                Test your telepathic abilities. Sense which card hides the image.
                50 rounds. Can you beat chance?
              </p>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-white font-semibold mb-3">How to play:</h3>
                <ul className="text-purple-200/60 text-sm space-y-2">
                  <li>• 4 colored cards, 1 hides an image</li>
                  <li>• Trust your gut - tap the card you sense</li>
                  <li>• Correct = vibrate + reveal image</li>
                  <li>• 25% is chance. Can you do better?</li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl text-white font-semibold text-lg hover:from-purple-400 hover:to-indigo-400 transition-all"
              >
                Begin Test
              </button>

              {leaderboard.length > 0 && (
                <button
                  onClick={() => setGameState('leaderboard')}
                  className="block mx-auto mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View Leaderboard
                </button>
              )}
            </motion.div>
          )}

          {/* PLAYING SCREEN */}
          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header Stats */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-purple-300">
                  <span className="text-white font-bold text-xl">{round}</span>
                  <span className="text-purple-400">/{TOTAL_ROUNDS}</span>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 text-xs uppercase tracking-wide">Score</div>
                  <div className="text-white font-bold text-2xl">{score}</div>
                </div>
                <div className="text-right">
                  <div className="text-purple-400 text-xs uppercase tracking-wide">Streak</div>
                  <div className="text-yellow-400 font-bold">{streak > 0 ? `🔥 ${streak}` : '-'}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
                />
              </div>

              {/* Instruction */}
              <div className="text-center mb-8">
                <p className="text-purple-200/80 text-lg">
                  {showResult
                    ? selectedCard === correctCard
                      ? '✨ You sensed it!'
                      : 'Not this time...'
                    : 'Which card hides the image?'
                  }
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {COLORS.map((color, index) => (
                  <motion.button
                    key={color.name}
                    onClick={() => selectCard(index)}
                    disabled={showResult}
                    className={`
                      relative aspect-square rounded-2xl ${color.bg} ${!showResult && color.hover}
                      transition-all overflow-hidden
                      ${selectedCard === index ? `ring-4 ${color.ring} ring-offset-2 ring-offset-slate-900` : ''}
                      ${showResult && index !== correctCard ? 'opacity-50' : ''}
                    `}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    {/* Reveal image on correct card */}
                    <AnimatePresence>
                      {showResult && index === correctCard && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0"
                        >
                          <img
                            src={currentImage}
                            alt="Hidden image"
                            className="w-full h-full object-cover"
                          />
                          {selectedCard === correctCard && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center bg-black/30"
                            >
                              <Sparkles className="w-12 h-12 text-yellow-400" />
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Wrong indicator */}
                    {showResult && selectedCard === index && index !== correctCard && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                      >
                        <span className="text-4xl">✕</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Revealed Images Preview */}
              {revealedImages.length > 0 && (
                <div className="flex justify-center gap-1 flex-wrap">
                  {revealedImages.slice(-10).map((img, i) => (
                    <div key={i} className="w-8 h-8 rounded overflow-hidden opacity-60">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* RESULT SCREEN */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
              <p className="text-purple-300 text-lg mb-6">{rating}</p>

              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  {score}<span className="text-purple-400 text-2xl">/{TOTAL_ROUNDS}</span>
                </div>
                <div className="text-purple-300">{percentage}% accuracy</div>
                <div className="text-purple-400/60 text-sm mt-2">
                  Chance level: {chanceLevel}%
                </div>
                {bestStreak > 1 && (
                  <div className="text-yellow-400 mt-2">
                    Best streak: 🔥 {bestStreak}
                  </div>
                )}
              </div>

              {/* Name entry */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <label className="block text-purple-300 text-sm mb-2">Enter your name for the leaderboard:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name..."
                  maxLength={20}
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                />
                <button
                  onClick={submitScore}
                  disabled={!playerName.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-400 hover:to-indigo-400 transition-all"
                >
                  Submit Score
                </button>
              </div>

              <button
                onClick={startGame}
                className="flex items-center gap-2 mx-auto text-purple-400 hover:text-purple-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </motion.div>
          )}

          {/* LEADERBOARD SCREEN */}
          {gameState === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="text-center mb-8">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
                <p className="text-purple-300/60">Top telepaths</p>
              </div>

              <div className="bg-white/5 rounded-2xl overflow-hidden mb-8">
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-purple-400/60">
                    No scores yet. Be the first!
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {leaderboard.map((entry, i) => (
                      <div key={i} className="flex items-center gap-4 p-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          i === 0 ? 'bg-yellow-500 text-yellow-900' :
                          i === 1 ? 'bg-gray-300 text-gray-700' :
                          i === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-white/10 text-white/60'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{entry.name}</div>
                          <div className="text-purple-400/60 text-xs">{entry.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{entry.score}/{TOTAL_ROUNDS}</div>
                          <div className="text-purple-400/60 text-xs">{Math.round((entry.score / TOTAL_ROUNDS) * 100)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white font-semibold hover:from-purple-400 hover:to-indigo-400 transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setGameState('intro')}
                  className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
