'use client';

/**
 * Admin User Management Page
 *
 * Owner-only page for managing users, roles, and permissions.
 * Allows adding collaborators, setting their access levels, and
 * controlling what features they can use.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';

// Type assertion for userManagement module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userManagementApi = (api as any).userManagement;

import { PageTransition } from '@/components/ios';
import { useAdminSession } from '@/hooks/useAdminSession';
import {
  ChevronLeft,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Shield,
  ShieldCheck,
  UserPlus,
  Eye,
  Crown,
  UserCog,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Music,
  Palette,
  Sparkles,
  BarChart,
  Key,
  FileEdit,
  AlertTriangle,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface ManagedUser {
  id: string;
  email: string;
  clerkId?: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'collaborator' | 'viewer';
  isActive: boolean;
  permissions: {
    areas: string[];
    privateMusic: boolean;
    designCanvas: boolean;
    clawAI: boolean;
    security: boolean;
    analytics: boolean;
    manageUsers: boolean;
    managePasscodes: boolean;
    manageContent: boolean;
  };
  invitedAt: number;
  lastActiveAt?: number;
  notes?: string;
}

interface UserStats {
  total: number;
  active: number;
  byRole: {
    owner: number;
    admin: number;
    collaborator: number;
    viewer: number;
  };
}

// ============================================================================
// Constants
// ============================================================================

const ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features', icon: ShieldCheck },
  { value: 'collaborator', label: 'Collaborator', description: 'Access to assigned features', icon: Users },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access', icon: Eye },
] as const;

const AREAS = [
  { slug: 'humans', name: 'Humans Search', icon: Users },
  { slug: 'studio', name: 'Jamz Studio', icon: Music },
  { slug: 'vault', name: 'Vault', icon: Lock },
  { slug: 'calendar', name: 'Calendar', icon: Lock },
  { slug: 'prototyping', name: 'Prototyping', icon: Palette },
];

const FEATURE_PERMISSIONS = [
  { key: 'privateMusic', label: 'Private Music', description: 'Access unreleased tracks', icon: Music },
  { key: 'designCanvas', label: 'Design Canvas', description: 'Use infinite canvas', icon: Palette },
  { key: 'clawAI', label: 'Claw AI', description: 'Chat with AI assistant', icon: Sparkles },
  { key: 'security', label: 'Security Dashboard', description: 'View security events', icon: Shield },
  { key: 'analytics', label: 'Analytics', description: 'View usage stats', icon: BarChart },
] as const;

const ADMIN_PERMISSIONS = [
  { key: 'manageUsers', label: 'Manage Users', description: 'Add, edit, remove users', icon: UserCog },
  { key: 'managePasscodes', label: 'Manage Passcodes', description: 'Change area passcodes', icon: Key },
  { key: 'manageContent', label: 'Manage Content', description: 'Edit site content', icon: FileEdit },
] as const;

// ============================================================================
// Main Component
// ============================================================================

export default function UserManagementPage() {
  const router = useRouter();
  const { isAuthenticated: isAdmin, isLoading: isAdminLoading } = useAdminSession();

  // State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'collaborator' | 'viewer'>('collaborator');
  const [newNotes, setNewNotes] = useState('');

  // Queries
  const users = useQuery(userManagementApi?.listManagedUsers) as ManagedUser[] | undefined;
  const stats = useQuery(userManagementApi?.getUserStats) as UserStats | undefined;

  // Mutations
  const upsertUser = useMutation(userManagementApi?.upsertManagedUser);
  const deleteUser = useMutation(userManagementApi?.deleteManagedUser);
  const toggleArea = useMutation(userManagementApi?.toggleAreaAccess);
  const updatePermissions = useMutation(userManagementApi?.updateUserPermissions);
  const seedOwner = useMutation(userManagementApi?.seedOwner);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/settings');
    }
  }, [isAdmin, isAdminLoading, router]);

  // Clear messages after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handlers
  const handleAddUser = async () => {
    if (!newEmail.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await upsertUser({
        email: newEmail,
        displayName: newDisplayName || undefined,
        role: newRole,
        isActive: true,
        notes: newNotes || undefined,
        invitedBy: 'admin', // In production, use actual Clerk ID
      });
      setIsAddingUser(false);
      resetForm();
      setSuccess(`${newDisplayName || newEmail} has been added`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm(`Are you sure you want to remove this user? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser({ email });
      setSuccess('User has been removed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user');
    }
  };

  const handleToggleActive = async (user: ManagedUser) => {
    try {
      await upsertUser({
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        isActive: !user.isActive,
        invitedBy: 'admin',
      });
      setSuccess(`${user.displayName || user.email} has been ${user.isActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleToggleAreaAccess = async (user: ManagedUser, area: string) => {
    const hasAccess = user.permissions.areas.includes(area);
    try {
      await toggleArea({
        email: user.email,
        area,
        hasAccess: !hasAccess,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update access');
    }
  };

  const handleTogglePermission = async (user: ManagedUser, key: string) => {
    const newPermissions = {
      ...user.permissions,
      [key]: !user.permissions[key as keyof typeof user.permissions],
    };
    try {
      await updatePermissions({
        email: user.email,
        permissions: newPermissions,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update permissions');
    }
  };

  const handleRoleChange = async (user: ManagedUser, newRole: 'admin' | 'collaborator' | 'viewer') => {
    try {
      await upsertUser({
        email: user.email,
        displayName: user.displayName,
        role: newRole,
        isActive: user.isActive,
        notes: user.notes,
        invitedBy: 'admin',
      });
      setSuccess(`${user.displayName || user.email} is now a ${newRole}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change role');
    }
  };

  const handleSeedOwner = async () => {
    try {
      await seedOwner({
        email: 'admin@openclaw.io',
        displayName: 'OpenClaw-OS',
      });
      setSuccess('Owner account created');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create owner');
    }
  };

  const resetForm = () => {
    setNewEmail('');
    setNewDisplayName('');
    setNewRole('collaborator');
    setNewNotes('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return ShieldCheck;
      case 'collaborator': return Users;
      default: return Eye;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-amber-400 bg-amber-500/10';
      case 'admin': return 'text-purple-400 bg-purple-500/10';
      case 'collaborator': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-white/60 bg-white/10';
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
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/settings"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go back to settings"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">User Management</h1>
              <p className="text-xs text-white/50">Manage access and permissions</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-500/20 rounded">
                  <X className="w-3 h-3 text-red-400" />
                </button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-400">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-white/50">Total</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
                <div className="text-xs text-white/50">Active</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.byRole.admin}</div>
                <div className="text-xs text-white/50">Admins</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-bold text-white/60">{stats.byRole.collaborator + stats.byRole.viewer}</div>
                <div className="text-xs text-white/50">Others</div>
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/70">
                  Manage who has access to your OpenClaw-OS instance. Add collaborators, assign roles, and control
                  exactly what features and areas each user can access.
                </p>
              </div>
            </div>
          </div>

          {/* Seed owner button (only show if no users) */}
          {users?.length === 0 && (
            <button
              onClick={handleSeedOwner}
              className="mb-4 w-full py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Initialize Owner Account
            </button>
          )}

          {/* Add user button */}
          {!isAddingUser && (
            <button
              onClick={() => setIsAddingUser(true)}
              className="mb-4 w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add New User
            </button>
          )}

          {/* Add user form */}
          <AnimatePresence>
            {isAddingUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <UserPlus className="w-4 h-4" />
                    Add New User
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      autoFocus
                    />
                  </div>

                  {/* Display name */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.value}
                            onClick={() => setNewRole(role.value)}
                            className={`p-3 rounded-lg border transition-colors text-left ${newRole === role.value
                                ? 'border-emerald-500/50 bg-emerald-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                              }`}
                          >
                            <Icon className={`w-4 h-4 mb-1 ${newRole === role.value ? 'text-emerald-400' : 'text-white/60'}`} />
                            <div className={`text-sm font-medium ${newRole === role.value ? 'text-emerald-400' : 'text-white'}`}>
                              {role.label}
                            </div>
                            <div className="text-xs text-white/40">{role.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Notes (optional)</label>
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Add any notes about this user..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add User
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingUser(false);
                        resetForm();
                        setError(null);
                      }}
                      className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Users list */}
          <div className="space-y-3">
            {users === undefined ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/50">No users yet</p>
                <p className="text-xs text-white/30 mt-1">Add your first user to get started</p>
              </div>
            ) : (
              users.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const isExpanded = expandedUser === user.email;
                const isOwner = user.role === 'owner';

                return (
                  <motion.div
                    key={user.id}
                    layout
                    className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                  >
                    {/* User header */}
                    <div
                      className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedUser(isExpanded ? null : user.email)}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg font-medium text-white">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (user.displayName || user.email)[0].toUpperCase()
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">
                            {user.displayName || user.email}
                          </span>
                          {!user.isActive && (
                            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">Inactive</span>
                          )}
                          {!user.clerkId && (
                            <span className="text-xs text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded">Pending</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span className="truncate">{user.email}</span>
                          {user.lastActiveAt && (
                            <>
                              <span>·</span>
                              <span>Active {new Date(user.lastActiveAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Role badge */}
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${getRoleColor(user.role)}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium capitalize">{user.role}</span>
                      </div>

                      {/* Expand icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      )}
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-4">
                            {/* Role selector (not for owner) */}
                            {!isOwner && (
                              <div>
                                <label className="block text-xs text-white/50 mb-2">Role</label>
                                <div className="flex gap-2">
                                  {ROLES.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = user.role === role.value;
                                    return (
                                      <button
                                        key={role.value}
                                        onClick={() => handleRoleChange(user, role.value)}
                                        className={`flex-1 p-2 rounded-lg border transition-colors ${isSelected
                                            ? 'border-emerald-500/50 bg-emerald-500/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                          }`}
                                      >
                                        <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-emerald-400' : 'text-white/60'}`} />
                                        <div className={`text-xs font-medium ${isSelected ? 'text-emerald-400' : 'text-white/70'}`}>
                                          {role.label}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Protected areas */}
                            {!isOwner && user.role !== 'admin' && (
                              <div>
                                <label className="block text-xs text-white/50 mb-2">Protected Area Access</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {AREAS.map((area) => {
                                    const hasAccess = user.permissions.areas.includes(area.slug);
                                    const Icon = area.icon;
                                    return (
                                      <button
                                        key={area.slug}
                                        onClick={() => handleToggleAreaAccess(user, area.slug)}
                                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${hasAccess
                                            ? 'border-emerald-500/50 bg-emerald-500/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                          }`}
                                      >
                                        <Icon className={`w-4 h-4 ${hasAccess ? 'text-emerald-400' : 'text-white/40'}`} />
                                        <span className={`text-xs ${hasAccess ? 'text-emerald-400' : 'text-white/60'}`}>
                                          {area.name}
                                        </span>
                                        {hasAccess && <Check className="w-3 h-3 text-emerald-400 ml-auto" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Feature permissions */}
                            {!isOwner && user.role !== 'admin' && (
                              <div>
                                <label className="block text-xs text-white/50 mb-2">Feature Access</label>
                                <div className="space-y-2">
                                  {FEATURE_PERMISSIONS.map((perm) => {
                                    const hasAccess = user.permissions[perm.key as keyof typeof user.permissions];
                                    const Icon = perm.icon;
                                    return (
                                      <button
                                        key={perm.key}
                                        onClick={() => handleTogglePermission(user, perm.key)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-colors ${hasAccess
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                          }`}
                                      >
                                        <Icon className={`w-4 h-4 ${hasAccess ? 'text-emerald-400' : 'text-white/40'}`} />
                                        <div className="flex-1 text-left">
                                          <div className={`text-sm ${hasAccess ? 'text-white' : 'text-white/60'}`}>
                                            {perm.label}
                                          </div>
                                          <div className="text-xs text-white/40">{perm.description}</div>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${hasAccess ? 'bg-emerald-500' : 'bg-white/20'}`}>
                                          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${hasAccess ? 'translate-x-4' : ''}`} />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Admin permissions (only for admins) */}
                            {user.role === 'admin' && (
                              <div>
                                <label className="block text-xs text-white/50 mb-2">Admin Permissions</label>
                                <div className="space-y-2">
                                  {ADMIN_PERMISSIONS.map((perm) => {
                                    const hasAccess = user.permissions[perm.key as keyof typeof user.permissions];
                                    const Icon = perm.icon;
                                    return (
                                      <button
                                        key={perm.key}
                                        onClick={() => handleTogglePermission(user, perm.key)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-colors ${hasAccess
                                            ? 'border-purple-500/30 bg-purple-500/5'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                          }`}
                                      >
                                        <Icon className={`w-4 h-4 ${hasAccess ? 'text-purple-400' : 'text-white/40'}`} />
                                        <div className="flex-1 text-left">
                                          <div className={`text-sm ${hasAccess ? 'text-white' : 'text-white/60'}`}>
                                            {perm.label}
                                          </div>
                                          <div className="text-xs text-white/40">{perm.description}</div>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${hasAccess ? 'bg-purple-500' : 'bg-white/20'}`}>
                                          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${hasAccess ? 'translate-x-4' : ''}`} />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {user.notes && (
                              <div className="p-2 rounded-lg bg-white/5 text-xs text-white/50">
                                {user.notes}
                              </div>
                            )}

                            {/* Actions */}
                            {!isOwner && (
                              <div className="flex gap-2 pt-2 border-t border-white/10">
                                <button
                                  onClick={() => handleToggleActive(user)}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${user.isActive
                                      ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    }`}
                                >
                                  {user.isActive ? (
                                    <>
                                      <Lock className="w-4 h-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="w-4 h-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.email)}
                                  className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )}

                            {/* Owner note */}
                            {isOwner && (
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs">
                                <Crown className="w-4 h-4" />
                                Owner account cannot be modified
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer info */}
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Role Permissions
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="flex items-center gap-1.5 text-amber-400 w-24">
                  <Crown className="w-3.5 h-3.5" />
                  Owner
                </dt>
                <dd className="text-white/60 flex-1">Full control over everything. Cannot be modified or removed.</dd>
              </div>
              <div className="flex gap-3">
                <dt className="flex items-center gap-1.5 text-purple-400 w-24">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </dt>
                <dd className="text-white/60 flex-1">Access to all features and can manage other users (except owner).</dd>
              </div>
              <div className="flex gap-3">
                <dt className="flex items-center gap-1.5 text-emerald-400 w-24">
                  <Users className="w-3.5 h-3.5" />
                  Collaborator
                </dt>
                <dd className="text-white/60 flex-1">Access to assigned features and areas only.</dd>
              </div>
              <div className="flex gap-3">
                <dt className="flex items-center gap-1.5 text-white/60 w-24">
                  <Eye className="w-3.5 h-3.5" />
                  Viewer
                </dt>
                <dd className="text-white/60 flex-1">Read-only access to permitted content.</dd>
              </div>
            </dl>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
