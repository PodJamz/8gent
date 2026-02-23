'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  Music2,
  Users,
  Disc,
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  ChevronDown,
  Settings,
  Globe,
  Lock,
  Mic2,
  Sparkles,
} from 'lucide-react';
import { EphemeralMusicChat } from './EphemeralMusicChat';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.15 },
};

type AdminTab = 'tracks' | 'collaborators' | 'info';

interface MusicAdminPanelProps {
  onClose: () => void;
}

/**
 * Music admin panel for managing the music library.
 * Uses the existing privateMusic API.
 *
 * NOTE: Once the new music schema (convex/music.ts) is deployed via `npx convex deploy`,
 * this can be enhanced with full credit/artist/album management.
 */
export function MusicAdminPanel({ onClose }: MusicAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('tracks');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-[#f5f5f5] to-[#e8e8e8] dark:from-zinc-800 dark:to-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-850">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  Music Library
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Manage your tracks and collaborators
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4 p-1 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-xl">
            {[
              { id: 'tracks' as const, label: 'Tracks', icon: Music2 },
              { id: 'collaborators' as const, label: 'Collaborators', icon: Users },
              { id: 'info' as const, label: 'Info', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-zinc-600 text-zinc-800 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'tracks' && <TracksPanel key="tracks" />}
            {activeTab === 'collaborators' && <CollaboratorsPanel key="collaborators" />}
            {activeTab === 'info' && <InfoPanel key="info" />}
          </AnimatePresence>
        </div>

        {/* 8gent Chat Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
          <EphemeralMusicChat
            isAdmin
            context="Help with music library management, track metadata, and organization."
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Tracks Panel - Using existing privateMusic API
// ============================================================================

function TracksPanel() {
  const tracks = useQuery(api.privateMusic.listAllPrivateTracks) || [];
  const addTrack = useMutation(api.privateMusic.addPrivateTrack);
  const deleteTrack = useMutation(api.privateMusic.deletePrivateTrack);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    audioUrl: '',
    albumArt: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.artist || !formData.audioUrl) return;
    setIsSubmitting(true);
    try {
      await addTrack({
        title: formData.title,
        artist: formData.artist,
        album: formData.album || undefined,
        audioUrl: formData.audioUrl,
        albumArt: formData.albumArt || undefined,
        notes: formData.notes || undefined,
      });
      setFormData({ title: '', artist: '', album: '', audioUrl: '', albumArt: '', notes: '' });
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<'privateTracks'>) => {
    if (confirm('Delete this track?')) {
      await deleteTrack({ trackId: id });
    }
  };

  return (
    <motion.div {...fadeIn}>
      {/* Add Track Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add Track</span>
      </button>

      {/* Add Track Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Artist *"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
              </div>
              <input
                type="text"
                placeholder="Audio URL *"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Album (optional)"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Album Art URL (optional)"
                  value={formData.albumArt}
                  onChange={(e) => setFormData({ ...formData, albumArt: e.target.value })}
                  className="px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.title || !formData.artist || !formData.audioUrl}
                  className="px-5 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Add Track
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track List */}
      <div className="space-y-2">
        {tracks.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tracks yet. Add one above.</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <motion.div
              key={track.id}
              {...slideIn}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 group"
            >
              {track.albumArt ? (
                <img
                  src={track.albumArt}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-zinc-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                  {track.title}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {track.artist} {track.album && `• ${track.album}`}
                </div>
              </div>
              <button
                onClick={() => handleDelete(track.id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Collaborators Panel
// ============================================================================

function CollaboratorsPanel() {
  const collaborators = useQuery(api.privateMusic.listCollaborators) || [];
  const addCollaborator = useMutation(api.privateMusic.addCollaborator);
  const removeCollaborator = useMutation(api.privateMusic.removeCollaborator);
  const updateCollaborator = useMutation(api.privateMusic.updateCollaborator);

  const [showInvite, setShowInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    displayName: '',
    role: 'collaborator' as 'collaborator' | 'admin',
  });

  const handleInvite = async () => {
    if (!inviteData.email) return;
    setIsInviting(true);
    try {
      await addCollaborator({
        email: inviteData.email,
        displayName: inviteData.displayName || undefined,
        role: inviteData.role,
      });
      setInviteData({ email: '', displayName: '', role: 'collaborator' });
      setShowInvite(false);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (id: Id<'musicCollaborators'>) => {
    if (confirm('Remove this collaborator?')) {
      await removeCollaborator({ collaboratorId: id });
    }
  };

  return (
    <motion.div {...fadeIn}>
      {/* Invite Button */}
      <button
        onClick={() => setShowInvite(!showInvite)}
        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Invite Collaborator</span>
      </button>

      {/* Invite Form */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl space-y-3">
              <input
                type="email"
                placeholder="Email address *"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Display name (optional)"
                  value={inviteData.displayName}
                  onChange={(e) => setInviteData({ ...inviteData, displayName: e.target.value })}
                  className="px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as 'collaborator' | 'admin' })}
                  className="px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200"
                >
                  <option value="collaborator">Collaborator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={isInviting || !inviteData.email}
                  className="px-5 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 rounded-lg flex items-center gap-2"
                >
                  {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Invite
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborator List */}
      <div className="space-y-2">
        {collaborators.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No collaborators yet. Invite someone above.</p>
          </div>
        ) : (
          collaborators.map((collab, index) => (
            <motion.div
              key={collab.id}
              {...slideIn}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                    {collab.displayName || collab.email}
                  </span>
                  {collab.role === 'admin' && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {collab.email}
                </div>
              </div>
              <button
                onClick={() => handleRemove(collab.id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Info Panel - Schema upgrade info
// ============================================================================

function InfoPanel() {
  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
              Full Credits System Coming Soon
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The new music schema with Spotify-style credits, multiple artists, albums, lyrics,
              and tags has been designed and is ready to deploy.
            </p>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          New Features
        </h4>
        {[
          { icon: Mic2, label: 'Artist Profiles', desc: 'Create artist entities with bio and links' },
          { icon: Disc, label: 'Album Management', desc: 'Group tracks into albums with cover art' },
          { icon: Users, label: 'Full Credits', desc: 'Producer, writer, mixer, mastering, and more' },
          { icon: Tag, label: 'Tags & Categories', desc: 'Organize with custom tags and colors' },
          { icon: Globe, label: 'Public/Private', desc: 'Control visibility per track' },
        ].map((feature) => (
          <div
            key={feature.label}
            className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700"
          >
            <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
              <feature.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                {feature.label}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {feature.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deploy Instructions */}
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          To Enable Full Features
        </h4>
        <code className="block text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-700 p-2 rounded-lg">
          npx convex deploy
        </code>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          This deploys the new music schema with artists, albums, credits, and more.
        </p>
      </div>
    </motion.div>
  );
}

export default MusicAdminPanel;
