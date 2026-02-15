'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Plus, Search, MoreHorizontal } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { tracks, type Track } from '@/data/tracks';

interface LibraryBrowserProps {
  onClose?: () => void;
}

// Group tracks by album
function groupByAlbum(tracks: Track[]): Map<string, { artist: string; albumArt: string; tracks: Track[] }> {
  const albums = new Map<string, { artist: string; albumArt: string; tracks: Track[] }>();

  for (const track of tracks) {
    const key = `${track.album}::${track.artist}`;
    if (!albums.has(key)) {
      albums.set(key, {
        artist: track.artist,
        albumArt: track.albumArt,
        tracks: [],
      });
    }
    albums.get(key)!.tracks.push(track);
  }

  return albums;
}

// Album card component
function AlbumCard({
  name,
  artist,
  albumArt,
  trackCount,
  onClick,
}: {
  name: string;
  artist: string;
  albumArt: string;
  trackCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
    >
      <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-300 dark:bg-zinc-800 flex-shrink-0">
        {albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={albumArt} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-zinc-800 dark:text-white font-medium truncate">{name}</div>
        <div className="text-zinc-500 dark:text-zinc-400 text-sm truncate">
          {artist} · {trackCount} track{trackCount !== 1 ? 's' : ''}
        </div>
      </div>
      <Play className="w-5 h-5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// Track row component
function TrackRow({
  track,
  index,
  isPlaying,
  isCurrent,
  onPlay,
}: {
  track: Track;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
}) {
  return (
    <button
      onClick={onPlay}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left group ${
        isCurrent ? 'bg-zinc-300 dark:bg-zinc-800' : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
      }`}
    >
      <span className="w-6 text-center text-sm text-zinc-500 font-mono">
        {isCurrent && isPlaying ? (
          <span className="text-yellow-400">▶</span>
        ) : (
          index + 1
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${isCurrent ? 'text-yellow-600 dark:text-yellow-400' : 'text-zinc-800 dark:text-white'}`}>
          {track.title}
        </div>
        <div className="text-zinc-500 dark:text-zinc-400 text-sm truncate">{track.artist}</div>
      </div>
      <button className="p-1 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </button>
  );
}

type View = 'library' | 'album';

export function LibraryBrowser({ onClose }: LibraryBrowserProps) {
  const { currentTrack, isPlaying, selectTrack } = useMusic();
  const [view, setView] = useState<View>('library');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const albums = useMemo(() => groupByAlbum(tracks), []);

  const albumList = useMemo(() => {
    return Array.from(albums.entries()).map(([key, data]) => ({
      key,
      name: key.split('::')[0],
      ...data,
    }));
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return albumList;
    const q = searchQuery.toLowerCase();
    return albumList.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q)
    );
  }, [albumList, searchQuery]);

  const selectedAlbumData = selectedAlbum ? albums.get(selectedAlbum) : null;
  const selectedAlbumName = selectedAlbum?.split('::')[0] || '';

  const handleSelectAlbum = (key: string) => {
    setSelectedAlbum(key);
    setView('album');
  };

  const handleBack = () => {
    setView('library');
    setSelectedAlbum(null);
  };

  const handlePlayTrack = (track: Track) => {
    selectTrack(track);
  };

  const handlePlayAll = () => {
    if (selectedAlbumData && selectedAlbumData.tracks.length > 0) {
      selectTrack(selectedAlbumData.tracks[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-zinc-800 dark:text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-300 dark:border-zinc-700">
        {view === 'album' && (
          <button
            onClick={handleBack}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-lg font-semibold flex-1">
          {view === 'library' ? 'Library' : selectedAlbumName}
        </h2>
        {view === 'library' && (
          <button className="p-1 text-zinc-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search (library view) */}
      {view === 'library' && (
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-800 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {view === 'library' ? (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="p-4 pt-2 space-y-1"
            >
              {filteredAlbums.map((album) => (
                <AlbumCard
                  key={album.key}
                  name={album.name}
                  artist={album.artist}
                  albumArt={album.albumArt}
                  trackCount={album.tracks.length}
                  onClick={() => handleSelectAlbum(album.key)}
                />
              ))}

              {filteredAlbums.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No albums found
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="album"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              {/* Album Header */}
              {selectedAlbumData && (
                <div className="p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-zinc-300 dark:bg-zinc-800 flex-shrink-0 shadow-lg">
                      {selectedAlbumData.albumArt ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedAlbumData.albumArt}
                          alt={selectedAlbumName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🎵</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold truncate text-zinc-800 dark:text-white">{selectedAlbumName}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">{selectedAlbumData.artist}</p>
                      <p className="text-zinc-400 dark:text-zinc-500 text-sm">
                        {selectedAlbumData.tracks.length} track{selectedAlbumData.tracks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Play All / Add */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePlayAll}
                      className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black font-medium py-2 rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Play
                    </button>
                    <button className="px-4 py-2 bg-zinc-300 dark:bg-zinc-800 text-zinc-800 dark:text-white rounded-lg hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Track List */}
              <div className="px-2">
                {selectedAlbumData?.tracks.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i}
                    isPlaying={isPlaying}
                    isCurrent={track.id === currentTrack.id}
                    onPlay={() => handlePlayTrack(track)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LibraryBrowser;
