'use client';

import { useState, Suspense, lazy } from 'react';
import { GALLERY_IMAGES } from '@/lib/gallery-images';
import type { GalleryImage, GalleryVariant, AudioReactiveData } from '@/components/gallery-3d/types';
import {
  AudioReactiveProvider,
  AudioReactiveToggle,
  AudioVisualizerBars,
  useAudioReactive,
} from '@/components/gallery-3d/AudioReactiveContext';

// Lazy load gallery components for better performance
const SphereGallery = lazy(() => import('@/components/gallery-3d/SphereGallery'));
const CarouselGallery = lazy(() => import('@/components/gallery-3d/CarouselGallery'));
const HelixGallery = lazy(() => import('@/components/gallery-3d/HelixGallery'));
const CubeGallery = lazy(() => import('@/components/gallery-3d/CubeGallery'));
const ParticleGallery = lazy(() => import('@/components/gallery-3d/ParticleGallery'));
const FloatingCards = lazy(() => import('@/components/gallery-3d/FloatingCards'));
const RoomGallery = lazy(() => import('@/components/gallery-3d/RoomGallery'));

interface GalleryConfig {
  id: GalleryVariant;
  name: string;
  description: string;
  icon: string;
  useCase: string;
  features: string[];
}

const GALLERY_CONFIGS: GalleryConfig[] = [
  {
    id: 'sphere',
    name: 'Sphere Gallery',
    description: 'Orbital 3D gallery with images distributed across a sphere surface using Fibonacci distribution',
    icon: '🌐',
    useCase: 'System showcases, content collections, product catalogs',
    features: ['Fibonacci sphere distribution', 'Auto-rotation', 'Interactive orbit controls', 'Hover effects'],
  },
  {
    id: 'carousel',
    name: 'Carousel Gallery',
    description: 'Classic rotating 3D carousel with reflective floor and elegant transitions',
    icon: '🎠',
    useCase: 'Featured products, hero sections, image sliders',
    features: ['Reflective floor', 'Smooth snap rotation', 'Drag interaction', 'Auto-rotate'],
  },
  {
    id: 'helix',
    name: 'Helix Gallery',
    description: 'DNA-inspired spiral arrangement with scroll-based navigation',
    icon: '🧬',
    useCase: 'Timelines, chronological content, story progression',
    features: ['Scroll-driven animation', 'DNA helix structure', 'Ambient particles', 'Depth-based focus'],
  },
  {
    id: 'cube',
    name: 'Cube Gallery',
    description: 'Interactive 3D cube with images on each face, rotatable and zoomable',
    icon: '📦',
    useCase: 'Product views, category navigation, interactive interfaces',
    features: ['6-sided display', 'Face navigation buttons', 'Corner particles', 'Pop-out effect'],
  },
  {
    id: 'particle',
    name: 'Particle Gallery',
    description: 'Images floating as particles in 3D space with organic movement',
    icon: '✨',
    useCase: 'Creative displays, technical visualizations, mood boards',
    features: ['Organic floating motion', 'Particle trails', 'Golden ratio distribution', 'Ambient particles'],
  },
  {
    id: 'floating',
    name: 'Floating Cards',
    description: 'Elegant 3D cards floating with physics-based animations',
    icon: '🃏',
    useCase: 'Team pages, card-based content, photo galleries',
    features: ['Rounded card design', 'Float animation', 'Tilt on hover', 'Shadow effects'],
  },
  {
    id: 'room',
    name: 'Room Gallery',
    description: 'Virtual museum experience with first-person navigation',
    icon: '🏛️',
    useCase: 'Technical exhibitions, virtual tours, immersive showcases',
    features: ['First-person controls', 'Realistic lighting', 'Museum frames', 'Pointer lock navigation'],
  },
];

function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading 3D Gallery...</p>
      </div>
    </div>
  );
}

function GallerySelector({
  configs,
  selected,
  onSelect,
}: {
  configs: GalleryConfig[];
  selected: GalleryVariant;
  onSelect: (id: GalleryVariant) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 p-4">
      {configs.map((config) => (
        <button
          key={config.id}
          onClick={() => onSelect(config.id)}
          className={`p-3 rounded-xl text-left transition-all duration-200 ${selected === config.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:scale-102'
            }`}
        >
          <span className="text-2xl block mb-1">{config.icon}</span>
          <span className="text-sm font-medium block truncate">{config.name}</span>
        </button>
      ))}
    </div>
  );
}

function GalleryInfo({ config }: { config: GalleryConfig }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mx-4 mb-4">
      <div className="flex items-start gap-4">
        <span className="text-4xl">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white mb-1">{config.name}</h2>
          <p className="text-slate-400 text-sm mb-2">{config.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {config.features.map((feature) => (
              <span
                key={feature}
                className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
          <p className="text-slate-500 text-xs">
            <span className="text-slate-400 font-medium">Best for:</span> {config.useCase}
          </p>
        </div>
      </div>
    </div>
  );
}

function renderGallery(
  variant: GalleryVariant,
  images: GalleryImage[],
  onImageClick: (image: GalleryImage, index: number) => void,
  audioData?: AudioReactiveData
) {
  const commonProps = {
    images,
    onImageClick,
    className: 'w-full h-full',
    audioData,
  };

  switch (variant) {
    case 'sphere':
      return <SphereGallery {...commonProps} radius={6} itemSize={1.4} />;
    case 'carousel':
      return <CarouselGallery {...commonProps} radius={5} itemWidth={3} itemHeight={2.2} />;
    case 'helix':
      return <HelixGallery {...commonProps} radius={3.5} height={18} turns={2.5} />;
    case 'cube':
      return <CubeGallery {...commonProps} size={3.5} />;
    case 'particle':
      return <ParticleGallery {...commonProps} spread={10} imageSize={1.8} floatIntensity={0.6} />;
    case 'floating':
      return <FloatingCards {...commonProps} cardWidth={2} cardHeight={2.6} spread={1.1} />;
    case 'room':
      return <RoomGallery {...commonProps} roomWidth={14} roomDepth={25} frameSize={2} />;
    default:
      return <SphereGallery {...commonProps} />;
  }
}

// Inner component that uses audio reactivity
function Gallery3DShowcaseInner() {
  const [selectedGallery, setSelectedGallery] = useState<GalleryVariant>('sphere');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { isEnabled, isPlaying, analysisData } = useAudioReactive();

  const images: GalleryImage[] = GALLERY_IMAGES.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    console.log('Selected image:', image, 'at index:', index);
  };

  const currentConfig = GALLERY_CONFIGS.find((c) => c.id === selectedGallery)!;

  // Convert analysis data to AudioReactiveData format for galleries
  const audioData: AudioReactiveData | undefined = isEnabled && isPlaying ? {
    enabled: true,
    bass: analysisData.bass,
    lowMid: analysisData.lowMid,
    mid: analysisData.mid,
    highMid: analysisData.highMid,
    treble: analysisData.treble,
    energy: analysisData.energy,
    isBeat: analysisData.isBeat,
    beatIntensity: analysisData.beatIntensity,
    frequencyData: analysisData.frequencyData,
    waveformData: analysisData.waveformData,
  } : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header with Audio Controls */}
      <header className="p-4 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                3D Gallery Showcase
              </h1>
              <p className="text-slate-400 text-sm">
                Excellence in Three.js - Interactive 3D galleries for creative use cases
              </p>
            </div>
            {/* Audio Reactivity Controls */}
            <div className="flex items-center gap-3">
              <AudioVisualizerBars barCount={12} />
              <AudioReactiveToggle />
            </div>
          </div>
          {/* Audio status indicator */}
          {isEnabled && !isPlaying && (
            <div className="mt-2 text-amber-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Play music from the iPod to see audio-reactive effects
            </div>
          )}
        </div>
      </header>

      {/* Gallery Selector */}
      <div className="max-w-7xl mx-auto">
        <GallerySelector
          configs={GALLERY_CONFIGS}
          selected={selectedGallery}
          onSelect={setSelectedGallery}
        />
      </div>

      {/* Gallery Info */}
      <div className="max-w-7xl mx-auto">
        <GalleryInfo config={currentConfig} />
      </div>

      {/* Gallery Container */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-slate-900/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50 relative">
          {/* Audio reactive border glow */}
          {isEnabled && isPlaying && (
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-100"
              style={{
                boxShadow: `0 0 ${20 + analysisData.beatIntensity * 40}px ${5 + analysisData.bass * 15}px rgba(99, 102, 241, ${0.2 + analysisData.energy * 0.3})`,
              }}
            />
          )}
          <div className="h-[600px] md:h-[700px]">
            <Suspense fallback={<LoadingSpinner />}>
              {renderGallery(selectedGallery, images, handleImageClick, audioData)}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Selected Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || ''}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            {selectedImage.alt && (
              <div className="p-4 border-t border-slate-800">
                <h3 className="text-white font-medium">{selectedImage.alt}</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
          <p>Built with Three.js, React Three Fiber, and Drei</p>
          <p className="mt-1 text-slate-600">
            Sphere | Carousel | Helix | Cube | Particle | Floating Cards | Room Gallery
          </p>
          {isEnabled && (
            <p className="mt-2 text-indigo-400 text-xs">
              🎵 Audio Reactivity Enabled - Galleries respond to music
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

// Main export wrapped with AudioReactiveProvider
export default function Gallery3DShowcase() {
  return (
    <AudioReactiveProvider>
      <Gallery3DShowcaseInner />
    </AudioReactiveProvider>
  );
}
