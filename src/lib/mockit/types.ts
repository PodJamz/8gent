// Mockit Types

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceFrame {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  scale: number;
  bezel: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    radius: number;
  };
}

export interface Screenshot {
  id: string;
  url: string;
  device: DeviceType;
  dataUrl: string;
  width: number;
  height: number;
  capturedAt: number;
}

export interface MockupProject {
  id: string;
  name: string;
  sourceUrl: string;
  screenshots: Screenshot[];
  createdAt: number;
  updatedAt: number;
}

export type AnimationType =
  | 'none'
  | 'float'
  | 'rotate3d'
  | 'parallax'
  | 'bounce'
  | 'pulse'
  | 'swing'
  | 'flip'
  | 'zoom';

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay: number;
  easing: string;
  intensity: number;
}

export type BackgroundType =
  | 'gradient'
  | 'solid'
  | 'mesh'
  | 'noise'
  | 'blur'
  | 'transparent';

export interface BackgroundConfig {
  type: BackgroundType;
  primaryColor: string;
  secondaryColor: string;
  angle?: number;
  blur?: number;
  noise?: number;
}

export type ExportFormat = 'gif' | 'json' | 'react' | 'png' | 'webm';

export interface ExportConfig {
  format: ExportFormat;
  quality: number;
  fps?: number;
  duration?: number;
  includeBackground: boolean;
  filename?: string;
}

export interface MockupLayout {
  devices: DeviceType[];
  arrangement: 'stack' | 'fan' | 'grid' | 'cascade' | 'perspective';
  spacing: number;
  rotation: number;
  perspective: number;
  shadow: {
    enabled: boolean;
    blur: number;
    opacity: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface MockitState {
  project: MockupProject | null;
  selectedDevice: DeviceType;
  animation: AnimationConfig;
  background: BackgroundConfig;
  layout: MockupLayout;
  isCapturing: boolean;
  isExporting: boolean;
  error: string | null;
}

// Device presets
export const DEVICE_FRAMES: Record<DeviceType, DeviceFrame> = {
  mobile: {
    id: 'mobile',
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    scale: 0.5,
    bezel: {
      top: 60,
      bottom: 34,
      left: 18,
      right: 18,
      radius: 55,
    },
  },
  tablet: {
    id: 'tablet',
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    scale: 0.4,
    bezel: {
      top: 28,
      bottom: 28,
      left: 28,
      right: 28,
      radius: 24,
    },
  },
  desktop: {
    id: 'desktop',
    name: 'MacBook Pro',
    width: 1512,
    height: 982,
    scale: 0.35,
    bezel: {
      top: 36,
      bottom: 0,
      left: 0,
      right: 0,
      radius: 12,
    },
  },
};

// Animation presets
export const ANIMATION_PRESETS: Record<AnimationType, Partial<AnimationConfig>> = {
  none: { duration: 0, intensity: 0 },
  float: { duration: 3000, intensity: 10, easing: 'ease-in-out' },
  rotate3d: { duration: 4000, intensity: 15, easing: 'ease-in-out' },
  parallax: { duration: 2000, intensity: 20, easing: 'ease-out' },
  bounce: { duration: 1500, intensity: 15, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  pulse: { duration: 2000, intensity: 5, easing: 'ease-in-out' },
  swing: { duration: 2500, intensity: 8, easing: 'ease-in-out' },
  flip: { duration: 3000, intensity: 180, easing: 'ease-in-out' },
  zoom: { duration: 2500, intensity: 10, easing: 'ease-in-out' },
};

// Background presets
export const BACKGROUND_PRESETS = {
  ocean: { primaryColor: '#0077b6', secondaryColor: '#00b4d8', type: 'gradient' as BackgroundType, angle: 135 },
  sunset: { primaryColor: '#f093fb', secondaryColor: '#f5576c', type: 'gradient' as BackgroundType, angle: 45 },
  forest: { primaryColor: '#11998e', secondaryColor: '#38ef7d', type: 'gradient' as BackgroundType, angle: 90 },
  midnight: { primaryColor: '#232526', secondaryColor: '#414345', type: 'gradient' as BackgroundType, angle: 180 },
  fire: { primaryColor: '#f12711', secondaryColor: '#f5af19', type: 'gradient' as BackgroundType, angle: 45 },
  arctic: { primaryColor: '#74ebd5', secondaryColor: '#acb6e5', type: 'gradient' as BackgroundType, angle: 135 },
  charcoal: { primaryColor: '#373B44', secondaryColor: '#4286f4', type: 'gradient' as BackgroundType, angle: 135 },
  peach: { primaryColor: '#ed6ea0', secondaryColor: '#ec8c69', type: 'gradient' as BackgroundType, angle: 90 },
  transparent: { primaryColor: 'transparent', secondaryColor: 'transparent', type: 'transparent' as BackgroundType, angle: 0 },
} as const;
