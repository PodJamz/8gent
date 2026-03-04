'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Dock } from '@/components/dock/Dock';

/**
 * SchoolTube - Safe, curated educational videos for kids
 *
 * A kid-safe YouTube alternative with curated educational content.
 */

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  emoji: string;
  category: string;
  duration: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📺' },
  { id: 'learning', label: 'Learning', emoji: '📚' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'stories', label: 'Stories', emoji: '📖' },
  { id: 'art', label: 'Art', emoji: '🎨' },
];

// Demo curated videos - safe, educational content
const DEMO_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Learn Your Colors',
    thumbnail: '🌈',
    emoji: '🌈',
    category: 'learning',
    duration: '3:20',
  },
  {
    id: '2',
    title: 'Counting to 20',
    thumbnail: '🔢',
    emoji: '🔢',
    category: 'learning',
    duration: '4:15',
  },
  {
    id: '3',
    title: 'Animal Sounds',
    thumbnail: '🐮',
    emoji: '🐮',
    category: 'learning',
    duration: '2:45',
  },
  {
    id: '4',
    title: 'How Plants Grow',
    thumbnail: '🌱',
    emoji: '🌱',
    category: 'science',
    duration: '5:30',
  },
  {
    id: '5',
    title: 'The Water Cycle',
    thumbnail: '💧',
    emoji: '💧',
    category: 'science',
    duration: '4:00',
  },
  {
    id: '6',
    title: 'Solar System Song',
    thumbnail: '🪐',
    emoji: '🪐',
    category: 'science',
    duration: '3:45',
  },
  {
    id: '7',
    title: 'ABC Alphabet Song',
    thumbnail: '🎶',
    emoji: '🎶',
    category: 'music',
    duration: '2:30',
  },
  {
    id: '8',
    title: 'Baby Shark Dance',
    thumbnail: '🦈',
    emoji: '🦈',
    category: 'music',
    duration: '2:15',
  },
  {
    id: '9',
    title: 'The Three Little Pigs',
    thumbnail: '🐷',
    emoji: '🐷',
    category: 'stories',
    duration: '8:00',
  },
  {
    id: '10',
    title: 'Goldilocks',
    thumbnail: '🐻',
    emoji: '🐻',
    category: 'stories',
    duration: '6:30',
  },
  {
    id: '11',
    title: 'How to Draw a Cat',
    thumbnail: '🐱',
    emoji: '🐱',
    category: 'art',
    duration: '5:00',
  },
  {
    id: '12',
    title: 'Rainbow Painting',
    thumbnail: '🎨',
    emoji: '🎨',
    category: 'art',
    duration: '4:30',
  },
];

export default function SchoolTubePage() {
  const { settings } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  const primaryColor = settings.primaryColor || '#4CAF50';

  const filteredVideos =
    activeCategory === 'all'
      ? DEMO_VIDEOS
      : DEMO_VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f7]">
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl safe-top"
        style={{ backgroundColor: `${primaryColor}F2` }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[18px] font-semibold text-white">
            {settings.childName ? `${settings.childName}'s SchoolTube` : 'SchoolTube'}
          </span>
        </div>
      </header>

      {/* Video Player (when playing) */}
      {playingVideo && (
        <div className="bg-black aspect-video flex items-center justify-center relative">
          <div className="text-center">
            <span className="text-8xl mb-4 block">{playingVideo.emoji}</span>
            <p className="text-white text-xl">{playingVideo.title}</p>
            <p className="text-gray-400 mt-2">Video playing...</p>
          </div>
          <button
            onClick={() => setPlayingVideo(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl"
          >
            ✕
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat.id ? 'text-white' : 'bg-gray-100 text-gray-700'
              }`}
              style={{
                backgroundColor: activeCategory === cat.id ? primaryColor : undefined,
              }}
            >
              <span>{cat.emoji}</span>
              <span className="text-[15px] font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => setPlayingVideo(video)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform text-left"
            >
              {/* Thumbnail */}
              <div
                className="aspect-video flex items-center justify-center text-5xl"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                {video.emoji}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-[15px] font-medium text-black line-clamp-2">{video.title}</p>
                <p className="text-[13px] text-gray-500 mt-1">{video.duration}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-gray-500">No videos in this category yet</p>
          </div>
        )}
      </div>

      {/* Dock */}
      <Dock primaryColor={primaryColor} />
    </div>
  );
}
