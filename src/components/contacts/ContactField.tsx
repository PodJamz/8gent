'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface ContactFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  copyable?: boolean;
  external?: boolean;
}

export function ContactField({
  icon,
  label,
  value,
  href,
  copyable = false,
  external = false,
}: ContactFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!copyable) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [copyable, value]);

  const content = (
    <div className="flex items-center gap-3 w-full">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'hsl(var(--theme-primary) / 0.15)' }}
      >
        <span style={{ color: 'hsl(var(--theme-primary))' }}>{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-xs uppercase tracking-wider opacity-60"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {label}
        </p>
        <p
          className="text-sm font-medium truncate"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {value}
        </p>
      </div>

      {(copyable || external) && (
        <div className="flex-shrink-0">
          {copyable && (
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy();
              }}
              className="p-2 rounded-full transition-colors"
              style={{
                background: copied
                  ? 'hsl(var(--theme-accent) / 0.2)'
                  : 'hsl(var(--theme-muted) / 0.5)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4" style={{ color: 'hsl(var(--theme-accent))' }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
          {external && !copyable && (
            <div
              className="p-2 rounded-full"
              style={{ background: 'hsl(var(--theme-muted) / 0.5)' }}
            >
              <ExternalLink className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const baseClasses = "block w-full px-4 py-3 rounded-xl transition-all";
  const hoverStyles = {
    background: 'hsl(var(--theme-muted) / 0.3)',
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        whileHover={hoverStyles}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  if (copyable) {
    return (
      <motion.div
        className={`${baseClasses} cursor-pointer`}
        onClick={handleCopy}
        whileHover={hoverStyles}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
}
