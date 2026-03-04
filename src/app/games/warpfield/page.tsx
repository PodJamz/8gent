'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Three.js
const Warpfield = dynamic(
  () => import('@/components/games/warpfield/Warpfield'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading Warpfield...</p>
        </div>
      </div>
    ),
  }
);

export default function WarpfieldPage() {
  return <Warpfield />;
}
