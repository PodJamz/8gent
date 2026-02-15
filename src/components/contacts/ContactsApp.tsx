'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, QrCode, CheckCircle } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { ContactCard } from './ContactCard';
import { QRCodeDisplay } from './QRCodeDisplay';
import { JAMES_CONTACT, downloadVCard } from './VCardGenerator';
import { Toast, ToastContainer } from '@/components/superdesign/feedback/Toast';

export function ContactsApp() {
  const [showQR, setShowQR] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDownloadVCard = () => {
    downloadVCard(JAMES_CONTACT);
    setToastMessage('Contact saved to downloads');
    setShowToast(true);
  };

  return (
    <div className="min-h-screen relative overflow-y-auto">
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at top, hsl(var(--theme-primary) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, hsl(var(--theme-accent) / 0.1) 0%, transparent 50%),
            hsl(var(--theme-background))
          `,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/">
            <LiquidGlass
              variant="button"
              intensity="subtle"
              className="!px-3 !py-2 !rounded-full flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </LiquidGlass>
          </Link>

          <h1
            className="text-lg font-semibold"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Contact
          </h1>

          {/* Spacer for centering */}
          <div className="w-20" />
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ContactCard contact={JAMES_CONTACT} />
        </motion.div>
      </main>

      {/* Fixed action buttons */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', damping: 20 }}
        className="fixed bottom-0 inset-x-0 p-4 z-30"
      >
        <div
          className="max-w-md mx-auto backdrop-blur-xl rounded-2xl p-3"
          style={{
            background: 'hsl(var(--theme-background) / 0.8)',
            border: '1px solid hsl(var(--theme-border) / 0.5)',
          }}
        >
          <div className="flex gap-3">
            {/* Download vCard button */}
            <motion.button
              onClick={handleDownloadVCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                color: 'white',
                boxShadow: '0 4px 14px hsl(var(--theme-primary) / 0.4)',
              }}
            >
              <Download className="w-5 h-5" />
              Add to Contacts
            </motion.button>

            {/* Show QR button */}
            <motion.button
              onClick={() => setShowQR(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all"
              style={{
                background: 'hsl(var(--theme-muted) / 0.5)',
                color: 'hsl(var(--theme-foreground))',
                border: '1px solid hsl(var(--theme-border) / 0.5)',
              }}
            >
              <QrCode className="w-5 h-5" />
              QR
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      <QRCodeDisplay
        contact={JAMES_CONTACT}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />

      {/* Toast notifications */}
      <ToastContainer position="top-center">
        <AnimatePresence>
          {showToast && (
            <Toast
              variant="success"
              title={toastMessage}
              open={showToast}
              onClose={() => setShowToast(false)}
              duration={3000}
            />
          )}
        </AnimatePresence>
      </ToastContainer>
    </div>
  );
}
