'use client';

import dynamic from 'next/dynamic';

const HumansClient = dynamic(
  () => import('./HumansClient').then((mod) => mod.HumansClient),
  { ssr: false }
);

export default function HumansPage() {
  return <HumansClient />;
}
