'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Triangle, Loader2, RefreshCw, Zap, Globe, GitBranch, Clock } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';
import { VercelChart } from '@/components/design/ChartShowcase';

interface ShipLog {
  commit: string;
  status: string;
  time: string;
  edge: string;
  message: string;
}

function ShipLogApp() {
  const [log, setLog] = useState<ShipLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [accomplishment, setAccomplishment] = useState('');

  const accomplishments = ['finished a feature', 'fixed a bug', 'deployed to prod', 'learned something new', 'helped a teammate'];

  const shipIt = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ship-log', prompt: accomplishment || 'I accomplished something' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setLog({
          commit: data.commit || 'feat: level up complete',
          status: data.status || 'DEPLOYED',
          time: data.time || '< 1s',
          edge: data.edge || 'impact: global',
          message: data.message || 'Production is live. You shipped it.',
        });
      }
    } catch {
      setLog({
        commit: 'chore: keep winning',
        status: 'SHIPPED',
        time: '0.2s',
        edge: 'uptime: 100%',
        message: 'Another successful deploy. Keep building.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, accomplishment]);

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Triangle className="w-4 h-4 fill-current" style={{ color: 'hsl(var(--theme-foreground))' }} />
          <span className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Ship Log
          </span>
        </div>
        {log && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-background))' }}
          >
            {log.status}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Accomplishment Selection */}
        {!log && (
          <div className="mb-6">
            <p
              className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What did you ship?
            </p>
            <div className="flex flex-wrap gap-2">
              {accomplishments.map((a) => (
                <button
                  key={a}
                  onClick={() => setAccomplishment(a)}
                  className="px-3 py-1.5 text-xs font-medium rounded transition-all border"
                  style={{
                    backgroundColor: accomplishment === a ? 'hsl(var(--theme-foreground))' : 'transparent',
                    color: accomplishment === a ? 'hsl(var(--theme-background))' : 'hsl(var(--theme-foreground))',
                    borderColor: 'hsl(var(--theme-border))',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Triangle className="w-10 h-10 fill-current mx-auto mb-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Deploying...
                </p>
              </motion.div>
            ) : log ? (
              <motion.div
                key="log"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                {/* Deployment card */}
                <div
                  className="rounded-lg border overflow-hidden"
                  style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsla(var(--theme-muted) / 0.2)' }}
                >
                  {/* Commit line */}
                  <div
                    className="px-4 py-3 border-b flex items-center gap-3"
                    style={{ borderColor: 'hsl(var(--theme-border))' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <code className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {log.commit}
                    </code>
                  </div>

                  {/* Details */}
                  <div className="px-4 py-4 space-y-3">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          Build: {log.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {log.edge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                      <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        main
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6 text-center">
                  <p
                    className="text-lg font-medium mb-2"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {log.message}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Ready for the next one
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Triangle
                  className="w-16 h-16 fill-current mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-foreground))', opacity: 0.2 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  What did you accomplish?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI turns your wins into deployment logs
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {log ? (
          <button
            onClick={() => setLog(null)}
            className="w-full py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 border rounded-md"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Ship Again
          </button>
        ) : (
          <button
            onClick={shipIt}
            disabled={loading}
            className="w-full py-3 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 rounded-md"
            style={{
              backgroundColor: 'hsl(var(--theme-foreground))',
              color: 'hsl(var(--theme-background))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Triangle className="w-4 h-4 fill-current" />
                Ship It
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VercelPage() {
  return (
    <ProductPageLayout
      theme="vercel"
      targetUser="developers who need to feel their progress"
      problemStatement="Building is invisible. Commits disappear. The grind does not feel like progress."
      problemContext="Developers ship code every day. Pull requests merge, features deploy, bugs get fixed. But it all feels like an endless treadmill. There is no ceremony. No celebration. Just the next ticket. The best work often goes unnoticed, even by the person doing it."
      insight="Deployment is a ritual. The moment code goes live deserves recognition. By framing accomplishments as ship logs, we make invisible progress tangible. Every commit is a win."
      tradeoffs={['Celebration over efficiency', 'Recognition over speed', 'Ritual over automation']}
      appName="Ship Log"
      appDescription="AI turns your wins into motivating deployment logs"
      showToolbar={true}
      themeLabel="Vercel"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Radical Simplicity',
          description: 'Black, white, and nothing else. Every pixel earns its place. Complexity is hidden until needed.',
        },
        {
          title: 'Speed as Feature',
          description: 'Fast deploys, fast sites, fast feedback. Performance is not a metric. It is the core product.',
        },
        {
          title: 'Developer First',
          description: 'Every decision optimizes for developer experience. Git integration, previews, instant rollbacks.',
        },
        {
          title: 'Global by Default',
          description: 'Edge network visualization. Geographic awareness. Performance metrics that span the world.',
        },
      ]}
      quote={{
        text: 'The best developer experience creates the best user experience.',
        author: 'Vercel Design Philosophy',
      }}
    >
      <ShipLogApp />

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Ship Metrics
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Track your deployment velocity. Every ship counts.
        </p>
        <VercelChart />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Monochrome Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Black, white, and nothing else. Click to copy.
        </p>
        <ColorPalette colors={themeColors.vercel} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Developer Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
