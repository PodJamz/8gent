'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Home } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    draftUpdates?: string[];
  };
}

interface SavedSession {
  sessionId: string;
  draft: {
    brief: {
      problem: string;
      audience: string;
      currentWorkaround: string;
      desiredOutcome: string;
      constraints: string[];
    };
    prd: {
      goals: string[];
      nonGoals: string[];
      keyWorkflows: string[];
      scopeMvp: string[];
      risks: string[];
      successMetrics: string[];
    };
    prototype: {
      screens: string[];
      primaryFlow: string;
      dataInputs: string[];
      notes: string;
    };
    designDirection: {
      toneWords: string[];
      uiDensity: 'compact' | 'comfortable' | 'spacious';
      typographyNotes: string;
      componentRules: string[];
      selectedTheme?: string;
    };
  };
  chatHistory: ChatMessage[];
  eventLog: unknown[];
  createdAt: number;
  expiresAt: number;
}

type LoadState = 'loading' | 'success' | 'error' | 'notfound' | 'expired';

export default function SavedSessionPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [session, setSession] = useState<SavedSession | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch(`/api/save?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setSession(data);
          setLoadState('success');

          // Store in localStorage for the session brain to pick up
          const sessionState = {
            sessionId: data.sessionId,
            createdAt: data.createdAt,
            lastModified: Date.now(),
            draft: data.draft,
            chatHistory: data.chatHistory || [],
            eventLog: data.eventLog || [],
            notifications: [],
          };
          localStorage.setItem('openclaw_session', JSON.stringify(sessionState));
        } else if (response.status === 404) {
          setLoadState('notfound');
          setError('This saved session could not be found.');
        } else if (response.status === 410) {
          setLoadState('expired');
          setError('This saved session has expired.');
        } else {
          setLoadState('error');
          setError(data.error || 'Failed to load session');
        }
      } catch (err) {
        setLoadState('error');
        setError('Network error. Please try again.');
      }
    }

    if (token) {
      loadSession();
    }
  }, [token]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(https://2oczblkb3byymav8.public.blob.vercel-storage.com/aurora.jpeg)',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          {loadState === 'loading' && (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <h1 className="text-white text-xl font-semibold mb-2">Loading your draft...</h1>
              <p className="text-white/50 text-sm">Please wait while we retrieve your saved session.</p>
            </div>
          )}

          {loadState === 'success' && session && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-white text-xl font-semibold mb-2">Draft Loaded!</h1>
              <p className="text-white/50 text-sm mb-6">
                Your saved project draft has been restored to your session.
              </p>

              {/* Brief preview */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                <h3 className="text-white/70 text-xs uppercase tracking-wider mb-3">Brief Summary</h3>
                {session.draft.brief.problem && (
                  <div className="mb-2">
                    <span className="text-white/40 text-xs">Building:</span>
                    <p className="text-white/80 text-sm truncate">{session.draft.brief.problem}</p>
                  </div>
                )}
                {session.draft.brief.audience && (
                  <div>
                    <span className="text-white/40 text-xs">For:</span>
                    <p className="text-white/80 text-sm truncate">{session.draft.brief.audience}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
              >
                <Home className="w-4 h-4" />
                Go to OpenClaw-OS
              </button>
            </div>
          )}

          {(loadState === 'error' || loadState === 'notfound' || loadState === 'expired') && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-white text-xl font-semibold mb-2">
                {loadState === 'notfound' && 'Session Not Found'}
                {loadState === 'expired' && 'Session Expired'}
                {loadState === 'error' && 'Error Loading Session'}
              </h1>
              <p className="text-white/50 text-sm mb-6">{error}</p>

              <button
                onClick={handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-colors"
              >
                <Home className="w-4 h-4" />
                Start Fresh
              </button>
            </div>
          )}

          {/* Expiration notice for successful loads */}
          {loadState === 'success' && session && (
            <p className="text-white/30 text-xs text-center mt-4">
              This link expires {new Date(session.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
