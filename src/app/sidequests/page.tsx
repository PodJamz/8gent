'use client';

import { Compass, Shuffle, Trophy, Sparkles } from 'lucide-react';

export default function SideQuestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-purple-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Side Quests</h1>
          <p className="text-violet-300/70">Productive procrastination engine</p>
        </div>

        {/* Coming Soon Cards */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Shuffle className="w-8 h-8 text-violet-400" />
              <div>
                <h3 className="text-white font-semibold">Random Quest Generator</h3>
                <p className="text-white/50 text-sm">Stuck? Get a random productive task</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Trophy className="w-8 h-8 text-violet-400" />
              <div>
                <h3 className="text-white font-semibold">Achievement System</h3>
                <p className="text-white/50 text-sm">Gamify boring tasks, unlock badges</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Sparkles className="w-8 h-8 text-violet-400" />
              <div>
                <h3 className="text-white font-semibold">Interest Rabbit Holes</h3>
                <p className="text-white/50 text-sm">Curated deep-dives for curious minds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <p className="text-violet-400/50 text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
