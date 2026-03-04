'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AAC_CATEGORIES,
  getPhrasesByCategory,
  type AACCategory,
  type AACPhrase,
} from '@/lib/aac/vocabulary';

/**
 * Main AAC App Page
 *
 * Grid 3 / Smartbox style AAC board using ARASAAC pictographic symbols.
 * Clean white cards, proper Fitzgerald Key color coding.
 */

export default function AACAppPage() {
  const [sentence, setSentence] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<AACCategory | null>(null);

  const handleCardTap = (phrase: AACPhrase) => {
    const textToSpeak = phrase.spokenText || phrase.text;
    setSentence([...sentence, phrase.text]);

    // Speak the word using Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      speechSynthesis.speak(utterance);
    }
  };

  const handleCategoryTap = (category: AACCategory) => {
    setActiveCategory(category);
  };

  const handleBack = () => {
    setActiveCategory(null);
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

  const handleBackspace = () => {
    setSentence(sentence.slice(0, -1));
  };

  // Get phrases for active category
  const phrases = activeCategory ? getPhrasesByCategory(activeCategory.id) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Header - Grid 3 style green bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#4CAF50] text-white">
        <div className="flex items-center gap-3">
          {activeCategory ? (
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
          ) : (
            <span className="text-xl font-bold">8gent</span>
          )}
          {activeCategory && (
            <span className="font-semibold">{activeCategory.name}</span>
          )}
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/voice"
            className="px-3 py-1.5 text-sm bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Voice
          </Link>
          <Link
            href="/settings"
            className="px-3 py-1.5 text-sm bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Settings
          </Link>
        </nav>
      </header>

      {/* Sentence Strip - Gray bar */}
      <div className="p-3 bg-[#e0e0e0] border-b border-gray-300">
        <div className="flex items-center gap-2 min-h-[56px] p-3 bg-white rounded-lg shadow-sm">
          {sentence.length === 0 ? (
            <span className="text-gray-400 text-lg">
              Tap cards to build a sentence...
            </span>
          ) : (
            <>
              {sentence.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium text-lg"
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
            className="flex-1 py-3 bg-[#4CAF50] text-white font-semibold rounded-xl
                     hover:bg-[#43A047] active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔊</span>
            <span>Speak</span>
          </button>
          <button
            onClick={handleBackspace}
            disabled={sentence.length === 0}
            className="px-5 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300
                     hover:bg-gray-50 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⌫
          </button>
          <button
            onClick={handleClear}
            disabled={sentence.length === 0}
            className="px-5 py-3 bg-white text-red-600 font-semibold rounded-xl border border-gray-300
                     hover:bg-red-50 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeCategory ? (
          // Show phrases for selected category
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {phrases.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => handleCardTap(phrase)}
                className="bg-white rounded-xl p-3 flex flex-col items-center justify-center
                          aspect-square shadow-sm hover:shadow-md hover:scale-[1.02]
                          active:scale-95 transition-all border-2 border-transparent
                          hover:border-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              >
                <div className="relative w-full h-3/5 mb-2">
                  <Image
                    src={phrase.imageUrl}
                    alt={phrase.text}
                    fill
                    className="object-contain"
                    unoptimized // ARASAAC images are external
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
                  {phrase.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          // Show categories
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {AAC_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryTap(category)}
                className="bg-white rounded-xl p-3 flex flex-col items-center justify-center
                          aspect-square shadow-sm hover:shadow-md hover:scale-[1.02]
                          active:scale-95 transition-all border-4"
                style={{ borderColor: category.color }}
              >
                <div className="relative w-full h-3/5 mb-2">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-contain"
                    unoptimized // ARASAAC images are external
                  />
                </div>
                <span
                  className="text-sm font-bold text-center leading-tight"
                  style={{ color: category.color }}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-3 text-center text-xs text-gray-400 bg-white border-t border-gray-200">
        8gent · Your Voice, Your Way · Symbols © ARASAAC
      </footer>
    </div>
  );
}
