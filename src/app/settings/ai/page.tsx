'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Clerk
const AISettingsClient = dynamic(
  () => import('./AISettingsClient').then((mod) => mod.AISettingsClient),
  { ssr: false }
);

export default function AISettingsPage() {
  return <AISettingsClient />;
}
