'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, QrCode } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { ContactInfo, generateVCard } from './VCardGenerator';

interface QRCodeDisplayProps {
  contact: ContactInfo;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeDisplay({ contact, isOpen, onClose }: QRCodeDisplayProps) {
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate vCard data for QR code
  const vCardData = generateVCard(contact);

  const handleDownload = useCallback(async () => {
    if (!qrRef.current) return;

    setDownloading(true);
    try {
      // Get the SVG element
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;

      // Create a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size with padding
      const padding = 40;
      const size = 256 + padding * 2;
      canvas.width = size;
      canvas.height = size;

      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create image and draw to canvas
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, padding, padding, 256, 256);
        URL.revokeObjectURL(svgUrl);

        // Download as PNG
        const link = document.createElement('a');
        link.download = `${contact.name.first}-${contact.name.last}-QR.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloading(false);
      };
      img.src = svgUrl;
    } catch (err) {
      console.error('Failed to download QR code:', err);
      setDownloading(false);
    }
  }, [contact.name.first, contact.name.last]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${contact.name.first} ${contact.name.last} Contact`,
          text: `Contact info for ${contact.name.first} ${contact.name.last}`,
          url: contact.website,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  }, [contact]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <LiquidGlass
              variant="card"
              intensity="strong"
              className="!p-6 !rounded-3xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ background: 'hsl(var(--theme-muted) / 0.5)' }}
              >
                <X className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
                  style={{ background: 'hsl(var(--theme-primary) / 0.15)' }}
                >
                  <QrCode className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'hsl(var(--theme-primary))' }}
                  >
                    Scan to Add Contact
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6" ref={qrRef}>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-2xl bg-white"
                >
                  <QRCodeSVG
                    value={vCardData}
                    size={200}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </motion.div>
              </div>

              {/* Contact info summary */}
              <div className="text-center mb-6">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {contact.name.first} {contact.name.last}
                </h3>
                <p
                  className="text-sm opacity-70"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {contact.email[0]}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
                  style={{
                    background: 'hsl(var(--theme-primary))',
                    color: 'white',
                  }}
                >
                  <Download className="w-4 h-4" />
                  {downloading ? 'Saving...' : 'Save QR'}
                </motion.button>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors"
                    style={{
                      background: 'hsl(var(--theme-muted) / 0.5)',
                      color: 'hsl(var(--theme-foreground))',
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Instruction text */}
              <p
                className="text-xs text-center mt-4 opacity-60"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Point your phone camera at this QR code to save contact
              </p>
            </LiquidGlass>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
