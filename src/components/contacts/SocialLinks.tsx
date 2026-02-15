'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className="w-5 h-5" />;
    case 'linkedin':
      return <Linkedin className="w-5 h-5" />;
    case 'x':
    case 'twitter':
      return <Twitter className="w-5 h-5" />;
    default:
      return null;
  }
};

const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'github':
      return '210 10% 23%'; // GitHub dark gray
    case 'linkedin':
      return '210 80% 46%'; // LinkedIn blue
    case 'x':
    case 'twitter':
      return '210 10% 10%'; // X black
    default:
      return 'var(--theme-primary)';
  }
};

const getPlatformLabel = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'github':
      return 'GitHub';
    case 'linkedin':
      return 'LinkedIn';
    case 'x':
      return 'X';
    case 'twitter':
      return 'Twitter';
    default:
      return platform;
  }
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {links.map((link, index) => (
        <motion.a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="group"
        >
          <LiquidGlass
            variant="button"
            intensity="subtle"
            className="!p-4 !rounded-2xl flex flex-col items-center gap-2 w-full"
          >
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: `hsl(${getPlatformColor(link.platform)} / 0.15)`,
              }}
              whileHover={{
                background: `hsl(${getPlatformColor(link.platform)} / 0.25)`,
              }}
            >
              <span
                className="transition-colors"
                style={{ color: `hsl(${getPlatformColor(link.platform)})` }}
              >
                {getPlatformIcon(link.platform)}
              </span>
            </motion.div>

            <div className="text-center">
              <p
                className="text-xs font-medium"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                {getPlatformLabel(link.platform)}
              </p>
              <p
                className="text-xs opacity-60 truncate max-w-[80px]"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {link.handle}
              </p>
            </div>

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, hsl(${getPlatformColor(link.platform)} / 0.1) 0%, transparent 70%)`,
              }}
            />
          </LiquidGlass>
        </motion.a>
      ))}
    </div>
  );
}
