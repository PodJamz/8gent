'use client';

/**
 * CalendarWithAuth - The full calendar implementation with Clerk
 *
 * This component is dynamically imported when Clerk is available.
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Calendar, Clock, Plus, Users, Link2, Settings, Check, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import {
  EventTypeCard,
  EventTypeForm,
  AvailabilityEditor,
  UpcomingBookings,
  GoogleCalendarConnect,
} from '@/components/scheduling';
import { useScheduling } from '@/hooks/useScheduling';
import type { EventType, LocationType, DaySchedule } from '@/lib/scheduling/types';
import { getUserTimezone } from '@/lib/scheduling/utils';
import type { Id } from '../../../convex/_generated/dataModel';

type Tab = 'bookings' | 'event-types' | 'availability' | 'integrations' | 'settings';

export default function CalendarWithAuth() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [showEventTypeForm, setShowEventTypeForm] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState(''); // Prevent hydration mismatch

  // Set baseUrl after mount to prevent hydration mismatch
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const {
    schemaReady,
    userProfile,
    eventTypes,
    defaultAvailability,
    calendarIntegration,
    upcomingBookings,
    isLoading,
    createOrUpdateUserProfile,
    createEventType,
    updateEventType,
    deleteEventType,
    updateAvailability,
    cancelBooking,
    markCompleted,
    markNoShow,
    connectGoogleCalendar,
    saveGoogleTokens,
    disconnectGoogleCalendar,
    isConnectingGoogle,
  } = useScheduling();

  // Initialize username input when profile loads
  useEffect(() => {
    if (userProfile?.username) {
      setUsernameInput(userProfile.username);
    }
  }, [userProfile?.username]);

  // Handle Google OAuth callback
  useEffect(() => {
    const googleTokens = searchParams.get('google_tokens');
    if (googleTokens) {
      try {
        const tokenData = JSON.parse(Buffer.from(googleTokens, 'base64').toString());
        saveGoogleTokens(tokenData).then(() => {
          router.replace('/calendar');
        });
      } catch (error) {
        console.error('Failed to parse Google tokens:', error);
      }
    }

    const error = searchParams.get('error');
    if (error) {
      console.error('Google OAuth error:', error);
      router.replace('/calendar');
    }
  }, [searchParams, saveGoogleTokens, router]);

  // Handle saving event type
  const handleSaveEventType = async (data: {
    title: string;
    description?: string;
    duration: number;
    color: string;
    locationType: LocationType;
    locationValue?: string;
    bufferBefore?: number;
    bufferAfter?: number;
    minNotice?: number;
    maxAdvance?: number;
  }) => {
    if (editingEventType) {
      await updateEventType(editingEventType._id as Id<'eventTypes'>, data);
    } else {
      await createEventType(data);
    }
    setShowEventTypeForm(false);
    setEditingEventType(null);
  };

  // Handle toggling event type active status
  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateEventType(id as Id<'eventTypes'>, { isActive });
  };

  // Handle deleting event type
  const handleDeleteEventType = async (id: string) => {
    if (confirm('Are you sure you want to delete this event type?')) {
      await deleteEventType(id as Id<'eventTypes'>);
    }
  };

  // Handle saving availability
  const handleSaveAvailability = async (schedule: DaySchedule[]) => {
    if (defaultAvailability) {
      await updateAvailability(defaultAvailability._id as Id<'availability'>, { schedule });
    }
  };

  // Loading state
  if (!isUserLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Schema not deployed yet
  if (!schemaReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LiquidGlass className="p-8 rounded-2xl text-center max-w-md">
          <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(var(--primary))' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            Schema Setup Required
          </h1>
          <p className="mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            The scheduling schema needs to be deployed to Convex.
          </p>
          <div className="text-left p-4 rounded-lg font-mono text-sm" style={{ backgroundColor: 'hsl(var(--muted))' }}>
            <p style={{ color: 'hsl(var(--foreground))' }}>Run this command:</p>
            <code style={{ color: 'hsl(var(--primary))' }}>npx convex dev</code>
          </div>
        </LiquidGlass>
      </div>
    );
  }

  // Loading data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LiquidGlass className="p-8 rounded-2xl text-center max-w-md">
          <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(var(--primary))' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            Calendar & Scheduling
          </h1>
          <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Sign in to manage your event types, availability, and view bookings.
          </p>
          <a
            href="/sign-in"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-colors"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Sign In to Continue
          </a>
        </LiquidGlass>
      </div>
    );
  }

  const tabs = [
    { id: 'bookings' as Tab, label: 'Bookings', icon: Users },
    { id: 'event-types' as Tab, label: 'Event Types', icon: Calendar },
    { id: 'availability' as Tab, label: 'Availability', icon: Clock },
    { id: 'integrations' as Tab, label: 'Integrations', icon: Link2 },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  // Use our userProfiles username, fallback to clerk username or ID
  const bookingUsername = userProfile?.username || user.username || user.id;
  const hasSetUsername = !!userProfile?.username;

  // Handle saving username
  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return;
    setIsSavingUsername(true);
    try {
      await createOrUpdateUserProfile({
        username: usernameInput.trim(),
        displayName: user.fullName || user.firstName || undefined,
      });
    } catch (error) {
      console.error('Failed to save username:', error);
      alert('Username may already be taken. Try a different one.');
    } finally {
      setIsSavingUsername(false);
    }
  };

  // Handle copying booking link
  const handleCopyBookingLink = () => {
    navigator.clipboard.writeText(`${baseUrl}/book/${bookingUsername}`);
    setUsernameCopied(true);
    setTimeout(() => setUsernameCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            Calendar
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            Manage your scheduling and bookings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: isActive ? 'hsl(var(--primary))' : 'transparent',
                  color: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                  border: isActive ? 'none' : '1px solid hsl(var(--border))',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UpcomingBookings
                bookings={upcomingBookings}
                onCancel={async (id) => cancelBooking(id as Id<'bookings'>)}
                onMarkComplete={async (id) => markCompleted(id as Id<'bookings'>)}
                onMarkNoShow={async (id) => markNoShow(id as Id<'bookings'>)}
              />
            </motion.div>
          )}

          {activeTab === 'event-types' && (
            <motion.div
              key="event-types"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Add event type button */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setEditingEventType(null);
                    setShowEventTypeForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  New Event Type
                </button>
              </div>

              {/* Event types list */}
              {eventTypes.length === 0 ? (
                <LiquidGlass className="p-8 rounded-2xl text-center">
                  <Calendar
                    className="w-12 h-12 mx-auto mb-4 opacity-50"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                    No event types yet
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Create your first event type to start accepting bookings
                  </p>
                  <button
                    onClick={() => setShowEventTypeForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Event Type
                  </button>
                </LiquidGlass>
              ) : (
                <div className="space-y-4">
                  {!hasSetUsername && (
                    <LiquidGlass className="p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'hsl(var(--primary) / 0.5)' }}>
                      <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        <strong style={{ color: 'hsl(var(--foreground))' }}>Set up your booking username</strong> in Settings to get a custom booking URL.
                      </p>
                    </LiquidGlass>
                  )}
                  {eventTypes.map((eventType) => (
                    <EventTypeCard
                      key={eventType._id}
                      eventType={eventType}
                      username={bookingUsername}
                      onEdit={(et) => {
                        setEditingEventType(et);
                        setShowEventTypeForm(true);
                      }}
                      onDelete={handleDeleteEventType}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AvailabilityEditor
                availability={defaultAvailability ?? null}
                onSave={handleSaveAvailability}
                timezone={defaultAvailability?.timezone || getUserTimezone()}
              />
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GoogleCalendarConnect
                integration={calendarIntegration ?? null}
                onConnect={connectGoogleCalendar}
                onDisconnect={disconnectGoogleCalendar}
                isConnecting={isConnectingGoogle}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Booking Username */}
              <LiquidGlass className="p-6 rounded-2xl">
                <h3 className="font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                  Booking Username
                </h3>
                <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  This is your custom booking URL that guests will use to schedule meetings with you.
                </p>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1 flex items-center rounded-lg overflow-hidden" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                    <span className="px-3 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {baseUrl}/book/
                    </span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="your-username"
                      className="flex-1 px-2 py-2 bg-transparent outline-none"
                      style={{ color: 'hsl(var(--foreground))' }}
                    />
                  </div>
                  <button
                    onClick={handleSaveUsername}
                    disabled={isSavingUsername || !usernameInput.trim() || usernameInput === userProfile?.username}
                    className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                    }}
                  >
                    {isSavingUsername ? 'Saving...' : 'Save'}
                  </button>
                </div>

                {hasSetUsername && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Your booking link:
                    </span>
                    <code className="text-sm px-2 py-1 rounded" style={{ backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--primary))' }}>
                      {baseUrl}/book/{bookingUsername}
                    </code>
                    <button
                      onClick={handleCopyBookingLink}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      title="Copy link"
                    >
                      {usernameCopied ? (
                        <Check className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                      )}
                    </button>
                    <a
                      href={`/book/${bookingUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      title="Open booking page"
                    >
                      <ExternalLink className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                    </a>
                  </div>
                )}
              </LiquidGlass>

              {/* Account Info */}
              <LiquidGlass className="p-6 rounded-2xl">
                <h3 className="font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                  Account Info
                </h3>
                <div className="space-y-2 text-sm">
                  <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Name:</span>{' '}
                    {user.fullName || user.firstName || 'Not set'}
                  </p>
                  <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Email:</span>{' '}
                    {user.emailAddresses[0]?.emailAddress || 'Not set'}
                  </p>
                </div>
              </LiquidGlass>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event type form modal */}
        <AnimatePresence>
          {showEventTypeForm && (
            <EventTypeForm
              eventType={editingEventType}
              onSave={handleSaveEventType}
              onClose={() => {
                setShowEventTypeForm(false);
                setEditingEventType(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
