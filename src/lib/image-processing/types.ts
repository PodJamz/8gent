/**
 * Image Processing Types
 *
 * Type definitions for the image processing and effects system.
 */

// =============================================================================
// Effect Types
// =============================================================================

export type StylizationEffect =
  | "halftone"
  | "duotone"
  | "posterize"
  | "pixelate"
  | "ascii"
  | "line-art";

export type ColorEffect =
  | "grayscale"
  | "sepia"
  | "invert"
  | "hue-shift"
  | "saturate"
  | "color-replace"
  | "brightness"
  | "contrast";

export type BlurEffect =
  | "gaussian-blur"
  | "motion-blur"
  | "radial-blur"
  | "zoom-blur"
  | "tilt-shift";

export type DistortionEffect =
  | "swirl"
  | "bulge"
  | "pinch"
  | "wave"
  | "ripple"
  | "fisheye";

export type TextureEffect =
  | "noise"
  | "film-grain"
  | "scanlines"
  | "vignette"
  | "grain";

export type ArtisticEffect =
  | "oil-paint"
  | "watercolor"
  | "sketch"
  | "comic"
  | "glitch";

export type PresetEffect =
  | "vintage"
  | "cyberpunk"
  | "noir"
  | "pop-art"
  | "blueprint";

export type EffectType =
  | StylizationEffect
  | ColorEffect
  | BlurEffect
  | DistortionEffect
  | TextureEffect
  | ArtisticEffect
  | PresetEffect;

// =============================================================================
// Effect Parameters
// =============================================================================

export interface HalftoneParams {
  shape: "dot" | "line" | "diamond" | "ellipse" | "cross";
  frequency: number; // Lines per inch (10-100)
  angle: number; // Rotation in degrees (0-360)
  size: number; // Dot size multiplier (0.1-3)
  contrast: number; // Contrast adjustment (-100 to 100)
  method: "screen" | "multiply" | "overlay";
}

export interface DuotoneParams {
  highlightColor: string; // Hex color for highlights
  shadowColor: string; // Hex color for shadows
  contrast: number; // -100 to 100
  midtoneShift: number; // -50 to 50
}

export interface BlurParams {
  type: "gaussian" | "motion" | "radial" | "zoom" | "tilt-shift";
  radius: number; // Blur radius (0-100)
  angle?: number; // For motion blur (0-360)
  center?: { x: number; y: number }; // For radial/zoom blur
  focusArea?: { top: number; bottom: number }; // For tilt-shift
}

export interface GlitchParams {
  intensity: number; // 0-100
  sliceCount: number; // Number of horizontal slices (2-50)
  channelShift: number; // RGB channel offset (0-50px)
  scanlines: boolean; // Add CRT scanlines
  colorShift: boolean; // Chromatic aberration
  noise: number; // Digital noise amount (0-100)
}

export interface VignetteParams {
  intensity: number; // 0-1
  radius: number; // 0-1 (1 = full image)
  softness: number; // 0-1
  color: string; // Vignette color (usually black)
}

export interface GrainParams {
  amount: number; // 0-100
  size: number; // Grain size multiplier
  colored: boolean; // Color vs monochrome grain
}

export interface PosterizeParams {
  levels: number; // 2-16 color levels
}

export interface PixelateParams {
  size: number; // Pixel block size
}

export type EffectParams =
  | HalftoneParams
  | DuotoneParams
  | BlurParams
  | GlitchParams
  | VignetteParams
  | GrainParams
  | PosterizeParams
  | PixelateParams
  | Record<string, number | string | boolean>;

// =============================================================================
// Image Operation
// =============================================================================

export interface ImageOperation {
  type: EffectType;
  params: EffectParams;
  mask?: MaskConfig;
}

export interface MaskConfig {
  type: "rectangle" | "ellipse" | "gradient" | "image";
  invert: boolean;
  feather: number;
  bounds?: { x: number; y: number; width: number; height: number };
  gradientAngle?: number;
  maskImageUrl?: string;
}

// =============================================================================
// Output Configuration
// =============================================================================

export interface OutputConfig {
  format: "png" | "jpg" | "webp" | "svg";
  quality: number; // 0-100
  width?: number;
  height?: number;
  fit: "contain" | "cover" | "fill" | "inside" | "outside";
}

// =============================================================================
// Processing Pipeline
// =============================================================================

export interface ImageProcessingPipeline {
  id: string;
  input: ImageSource;
  operations: ImageOperation[];
  output: OutputConfig;
}

export type ImageSource =
  | { type: "url"; url: string }
  | { type: "base64"; data: string; mimeType: string }
  | { type: "file"; path: string }
  | { type: "canvas"; canvas: HTMLCanvasElement };

// =============================================================================
// Icon Generation
// =============================================================================

export type IconStyle =
  | "flat"
  | "gradient"
  | "glassmorphism"
  | "neumorphic"
  | "illustrated"
  | "3d"
  | "halftone"
  | "minimal";

export type IconShape = "square" | "rounded" | "circle" | "squircle";

export interface IconEffect {
  type: "shadow" | "glow" | "border" | "overlay" | "badge";
  params: Record<string, unknown>;
}

export interface IconShadowEffect extends IconEffect {
  type: "shadow";
  params: {
    blur: number;
    offset: { x: number; y: number };
    color: string;
    spread?: number;
  };
}

export interface IconGlowEffect extends IconEffect {
  type: "glow";
  params: {
    blur: number;
    color: string;
    spread: number;
  };
}

export interface IconBorderEffect extends IconEffect {
  type: "border";
  params: {
    width: number;
    color: string;
    style: "solid" | "gradient" | "double";
  };
}

export interface IconGenerationConfig {
  name: string;
  style: IconStyle;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  shape: IconShape;
  cornerRadius?: number;
  symbol?: string;
  effects: IconEffect[];
  sizes: number[];
}

export interface GeneratedIcon {
  name: string;
  size: number;
  dataUrl: string;
  format: "png" | "svg";
}

// =============================================================================
// Branded Look
// =============================================================================

export interface BrandedLookConfig {
  name: string;
  description: string;
  operations: ImageOperation[];
  presets: {
    light: Partial<ImageOperation>[];
    dark: Partial<ImageOperation>[];
  };
}

// =============================================================================
// Color Palette
// =============================================================================

export interface ColorPalette {
  name: string;
  colors: PaletteColor[];
  source?: string;
}

export interface PaletteColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
  shades?: string[];
}

export type PaletteMode =
  | "extract"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary"
  | "monochromatic";

// =============================================================================
// Pattern Generation
// =============================================================================

export type PatternType =
  | "dots"
  | "lines"
  | "grid"
  | "waves"
  | "noise"
  | "geometric"
  | "organic"
  | "halftone"
  | "checkerboard"
  | "stripes";

export interface PatternConfig {
  type: PatternType;
  width: number;
  height: number;
  colors: string[];
  density: number;
  rotation: number;
  seamless: boolean;
  seed?: number;
}

// =============================================================================
// Composite Layers
// =============================================================================

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export interface CompositeLayer {
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  opacity: number;
  blendMode: BlendMode;
  rotation?: number;
  effects?: ImageOperation[];
}

// =============================================================================
// Processing Result
// =============================================================================

export interface ProcessingResult {
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  width?: number;
  height?: number;
  format?: string;
  error?: string;
  processingTimeMs?: number;
}

// =============================================================================
// Effect Controls (for UI)
// =============================================================================

export interface EffectControl {
  id: string;
  label: string;
  type: "slider" | "color" | "toggle" | "select" | "position";
  param: string;
  min?: number;
  max?: number;
  step?: number;
  default: number | string | boolean;
  unit?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface EffectDefinition {
  type: EffectType;
  name: string;
  description: string;
  category: "stylization" | "color" | "blur" | "distortion" | "texture" | "artistic" | "preset";
  controls: EffectControl[];
  defaultParams: EffectParams;
}
