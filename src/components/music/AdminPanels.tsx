'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  Music2,
  Users,
  Plus,
  Trash2,
  Check,
  X,
  UserPlus,
  Mail,
  Shield,
  User,
  Loader2,
  Upload,
  ToggleLeft,
  ToggleRight,
  Link2,
  Copy,
  CheckCircle,
  Clock,
  RefreshCw,
  Music,
  ListMusic,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ============================================================================
// Admin Tracks Panel - Left side panel for managing tracks
// ============================================================================

interface TrackWithCollaborators {
  id: Id<'privateTracks'>;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  audioUrl: string;
  notes?: string;
  allowedUserIds: string[];
  createdAt: number;
  updatedAt: number;
}

export function AdminTracksPanel() {
  const tracks = useQuery(api.privateMusic.listAllPrivateTracks) || [];
  const collaborators = useQuery(api.collaborators.listCollaboratorsWithResources) || [];
  const addTrack = useMutation(api.privateMusic.addPrivateTrack);
  const deleteTrack = useMutation(api.privateMusic.deletePrivateTrack);
  const assignToResource = useMutation(api.collaborators.assignToResource);
  const removeFromResource = useMutation(api.collaborators.removeFromResource);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    audioUrl: '',
    albumArt: '',
    notes: '',
  });

  // Get resource collaborators for a track
  const trackCollaborators = useQuery(
    api.collaborators.listResourceCollaborators,
    expandedTrackId
      ? { resourceType: 'track' as const, resourceId: expandedTrackId }
      : 'skip'
  ) || [];

  // Upload file to Vercel Blob
  const uploadFile = useCallback(async (file: File, type: 'audio' | 'image'): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/tracks/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFiles = files.filter(f =>
      f.type.startsWith('audio/') ||
      f.name.endsWith('.mp3') ||
      f.name.endsWith('.m4a') ||
      f.name.endsWith('.wav')
    );

    if (audioFiles.length === 0) return;

    setIsUploading(true);

    for (const file of audioFiles) {
      setUploadProgress(`Uploading ${file.name}...`);

      const audioUrl = await uploadFile(file, 'audio');
      if (audioUrl) {
        // Extract title from filename (remove extension)
        const title = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

        setUploadProgress(`Adding ${title}...`);

        await addTrack({
          title,
          artist: 'Unknown Artist',
          audioUrl,
        });
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
  }, [uploadFile, addTrack]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Handle file input change (for click-to-upload)
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      setUploadProgress(`Uploading ${file.name}...`);

      const audioUrl = await uploadFile(file, 'audio');
      if (audioUrl) {
        const title = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        setUploadProgress(`Adding ${title}...`);

        await addTrack({
          title,
          artist: 'Unknown Artist',
          audioUrl,
        });
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadFile, addTrack]);

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

  const handleAssignCollaborator = async (trackId: string, managedUserId: Id<'managedUsers'>) => {
    await assignToResource({
      managedUserId,
      resourceType: 'track',
      resourceId: trackId,
      accessLevel: 'view',
    });
  };

  const handleRemoveCollaborator = async (trackId: string, managedUserId: Id<'managedUsers'>) => {
    await removeFromResource({
      managedUserId,
      resourceType: 'track',
      resourceId: trackId,
    });
  };

  const toggleTrackExpand = (trackId: string) => {
    setExpandedTrackId(expandedTrackId === trackId ? null : trackId);
  };

  // Filter collaborators who don't have system-wide privateMusic access (they already see all)
  const assignableCollaborators = collaborators.filter(
    c => !c.permissions.privateMusic && c.role !== 'owner' && c.role !== 'admin'
  );

  return (
    <div
      className="flex flex-col h-full bg-transparent text-zinc-800 dark:text-white"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-amber-500/20 backdrop-blur-sm border-2 border-dashed border-amber-500 rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="w-12 h-12 text-amber-500 mx-auto mb-2" />
              <p className="text-amber-600 dark:text-amber-400 font-medium">Drop audio files here</p>
              <p className="text-sm text-amber-500/70">MP3, M4A, WAV supported</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">{uploadProgress}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-300 dark:border-zinc-700">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
          <Music2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Tracks</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{tracks.length} private tracks</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Drop Zone / Add Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 p-4 mb-4 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400"
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm font-medium">Drop files or click to upload</span>
          <span className="text-xs opacity-60">MP3, M4A, WAV</span>
        </button>

        {/* Manual Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full flex items-center justify-center gap-2 p-2 mb-4 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add by URL</span>
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
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg space-y-2">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Artist *"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Audio URL *"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Album (optional)"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Album Art URL (optional)"
                  value={formData.albumArt}
                  onChange={(e) => setFormData({ ...formData, albumArt: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={isAdding || !formData.title || !formData.artist || !formData.audioUrl}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2"
                  >
                    {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Add
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
              No private tracks yet
            </div>
          ) : (
            tracks.map((track, index) => {
              const isExpanded = expandedTrackId === track.id;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white/50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-2 group">
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
                        {track.artist}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {assignableCollaborators.length > 0 && (
                        <button
                          onClick={() => toggleTrackExpand(track.id)}
                          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          title="Manage access"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(track.id)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded collaborator assignment */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                            Grant access to specific collaborators:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {assignableCollaborators.map(collab => {
                              const hasAccess = trackCollaborators.some(
                                tc => tc.managedUserId === collab.id
                              );
                              return (
                                <button
                                  key={collab.id}
                                  onClick={() =>
                                    hasAccess
                                      ? handleRemoveCollaborator(track.id, collab.id)
                                      : handleAssignCollaborator(track.id, collab.id)
                                  }
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
                                    hasAccess
                                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                                  }`}
                                >
                                  {hasAccess && <Check className="w-3 h-3" />}
                                  {collab.displayName || collab.email.split('@')[0]}
                                </button>
                              );
                            })}
                            {assignableCollaborators.length === 0 && (
                              <p className="text-xs text-zinc-400 italic">
                                All collaborators have full music access
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Admin Collaborators Panel - Right side panel for managing collaborators
// ============================================================================

export function AdminCollaboratorsPanel() {
  // Use the new system-wide collaborators query
  const collaborators = useQuery(api.collaborators.listCollaboratorsWithResources) || [];
  const pendingInvites = useQuery(api.collaborators.listPendingInvites) || [];

  // New invite system mutations
  const createInvite = useMutation(api.collaborators.createInvite);
  const revokeInvite = useMutation(api.collaborators.revokeInvite);
  const regenerateInvite = useMutation(api.collaborators.regenerateInvite);

  // Legacy mutations for backwards compatibility
  const removeCollaborator = useMutation(api.privateMusic.removeCollaborator);
  const updateCollaborator = useMutation(api.privateMusic.updateCollaborator);

  const [showInvite, setShowInvite] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState({
    email: '',
    displayName: '',
    role: 'collaborator' as 'collaborator' | 'admin' | 'viewer',
    privateMusic: true,
  });

  const handleCreateInvite = async () => {
    if (!inviteData.email) return;
    setIsInviting(true);
    try {
      const result = await createInvite({
        email: inviteData.email,
        role: inviteData.role,
        permissions: {
          areas: [],
          privateMusic: inviteData.privateMusic,
          designCanvas: false,
          clawAI: true,
          security: false,
          analytics: false,
          manageUsers: inviteData.role === 'admin',
          managePasscodes: inviteData.role === 'admin',
          manageContent: inviteData.role === 'admin',
        },
      });

      if (result.success && result.token) {
        const inviteUrl = `${window.location.origin}/invite/${result.token}`;
        setGeneratedInviteLink(inviteUrl);
        navigator.clipboard.writeText(inviteUrl);
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyInviteLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateInvite = async (inviteId: Id<'collaboratorInvites'>) => {
    const result = await regenerateInvite({ inviteId });
    if (result.success && result.token) {
      const inviteUrl = `${window.location.origin}/invite/${result.token}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedId(result.token);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRevokeInvite = async (inviteId: Id<'collaboratorInvites'>) => {
    if (confirm('Revoke this invite? The link will no longer work.')) {
      await revokeInvite({ inviteId });
    }
  };

  const resetInviteForm = () => {
    setInviteData({ email: '', displayName: '', role: 'collaborator', privateMusic: true });
    setGeneratedInviteLink(null);
    setShowInvite(false);
  };

  // Filter to show only pending invites that haven't been accepted
  const activePendingInvites = pendingInvites.filter(
    inv => !inv.acceptedAt && !inv.isRevoked && !inv.isExpired
  );

  return (
    <div className="flex flex-col h-full bg-transparent text-zinc-800 dark:text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-300 dark:border-zinc-700">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
          <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Collaborators</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {collaborators.length} people
            {activePendingInvites.length > 0 && ` · ${activePendingInvites.length} pending`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Invite Button */}
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400"
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
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg space-y-3">
                {!generatedInviteLink ? (
                  <>
                    <div className="flex items-start gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Generate a unique invite link they can use to join
                      </p>
                    </div>
                    <input
                      type="email"
                      placeholder="Email *"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                    />
                    <select
                      value={inviteData.role}
                      onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as 'collaborator' | 'admin' | 'viewer' })}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-sm text-zinc-800 dark:text-zinc-200"
                    >
                      <option value="viewer">Viewer (read-only)</option>
                      <option value="collaborator">Collaborator</option>
                      <option value="admin">Admin</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <input
                        type="checkbox"
                        checked={inviteData.privateMusic}
                        onChange={(e) => setInviteData({ ...inviteData, privateMusic: e.target.checked })}
                        className="rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500"
                      />
                      <Music className="w-4 h-4" />
                      Access to all private music
                    </label>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={resetInviteForm}
                        className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateInvite}
                        disabled={isInviting || !inviteData.email}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2"
                      >
                        {isInviting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
                        Generate Link
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Invite link created and copied to clipboard!
                      </p>
                    </div>
                    <div className="p-2 bg-zinc-200 dark:bg-zinc-700 rounded-md">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 break-all font-mono">
                        {generatedInviteLink}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedInviteLink)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-200 dark:bg-zinc-700 rounded-md"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Again
                      </button>
                      <button
                        onClick={resetInviteForm}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md"
                      >
                        Done
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending Invites Section */}
        {activePendingInvites.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Pending Invites
            </h3>
            <div className="space-y-2">
              {activePendingInvites.map((invite) => (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-2 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-200/50 dark:border-amber-800/30"
                >
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/40">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                      {invite.email}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyInviteLink(invite.token)}
                      className="p-1.5 rounded hover:bg-amber-200/50 dark:hover:bg-amber-800/30 text-amber-600 dark:text-amber-400 transition-colors"
                      title="Copy invite link"
                    >
                      {copiedId === invite.token ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRegenerateInvite(invite.id)}
                      className="p-1.5 rounded hover:bg-amber-200/50 dark:hover:bg-amber-800/30 text-amber-600 dark:text-amber-400 transition-colors"
                      title="Regenerate link"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRevokeInvite(invite.id)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-colors"
                      title="Revoke invite"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Collaborator List */}
        <div className="space-y-2">
          {collaborators.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
              No collaborators yet
            </div>
          ) : (
            collaborators.map((collab, index) => (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-3 p-2 rounded-lg border group ${
                  collab.isActive
                    ? 'bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                    : 'bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  collab.role === 'owner'
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40'
                    : collab.role === 'admin'
                    ? 'bg-amber-100 dark:bg-amber-900/40'
                    : 'bg-zinc-100 dark:bg-zinc-800'
                }`}>
                  {collab.role === 'owner' ? (
                    <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  ) : collab.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">
                      {collab.displayName || collab.email.split('@')[0]}
                    </span>
                    {collab.role === 'owner' && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full uppercase tracking-wider">
                        Owner
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-2">
                    <span>{collab.email}</span>
                    {collab.totalResources > 0 && (
                      <span className="inline-flex items-center gap-1">
                        {collab.resourceCounts.tracks > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Music className="w-3 h-3" />
                            {collab.resourceCounts.tracks}
                          </span>
                        )}
                        {collab.resourceCounts.playlists > 0 && (
                          <span className="flex items-center gap-0.5">
                            <ListMusic className="w-3 h-3" />
                            {collab.resourceCounts.playlists}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                {collab.role !== 'owner' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {collab.hasPendingInvite && collab.inviteToken && (
                      <button
                        onClick={() => handleCopyInviteLink(collab.inviteToken!)}
                        className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        title="Copy invite link"
                      >
                        {copiedId === collab.inviteToken ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Link2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
