'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  Music2,
  Users,
  ListMusic,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  UserPlus,
  Mail,
  Shield,
  User,
  Loader2,
  ChevronRight,
  Settings,
} from 'lucide-react';

// Animation constants
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

type AdminTab = 'tracks' | 'collaborators' | 'playlists';

interface PrivateMusicAdminProps {
  onClose: () => void;
}

export function PrivateMusicAdmin({ onClose }: PrivateMusicAdminProps) {
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
        className="w-full max-w-2xl bg-gradient-to-b from-[#f5f5f5] to-[#e8e8e8] dark:from-zinc-800 dark:to-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-850">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  Music Admin
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Manage tracks, collaborators & playlists
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4 p-1 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-lg">
            {[
              { id: 'tracks' as const, label: 'Tracks', icon: Music2 },
              { id: 'collaborators' as const, label: 'Collaborators', icon: Users },
              { id: 'playlists' as const, label: 'Playlists', icon: ListMusic },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'tracks' && <TracksPanel key="tracks" />}
            {activeTab === 'collaborators' && <CollaboratorsPanel key="collaborators" />}
            {activeTab === 'playlists' && <PlaylistsPanel key="playlists" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Tracks Panel
// ============================================================================

function TracksPanel() {
  const tracks = useQuery(api.privateMusic.listAllPrivateTracks) || [];
  const addTrack = useMutation(api.privateMusic.addPrivateTrack);
  const deleteTrack = useMutation(api.privateMusic.deletePrivateTrack);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    audioUrl: '',
    albumArt: '',
    notes: '',
  });

  const handleAdd = async () => {
    if (!formData.title || !formData.artist || !formData.audioUrl) return;
    setIsAdding(true);
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
      setIsAdding(false);
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
        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
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
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Artist *"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
              </div>
              <input
                type="text"
                placeholder="Audio URL *"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Album (optional)"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Album Art URL (optional)"
                  value={formData.albumArt}
                  onChange={(e) => setFormData({ ...formData, albumArt: e.target.value })}
                  className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isAdding || !formData.title || !formData.artist || !formData.audioUrl}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2"
                >
                  {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
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
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
            No private tracks yet. Add one above.
          </div>
        ) : (
          tracks.map((track, index) => (
            <motion.div
              key={track.id}
              {...slideIn}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 group"
            >
              {track.albumArt ? (
                <img
                  src={track.albumArt}
                  alt=""
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
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
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(track.id)}
                  className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Delete track"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
  const [inviteData, setInviteData] = useState({ email: '', displayName: '', role: 'collaborator' as 'collaborator' | 'admin' });

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

  const handleToggleActive = async (id: Id<'musicCollaborators'>, isActive: boolean) => {
    await updateCollaborator({ collaboratorId: id, isActive: !isActive });
  };

  return (
    <motion.div {...fadeIn}>
      {/* Invite Button */}
      <button
        onClick={() => setShowInvite(!showInvite)}
        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        <UserPlus className="w-4 h-4" />
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
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Enter the email they'll use to sign in. When they sign in with Clerk, they'll automatically get access.
                </p>
              </div>
              <input
                type="email"
                placeholder="Email address *"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Display name (optional)"
                  value={inviteData.displayName}
                  onChange={(e) => setInviteData({ ...inviteData, displayName: e.target.value })}
                  className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as 'collaborator' | 'admin' })}
                  className="px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200"
                >
                  <option value="collaborator">Collaborator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowInvite(false)}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={isInviting || !inviteData.email}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2"
                >
                  {isInviting ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
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
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
            No collaborators yet. Invite someone above.
          </div>
        ) : (
          collaborators.map((collab, index) => (
            <motion.div
              key={collab.id}
              {...slideIn}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg border group ${
                collab.isActive
                  ? 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                  : 'bg-zinc-100 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-full ${
                collab.role === 'admin'
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : 'bg-zinc-100 dark:bg-zinc-700'
              }`}>
                {collab.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                    {collab.displayName || collab.email}
                  </span>
                  {collab.isPending && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">
                      Pending
                    </span>
                  )}
                  {collab.role === 'admin' && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {collab.email}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleActive(collab.id, collab.isActive)}
                  className={`p-1.5 rounded transition-colors ${
                    collab.isActive
                      ? 'hover:bg-amber-100 dark:hover:bg-amber-900/30 text-zinc-400 hover:text-amber-500'
                      : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-zinc-400 hover:text-emerald-500'
                  }`}
                  title={collab.isActive ? 'Deactivate' : 'Activate'}
                >
                  {collab.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleRemove(collab.id)}
                  className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Playlists Panel
// ============================================================================

function PlaylistsPanel() {
  const playlists = useQuery(api.privateMusic.listAllPlaylists) || [];
  const tracks = useQuery(api.privateMusic.listAllPrivateTracks) || [];
  const collaborators = useQuery(api.privateMusic.listCollaborators) || [];
  const createPlaylist = useMutation(api.privateMusic.createPlaylist);
  const deletePlaylist = useMutation(api.privateMusic.deletePlaylist);
  const addTrackToPlaylist = useMutation(api.privateMusic.addTrackToPlaylist);
  const removeTrackFromPlaylist = useMutation(api.privateMusic.removeTrackFromPlaylist);
  const grantPlaylistAccess = useMutation(api.privateMusic.grantPlaylistAccess);
  const revokePlaylistAccess = useMutation(api.privateMusic.revokePlaylistAccess);

  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createData, setCreateData] = useState({ name: '', description: '' });
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!createData.name) return;
    setIsCreating(true);
    try {
      await createPlaylist({
        name: createData.name,
        description: createData.description || undefined,
      });
      setCreateData({ name: '', description: '' });
      setShowCreate(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: Id<'privatePlaylists'>) => {
    if (confirm('Delete this playlist?')) {
      await deletePlaylist({ playlistId: id });
    }
  };

  const handleToggleTrack = async (playlistId: Id<'privatePlaylists'>, trackId: Id<'privateTracks'>, isInPlaylist: boolean) => {
    if (isInPlaylist) {
      await removeTrackFromPlaylist({ playlistId, trackId });
    } else {
      await addTrackToPlaylist({ playlistId, trackId });
    }
  };

  const handleToggleAccess = async (playlistId: Id<'privatePlaylists'>, userId: string, hasAccess: boolean) => {
    if (hasAccess) {
      await revokePlaylistAccess({ playlistId, userId });
    } else {
      await grantPlaylistAccess({ playlistId, userId });
    }
  };

  return (
    <motion.div {...fadeIn}>
      {/* Create Button */}
      <button
        onClick={() => setShowCreate(!showCreate)}
        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Create Playlist</span>
      </button>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Playlist name *"
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
              />
              <textarea
                placeholder="Description (optional)"
                value={createData.description}
                onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isCreating || !createData.name}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2"
                >
                  {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist List */}
      <div className="space-y-2">
        {playlists.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
            No playlists yet. Create one above.
          </div>
        ) : (
          playlists.map((playlist, index) => {
            const isExpanded = expandedPlaylist === playlist.id;
            return (
              <motion.div
                key={playlist.id}
                {...slideIn}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden"
              >
                {/* Playlist Header */}
                <button
                  onClick={() => setExpandedPlaylist(isExpanded ? null : playlist.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <ListMusic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                      {playlist.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {playlist.trackIds.length} tracks • {playlist.allowedUserIds.length} users
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4 border-t border-zinc-100 dark:border-zinc-700 pt-3">
                        {/* Tracks Section */}
                        <div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1">
                            <Music2 className="w-3 h-3" /> Tracks
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {tracks.map((track) => {
                              const isInPlaylist = playlist.trackIds.includes(track.id);
                              return (
                                <button
                                  key={track.id}
                                  onClick={() => handleToggleTrack(playlist.id, track.id, isInPlaylist)}
                                  className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-colors ${
                                    isInPlaylist
                                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                                  }`}
                                >
                                  {isInPlaylist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-50" />}
                                  <span className="truncate">{track.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Access Section */}
                        <div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Access
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {collaborators.filter(c => c.role !== 'admin').map((collab) => {
                              const hasAccess = playlist.allowedUserIds.includes(collab.userId);
                              return (
                                <button
                                  key={collab.id}
                                  onClick={() => handleToggleAccess(playlist.id, collab.userId, hasAccess)}
                                  className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-colors ${
                                    hasAccess
                                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                                  }`}
                                >
                                  {hasAccess ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-50" />}
                                  <span className="truncate">{collab.displayName || collab.email}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(playlist.id)}
                          className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Playlist
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
