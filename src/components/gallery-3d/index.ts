// 3D Gallery Components - Excellence in Three.js
// A comprehensive collection of immersive 3D gallery experiences

// Main gallery components
export { default as SphereGallery } from './SphereGallery';
export { default as CarouselGallery } from './CarouselGallery';
export { default as HelixGallery } from './HelixGallery';
export { default as CubeGallery } from './CubeGallery';
export { default as ParticleGallery } from './ParticleGallery';
export { default as FloatingCards } from './FloatingCards';
export { default as RoomGallery } from './RoomGallery';

// Types
export type {
  GalleryImage,
  Gallery3DProps,
  GalleryVariant,
  GalleryShowcaseProps,
  CameraConfig,
  LightingConfig,
  AnimationConfig,
  InteractionState,
  ShaderUniforms,
} from './types';

// Utilities
export {
  easing,
  lerp,
  clamp,
  mapRange,
  spherePoint,
  helixPoint,
  fibonacciSphere,
  smoothNoise,
  createGradientTexture,
  getTextureAspect,
  damp,
  dampVector3,
  isWebGLSupported,
  isWebGL2Supported,
  disposeObject,
} from './utils';

// Shaders
export {
  holographicShader,
  glassShader,
  particleGlowShader,
  rippleShader,
  neonShader,
  depthFadeShader,
  chromaticShader,
  dissolveShader,
} from './shaders';
