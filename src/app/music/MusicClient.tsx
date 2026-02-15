'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurFade from '@/components/magicui/blur-fade';
import { List, Lock, Music2, Eye, EyeOff, Settings, ChevronLeft, Play, Pause, Disc, Home, Maximize2, Minimize2, Sparkles, Loader2 } from 'lucide-react';
import { tracks as publicTracks, isVideoTrack, type Track } from '@/data/tracks';
import { useMusic } from '@/context/MusicContext';
import { PageTransition } from '@/components/ios';
import { PrivateMusicProvider, usePrivateMusic, type PrivateTrack } from '@/context/PrivateMusicContext';
import { IPodAuthScreen } from '@/components/music/iPodAuthScreen';
import { PrivateMusicAdmin } from '@/components/music/PrivateMusicAdmin';
import { VinylCarousel, type Album } from '@/components/music/VinylCarousel';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useMusicPlayerMorph } from '@/hooks/useMusicPlayerMorph';
import { ExpandedNowPlaying } from '@/components/music/ExpandedNowPlaying';
import { LibraryBrowser } from '@/components/music/LibraryBrowser';
import { AdminTracksPanel, AdminCollaboratorsPanel } from '@/components/music/AdminPanels';
import { useMusicGeneration, MUSIC_PRESETS } from '@/hooks/useMusicGeneration';

const BLUR_FADE_DELAY = 0.04;

// View types for the iPod screen
type ViewType = 'carousel' | 'album' | 'nowPlaying' | 'playlist' | 'auth' | 'create';

// Inner component that uses the private music context
function MusicPageContent() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isVideo,
    togglePlay,
    skipToNext,
    skipToPrevious,
    selectTrack,
    setVideoElement,
  } = useMusic();

  // Expandable player morph state
  const {
    morphProgress,
    morphState,
    isDragging,
    isMobile,
    ipodScale,
    ipodBorderRadius,
    panelOpacity,
    expand,
    collapse,
    toggleExpanded,
  } = useMusicPlayerMorph();

  const isExpanded = morphProgress > 0.5;
  const showPanels = morphProgress > 0.3 && !isMobile;

  // Ref for video element
  const videoRef = useRef<HTMLVideoElement>(null);

  // Register video element with music context when it changes
  useEffect(() => {
    if (isVideo && videoRef.current) {
      setVideoElement(videoRef.current);
    }
    return () => {
      if (isVideo) {
        setVideoElement(null);
      }
    };
  }, [isVideo, setVideoElement, currentTrack.id]);

  const {
    hasPrivateAccess,
    isCollaborator,
    isAdmin,
    privateTracks,
    collaborator,
    isLoadingTracks,
  } = usePrivateMusic();

  // Check if user is owner/admin (has full access to music admin)
  const { hasAccess: hasOwnerAccess } = useFeatureAccess('privateMusic');

  const [currentView, setCurrentView] = useState<ViewType>('carousel');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  // Toggle between public and private view (for collaborators who have access)
  const [viewingPrivate, setViewingPrivate] = useState(false);

  // Create mode state
  const [createPrompt, setCreatePrompt] = useState('');
  const [createDuration, setCreateDuration] = useState(30);
  const [showAdvancedCreate, setShowAdvancedCreate] = useState(false);
  const [createLyrics, setCreateLyrics] = useState('');
  const [createBpm, setCreateBpm] = useState<number | undefined>();
  const [createKey, setCreateKey] = useState<string | undefined>();

  // Music generation hook
  const {
    generate,
    isGenerating,
    progress,
    error: generateError,
    result: generateResult,
    reset: resetGeneration,
  } = useMusicGeneration();

  // Screen container ref for animations
  const screenRef = useRef<HTMLDivElement>(null);

  // Legacy compatibility
  const showPlaylist = currentView === 'playlist';
  const showAuthScreen = currentView === 'auth';

  // Auto-switch to private view when user has access and private tracks exist
  useEffect(() => {
    if (hasPrivateAccess && privateTracks.length > 0 && !viewingPrivate) {
      setViewingPrivate(true);
    }
  }, [hasPrivateAccess, privateTracks.length, viewingPrivate]);

  // Determine which tracks to show based on view mode
  const tracks: Track[] = useMemo(() => {
    if (viewingPrivate && hasPrivateAccess && privateTracks.length > 0) {
      return privateTracks.map((pt: PrivateTrack) => ({
        id: pt.id,
        title: pt.title,
        artist: pt.artist,
        album: pt.album,
        albumArt: pt.albumArt,
        audioSrc: pt.audioSrc,
        lyrics: pt.lyrics,
      }));
    }
    return publicTracks;
  }, [viewingPrivate, hasPrivateAccess, privateTracks]);

  // Reset to first track when switching modes
  useEffect(() => {
    if (tracks.length > 0 && !tracks.find(t => t.id === currentTrack.id)) {
      selectTrack(tracks[0]);
    }
  }, [tracks, currentTrack.id, selectTrack]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Handle opening the auth screen
  const handleOpenAuth = () => {
    setCurrentView('auth');
  };

  // Handle closing the auth screen
  const handleCloseAuth = () => {
    setCurrentView('carousel');
  };

  // Handle successful auth
  const handleAuthSuccess = () => {
    setCurrentView('carousel');
    // Refresh the page to get updated auth state
    window.location.reload();
  };

  // Handle album selection from carousel
  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setCurrentView('album');
  };

  // Handle track selection - go to now playing
  const handleSelectTrackFromAlbum = (track: Track) => {
    selectTrack(track);
    setCurrentView('nowPlaying');
  };

  // Navigate back based on current view
  const handleBack = () => {
    if (currentView === 'nowPlaying') {
      setCurrentView('album');
    } else if (currentView === 'album') {
      setCurrentView('carousel');
      setSelectedAlbum(null);
    } else if (currentView === 'playlist') {
      setCurrentView('carousel');
    } else if (currentView === 'auth') {
      handleCloseAuth();
    } else if (currentView === 'create') {
      resetGeneration();
      setCurrentView('carousel');
    }
  };

  // Get the back button label
  const getMenuLabel = () => {
    if (currentView === 'auth') return 'BACK';
    if (currentView === 'nowPlaying') return 'ALBUM';
    if (currentView === 'album') return 'BACK';
    if (currentView === 'playlist') return 'BACK';
    if (currentView === 'create') return 'BACK';
    return 'MENU';
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col items-center justify-start">
        {/* Private Session Indicator - shown when viewing private tracks */}
        {viewingPrivate && hasPrivateAccess && collaborator && (
          <BlurFade delay={0.05}>
            <div className="fixed top-6 left-6 z-50">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <Music2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {collaborator.displayName}{isAdmin && ' (Admin)'}
                </span>
                <button
                  onClick={() => setViewingPrivate(false)}
                  className="ml-1 p-0.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                  title="Switch to public tracks"
                >
                  <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="ml-1 p-0.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                    title="Admin settings"
                  >
                    <Settings className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </button>
                )}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Viewing public tracks as collaborator - show toggle to go back to private */}
        {!viewingPrivate && hasPrivateAccess && privateTracks.length > 0 && (
          <BlurFade delay={0.1}>
            <button
              onClick={() => setViewingPrivate(true)}
              className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors group"
              title="Switch to private tracks"
            >
              <EyeOff className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300" />
              <span className="text-xs text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                Private
              </span>
            </button>
          </BlurFade>
        )}

        {/* Background blur overlay when expanded */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* iPod Classic Container with Expandable Panels */}
        <div className="flex flex-col items-center pt-16 pb-32 px-4 relative z-20">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="relative flex items-center justify-center">
              {/* Left Panel - Library Browser OR Admin Panel (Desktop only) */}
              {!isMobile && (
                <motion.div
                  className="absolute right-full mr-6 w-[320px] h-[520px]"
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{
                    opacity: showPanels ? 1 : 0,
                    x: showPanels ? 0 : 50,
                    scale: showPanels ? 1 : 0.95,
                    pointerEvents: showPanels ? 'auto' : 'none',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                >
                  <div className="h-full rounded-2xl bg-gradient-to-b from-[#f5f5f5] to-[#d4d4d4] dark:from-zinc-800 dark:to-zinc-900 border border-white/20 overflow-hidden shadow-2xl">
                    {adminMode ? (
                      <AdminTracksPanel />
                    ) : (
                      <LibraryBrowser onClose={collapse} />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Right Panel - Expanded Now Playing OR Admin Panel (Desktop only) */}
              {!isMobile && (
                <motion.div
                  className="absolute left-full ml-6 w-[320px] h-[520px]"
                  initial={{ opacity: 0, x: -50, scale: 0.95 }}
                  animate={{
                    opacity: showPanels ? 1 : 0,
                    x: showPanels ? 0 : -50,
                    scale: showPanels ? 1 : 0.95,
                    pointerEvents: showPanels ? 'auto' : 'none',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                >
                  <div className="h-full rounded-2xl bg-gradient-to-b from-[#f5f5f5] to-[#d4d4d4] dark:from-zinc-800 dark:to-zinc-900 border border-white/20 overflow-hidden shadow-2xl">
                    {adminMode ? (
                      <AdminCollaboratorsPanel />
                    ) : (
                      <ExpandedNowPlaying />
                    )}
                  </div>
                </motion.div>
              )}

              {/* The iPod itself - with morph capability */}
              <motion.div
                className="relative"
                style={{
                  scale: ipodScale,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Floating buttons removed - now in dock */}

                <motion.div
                  className="bg-gradient-to-b from-[#f5f5f5] to-[#d4d4d4] dark:from-zinc-800 dark:to-zinc-900 rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border border-white/20 w-[300px] max-w-[calc(100vw-32px)]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{
                    borderRadius: ipodBorderRadius,
                    boxShadow: isDragging
                      ? '0 35px 60px -15px rgba(0,0,0,0.5), 0 0 40px rgba(250,204,21,0.15)'
                      : '0 25px 50px -12px rgba(0,0,0,0.4)',
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  whileHover={!isDragging ? { y: -2 } : undefined}
                >
                  {/* Screen - Fixed height for all views */}
                  <div
                    ref={screenRef}
                    className="bg-[#8fa39a] dark:bg-[#2a3a35] rounded-lg p-3 mb-4 shadow-inner border-2 border-[#6b7c74] dark:border-zinc-700 relative overflow-hidden cursor-pointer min-h-[240px]"
                    onClick={() => {
                      // Only open auth if not authenticated and in carousel view
                      if (!hasPrivateAccess && currentView === 'carousel') {
                        handleOpenAuth();
                      }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {/* Auth Screen */}
                      {currentView === 'auth' ? (
                        <motion.div
                          key="auth"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          <IPodAuthScreen
                            onClose={handleCloseAuth}
                            onSuccess={handleAuthSuccess}
                          />
                        </motion.div>
                      ) : currentView === 'carousel' ? (
                        /* Vinyl Carousel View */
                        <motion.div
                          key="carousel"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="min-h-[200px] flex items-center justify-center"
                        >
                          <VinylCarousel
                            tracks={tracks}
                            currentTrack={currentTrack}
                            isPlaying={isPlaying}
                            onSelectAlbum={handleSelectAlbum}
                            onSelectTrack={handleSelectTrackFromAlbum}
                            onTogglePlay={togglePlay}
                          />
                        </motion.div>
                      ) : currentView === 'album' && selectedAlbum ? (
                        /* Album Detail View - Shows tracks in the selected album */
                        <motion.div
                          key="album"
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="min-h-[200px]"
                        >
                          {/* Album header */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-12 h-12 rounded overflow-hidden shadow-md flex-shrink-0">
                              {selectedAlbum.albumArt ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={selectedAlbum.albumArt}
                                  alt={selectedAlbum.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#697d75] dark:bg-[#1e2a26] flex items-center justify-center text-xl">
                                  🎵
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-[#1a2420] dark:text-[#8fa39a] truncate font-mono">
                                {selectedAlbum.name}
                              </div>
                              <div className="text-[10px] text-[#3a4a45] dark:text-[#5a6a65] truncate font-mono">
                                {selectedAlbum.artist}
                              </div>
                            </div>
                          </div>

                          {/* Track list */}
                          <div className="space-y-1 max-h-[140px] overflow-y-auto">
                            {selectedAlbum.tracks.map((track, index) => (
                              <button
                                key={track.id}
                                onClick={() => handleSelectTrackFromAlbum(track)}
                                className={`w-full text-left p-2 rounded transition-colors ${track.id === currentTrack.id
                                    ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                    : 'hover:bg-[#697d75] dark:hover:bg-[#1e2a26] text-[#1a2420] dark:text-[#8fa39a]'
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono opacity-50 w-4">{index + 1}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium truncate font-mono">{track.title}</div>
                                  </div>
                                  {track.id === currentTrack.id && isPlaying && (
                                    <div className="flex gap-0.5">
                                      <motion.div
                                        className="w-0.5 h-3 bg-current rounded-full"
                                        animate={{ scaleY: [0.3, 1, 0.3] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                      />
                                      <motion.div
                                        className="w-0.5 h-3 bg-current rounded-full"
                                        animate={{ scaleY: [1, 0.3, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                                      />
                                      <motion.div
                                        className="w-0.5 h-3 bg-current rounded-full"
                                        animate={{ scaleY: [0.5, 1, 0.5] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ) : currentView === 'playlist' ? (
                        /* All Tracks Playlist View */
                        <motion.div
                          key="playlist"
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="min-h-[200px]"
                        >
                          <div className="text-[10px] font-bold text-[#1a2420] dark:text-[#8fa39a] uppercase tracking-wider mb-2 font-mono">
                            All Tracks
                          </div>
                          <div className="space-y-1 max-h-[180px] overflow-y-auto">
                            {tracks.map((track, index) => (
                              <button
                                key={track.id}
                                onClick={() => handleSelectTrackFromAlbum(track)}
                                className={`w-full text-left p-2 rounded transition-colors ${track.id === currentTrack.id
                                    ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                    : 'hover:bg-[#697d75] dark:hover:bg-[#1e2a26] text-[#1a2420] dark:text-[#8fa39a]'
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono opacity-50">{index + 1}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium truncate font-mono">{track.title}</div>
                                    <div className="text-[10px] opacity-70 truncate font-mono">{track.artist}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ) : currentView === 'create' ? (
                        /* Create View - AI Music Generation */
                        <motion.div
                          key="create"
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="min-h-[200px]"
                        >
                          {isGenerating ? (
                            /* Generating State */
                            <div className="flex flex-col items-center justify-center py-4">
                              <motion.div
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-8 h-8 text-white" />
                              </motion.div>
                              <div className="text-xs text-[#1a2420] dark:text-[#8fa39a] font-mono mb-2">
                                Creating your track...
                              </div>
                              <div className="w-full max-w-[200px] h-2 bg-[#5a6a65]/30 dark:bg-[#1a2420]/50 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-violet-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <div className="text-[10px] text-[#3a4a45] dark:text-[#5a6a65] mt-1 font-mono">
                                {progress}% complete
                              </div>
                              <button
                                onClick={() => resetGeneration()}
                                className="mt-3 text-[10px] text-red-500 hover:text-red-400 font-mono"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : generateResult ? (
                            /* Success State */
                            <div className="flex flex-col items-center justify-center py-4">
                              <motion.div
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Music2 className="w-8 h-8 text-white" />
                              </motion.div>
                              <div className="text-sm font-bold text-[#1a2420] dark:text-[#8fa39a] font-mono mb-1">
                                Track Created!
                              </div>
                              <div className="text-[10px] text-[#3a4a45] dark:text-[#5a6a65] font-mono mb-3">
                                {createPrompt.slice(0, 30)}...
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    // TODO: Play the generated track
                                    resetGeneration();
                                    setCurrentView('nowPlaying');
                                  }}
                                  className="px-3 py-1.5 text-[10px] font-mono bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420] rounded-full"
                                >
                                  Play
                                </button>
                                <button
                                  onClick={() => {
                                    resetGeneration();
                                    setCreatePrompt('');
                                  }}
                                  className="px-3 py-1.5 text-[10px] font-mono bg-[#5a6a65]/30 text-[#1a2420] dark:text-[#8fa39a] rounded-full"
                                >
                                  Create Another
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Input State */
                            <div className="space-y-3">
                              <div className="text-[10px] font-bold text-[#1a2420] dark:text-[#8fa39a] uppercase tracking-wider font-mono">
                                Create with AI
                              </div>

                              {/* Prompt Input */}
                              <input
                                type="text"
                                value={createPrompt}
                                onChange={(e) => setCreatePrompt(e.target.value)}
                                placeholder="Describe your track..."
                                className="w-full px-3 py-2 text-xs font-mono bg-[#5a6a65]/20 dark:bg-[#1a2420]/50 border border-[#5a6a65]/30 dark:border-[#3a4a45]/30 rounded-lg text-[#1a2420] dark:text-[#8fa39a] placeholder-[#3a4a45]/50 dark:placeholder-[#5a6a65]/50 focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />

                              {/* Quick Presets */}
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(MUSIC_PRESETS).slice(0, 4).map(([key, preset]) => (
                                  <button
                                    key={key}
                                    onClick={() => setCreatePrompt(preset.prompt)}
                                    className="px-2 py-1 text-[9px] font-mono bg-[#5a6a65]/20 dark:bg-[#1a2420]/50 text-[#1a2420] dark:text-[#8fa39a] rounded-full hover:bg-violet-500/20 transition-colors"
                                  >
                                    {preset.prompt.split(' ').slice(0, 2).join(' ')}
                                  </button>
                                ))}
                              </div>

                              {/* Duration Slider */}
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono text-[#3a4a45] dark:text-[#5a6a65] w-12">
                                  {createDuration}s
                                </span>
                                <input
                                  type="range"
                                  min="10"
                                  max="60"
                                  value={createDuration}
                                  onChange={(e) => setCreateDuration(Number(e.target.value))}
                                  className="flex-1 h-1 bg-[#5a6a65]/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500"
                                />
                              </div>

                              {/* Advanced Toggle */}
                              <button
                                onClick={() => setShowAdvancedCreate(!showAdvancedCreate)}
                                className="text-[9px] font-mono text-[#3a4a45] dark:text-[#5a6a65] hover:text-violet-500 transition-colors"
                              >
                                {showAdvancedCreate ? '▲ Less options' : '▼ More options'}
                              </button>

                              {/* Advanced Options */}
                              <AnimatePresence>
                                {showAdvancedCreate && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-2 overflow-hidden"
                                  >
                                    {/* Lyrics */}
                                    <textarea
                                      value={createLyrics}
                                      onChange={(e) => setCreateLyrics(e.target.value)}
                                      placeholder="[Verse]&#10;Add lyrics here..."
                                      rows={3}
                                      className="w-full px-3 py-2 text-[10px] font-mono bg-[#5a6a65]/20 dark:bg-[#1a2420]/50 border border-[#5a6a65]/30 dark:border-[#3a4a45]/30 rounded-lg text-[#1a2420] dark:text-[#8fa39a] placeholder-[#3a4a45]/50 dark:placeholder-[#5a6a65]/50 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                                    />
                                    {/* BPM & Key */}
                                    <div className="flex gap-2">
                                      <input
                                        type="number"
                                        value={createBpm || ''}
                                        onChange={(e) => setCreateBpm(e.target.value ? Number(e.target.value) : undefined)}
                                        placeholder="BPM"
                                        className="w-16 px-2 py-1 text-[10px] font-mono bg-[#5a6a65]/20 dark:bg-[#1a2420]/50 border border-[#5a6a65]/30 dark:border-[#3a4a45]/30 rounded text-[#1a2420] dark:text-[#8fa39a] placeholder-[#3a4a45]/50 focus:outline-none"
                                      />
                                      <select
                                        value={createKey || ''}
                                        onChange={(e) => setCreateKey(e.target.value || undefined)}
                                        className="flex-1 px-2 py-1 text-[10px] font-mono bg-[#5a6a65]/20 dark:bg-[#1a2420]/50 border border-[#5a6a65]/30 dark:border-[#3a4a45]/30 rounded text-[#1a2420] dark:text-[#8fa39a] focus:outline-none"
                                      >
                                        <option value="">Key (auto)</option>
                                        <option value="C major">C major</option>
                                        <option value="G major">G major</option>
                                        <option value="D major">D major</option>
                                        <option value="A minor">A minor</option>
                                        <option value="E minor">E minor</option>
                                      </select>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Generate Button */}
                              <button
                                onClick={() => {
                                  if (createPrompt.trim()) {
                                    generate({
                                      prompt: createPrompt,
                                      duration: createDuration,
                                      lyrics: createLyrics || undefined,
                                      bpm: createBpm,
                                      key: createKey,
                                    });
                                  }
                                }}
                                disabled={!createPrompt.trim()}
                                className="w-full py-2 text-xs font-mono font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-700 transition-all"
                              >
                                ✨ Generate Track
                              </button>

                              {/* Error Display */}
                              {generateError && (
                                <div className="text-[10px] text-red-500 font-mono">
                                  {generateError}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        /* Now Playing View */
                        <motion.div
                          key="playing"
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Video or Album Art - Large for now playing */}
                          <div className="w-full aspect-square bg-[#697d75] dark:bg-[#1e2a26] rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-lg relative">
                            {isVideo ? (
                              // Video player for MP4 tracks
                              <video
                                ref={videoRef}
                                src={currentTrack.audioSrc}
                                className="w-full h-full object-cover"
                                playsInline
                                preload="metadata"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlay();
                                }}
                              />
                            ) : currentTrack.albumArt && !imageError ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={currentTrack.albumArt}
                                alt={`${currentTrack.album} cover`}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                              />
                            ) : (
                              <span className="text-5xl">🎵</span>
                            )}
                            {/* Play/pause overlay - show for non-video or when paused */}
                            {(!isVideo || !isPlaying) && (
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-black/20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isPlaying ? 0 : 1 }}
                                whileHover={{ opacity: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlay();
                                }}
                              >
                                <motion.div
                                  className="p-3 rounded-full bg-white/30 backdrop-blur-sm cursor-pointer"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {isPlaying ? (
                                    <Pause className="w-6 h-6 text-white" />
                                  ) : (
                                    <Play className="w-6 h-6 text-white ml-0.5" />
                                  )}
                                </motion.div>
                              </motion.div>
                            )}
                          </div>

                          {/* Track Info */}
                          <div className="text-center mb-2">
                            <div className="text-[#1a2420] dark:text-[#8fa39a] font-bold text-sm truncate font-mono">
                              {currentTrack.title}
                            </div>
                            <div className="text-[#3a4a45] dark:text-[#5a6a65] text-xs truncate font-mono">
                              {currentTrack.artist}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-2 bg-[#5a6a65] dark:bg-[#1a2420] rounded-full overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full bg-[#1a2420] dark:bg-[#8fa39a] transition-all duration-150"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-[#3a4a45] dark:text-[#5a6a65] mt-1 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Dock */}
                    {currentView !== 'auth' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex justify-center gap-1"
                      >
                        <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-[#697d75]/50 dark:bg-[#1a2420]/50 border border-[#5a6a65]/30 dark:border-[#3a4a45]/30">
                          {/* Now Playing */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack) {
                                setCurrentView('nowPlaying');
                              }
                            }}
                            className={`p-1.5 rounded-full transition-all ${currentView === 'nowPlaying'
                                ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                              }`}
                            title="Now Playing"
                          >
                            {isPlaying ? (
                              <Music2 className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                          </button>

                          {/* Albums/Carousel */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentView('carousel');
                              setSelectedAlbum(null);
                            }}
                            className={`p-1.5 rounded-full transition-all ${currentView === 'carousel'
                                ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                              }`}
                            title="Albums"
                          >
                            <Disc className="w-3 h-3" />
                          </button>

                          {/* Album View (when an album is selected) */}
                          {selectedAlbum && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentView('album');
                              }}
                              className={`p-1.5 rounded-full transition-all ${currentView === 'album'
                                  ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                  : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                                }`}
                              title={selectedAlbum.name}
                            >
                              <Home className="w-3 h-3" />
                            </button>
                          )}

                          {/* All Tracks */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentView('playlist');
                            }}
                            className={`p-1.5 rounded-full transition-all ${currentView === 'playlist'
                                ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                              }`}
                            title="All Tracks"
                          >
                            <List className="w-3 h-3" />
                          </button>

                          {/* Create - AI Music Generation */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentView('create');
                            }}
                            className={`p-1.5 rounded-full transition-all ${currentView === 'create'
                                ? 'bg-violet-600 dark:bg-violet-500 text-white'
                                : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                              }`}
                            title="Create with AI"
                          >
                            {isGenerating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                          </button>

                          {/* Private/Lock */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (hasPrivateAccess) {
                                setViewingPrivate(!viewingPrivate);
                              } else {
                                handleOpenAuth();
                              }
                            }}
                            className={`p-1.5 rounded-full transition-all ${viewingPrivate && hasPrivateAccess
                                ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                                : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                              }`}
                            title={hasPrivateAccess ? (viewingPrivate ? 'Viewing Private' : 'View Private') : 'Private Access'}
                          >
                            <Lock className="w-3 h-3" />
                          </button>

                          {/* Settings - Admin mode (owner only) */}
                          {hasOwnerAccess && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdminMode(!adminMode);
                                if (!adminMode && !isExpanded) {
                                  expand();
                                }
                              }}
                              className={`p-1.5 rounded-full transition-all ${adminMode
                                  ? 'bg-amber-500 dark:bg-amber-400 text-white'
                                  : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                                }`}
                              title={adminMode ? 'Exit admin mode' : 'Admin settings'}
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          )}

                          {/* Expand/Collapse panels */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (adminMode) setAdminMode(false);
                              toggleExpanded();
                            }}
                            className={`p-1.5 rounded-full transition-all ${isExpanded
                                ? 'bg-[#1a2420] dark:bg-[#8fa39a] text-[#8fa39a] dark:text-[#1a2420]'
                                : 'text-[#1a2420]/70 dark:text-[#8fa39a]/70 hover:text-[#1a2420] dark:hover:text-[#8fa39a] hover:bg-[#5a6a65]/30 dark:hover:bg-[#3a4a45]/30'
                              }`}
                            title={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? (
                              <Minimize2 className="w-3 h-3" />
                            ) : (
                              <Maximize2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Click Wheel */}
                  <div className="relative mx-auto w-[200px] h-[200px]">
                    {/* Outer wheel */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f0f0f0] to-[#c0c0c0] dark:from-zinc-700 dark:to-zinc-800 shadow-lg">
                      {/* Menu button */}
                      <button
                        onClick={() => {
                          if (currentView === 'carousel') {
                            // In carousel view, menu opens all tracks playlist
                            setCurrentView('playlist');
                          } else {
                            // In other views, go back
                            handleBack();
                          }
                        }}
                        className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 tracking-wider hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
                      >
                        {getMenuLabel()}
                      </button>
                      {/* Previous track */}
                      <button
                        onClick={skipToPrevious}
                        disabled={showAuthScreen}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30"
                        title="Previous track"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 20L9 12l10-8v16zM7 19V5H5v14h2z" />
                        </svg>
                      </button>
                      {/* Next track */}
                      <button
                        onClick={skipToNext}
                        disabled={showAuthScreen}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30"
                        title="Next track"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 4l10 8-10 8V4zm12 1v14h2V5h-2z" />
                        </svg>
                      </button>
                      {/* Play/Pause - always show play/pause here */}
                      <button
                        onClick={togglePlay}
                        disabled={showAuthScreen}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          {isPlaying ? (
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </button>
                    </div>

                    {/* Center button - context-aware actions */}
                    <button
                      onClick={() => {
                        if (currentView === 'auth') {
                          // Do nothing in auth mode
                          return;
                        } else if (currentView === 'carousel') {
                          // In carousel, select the current album
                          if (selectedAlbum || tracks.length > 0) {
                            // Find album for current track or select first album
                            const albumForTrack = tracks.find(t => t.id === currentTrack.id);
                            if (albumForTrack) {
                              handleSelectAlbum({
                                name: albumForTrack.album,
                                artist: albumForTrack.artist,
                                albumArt: albumForTrack.albumArt,
                                tracks: tracks.filter(t => t.album === albumForTrack.album && t.artist === albumForTrack.artist),
                              });
                            }
                          }
                        } else if (currentView === 'album' && selectedAlbum) {
                          // In album view, play first track or toggle if already playing
                          if (selectedAlbum.tracks.some(t => t.id === currentTrack.id)) {
                            togglePlay();
                          } else {
                            handleSelectTrackFromAlbum(selectedAlbum.tracks[0]);
                          }
                        } else if (currentView === 'playlist') {
                          // In playlist, admin can access settings
                          if (isAdmin) {
                            setShowAdminPanel(true);
                          } else {
                            togglePlay();
                          }
                        } else if (currentView === 'nowPlaying') {
                          // In now playing, toggle play/pause
                          togglePlay();
                        }
                      }}
                      className="absolute inset-0 m-auto w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#fafafa] to-[#e0e0e0] dark:from-zinc-600 dark:to-zinc-700 shadow-md hover:from-white hover:to-[#e8e8e8] dark:hover:from-zinc-500 dark:hover:to-zinc-600 transition-all active:shadow-inner flex items-center justify-center"
                      title={
                        currentView === 'carousel' ? 'Open album' :
                          currentView === 'playlist' && isAdmin ? 'Admin Settings' :
                            'Play/Pause'
                      }
                    >
                      {/* Settings icon - when admin and viewing playlist */}
                      {isAdmin && currentView === 'playlist' && (
                        <Settings className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </BlurFade>

          {/* Mobile: Full expanded UI below */}
          <AnimatePresence>
            {isMobile && isExpanded && (
              <motion.div
                className="fixed inset-0 top-20 bg-black/95 backdrop-blur-xl z-30 overflow-auto"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              >
                <div className="max-w-md mx-auto p-4 space-y-6 pb-32">
                  {/* Now Playing Section */}
                  <section>
                    <h2 className="text-white font-semibold text-lg mb-3">Now Playing</h2>
                    <div className="rounded-xl overflow-hidden">
                      <ExpandedNowPlaying />
                    </div>
                  </section>

                  {/* Library Section */}
                  <section>
                    <h2 className="text-white font-semibold text-lg mb-3">Library</h2>
                    <div className="rounded-xl bg-black/60 border border-white/10 h-[400px] overflow-hidden">
                      <LibraryBrowser onClose={collapse} />
                    </div>
                  </section>
                </div>

                {/* Close button for mobile */}
                <motion.button
                  className="fixed top-4 right-4 z-40 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                  onClick={collapse}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minimize2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Morph progress indicator (subtle, only when dragging) */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full text-white text-sm font-mono"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {(morphProgress * 100).toFixed(0)}%
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lyrics Section - only show in now playing view */}
          {currentTrack.lyrics && currentView === 'nowPlaying' && (
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <div className="w-full max-w-[320px] mt-8">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-3 text-center">
                  Lyrics
                </h2>
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <pre className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono text-center">
                    {currentTrack.lyrics}
                  </pre>
                </div>
              </div>
            </BlurFade>
          )}

          {/* Playlist indicator for multiple tracks - only show in carousel view */}
          {tracks.length > 1 && currentView === 'carousel' && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <button
                onClick={() => setCurrentView('playlist')}
                className="mt-6 flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-sm"
              >
                <List className="w-4 h-4" />
                <span>View all {tracks.length} tracks</span>
              </button>
            </BlurFade>
          )}

          {/* Loading indicator for private tracks */}
          {viewingPrivate && hasPrivateAccess && isLoadingTracks && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                Loading your tracks...
              </div>
            </BlurFade>
          )}

          {/* Empty state for private view with no tracks */}
          {viewingPrivate && hasPrivateAccess && !isLoadingTracks && privateTracks.length === 0 && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No tracks assigned to you yet.
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Check back later or contact the administrator.
                </p>
                <button
                  onClick={() => setViewingPrivate(false)}
                  className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View public tracks
                </button>
              </div>
            </BlurFade>
          )}
        </div>

        {/* Admin Panel */}
        <AnimatePresence>
          {showAdminPanel && (isAdmin || hasOwnerAccess) && (
            <PrivateMusicAdmin onClose={() => setShowAdminPanel(false)} />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

// Main export wrapped with PrivateMusicProvider
export function MusicClient() {
  return (
    <PrivateMusicProvider>
      <MusicPageContent />
    </PrivateMusicProvider>
  );
}
