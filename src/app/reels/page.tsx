'use client';

import { ReelsPlayer } from '@/components/reels/ReelsPlayer';
import { reels } from '@/data/reels';
import { PageTransition } from '@/components/ios';
import { Sparkles } from 'lucide-react';

export default function ReelsPage() {
  const allReels = reels;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Subtle ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-rose-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[120px]" />
        </div>

        {/* Player */}
        <div className="relative z-10">
          {allReels.length > 0 ? (
            <ReelsPlayer reels={allReels} musicFirst={true} />
          ) : (
            <div className="w-[300px] md:w-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/5">
              <div className="bg-black rounded-2xl aspect-[9/14] flex items-center justify-center">
                <div className="text-center p-6">
                  <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                  <p className="text-white/60 text-sm font-mono mb-2">No tracks yet</p>
                  <p className="text-white/30 text-xs font-mono">
                    Add tracks in src/data/tracks.ts
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
