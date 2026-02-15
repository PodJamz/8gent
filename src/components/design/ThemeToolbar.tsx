'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Download,
  Palette,
  FileCode,
  FileJson,
  Settings2,
  Sparkles,
  Copy,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import {
  exportThemeAsCSS,
  exportThemeAsJSON,
  exportThemeAsTailwind,
  generateThemeReferencePrompt,
  downloadThemeFile,
  copyThemeToClipboard,
} from '@/lib/theme-exporter';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { ThemeName } from '@/lib/themes';

interface ThemeToolbarProps {
  themeName: ThemeName;
  themeLabel: string;
  className?: string;
  /** Callback when theme is referenced to Claw AI */
  onReferenceToAI?: (prompt: string) => void;
}

type ExportFormat = 'css' | 'json' | 'tailwind';

export function ThemeToolbar({
  themeName,
  themeLabel,
  className = '',
  onReferenceToAI,
}: ThemeToolbarProps) {
  const { setTheme, theme: currentTheme } = useDesignTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(currentTheme === themeName);
  const [isReferencing, setIsReferencing] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Update applied state when theme changes
  useEffect(() => {
    setIsApplied(currentTheme === themeName);
  }, [currentTheme, themeName]);

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyTheme = () => {
    setTheme(themeName);
    setIsApplied(true);
    // Flash feedback
    setTimeout(() => setIsApplied(currentTheme === themeName), 100);
  };

  const handleCopyFormat = async (format: ExportFormat | 'reference') => {
    const success = await copyThemeToClipboard(themeName, format);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
    setShowExportMenu(false);
  };

  const handleDownload = (format: ExportFormat) => {
    downloadThemeFile(themeName, format);
    setShowExportMenu(false);
  };

  const handleReferenceToAI = async () => {
    setIsReferencing(true);
    const prompt = generateThemeReferencePrompt(themeName);

    // Copy to clipboard as fallback
    await navigator.clipboard.writeText(prompt);

    // Call the callback if provided
    if (onReferenceToAI) {
      onReferenceToAI(prompt);
    }

    // Show success state briefly
    setTimeout(() => setIsReferencing(false), 1500);
    setShowExportMenu(false);
  };

  const exportOptions = [
    {
      id: 'css' as const,
      label: 'CSS Variables',
      icon: FileCode,
      description: 'Copy CSS custom properties',
    },
    {
      id: 'json' as const,
      label: 'JSON Config',
      icon: FileJson,
      description: 'Full theme as JSON',
    },
    {
      id: 'tailwind' as const,
      label: 'Tailwind Config',
      icon: Settings2,
      description: 'Tailwind CSS configuration',
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Apply Theme Button */}
      <motion.button
        onClick={handleApplyTheme}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        style={{
          backgroundColor: isApplied ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted))',
          color: isApplied ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isApplied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Applied</span>
          </>
        ) : (
          <>
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Apply</span>
          </>
        )}
      </motion.button>

      {/* Export Dropdown */}
      <div className="relative" ref={exportMenuRef}>
        <motion.button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
          style={{
            borderColor: 'hsl(var(--theme-border))',
            backgroundColor: 'hsl(var(--theme-card))',
            color: 'hsl(var(--theme-foreground))',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showExportMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 rounded-xl border shadow-xl overflow-hidden z-50"
              style={{
                backgroundColor: 'hsl(var(--theme-card))',
                borderColor: 'hsl(var(--theme-border))',
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  Export {themeLabel}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Choose format to export
                </p>
              </div>

              {/* Export Options */}
              <div className="p-2">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  const isCopied = copiedFormat === option.id;

                  return (
                    <div key={option.id} className="flex items-stretch gap-1 mb-1 last:mb-0">
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyFormat(option.id)}
                        className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-black/5"
                      >
                        <Icon
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: 'hsl(var(--theme-primary))' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: 'hsl(var(--theme-foreground))' }}
                          >
                            {option.label}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          >
                            {option.description}
                          </p>
                        </div>
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Copy
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          />
                        )}
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(option.id)}
                        className="flex items-center justify-center w-10 rounded-lg transition-colors hover:bg-black/5"
                        title={`Download ${option.label}`}
                      >
                        <ExternalLink
                          className="w-3.5 h-3.5"
                          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div
                className="mx-4 border-t"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              />

              {/* Reference to Claw AI */}
              <div className="p-2">
                <button
                  onClick={handleReferenceToAI}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-black/5"
                >
                  <Sparkles
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: 'hsl(var(--theme-accent))' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      Reference to Claw AI
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      Send theme context to AI assistant
                    </p>
                  </div>
                  {isReferencing ? (
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Sparkles
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ThemeToolbar;
