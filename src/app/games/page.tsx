'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Zap, Eye, Target, Gamepad2, Waves } from 'lucide-react';

const games = [
  {
    id: 'warpfield',
    name: 'Warpfield',
    description: 'Audio-reactive particle physics. Music drives the visual chaos.',
    icon: Waves,
    href: '/games/warpfield',
    gradient: 'from-orange-500 to-pink-600',
    tag: 'NEW',
    tagColor: 'bg-green-500',
  },
  {
    id: 'intuition',
    name: 'Intuition',
    description: 'Test your telepathic abilities. Sense which card hides the image.',
    icon: Brain,
    href: '/games/intuition',
    gradient: 'from-purple-500 to-indigo-600',
    tag: 'NEW',
    tagColor: 'bg-green-500',
  },
  {
    id: 'reaction',
    name: 'Reaction Time',
    description: 'Measure and train your reaction speed.',
    icon: Zap,
    href: '/games/reaction',
    gradient: 'from-yellow-500 to-orange-600',
    tag: 'SOON',
    tagColor: 'bg-purple-500',
  },
  {
    id: 'peripheral',
    name: 'Peripheral Vision',
    description: 'Expand your visual awareness field.',
    icon: Eye,
    href: '/games/peripheral',
    gradient: 'from-cyan-500 to-blue-600',
    tag: 'SOON',
    tagColor: 'bg-purple-500',
  },
  {
    id: 'dual-n-back',
    name: 'Dual N-Back',
    description: 'Working memory trainer. Boost fluid intelligence.',
    icon: Target,
    href: '/games/dual-n-back',
    gradient: 'from-rose-500 to-pink-600',
    tag: 'SOON',
    tagColor: 'bg-purple-500',
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Brain Games</h1>
          <p className="text-purple-300/70">Enhance your cognitive abilities</p>
        </div>

        {/* Games Grid */}
        <div className="grid gap-4">
          {games.map((game, index) => {
            const Icon = game.icon;
            const isAvailable = game.tag === 'NEW';

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isAvailable ? (
                  <Link href={game.href}>
                    <div className="group bg-white/5 hover:bg-white/10 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold text-lg">{game.name}</h3>
                            <span className={`px-2 py-0.5 ${game.tagColor} rounded text-xs font-bold text-white`}>
                              {game.tag}
                            </span>
                          </div>
                          <p className="text-purple-300/60 text-sm">{game.description}</p>
                        </div>
                        <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center flex-shrink-0 opacity-50`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white/70 font-semibold text-lg">{game.name}</h3>
                          <span className={`px-2 py-0.5 ${game.tagColor} rounded text-xs font-bold text-white`}>
                            {game.tag}
                          </span>
                        </div>
                        <p className="text-purple-300/40 text-sm">{game.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-10 text-center">
          <p className="text-purple-400/40 text-sm">
            Games designed to hack and enhance your brain
          </p>
        </div>
      </div>
    </div>
  );
}
