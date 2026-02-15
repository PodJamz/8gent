'use client';

/**
 * iPod Collaborators Management Page
 *
 * Admin-only page for managing iPod collaborators.
 * Allows creating, updating, and deleting collaborators with
 * their avatars, colors, and passcodes.
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
  Users,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Music,
  GripVertical,
} from 'lucide-react';

interface Collaborator {
  _id: string;
  slug: string;
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  avatarImage?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: number;
  lastAccessAt?: number;
}

// Predefined avatar emojis
const AVATAR_EMOJIS = ['😎', '🎵', '🎸', '🎹', '🎤', '🎧', '🎺', '🎷', '🥁', '🎻', '🪕', '🎼', '🦊', '🐻', '🦁', '🐯', '🦄', '🌟', '⚡', '🔥'];

// Predefined avatar colors
const AVATAR_COLORS = [
  'from-orange-500 to-amber-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-violet-500',
  'from-yellow-500 to-orange-500',
  'from-teal-500 to-cyan-500',
];

export default function CollaboratorsPage() {
  const router = useRouter();
  const { isAuthenticated: isAdmin, isLoading: isAdminLoading } = useAdminSession();
  const [editingCollaborator, setEditingCollaborator] = useState<string | null>(null);
  const [newPasscode, setNewPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newEmoji, setNewEmoji] = useState('😎');
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  // Fetch collaborators
  const collaborators = useQuery(passcodesApi.listCollaboratorsAdmin) as Collaborator[] | undefined;

  // Mutations
  const upsertCollaborator = useMutation(passcodesApi.upsertCollaborator);
  const deleteCollaborator = useMutation(passcodesApi.deleteCollaborator);
  const seedCollaborators = useMutation(passcodesApi.seedCollaborators);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/settings');
    }
  }, [isAdmin, isAdminLoading, router]);

  // Handle create collaborator
  const handleCreateCollaborator = async () => {
    if (!newName.trim()) {
      setError('Name is required');
      return;
    }
    if (!newSlug.trim()) {
      setError('Slug is required');
      return;
    }
    if (!newPasscode || newPasscode.length !== 6 || !/^\d+$/.test(newPasscode)) {
      setError('Passcode must be exactly 6 digits');
      return;
    }

    try {
      await upsertCollaborator({
        slug: newSlug.toLowerCase().replace(/\s+/g, '-'),
        displayName: newName,
        avatarEmoji: newEmoji,
        avatarColor: newColor,
        passcode: newPasscode,
        isActive: true,
        sortOrder: collaborators?.length || 0,
      });
      setIsCreating(false);
      resetForm();
      setError(null);
    } catch (err) {
      setError('Failed to create collaborator');
    }
  };

  // Handle update collaborator passcode
  const handleUpdatePasscode = async (collab: Collaborator) => {
    if (!newPasscode || newPasscode.length !== 6 || !/^\d+$/.test(newPasscode)) {
      setError('Passcode must be exactly 6 digits');
      return;
    }

    try {
      await upsertCollaborator({
        slug: collab.slug,
        displayName: collab.displayName,
        avatarEmoji: collab.avatarEmoji,
        avatarColor: collab.avatarColor,
        passcode: newPasscode,
        isActive: collab.isActive,
        sortOrder: collab.sortOrder,
      });
      setEditingCollaborator(null);
      setNewPasscode('');
      setError(null);
    } catch (err) {
      setError('Failed to update passcode');
    }
  };

  // Handle delete collaborator
  const handleDeleteCollaborator = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this collaborator?')) {
      return;
    }

    try {
      await deleteCollaborator({ slug });
    } catch (err) {
      setError('Failed to delete collaborator');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (collab: Collaborator) => {
    try {
      await upsertCollaborator({
        slug: collab.slug,
        displayName: collab.displayName,
        avatarEmoji: collab.avatarEmoji,
        avatarColor: collab.avatarColor,
        isActive: !collab.isActive,
        sortOrder: collab.sortOrder,
      });
    } catch (err) {
      setError('Failed to update collaborator');
    }
  };

  // Handle seed default collaborators
  const handleSeedDefaults = async () => {
    try {
      await seedCollaborators({});
      setError(null);
    } catch (err) {
      setError('Failed to seed collaborators');
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewSlug('');
    setNewPasscode('');
    setNewEmoji('😎');
    setNewColor(AVATAR_COLORS[0]);
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
              <h1 className="text-xl font-semibold text-white">iPod Collaborators</h1>
              <p className="text-xs text-white/50">Manage music sharing access</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
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
              <Music className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/70">
                  iPod collaborators can access private music playlists using their 6-digit passcode.
                  Each collaborator has their own avatar that appears in the carousel.
                </p>
              </div>
            </div>
          </div>

          {/* Seed defaults button */}
          {collaborators?.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              className="mb-4 w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Seed Default Collaborators (Owner, Team, Admins)
            </button>
          )}

          {/* Collaborators list */}
          <div className="space-y-3">
            {collaborators === undefined ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/50">No collaborators yet</p>
              </div>
            ) : (
              collaborators.map((collab) => (
                <motion.div
                  key={collab._id}
                  layout
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  {editingCollaborator === collab.slug ? (
                    /* Edit mode */
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${collab.avatarColor} flex items-center justify-center text-2xl`}>
                          {collab.avatarEmoji}
                        </div>
                        <div>
                          <span className="text-white font-medium">{collab.displayName}</span>
                          <p className="text-xs text-white/40 font-mono">{collab.slug}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type={showPasscode ? 'text' : 'password'}
                          value={newPasscode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setNewPasscode(val);
                          }}
                          placeholder="Enter new 6-digit passcode"
                          className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/20 rounded-lg text-white text-center text-lg tracking-[0.5em] font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                          onClick={() => handleUpdatePasscode(collab)}
                          disabled={newPasscode.length !== 6}
                          className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-white/10 disabled:text-white/30 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Update Passcode
                        </button>
                        <button
                          onClick={() => {
                            setEditingCollaborator(null);
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
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${collab.avatarColor} flex items-center justify-center text-2xl shadow-lg`}>
                        {collab.avatarEmoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{collab.displayName}</span>
                          {!collab.isActive && (
                            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">Disabled</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/40 font-mono">{collab.slug}</span>
                          {collab.lastAccessAt && (
                            <span className="text-xs text-white/30">
                              Last: {new Date(collab.lastAccessAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(collab)}
                          className={`p-2 rounded-lg transition-colors ${collab.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-white/40 hover:bg-white/10'}`}
                          title={collab.isActive ? 'Disable' : 'Enable'}
                        >
                          {collab.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCollaborator(collab.slug);
                            setNewPasscode('');
                          }}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Change passcode"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollaborator(collab.slug)}
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

          {/* Create new collaborator */}
          <AnimatePresence>
            {isCreating ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 p-4 rounded-xl bg-white/5 border border-emerald-500/30"
              >
                <h3 className="text-white font-medium mb-3">Add Collaborator</h3>
                <div className="space-y-3">
                  {/* Avatar preview */}
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${newColor} flex items-center justify-center text-3xl shadow-lg`}>
                      {newEmoji}
                    </div>
                  </div>

                  {/* Emoji picker */}
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Avatar Emoji</label>
                    <div className="flex flex-wrap gap-1">
                      {AVATAR_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setNewEmoji(emoji)}
                          className={`w-8 h-8 rounded-lg text-lg transition-all ${newEmoji === emoji
                              ? 'bg-white/20 ring-2 ring-emerald-500'
                              : 'bg-white/5 hover:bg-white/10'
                            }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color picker */}
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Avatar Color</label>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewColor(color)}
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} transition-all ${newColor === color
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950'
                              : 'opacity-60 hover:opacity-100'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    placeholder="Display name (e.g., Admin)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="Slug (e.g., admin)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                      className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/20 rounded-lg text-white text-center text-lg tracking-[0.5em] font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                      onClick={handleCreateCollaborator}
                      disabled={!newName.trim() || !newSlug.trim() || newPasscode.length !== 6}
                      className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-white/10 disabled:text-white/30 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Add Collaborator
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        resetForm();
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
                Add Collaborator
              </motion.button>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}
