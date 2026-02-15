'use client';

import { BookHeart, Mic, Brain, Sparkles } from 'lucide-react';

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-orange-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
            <BookHeart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Journal</h1>
          <p className="text-amber-300/70">Stream of consciousness capture</p>
        </div>

        {/* Coming Soon Cards */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Mic className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-white font-semibold">Voice Journaling</h3>
                <p className="text-white/50 text-sm">Speak your thoughts, auto-transcribed</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Brain className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-white font-semibold">Brain Dump Mode</h3>
                <p className="text-white/50 text-sm">Unstructured capture, sort later</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-white font-semibold">AI Reflection</h3>
                <p className="text-white/50 text-sm">Pattern recognition in your entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <p className="text-amber-400/50 text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
