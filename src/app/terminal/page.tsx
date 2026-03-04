import { Metadata } from 'next';
import TerminalApp from '@/components/terminal/TerminalApp';

export const metadata: Metadata = {
  title: 'Terminal | 8gent',
  description: 'Retro terminal easter egg with fun commands, ASCII art, and secret features',
};

export default function TerminalPage() {
  return (
    <div className="fixed inset-0 bg-black">
      <TerminalApp />
    </div>
  );
}
