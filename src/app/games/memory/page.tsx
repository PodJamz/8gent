import { ComingSoon } from '@/components/ComingSoon';
import { Brain } from 'lucide-react';

export const metadata = {
  title: 'Memory Match | OpenClaw-OS',
  description: 'Memory matching game with design theme icons',
};

export default function MemoryGamePage() {
  return (
    <ComingSoon
      title="Memory Match"
      description="Match pairs of design theme icons. Test your memory and unlock hidden themes as rewards!"
      icon={<Brain className="w-8 h-8" style={{ color: 'hsl(var(--theme-primary))' }} />}
      priority="P7"
      features={[
        '12/16/24 card grids',
        '60/90/120 second timers',
        'Theme icon card faces',
        'Smooth 3D flip animations',
        'Move counter and scoring',
        'Personal best tracking',
        'Theme unlock rewards',
      ]}
    />
  );
}
