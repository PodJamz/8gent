'use client';

import { motion } from 'framer-motion';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

interface CapabilitiesScreenProps {
  onAdvance: () => void;
  aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
}

const capabilities = [
  { text: 'Chat with AI Assistant', position: { x: -15, y: -20 } },
  { text: 'Explore System', position: { x: 25, y: 15 } },
  { text: 'Build with AI', position: { x: -20, y: 35 } },
  { text: 'Observe Workflows', position: { x: 10, y: -35 } },
  { text: 'Team Collaboration', position: { x: -5, y: 55 } },
];

export function CapabilitiesScreen({ onAdvance, aesthetic }: CapabilitiesScreenProps) {
  const { skipDelay } = useAutoAdvance({
    delay: 4950,
    onAdvance,
  });

  const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
  const bgClass = 'bg-transparent';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const mutedClass = isDark ? 'text-white/40' : 'text-slate-400';

  return (
    <motion.div
      className={`fixed inset-0 ${bgClass} flex items-center justify-center cursor-pointer overflow-hidden`}
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {capabilities.map((cap, index) => (
          <motion.div
            key={cap.text}
            className={`absolute text-xl sm:text-2xl md:text-3xl font-light ${textClass}`}
            style={{
              left: `calc(50% + ${cap.position.x}%)`,
              top: `calc(50% + ${cap.position.y}%)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -10],
            }}
            transition={{
              delay: 0.33 + index * 0.66,
              duration: 3.3,
              times: [0, 0.15, 0.85, 1],
              ease: 'easeOut',
            }}
          >
            {cap.text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
