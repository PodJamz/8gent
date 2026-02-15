'use client';

import { Target, Timer, Ban, Zap } from 'lucide-react';

export default function HyperfocusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-rose-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hyperfocus</h1>
          <p className="text-red-300/70">Channel the superpower</p>
        </div>

        {/* Coming Soon Cards */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Timer className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">Focus Sessions</h3>
                <p className="text-white/50 text-sm">Pomodoro with ADHD-friendly tweaks</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Ban className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">Distraction Blocker</h3>
                <p className="text-white/50 text-sm">Lock out apps during focus mode</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Zap className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">Energy Tracking</h3>
                <p className="text-white/50 text-sm">Log your peak focus hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <p className="text-red-400/50 text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
