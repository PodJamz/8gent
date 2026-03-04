'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Main AAC App Page
 *
 * The core communication board where users tap cards to speak.
 * This is a simplified version - the full implementation uses
 * the components in src/components/aac/.
 */

// Sample categories following Fitzgerald Key color coding
const CATEGORIES = [
  { id: 'people', label: 'People', color: 'bg-yellow-400', emoji: '👤' },
  { id: 'actions', label: 'Actions', color: 'bg-green-400', emoji: '🏃' },
  { id: 'things', label: 'Things', color: 'bg-orange-400', emoji: '📦' },
  { id: 'places', label: 'Places', color: 'bg-purple-400', emoji: '🏠' },
  { id: 'feelings', label: 'Feelings', color: 'bg-blue-400', emoji: '😊' },
  { id: 'questions', label: 'Questions', color: 'bg-pink-400', emoji: '❓' },
];

// Sample cards for demo
const SAMPLE_CARDS = [
  { id: '1', label: 'I want', category: 'people', emoji: '🙋' },
  { id: '2', label: 'Help', category: 'actions', emoji: '🆘' },
  { id: '3', label: 'Yes', category: 'things', emoji: '✅' },
  { id: '4', label: 'No', category: 'things', emoji: '❌' },
  { id: '5', label: 'More', category: 'actions', emoji: '➕' },
  { id: '6', label: 'Done', category: 'actions', emoji: '✔️' },
  { id: '7', label: 'Eat', category: 'actions', emoji: '🍽️' },
  { id: '8', label: 'Drink', category: 'actions', emoji: '🥤' },
  { id: '9', label: 'Play', category: 'actions', emoji: '🎮' },
  { id: '10', label: 'Happy', category: 'feelings', emoji: '😊' },
  { id: '11', label: 'Sad', category: 'feelings', emoji: '😢' },
  { id: '12', label: 'Tired', category: 'feelings', emoji: '😴' },
];

export default function AACAppPage() {
  const [sentence, setSentence] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCardTap = (label: string) => {
    // Add to sentence strip
    setSentence([...sentence, label]);

    // Speak the word using Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(label);
      speechSynthesis.speak(utterance);
    }
  };

  const handleSpeak = () => {
    if (sentence.length === 0) return;

    const text = sentence.join(' ');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleClear = () => {
    setSentence([]);
  };

  const filteredCards = activeCategory
    ? SAMPLE_CARDS.filter((card) => card.category === activeCategory)
    : SAMPLE_CARDS;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗣️</span>
          <span className="font-bold text-gray-900">8gent</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/voice"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Voice
          </Link>
          <Link
            href="/settings"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Settings
          </Link>
        </nav>
      </header>

      {/* Sentence Strip */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 min-h-[60px] p-3 bg-gray-50 rounded-xl">
          {sentence.length === 0 ? (
            <span className="text-gray-400 text-lg">
              Tap cards to build a sentence...
            </span>
          ) : (
            <>
              {sentence.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                >
                  {word}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSpeak}
            disabled={sentence.length === 0}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl
                     hover:bg-blue-700 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔊 Speak
          </button>
          <button
            onClick={handleClear}
            disabled={sentence.length === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl
                     hover:bg-gray-300 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 p-4 overflow-x-auto bg-white/50">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
                    ${
                      activeCategory === null
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
                      ${
                        activeCategory === cat.id
                          ? `${cat.color} text-white`
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredCards.map((card) => {
            const category = CATEGORIES.find((c) => c.id === card.category);
            return (
              <button
                key={card.id}
                onClick={() => handleCardTap(card.label)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center
                          aspect-square ${category?.color || 'bg-gray-200'}
                          hover:scale-105 active:scale-95 transition-transform
                          shadow-sm hover:shadow-md`}
              >
                <span className="text-4xl mb-2">{card.emoji}</span>
                <span className="text-sm font-semibold text-white drop-shadow-sm">
                  {card.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-400 bg-white/50 border-t border-gray-100">
        8gent &middot; Your Voice, Your Way
      </footer>
    </div>
  );
}
