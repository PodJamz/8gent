'use client';

import dynamic from 'next/dynamic';

const MessagesClient = dynamic(
  () => import('./MessagesClient').then((mod) => ({ default: mod.MessagesClient })),
  { ssr: false }
);

export default function MessagesPage() {
  return <MessagesClient />;
}
