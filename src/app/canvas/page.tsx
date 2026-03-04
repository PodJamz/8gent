'use client';

import dynamic from 'next/dynamic';

const CanvasClient = dynamic(
  () => import('./CanvasClient').then((mod) => mod.CanvasClient),
  { ssr: false }
);

export default function CanvasPage() {
  return <CanvasClient />;
}
