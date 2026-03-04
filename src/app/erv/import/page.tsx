'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Clerk
const ERVImportClient = dynamic(
  () => import('@/components/erv/ERVImportClient').then((mod) => mod.ERVImportClient),
  { ssr: false }
);

export default function ERVImportPage() {
  return <ERVImportClient />;
}
