'use client';

import { PageTransition } from '@/components/ios';
import MockitApp from '@/components/mockit/MockitApp';

export default function MockitPage() {
  return (
    <PageTransition>
      <MockitApp />
    </PageTransition>
  );
}
