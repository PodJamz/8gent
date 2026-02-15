'use client';

import { PageTransition } from '@/components/ios';
import { CowriteProvider } from '@/context/CowriteContext';
import { CowriteApp } from '@/components/cowrite';

export default function CowritePage() {
  return (
    <PageTransition>
      <CowriteProvider>
        <CowriteApp />
      </CowriteProvider>
    </PageTransition>
  );
}
