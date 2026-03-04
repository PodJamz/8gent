// Utility functions for 3D Gallery components
import * as THREE from 'three';

/**
 * Easing functions for smooth animations
 */
export const easing = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  elastic: (t: number) => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/**
 * Lerp (linear interpolation) between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculate points on a sphere surface
 */
export function spherePoint(
  radius: number,
  theta: number,
  phi: number
): THREE.Vector3 {
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Calculate points along a helix
 */
export function helixPoint(
  radius: number,
  height: number,
  angle: number,
  turns: number
): THREE.Vector3 {
  const y = (angle / (Math.PI * 2 * turns)) * height - height / 2;
  return new THREE.Vector3(
    radius * Math.cos(angle),
    y,
    radius * Math.sin(angle)
  );
}

/**
 * Fibonacci sphere distribution for even spacing
 */
export function fibonacciSphere(
  samples: number,
  radius: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // Golden angle

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radiusAtY * radius,
        y * radius,
        Math.sin(theta) * radiusAtY * radius
      )
    );
  }

  return points;
}

/**
 * Generate a smooth noise value (simplified Perlin-like)
 */
export function smoothNoise(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);

  const u = x * x * (3 - 2 * x);
  const v = y * y * (3 - 2 * y);
  const w = z * z * (3 - 2 * z);

  // Simplified noise computation
  const n = X + Y * 57 + Z * 113;
  const noise1 = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return (noise1 - Math.floor(noise1)) * (1 - u) * (1 - v) * (1 - w);
}

/**
 * Create a gradient texture
 */
export function createGradientTexture(
  colors: string[],
  size: number = 256
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, size, size);

  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Get aspect ratio from texture
 */
export function getTextureAspect(texture: THREE.Texture): number {
  if (texture.image) {
    return texture.image.width / texture.image.height;
  }
  return 1;
}

/**
 * Damping function for smooth deceleration
 */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number
): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Vector3 damping
 */
export function dampVector3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number
): void {
  current.x = damp(current.x, target.x, lambda, dt);
  current.y = damp(current.y, target.y, lambda, dt);
  current.z = damp(current.z, target.z, lambda, dt);
}

/**
 * Check WebGL support
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Check WebGL2 support
 */
export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

/**
 * Dispose of Three.js objects properly
 */
export function disposeObject(obj: THREE.Object3D): void {
  if (obj instanceof THREE.Mesh) {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  }
  obj.children.forEach((child) => disposeObject(child));
}
