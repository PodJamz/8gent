'use client';

import Link from 'next/link';

/**
 * Voice Designer Page
 *
 * Where users can create and customize their voice.
 * Uses ElevenLabs or other TTS services.
 */
export default function VoicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-gray-400 hover:text-gray-600">
            &larr;
          </Link>
          <span className="font-bold text-gray-900">Voice Designer</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Create Your Voice
          </h1>
          <p className="text-gray-600 mb-6">
            Record a short sample and we&apos;ll create a unique voice that sounds
            like you. Your voice, your way.
          </p>
          <button
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl
                     hover:bg-blue-700 active:scale-95 transition-all
                     shadow-lg shadow-blue-200"
          >
            Start Recording
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Coming soon with ElevenLabs integration
          </p>
        </div>
      </div>
    </div>
  );
}
