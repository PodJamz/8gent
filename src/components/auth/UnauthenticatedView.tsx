'use client';

import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/nextjs';
import { Github, Sparkles, Lock } from 'lucide-react';

export function UnauthenticatedView() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black to-neutral-950" />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/5">
            {/* Claw AI orb */}
            <motion.div
              className="w-20 h-20 mx-auto mb-4 relative"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(249, 115, 22, 0.3)',
                  '0 0 40px rgba(249, 115, 22, 0.5)',
                  '0 0 20px rgba(249, 115, 22, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ borderRadius: '50%' }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to Claw AI
            </h1>
            <p className="text-white/50 text-sm">
              Sign in to access the full Cursor-like IDE experience
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            {/* GitHub Sign In */}
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium transition-all">
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
            </SignInButton>

            {/* Features list */}
            <div className="pt-4 space-y-3">
              <p className="text-xs text-white/30 uppercase tracking-wide font-medium">
                What you&apos;ll get access to:
              </p>
              <ul className="space-y-2">
                {[
                  'File explorer with real code editing',
                  'AI-powered code assistance',
                  'GitHub repository integration',
                  'Terminal & browser automation',
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <div className="w-1 h-1 rounded-full bg-orange-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-xs text-white/30">
              <Lock className="w-3 h-3" />
              <span>Secure authentication via Clerk</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
