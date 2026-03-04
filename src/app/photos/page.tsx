'use client';

import Link from 'next/link';
import InfiniteGallery from '@/components/InfiniteGallery';

const sampleImages = [
  { src: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/FB394334-6F13-446C-8B43-57C993D05E01.png', alt: '8gent Vision' },
  { src: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/0505D0AD-9EBF-4675-B3AC-ABF92501F024.png', alt: '8gent Workspace' },
  { src: '/photos/aurora.jpeg', alt: 'Aurora' },
  { src: '/photos/Corballis.jpeg', alt: 'Corballis' },
  { src: '/photos/Donabatebeach.jpeg', alt: 'Donabate Beach' },
  { src: '/photos/Donabatebeach2.jpeg', alt: 'Donabate Beach' },
  { src: '/photos/Glenofthedowns.jpeg', alt: 'Glen of the Downs' },
  { src: '/photos/Mistysunrise.jpeg', alt: 'Misty Sunrise' },
  { src: '/photos/Nightsky.jpeg', alt: 'Night Sky' },
  { src: '/photos/Nightskytree.jpeg', alt: 'Night Sky Tree' },
  { src: '/photos/Portranedemense.jpeg', alt: 'Portrane Demesne' },
  { src: '/photos/Robin.jpeg', alt: 'Robin' },
  { src: '/photos/Skygrange.jpeg', alt: 'Sky Grange' },
  { src: '/photos/Sunriseoverhowth.jpeg', alt: 'Sunrise over Howth' },
  { src: '/photos/Sunriseportrane.jpeg', alt: 'Sunrise Portrane' },
  { src: '/photos/sunsetachill.jpeg', alt: 'Sunset Achill' },
  { src: '/photos/SunsetPortrane.jpeg', alt: 'Sunset Portrane' },
  { src: '/photos/SunsetSalvador.jpeg', alt: 'Sunset Salvador' },
];

export default function PhotosPage() {
  return (
    <main className="min-h-screen bg-black">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full"
      />

      {/* Overlay text */}
      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif text-4xl md:text-7xl tracking-tight">
          <span className="italic">I create;</span> therefore I am
        </h1>
      </div>

      {/* Navigation hint */}
      <div className="text-center fixed bottom-24 left-0 right-0 font-mono uppercase text-[11px] font-semibold text-white/60">
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className="opacity-60">
          Auto-play resumes after 3 seconds of inactivity
        </p>
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm z-10"
      >
        ← Back to 8gent
      </Link>
    </main>
  );
}
