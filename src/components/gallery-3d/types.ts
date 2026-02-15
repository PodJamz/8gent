// Core types for 3D Gallery components
import type * as THREE from 'three';

export interface GalleryImage {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

// Audio reactivity data passed to 3D galleries
export interface AudioReactiveData {
  enabled: boolean;
  // Frequency bands (0-1 normalized)
  bass: number;
  lowMid: number;
  mid: number;
  highMid: number;
  treble: number;
  // Overall energy (0-1)
  energy: number;
  // Beat detection
  isBeat: boolean;
  beatIntensity: number;
  // Raw frequency data for advanced effects
  frequencyData?: Uint8Array;
  waveformData?: Uint8Array;
}

export interface Gallery3DProps {
  images: GalleryImage[];
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  onImageClick?: (image: GalleryImage, index: number) => void;
  onImageHover?: (image: GalleryImage | null, index: number | null) => void;
}

export interface CameraConfig {
  position: [number, number, number];
  fov: number;
  near?: number;
  far?: number;
}

export interface LightingConfig {
  ambient?: { intensity: number; color?: string };
  directional?: { position: [number, number, number]; intensity: number; color?: string };
  point?: Array<{ position: [number, number, number]; intensity: number; color?: string }>;
}

export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
  delay?: number;
}

export interface InteractionState {
  hoveredIndex: number | null;
  selectedIndex: number | null;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
}

// Shader uniform types
export interface ShaderUniforms {
  [key: string]: { value: number | THREE.Vector2 | THREE.Vector3 | THREE.Color | THREE.Texture | null };
}

// Gallery variant types for showcase
export type GalleryVariant =
  | 'sphere'
  | 'carousel'
  | 'room'
  | 'particle'
  | 'helix'
  | 'cube'
  | 'floating'
  | 'tunnel'
  | 'infinite';

export interface GalleryShowcaseProps {
  variant: GalleryVariant;
  images: GalleryImage[];
  title?: string;
  description?: string;
}
