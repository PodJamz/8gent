'use client';

import dynamic from 'next/dynamic';

const CalendarClient = dynamic(
  () => import('./CalendarClient').then((mod) => mod.CalendarClient),
  { ssr: false }
);

export default function CalendarPage() {
  return <CalendarClient />;
}
