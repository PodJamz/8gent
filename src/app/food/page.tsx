'use client';

import { UtensilsCrossed, Clock, Pill, Apple } from 'lucide-react';

export default function FoodPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-slate-900 to-emerald-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Food</h1>
          <p className="text-green-300/70">Fuel your brain right</p>
        </div>

        {/* Coming Soon Cards */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Clock className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Meal Reminders</h3>
                <p className="text-white/50 text-sm">Don&apos;t forget to eat (ADHD classic)</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Apple className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Brain Food Ideas</h3>
                <p className="text-white/50 text-sm">Quick, easy, dopamine-friendly recipes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-3">
              <Pill className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Supplement Tracker</h3>
                <p className="text-white/50 text-sm">Omega-3, magnesium, vitamin D</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <p className="text-green-400/50 text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
