'use client';

/**
 * Passcodes Management Page
 *
 * Admin-only page for managing passcodes for protected areas.
 * Allows creating, updating, and deleting passcodes for areas like
 * Humans, Studio, Vault, etc.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';

// Type assertion for passcodes module (generated types may not include it until deployed)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const passcodesApi = (api as any).passcodes;
import { PageTransition } from '@/components/ios';
import { useAdminSession } from '@/hooks/useAdminSession';
import {
  ChevronLeft,
  Key,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Lock,
  Shield,
} from 'lucide-react';

interface ProtectedArea {
  _id: string;
  slug: string;
  name: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export default function PasscodesPage() {
  const router = useRouter();
  const { isAuthenticated: isAdmin, isLoading: isAdminLoading } = useAdminSession();
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [newPasscode, setNewPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaSlug, setNewAreaSlug] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch protected areas
  const areas = useQuery(passcodesApi.listProtectedAreas) as ProtectedArea[] | undefined;

  // Mutations
  const upsertArea = useMutation(passcodesApi.upsertProtectedArea);
  const deleteArea = useMutation(passcodesApi.deleteProtectedArea);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/settings');
    }
  }, [isAdmin, isAdminLoading, router]);

  // Handle passcode update
  const handleUpdatePasscode = async (slug: string) => {
    if (!newPasscode || newPasscode.length !== 6 || !/^\d+$/.test(newPasscode)) {
      setError('Passcode must be exactly 6 digits');
      return;
    }

    try {
      await upsertArea({
        slug,
        name: areas?.find(a => a.slug === slug)?.name || slug,
        passcode: newPasscode,
        isActive: true,
      });
      setEditingArea(null);
      setNewPasscode('');
      setError(null);
    } catch (err) {
      setError('Failed to update passcode');
    }
  };

  // Handle create new area
  const handleCreateArea = async () => {
    if (!newAreaName.trim()) {
      setError('Area name is required');
      return;
    }
    if (!newAreaSlug.trim()) {
      setError('Area slug is required');
      return;
    }
    if (!newPasscode || newPasscode.length !== 6 || !/^\d+$/.test(newPasscode)) {
      setError('Passcode must be exactly 6 digits');
      return;
    }

    try {
      await upsertArea({
        slug: newAreaSlug.toLowerCase().replace(/\s+/g, '-'),
        name: newAreaName,
        passcode: newPasscode,
        isActive: true,
      });
      setIsCreating(false);
      setNewAreaName('');
      setNewAreaSlug('');
      setNewPasscode('');
      setError(null);
    } catch (err) {
      setError('Failed to create area');
    }
  };

  // Handle delete area
  const handleDeleteArea = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this protected area?')) {
      return;
    }

    try {
      await deleteArea({ slug });
    } catch (err) {
      setError('Failed to delete area');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (area: ProtectedArea) => {
    try {
      await upsertArea({
        slug: area.slug,
        name: area.name,
        isActive: !area.isActive,
      });
    } catch (err) {
      setError('Failed to update area');
    }
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/settings"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go back to settings"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">Passcodes</h1>
              <p className="text-xs text-white/50">Manage protected area access</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info card */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/70">
                  Protected areas require a 6-digit passcode to access.
                  Each area can have its own unique passcode.
                </p>
              </div>
            </div>
          </div>

          {/* Protected areas list */}
          <div className="space-y-3">
            {areas === undefined ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            ) : areas.length === 0 ? (
              <div className="text-center py-8">
                <Lock className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/50">No protected areas yet</p>
              </div>
            ) : (
              areas.map((area) => (
                <motion.div
                  key={area._id}
                  layout
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  {editingArea === area.slug ? (
                    /* Edit mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{area.name}</span>
                        <span className="text-xs text-white/40 font-mono">{area.slug}</span>
                      </div>
                      <div className="relative">
                        <input
                          type={showPasscode ? 'text' : 'password'}
                          value={newPasscode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setNewPasscode(val);
                          }}
                          placeholder="Enter 6-digit passcode"
                          className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/20 rounded-lg text-white text-center text-lg tracking-[0.5em] font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          maxLength={6}
                          inputMode="numeric"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasscode(!showPasscode)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70"
                        >
                          {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePasscode(area.slug)}
                          disabled={newPasscode.length !== 6}
                          className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-600 disabled:bg-white/10 disabled:text-white/30 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingArea(null);
                            setNewPasscode('');
                            setError(null);
                          }}
                          className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${area.isActive ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-white/10'}`}>
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{area.name}</span>
                          {!area.isActive && (
                            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">Disabled</span>
                          )}
                        </div>
                        <span className="text-xs text-white/40 font-mono">{area.slug}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(area)}
                          className={`p-2 rounded-lg transition-colors ${area.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-white/40 hover:bg-white/10'}`}
                          title={area.isActive ? 'Disable' : 'Enable'}
                        >
                          {area.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingArea(area.slug);
                            setNewPasscode('');
                          }}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Change passcode"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area.slug)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Create new area */}
          <AnimatePresence>
            {isCreating ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 p-4 rounded-xl bg-white/5 border border-orange-500/30"
              >
                <h3 className="text-white font-medium mb-3">Create Protected Area</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="Area name (e.g., Humans Search)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  <input
                    type="text"
                    value={newAreaSlug}
                    onChange={(e) => setNewAreaSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="Slug (e.g., humans)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  <div className="relative">
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      value={newPasscode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setNewPasscode(val);
                      }}
                      placeholder="6-digit passcode"
                      className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/20 rounded-lg text-white text-center text-lg tracking-[0.5em] font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      maxLength={6}
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70"
                    >
                      {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateArea}
                      disabled={!newAreaName.trim() || !newAreaSlug.trim() || newPasscode.length !== 6}
                      className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-600 disabled:bg-white/10 disabled:text-white/30 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewAreaName('');
                        setNewAreaSlug('');
                        setNewPasscode('');
                        setError(null);
                      }}
                      className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsCreating(true)}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-white/5 border border-dashed border-white/20 hover:bg-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Protected Area
              </motion.button>
            )}
          </AnimatePresence>

          {/* Predefined areas hint */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">Suggested Areas</h3>
            <p className="text-xs text-white/50 mb-3">
              Click to quickly add a predefined protected area:
            </p>
            <div className="flex flex-wrap gap-2">
              {['humans', 'studio', 'vault', 'calendar', 'prototyping'].map((slug) => {
                const exists = areas?.some(a => a.slug === slug);
                return (
                  <button
                    key={slug}
                    onClick={() => {
                      if (!exists) {
                        setIsCreating(true);
                        setNewAreaSlug(slug);
                        setNewAreaName(slug.charAt(0).toUpperCase() + slug.slice(1));
                      }
                    }}
                    disabled={exists}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      exists
                        ? 'bg-green-500/10 text-green-400 cursor-default'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {slug}
                    {exists && <Check className="w-3 h-3 inline ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
