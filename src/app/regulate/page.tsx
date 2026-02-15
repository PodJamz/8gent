'use client';

import { HeartPulse, Wind, Waves, Volume2 } from 'lucide-react';

export default function RegulatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mx-auto mb-4">
            <HeartPulse className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Regulate</h1>
          <p className="text-cyan-300/70">Nervous system regulation tools</p>
        </div>

        {/* Coming Soon Cards */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Wind className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="text-white font-semibold">Breathing Exercises</h3>
                <p className="text-white/50 text-sm">Box breathing, 4-7-8, physiological sigh</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Waves className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="text-white font-semibold">Vagal Toning</h3>
                <p className="text-white/50 text-sm">Cold exposure, humming, gentle movement</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Volume2 className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="text-white font-semibold">Bilateral Stimulation</h3>
                <p className="text-white/50 text-sm">EMDR-style tapping, audio panning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <p className="text-cyan-400/50 text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
