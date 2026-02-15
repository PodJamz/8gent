/**
 * Image Processing Library
 *
 * Professional image manipulation and effects for OpenClaw-OS.
 * Enables consistent branded looks, unique app icons, and artistic transformations.
 */

// Types
export * from "./types";

// Effects
export {
  applyEffect,
  applyPreset,
  applyHalftone,
  applyDuotone,
  applyGrayscale,
  applySepia,
  applyInvert,
  applyVignette,
  applyGrain,
  applyPosterize,
  applyPixelate,
  applyGlitch,
  applyBrightness,
  applyContrast,
  applySaturation,
  EFFECT_PRESETS,
  // Utilities
  createCanvas,
  loadImage,
  imageToCanvas,
  canvasToDataUrl,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
} from "./effects";

// =============================================================================
// High-Level API
// =============================================================================

import type {
  EffectType,
  EffectParams,
  IconGenerationConfig,
  GeneratedIcon,
  ProcessingResult,
  PatternConfig,
  ColorPalette,
  PaletteMode,
  CompositeLayer,
} from "./types";

import {
  loadImage,
  imageToCanvas,
  canvasToDataUrl,
  createCanvas,
  applyEffect as applyEffectInternal,
  applyPreset as applyPresetInternal,
  hexToRgb,
} from "./effects";

/**
 * Process an image with effects
 */
export async function processImage(
  src: string,
  effects: Array<{ type: EffectType; params?: EffectParams }>,
  options: {
    outputFormat?: "png" | "jpg" | "webp";
    quality?: number;
    width?: number;
    height?: number;
  } = {}
): Promise<ProcessingResult> {
  const startTime = performance.now();

  try {
    const img = await loadImage(src);
    let canvas = imageToCanvas(img);

    // Resize if needed
    if (options.width || options.height) {
      const newWidth = options.width || canvas.width;
      const newHeight = options.height || canvas.height;
      const resized = createCanvas(newWidth, newHeight);
      const ctx = resized.getContext("2d")!;
      ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
      canvas = resized;
    }

    // Apply effects
    for (const { type, params = {} } of effects) {
      canvas = await applyEffectInternal(canvas, type, params);
    }

    const format = options.outputFormat || "png";
    const quality = (options.quality || 90) / 100;
    const dataUrl = canvasToDataUrl(canvas, format, quality);

    return {
      success: true,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      format,
      processingTimeMs: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      processingTimeMs: performance.now() - startTime,
    };
  }
}

/**
 * Apply a named preset to an image
 */
export async function applyBrandedLook(
  src: string,
  preset: string,
  options: {
    outputFormat?: "png" | "jpg" | "webp";
    quality?: number;
  } = {}
): Promise<ProcessingResult> {
  const startTime = performance.now();

  try {
    const img = await loadImage(src);
    let canvas = imageToCanvas(img);
    canvas = await applyPresetInternal(canvas, preset);

    const format = options.outputFormat || "png";
    const quality = (options.quality || 90) / 100;
    const dataUrl = canvasToDataUrl(canvas, format, quality);

    return {
      success: true,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      format,
      processingTimeMs: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      processingTimeMs: performance.now() - startTime,
    };
  }
}

/**
 * Generate app icon with specified style
 */
export async function generateIcon(
  config: Partial<IconGenerationConfig> & { name: string; primaryColor: string }
): Promise<GeneratedIcon[]> {
  const {
    name,
    style = "flat",
    colors,
    shape = "squircle",
    cornerRadius = 22,
    symbol,
    effects = [],
    sizes = [64, 128, 256, 512, 1024],
  } = config;

  const primaryColor = config.primaryColor;
  const secondaryColor = colors?.secondary || primaryColor;
  const backgroundColor = colors?.background || primaryColor;

  const results: GeneratedIcon[] = [];

  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d")!;

    // Draw background based on style
    const radius = shape === "circle" ? size / 2 : shape === "square" ? 0 : (cornerRadius / 100) * size * 0.4;

    // Draw rounded rectangle path
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    } else {
      ctx.roundRect(0, 0, size, size, radius);
    }
    ctx.closePath();
    ctx.clip();

    // Fill based on style
    switch (style) {
      case "gradient": {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);
        ctx.fillStyle = gradient;
        break;
      }
      case "glassmorphism": {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);
        // Add glass overlay
        const glassGradient = ctx.createLinearGradient(0, 0, 0, size);
        glassGradient.addColorStop(0, "rgba(255,255,255,0.4)");
        glassGradient.addColorStop(0.5, "rgba(255,255,255,0.1)");
        glassGradient.addColorStop(0.51, "transparent");
        glassGradient.addColorStop(1, "transparent");
        ctx.fillStyle = glassGradient;
        break;
      }
      case "neumorphic": {
        ctx.fillStyle = backgroundColor;
        // Would need shadow implementation
        break;
      }
      default:
        ctx.fillStyle = primaryColor;
    }
    ctx.fillRect(0, 0, size, size);

    // Draw symbol if provided
    if (symbol) {
      ctx.fillStyle = "#ffffff";
      ctx.font = `${size * 0.5}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(symbol, size / 2, size / 2);
    }

    results.push({
      name: `${name}-${size}`,
      size,
      dataUrl: canvasToDataUrl(canvas, "png"),
      format: "png",
    });
  }

  return results;
}

/**
 * Generate seamless pattern
 */
export async function generatePattern(
  config: Partial<PatternConfig>
): Promise<ProcessingResult> {
  const {
    type = "dots",
    width = 256,
    height = 256,
    colors = ["#000000", "#ffffff"],
    density = 50,
    rotation = 0,
    seamless = true,
    seed = Math.random() * 10000,
  } = config;

  const startTime = performance.now();
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = colors[1] || "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = colors[0] || "#000000";
  ctx.strokeStyle = colors[0] || "#000000";

  // Seeded random for consistency
  let currentSeed = seed;
  const seededRandom = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  switch (type) {
    case "dots": {
      const spacing = Math.max(5, (100 - density) / 2);
      const dotSize = Math.max(1, density / 20);
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case "lines": {
      const spacing = Math.max(3, (100 - density) / 3);
      ctx.lineWidth = Math.max(1, density / 30);
      for (let y = 0; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      break;
    }
    case "grid": {
      const spacing = Math.max(5, (100 - density) / 2);
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      break;
    }
    case "checkerboard": {
      const size = Math.max(5, (100 - density) / 2);
      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
            ctx.fillRect(x, y, size, size);
          }
        }
      }
      break;
    }
    case "noise": {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const noiseLevel = density / 100;
      const fg = hexToRgb(colors[0]);
      const bg = hexToRgb(colors[1] || "#ffffff");
      for (let i = 0; i < data.length; i += 4) {
        const useNoise = seededRandom() < noiseLevel;
        if (useNoise) {
          data[i] = fg.r;
          data[i + 1] = fg.g;
          data[i + 2] = fg.b;
        } else {
          data[i] = bg.r;
          data[i + 1] = bg.g;
          data[i + 2] = bg.b;
        }
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      break;
    }
    default:
      console.warn(`Unknown pattern type: ${type}`);
  }

  // Apply rotation if needed
  if (rotation !== 0) {
    const rotatedCanvas = createCanvas(width, height);
    const rotatedCtx = rotatedCanvas.getContext("2d")!;
    rotatedCtx.translate(width / 2, height / 2);
    rotatedCtx.rotate((rotation * Math.PI) / 180);
    rotatedCtx.drawImage(canvas, -width / 2, -height / 2);
    return {
      success: true,
      dataUrl: canvasToDataUrl(rotatedCanvas, "png"),
      width,
      height,
      format: "png",
      processingTimeMs: performance.now() - startTime,
    };
  }

  return {
    success: true,
    dataUrl: canvasToDataUrl(canvas, "png"),
    width,
    height,
    format: "png",
    processingTimeMs: performance.now() - startTime,
  };
}

/**
 * Extract color palette from image
 */
export async function extractColorPalette(
  src: string,
  count: number = 5
): Promise<ColorPalette> {
  const img = await loadImage(src);
  const canvas = imageToCanvas(img);
  const ctx = canvas.getContext("2d")!;

  // Sample at reduced size for performance
  const sampleSize = 50;
  const sampleCanvas = createCanvas(sampleSize, sampleSize);
  const sampleCtx = sampleCanvas.getContext("2d")!;
  sampleCtx.drawImage(canvas, 0, 0, sampleSize, sampleSize);

  const imageData = sampleCtx.getImageData(0, 0, sampleSize, sampleSize);
  const data = imageData.data;

  // Simple color quantization using median cut (simplified)
  const colorMap = new Map<string, number>();

  for (let i = 0; i < data.length; i += 4) {
    // Reduce color space for grouping
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort by frequency and take top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);

  const colors = sortedColors.map(([key]) => {
    const [r, g, b] = key.split(",").map(Number);
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    const hsl = rgbToHslInternal(r, g, b);
    return {
      hex,
      rgb: { r, g, b },
      hsl,
    };
  });

  return {
    name: "Extracted Palette",
    colors,
    source: src,
  };
}

// Internal helper (avoiding circular import)
function rgbToHslInternal(
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Composite multiple images together
 */
export async function compositeImages(
  baseImageSrc: string,
  layers: CompositeLayer[],
  options: {
    outputWidth?: number;
    outputHeight?: number;
    format?: "png" | "jpg" | "webp";
    quality?: number;
  } = {}
): Promise<ProcessingResult> {
  const startTime = performance.now();

  try {
    const baseImg = await loadImage(baseImageSrc);
    const width = options.outputWidth || baseImg.width;
    const height = options.outputHeight || baseImg.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d")!;

    // Draw base image
    ctx.drawImage(baseImg, 0, 0, width, height);

    // Draw each layer
    for (const layer of layers) {
      const layerImg = await loadImage(layer.src);
      const layerWidth = layer.width || layerImg.width;
      const layerHeight = layer.height || layerImg.height;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

      if (layer.rotation) {
        ctx.translate(layer.x + layerWidth / 2, layer.y + layerHeight / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.drawImage(layerImg, -layerWidth / 2, -layerHeight / 2, layerWidth, layerHeight);
      } else {
        ctx.drawImage(layerImg, layer.x, layer.y, layerWidth, layerHeight);
      }

      ctx.restore();
    }

    const format = options.format || "png";
    const quality = (options.quality || 90) / 100;

    return {
      success: true,
      dataUrl: canvasToDataUrl(canvas, format, quality),
      width,
      height,
      format,
      processingTimeMs: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      processingTimeMs: performance.now() - startTime,
    };
  }
}
