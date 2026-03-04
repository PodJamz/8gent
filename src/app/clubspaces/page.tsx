'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Clerk
const ClubSpacesApp = dynamic(
  () => import('@/components/clubspaces/ClubSpacesApp').then((mod) => mod.ClubSpacesApp),
  { ssr: false }
);

export default function ClubSpacesPage() {
  return <ClubSpacesApp />;
}
