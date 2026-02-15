/**
 * Image Effects Implementation
 *
 * Canvas-based image processing effects.
 */

import type {
  EffectType,
  EffectParams,
  HalftoneParams,
  DuotoneParams,
  BlurParams,
  GlitchParams,
  VignetteParams,
  GrainParams,
  PosterizeParams,
  PixelateParams,
  ProcessingResult,
} from "../types";

// =============================================================================
// Canvas Utilities
// =============================================================================

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  format: "png" | "jpg" | "webp" = "png",
  quality: number = 0.92
): string {
  const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
  return canvas.toDataURL(mimeType, quality);
}

// =============================================================================
// Color Utilities
// =============================================================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// =============================================================================
// Effect Implementations
// =============================================================================

/**
 * Apply halftone effect
 */
export function applyHalftone(
  canvas: HTMLCanvasElement,
  params: Partial<HalftoneParams> = {}
): HTMLCanvasElement {
  const {
    shape = "dot",
    frequency = 45,
    angle = 45,
    size = 1,
    contrast = 0,
  } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Convert to grayscale first
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    // Apply contrast
    const adjusted = ((gray - 128) * (1 + contrast / 100) + 128);
    data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, adjusted));
  }

  const output = createCanvas(width, height);
  const outCtx = output.getContext("2d")!;
  outCtx.fillStyle = "#ffffff";
  outCtx.fillRect(0, 0, width, height);
  outCtx.fillStyle = "#000000";

  const cellSize = Math.max(2, Math.round(72 / frequency));
  const angleRad = (angle * Math.PI) / 180;

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      // Sample average brightness in cell
      let sum = 0;
      let count = 0;
      for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
        for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          sum += data[idx];
          count++;
        }
      }
      const brightness = sum / count / 255;
      const dotSize = (1 - brightness) * cellSize * size;

      if (dotSize > 0.5) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;

        outCtx.save();
        outCtx.translate(cx, cy);
        outCtx.rotate(angleRad);

        switch (shape) {
          case "dot":
            outCtx.beginPath();
            outCtx.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
            outCtx.fill();
            break;
          case "line":
            outCtx.fillRect(-cellSize / 2, -dotSize / 2, cellSize, dotSize);
            break;
          case "diamond":
            outCtx.beginPath();
            outCtx.moveTo(0, -dotSize / 2);
            outCtx.lineTo(dotSize / 2, 0);
            outCtx.lineTo(0, dotSize / 2);
            outCtx.lineTo(-dotSize / 2, 0);
            outCtx.closePath();
            outCtx.fill();
            break;
          case "cross":
            outCtx.fillRect(-dotSize / 2, -dotSize / 6, dotSize, dotSize / 3);
            outCtx.fillRect(-dotSize / 6, -dotSize / 2, dotSize / 3, dotSize);
            break;
          default:
            outCtx.beginPath();
            outCtx.ellipse(0, 0, dotSize / 2, dotSize / 3, 0, 0, Math.PI * 2);
            outCtx.fill();
        }

        outCtx.restore();
      }
    }
  }

  return output;
}

/**
 * Apply duotone effect
 */
export function applyDuotone(
  canvas: HTMLCanvasElement,
  params: Partial<DuotoneParams> = {}
): HTMLCanvasElement {
  const {
    highlightColor = "#ffffff",
    shadowColor = "#000000",
    contrast = 0,
    midtoneShift = 0,
  } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const highlight = hexToRgb(highlightColor);
  const shadow = hexToRgb(shadowColor);

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    let gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

    // Apply contrast
    gray = (gray - 128) * (1 + contrast / 100) + 128;

    // Apply midtone shift
    gray = gray + midtoneShift;

    // Clamp
    gray = Math.max(0, Math.min(255, gray));

    // Interpolate between shadow and highlight
    const t = gray / 255;
    data[i] = Math.round(shadow.r + (highlight.r - shadow.r) * t);
    data[i + 1] = Math.round(shadow.g + (highlight.g - shadow.g) * t);
    data[i + 2] = Math.round(shadow.b + (highlight.b - shadow.b) * t);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply grayscale effect
 */
export function applyGrayscale(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply sepia effect
 */
export function applySepia(
  canvas: HTMLCanvasElement,
  intensity: number = 1
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
    const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
    const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;

    data[i] = Math.min(255, r + (sepiaR - r) * intensity);
    data[i + 1] = Math.min(255, g + (sepiaG - g) * intensity);
    data[i + 2] = Math.min(255, b + (sepiaB - b) * intensity);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply invert effect
 */
export function applyInvert(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply vignette effect
 */
export function applyVignette(
  canvas: HTMLCanvasElement,
  params: Partial<VignetteParams> = {}
): HTMLCanvasElement {
  const {
    intensity = 0.5,
    radius = 0.7,
    softness = 0.5,
    color = "#000000",
  } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  const vignetteColor = hexToRgb(color);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;

      // Calculate vignette factor
      const vignetteStart = radius;
      const vignetteEnd = radius + softness;
      let factor = 0;

      if (dist > vignetteStart) {
        factor = Math.min(1, (dist - vignetteStart) / (vignetteEnd - vignetteStart));
        factor = factor * factor * intensity; // Quadratic falloff
      }

      const i = (y * width + x) * 4;
      data[i] = Math.round(data[i] * (1 - factor) + vignetteColor.r * factor);
      data[i + 1] = Math.round(data[i + 1] * (1 - factor) + vignetteColor.g * factor);
      data[i + 2] = Math.round(data[i + 2] * (1 - factor) + vignetteColor.b * factor);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply film grain effect
 */
export function applyGrain(
  canvas: HTMLCanvasElement,
  params: Partial<GrainParams> = {}
): HTMLCanvasElement {
  const { amount = 25, size = 1, colored = false } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const grainIntensity = amount / 100;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * grainIntensity;

    if (colored) {
      data[i] = Math.max(0, Math.min(255, data[i] + (Math.random() - 0.5) * 255 * grainIntensity));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (Math.random() - 0.5) * 255 * grainIntensity));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (Math.random() - 0.5) * 255 * grainIntensity));
    } else {
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply posterize effect
 */
export function applyPosterize(
  canvas: HTMLCanvasElement,
  params: Partial<PosterizeParams> = {}
): HTMLCanvasElement {
  const { levels = 4 } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const step = 255 / (levels - 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / step) * step);
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply pixelate effect
 */
export function applyPixelate(
  canvas: HTMLCanvasElement,
  params: Partial<PixelateParams> = {}
): HTMLCanvasElement {
  const { size = 10 } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;

  // Scale down then up for pixelation
  const smallWidth = Math.ceil(width / size);
  const smallHeight = Math.ceil(height / size);

  const smallCanvas = createCanvas(smallWidth, smallHeight);
  const smallCtx = smallCanvas.getContext("2d")!;

  // Disable smoothing for crisp pixels
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.drawImage(canvas, 0, 0, smallWidth, smallHeight);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(smallCanvas, 0, 0, width, height);

  return canvas;
}

/**
 * Apply glitch effect
 */
export function applyGlitch(
  canvas: HTMLCanvasElement,
  params: Partial<GlitchParams> = {}
): HTMLCanvasElement {
  const {
    intensity = 50,
    sliceCount = 20,
    channelShift = 10,
    scanlines = true,
    colorShift = true,
    noise = 20,
  } = params;

  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;

  // Apply channel shift (chromatic aberration)
  if (colorShift) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const shift = Math.round(channelShift * (intensity / 100));

    // Create shifted copy
    const redChannel = new Uint8ClampedArray(data.length);
    const blueChannel = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;

        // Red shifted left
        const redX = Math.max(0, x - shift);
        const redI = (y * width + redX) * 4;
        redChannel[i] = data[redI];

        // Blue shifted right
        const blueX = Math.min(width - 1, x + shift);
        const blueI = (y * width + blueX) * 4;
        blueChannel[i + 2] = data[blueI + 2];
      }
    }

    // Composite channels
    for (let i = 0; i < data.length; i += 4) {
      data[i] = redChannel[i]; // Red from shifted
      // Green stays
      data[i + 2] = blueChannel[i + 2]; // Blue from shifted
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Apply horizontal slice displacement
  const sliceHeight = Math.ceil(height / sliceCount);
  for (let y = 0; y < height; y += sliceHeight) {
    if (Math.random() < intensity / 100) {
      const sliceData = ctx.getImageData(0, y, width, Math.min(sliceHeight, height - y));
      const offset = Math.round((Math.random() - 0.5) * width * (intensity / 200));
      ctx.putImageData(sliceData, offset, y);
    }
  }

  // Apply scanlines
  if (scanlines) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    for (let y = 0; y < height; y += 2) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  // Apply noise
  if (noise > 0) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const noiseIntensity = noise / 100;

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < noiseIntensity * 0.1) {
        const noiseVal = Math.random() > 0.5 ? 255 : 0;
        data[i] = noiseVal;
        data[i + 1] = noiseVal;
        data[i + 2] = noiseVal;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

/**
 * Apply brightness adjustment
 */
export function applyBrightness(
  canvas: HTMLCanvasElement,
  value: number = 0
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const adjustment = (value / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + adjustment));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment));
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply contrast adjustment
 */
export function applyContrast(
  canvas: HTMLCanvasElement,
  value: number = 0
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const factor = (259 * (value + 255)) / (255 * (259 - value));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Apply saturation adjustment
 */
export function applySaturation(
  canvas: HTMLCanvasElement,
  value: number = 0
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const adjustment = 1 + value / 100;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = Math.max(0, Math.min(255, gray + (data[i] - gray) * adjustment));
    data[i + 1] = Math.max(0, Math.min(255, gray + (data[i + 1] - gray) * adjustment));
    data[i + 2] = Math.max(0, Math.min(255, gray + (data[i + 2] - gray) * adjustment));
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// =============================================================================
// Main Effect Dispatcher
// =============================================================================

export async function applyEffect(
  canvas: HTMLCanvasElement,
  type: EffectType,
  params: EffectParams = {}
): Promise<HTMLCanvasElement> {
  // Clone canvas to avoid mutating original
  const output = createCanvas(canvas.width, canvas.height);
  const ctx = output.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0);

  switch (type) {
    case "halftone":
      return applyHalftone(output, params as Partial<HalftoneParams>);
    case "duotone":
      return applyDuotone(output, params as Partial<DuotoneParams>);
    case "grayscale":
      return applyGrayscale(output);
    case "sepia":
      return applySepia(output, (params as { intensity?: number }).intensity);
    case "invert":
      return applyInvert(output);
    case "vignette":
      return applyVignette(output, params as Partial<VignetteParams>);
    case "film-grain":
    case "grain":
    case "noise":
      return applyGrain(output, params as Partial<GrainParams>);
    case "posterize":
      return applyPosterize(output, params as Partial<PosterizeParams>);
    case "pixelate":
      return applyPixelate(output, params as Partial<PixelateParams>);
    case "glitch":
      return applyGlitch(output, params as Partial<GlitchParams>);
    case "brightness":
      return applyBrightness(output, (params as { value?: number }).value);
    case "contrast":
      return applyContrast(output, (params as { value?: number }).value);
    case "saturate":
      return applySaturation(output, (params as { value?: number }).value);
    default:
      console.warn(`Unknown effect type: ${type}`);
      return output;
  }
}

// =============================================================================
// Preset Effects (Combinations)
// =============================================================================

export const EFFECT_PRESETS: Record<string, Array<{ type: EffectType; params: EffectParams }>> = {
  vintage: [
    { type: "sepia", params: { intensity: 0.4 } },
    { type: "vignette", params: { intensity: 0.5 } },
    { type: "grain", params: { amount: 25 } },
    { type: "contrast", params: { value: 10 } },
  ],

  cyberpunk: [
    { type: "duotone", params: { highlightColor: "#00ffff", shadowColor: "#ff00ff" } },
    { type: "glitch", params: { intensity: 20, channelShift: 5 } },
  ],

  noir: [
    { type: "grayscale", params: {} },
    { type: "contrast", params: { value: 40 } },
    { type: "vignette", params: { intensity: 0.6 } },
  ],

  "pop-art": [
    { type: "posterize", params: { levels: 4 } },
    { type: "saturate", params: { value: 50 } },
    { type: "halftone", params: { shape: "dot", frequency: 30 } },
  ],

  blueprint: [
    { type: "invert", params: {} },
    { type: "duotone", params: { highlightColor: "#ffffff", shadowColor: "#0066cc" } },
  ],

  signature: [
    { type: "duotone", params: { highlightColor: "#f5f5f5", shadowColor: "#0a0a0a" } },
    { type: "halftone", params: { shape: "line", frequency: 45, angle: 45 } },
    { type: "vignette", params: { intensity: 0.3, radius: 0.8 } },
    { type: "grain", params: { amount: 15 } },
  ],
};

export async function applyPreset(
  canvas: HTMLCanvasElement,
  presetName: string
): Promise<HTMLCanvasElement> {
  const preset = EFFECT_PRESETS[presetName];
  if (!preset) {
    console.warn(`Unknown preset: ${presetName}`);
    return canvas;
  }

  let result = canvas;
  for (const { type, params } of preset) {
    result = await applyEffect(result, type, params);
  }

  return result;
}
