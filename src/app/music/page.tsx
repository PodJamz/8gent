'use client';

import dynamic from 'next/dynamic';

const MusicClient = dynamic(
  () => import('./MusicClient').then((mod) => mod.MusicClient),
  { ssr: false }
);

export default function MusicPage() {
  return <MusicClient />;
}
