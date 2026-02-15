// =============================================================================
// Prompt Builder - Generate AI Prompts for Video/Image Generation
// =============================================================================
// Builds prompts for Fal, Replicate, and other providers using the Style Bible
// and scene context. Ensures every generated frame maintains visual consistency.
// =============================================================================

import type { StyleBible, Scene, CharacterSheet, GeneratedClip } from './types';
import { buildScenePrompt, buildNegativePrompt, buildCharacterPrompt } from './style-bible';

// -----------------------------------------------------------------------------
// Generation Request Types
// -----------------------------------------------------------------------------

export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt: string;
  /** Which provider to use */
  provider: 'fal' | 'replicate' | 'local';
  /** Provider-specific model identifier */
  model: string;
  /** Image dimensions */
  width: number;
  height: number;
  /** Number of images to generate */
  numImages: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Reference images for IP-Adapter/ControlNet */
  referenceImages?: string[];
  /** Guidance scale */
  guidanceScale?: number;
  /** Number of inference steps */
  numSteps?: number;
}

export interface VideoGenerationRequest {
  prompt: string;
  negativePrompt: string;
  provider: 'fal' | 'replicate' | 'local';
  model: string;
  /** Duration in seconds */
  durationSeconds: number;
  /** Source image to animate (image-to-video) */
  sourceImage?: string;
  width: number;
  height: number;
  fps: number;
  seed?: number;
  /** Motion intensity (0-1) */
  motionIntensity?: number;
}

// -----------------------------------------------------------------------------
// Model Presets
// -----------------------------------------------------------------------------

export const IMAGE_MODELS = {
  'flux-pro': {
    provider: 'fal' as const,
    model: 'fal-ai/flux-pro/v1.1',
    guidanceScale: 3.5,
    numSteps: 28,
  },
  'flux-dev': {
    provider: 'fal' as const,
    model: 'fal-ai/flux/dev',
    guidanceScale: 3.5,
    numSteps: 28,
  },
  'sdxl': {
    provider: 'fal' as const,
    model: 'fal-ai/fast-sdxl',
    guidanceScale: 7.5,
    numSteps: 30,
  },
  'sdxl-replicate': {
    provider: 'replicate' as const,
    model: 'stability-ai/sdxl',
    guidanceScale: 7.5,
    numSteps: 30,
  },
} as const;

export const VIDEO_MODELS = {
  'kling-pro': {
    provider: 'fal' as const,
    model: 'fal-ai/kling-video/v1.5/pro/image-to-video',
    fps: 24,
    maxDuration: 10,
  },
  'kling-standard': {
    provider: 'fal' as const,
    model: 'fal-ai/kling-video/v1/standard/image-to-video',
    fps: 24,
    maxDuration: 5,
  },
  'runway-gen3': {
    provider: 'replicate' as const,
    model: 'runway/gen-3-alpha',
    fps: 24,
    maxDuration: 10,
  },
  'minimax-video': {
    provider: 'fal' as const,
    model: 'fal-ai/minimax-video',
    fps: 30,
    maxDuration: 6,
  },
} as const;

// -----------------------------------------------------------------------------
// Prompt Generation
// -----------------------------------------------------------------------------

/**
 * Build a complete image generation request for a storyboard frame.
 */
export function buildStoryboardFrameRequest(
  styleBible: StyleBible,
  scene: Scene,
  options?: {
    model?: keyof typeof IMAGE_MODELS;
    width?: number;
    height?: number;
    seed?: number;
    characters?: string[];
  }
): ImageGenerationRequest {
  const modelKey = options?.model || 'flux-pro';
  const modelConfig = IMAGE_MODELS[modelKey];

  const prompt = buildScenePrompt(styleBible, scene, {
    characters: options?.characters,
    isVideo: false,
    modifiers: ['single frame, detailed illustration, establishing shot'],
  });

  return {
    prompt,
    negativePrompt: buildNegativePrompt(styleBible),
    provider: modelConfig.provider,
    model: modelConfig.model,
    width: options?.width || 1024,
    height: options?.height || 1024,
    numImages: 1,
    seed: options?.seed,
    referenceImages: styleBible.referenceImages,
    guidanceScale: modelConfig.guidanceScale,
    numSteps: modelConfig.numSteps,
  };
}

/**
 * Build a video generation request to animate a storyboard frame.
 * Uses image-to-video with the approved storyboard frame as source.
 */
export function buildSceneVideoRequest(
  styleBible: StyleBible,
  scene: Scene,
  sourceImageUrl: string,
  durationSeconds: number,
  options?: {
    model?: keyof typeof VIDEO_MODELS;
    width?: number;
    height?: number;
    seed?: number;
    motionDescription?: string;
  }
): VideoGenerationRequest {
  const modelKey = options?.model || 'kling-pro';
  const modelConfig = VIDEO_MODELS[modelKey];

  // Video prompts should include motion description
  const motionHint = options?.motionDescription || inferMotion(scene);

  const prompt = buildScenePrompt(styleBible, scene, {
    isVideo: true,
    modifiers: [motionHint, 'smooth natural motion, consistent character appearance'],
  });

  return {
    prompt,
    negativePrompt: buildNegativePrompt(styleBible),
    provider: modelConfig.provider,
    model: modelConfig.model,
    durationSeconds: Math.min(durationSeconds, modelConfig.maxDuration),
    sourceImage: sourceImageUrl,
    width: options?.width || 1080,
    height: options?.height || 1920,
    fps: modelConfig.fps,
    seed: options?.seed,
    motionIntensity: scene.emotion === 'chaotic' ? 0.8 : scene.emotion === 'tender' ? 0.3 : 0.5,
  };
}

/**
 * Build a character reference sheet request.
 * Generates a consistent character turnaround for use as IP-Adapter reference.
 */
export function buildCharacterSheetRequest(
  styleBible: StyleBible,
  character: CharacterSheet,
  options?: {
    model?: keyof typeof IMAGE_MODELS;
    expressions?: string[];
  }
): ImageGenerationRequest {
  const modelKey = options?.model || 'flux-pro';
  const modelConfig = IMAGE_MODELS[modelKey];

  const expressions = options?.expressions || ['happy', 'excited', 'tender'];
  const expressionDescriptions = expressions
    .map((e) => character.expressions[e])
    .filter(Boolean)
    .join('; ');

  const prompt = [
    styleBible.promptPrefix,
    'Character reference sheet, multiple poses and expressions',
    buildCharacterPrompt(character),
    `Expressions shown: ${expressionDescriptions}`,
    'White background, clean reference sheet layout',
    'Full body and close-up face views',
  ].join('. ');

  return {
    prompt,
    negativePrompt: buildNegativePrompt(styleBible),
    provider: modelConfig.provider,
    model: modelConfig.model,
    width: 1536,
    height: 1024,
    numImages: 1,
    guidanceScale: modelConfig.guidanceScale,
    numSteps: modelConfig.numSteps,
  };
}

// -----------------------------------------------------------------------------
// Motion Inference
// -----------------------------------------------------------------------------

/**
 * Infer motion description from scene context.
 * Used when no explicit motion description is provided.
 */
function inferMotion(scene: Scene): string {
  const emotion = scene.emotion.toLowerCase();
  const desc = scene.description.toLowerCase();

  // Check for explicit motion in description
  if (desc.includes('walking')) return 'characters walking, natural stride';
  if (desc.includes('running') || desc.includes('chase')) return 'dynamic running motion, energetic';
  if (desc.includes('sitting') || desc.includes('couch')) return 'subtle movements, breathing, head turns';
  if (desc.includes('driving') || desc.includes('car')) return 'gentle vehicle sway, scenery passing through window';
  if (desc.includes('jumping') || desc.includes('bouncing')) return 'bouncy, joyful movement';
  if (desc.includes('pointing')) return 'arm extending, finger pointing, excited gesture';
  if (desc.includes('hug')) return 'embrace, warm gentle movement';

  // Infer from emotion
  switch (emotion) {
    case 'chaotic':
    case 'excited':
      return 'energetic movement, dynamic camera, lively action';
    case 'playful':
      return 'bouncy, light movement, playful gestures';
    case 'tender':
    case 'cozy':
      return 'gentle, slow movement, soft breathing';
    case 'curious':
      return 'careful movement, leaning forward, looking around';
    case 'triumphant':
      return 'arms raised, celebratory gesture, big smile';
    case 'content':
      return 'relaxed, gentle swaying, peaceful';
    default:
      return 'natural subtle movement';
  }
}

// -----------------------------------------------------------------------------
// Batch Generation Planning
// -----------------------------------------------------------------------------

export interface GenerationPlan {
  scenes: {
    sceneId: string;
    storyboardFrame: ImageGenerationRequest;
    videoClips: VideoGenerationRequest[];
  }[];
  characterSheets: ImageGenerationRequest[];
  estimatedCost: {
    images: number;
    videos: number;
    total: number;
  };
}

/**
 * Plan all generation requests for an episode.
 * Produces a manifest of every image and video that needs to be created.
 */
export function planEpisodeGeneration(
  styleBible: StyleBible,
  scenes: Scene[],
  options?: {
    imageModel?: keyof typeof IMAGE_MODELS;
    videoModel?: keyof typeof VIDEO_MODELS;
    generateCharacterSheets?: boolean;
    maxClipDuration?: number;
    outputAspect?: 'portrait' | 'landscape' | 'square';
  }
): GenerationPlan {
  const aspect = options?.outputAspect || 'portrait';
  const dimensions = {
    portrait: { width: 1080, height: 1920 },
    landscape: { width: 1920, height: 1080 },
    square: { width: 1080, height: 1080 },
  }[aspect];

  const maxClip = options?.maxClipDuration || 5;

  // Character sheets
  const characterSheets = options?.generateCharacterSheets !== false
    ? styleBible.characters.map((char) =>
        buildCharacterSheetRequest(styleBible, char, {
          model: options?.imageModel,
        })
      )
    : [];

  // Per-scene generation
  const sceneGenerations = scenes.map((scene) => {
    const sceneDurationSec = (scene.beatWindow.endMs - scene.beatWindow.startMs) / 1000;
    const numClips = Math.ceil(sceneDurationSec / maxClip);
    const clipDuration = sceneDurationSec / numClips;

    return {
      sceneId: scene.id,
      storyboardFrame: buildStoryboardFrameRequest(styleBible, scene, {
        model: options?.imageModel,
        width: dimensions.width,
        height: dimensions.height,
      }),
      videoClips: Array.from({ length: numClips }, () =>
        buildSceneVideoRequest(
          styleBible,
          scene,
          '', // Source image URL filled after frame approval
          clipDuration,
          {
            model: options?.videoModel,
            width: dimensions.width,
            height: dimensions.height,
          }
        )
      ),
    };
  });

  // Rough cost estimate (varies by provider)
  const imageCount = sceneGenerations.length + characterSheets.length;
  const videoCount = sceneGenerations.reduce((sum, s) => sum + s.videoClips.length, 0);

  return {
    scenes: sceneGenerations,
    characterSheets,
    estimatedCost: {
      images: imageCount * 0.04, // ~$0.04 per Flux image
      videos: videoCount * 0.10, // ~$0.10 per Kling clip
      total: imageCount * 0.04 + videoCount * 0.10,
    },
  };
}
