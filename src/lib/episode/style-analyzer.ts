// =============================================================================
// Style Analyzer - Extract & Brainstorm Visual Styles from Reference Images
// =============================================================================
// Uses vision models to analyze reference images and extract style characteristics.
// Generates style bible drafts from analyzed images. Supports brainstorming
// different styles by generating variations and comparing them.
// =============================================================================

import type { StyleBible, CharacterSheet } from './types';

// -----------------------------------------------------------------------------
// Style Analysis Types
// -----------------------------------------------------------------------------

export interface StyleAnalysis {
  /** Overall art style description */
  artStyle: string;
  /** Detected techniques */
  techniques: string[];
  /** Extracted color palette */
  colors: {
    dominant: string[];
    accent: string[];
    mood: string;
  };
  /** Line work characteristics */
  lineWork: {
    weight: string;
    style: string; // "clean", "rough", "sketchy", "none"
  };
  /** Lighting description */
  lighting: string;
  /** Texture characteristics */
  texture: string;
  /** Overall mood/tone */
  mood: string;
  /** Composition style */
  composition: string;
  /** Detail level */
  detailLevel: 'minimal' | 'moderate' | 'high' | 'hyper-detailed';
  /** Influences or comparable styles */
  influences: string[];
  /** Raw prompt that could reproduce this style */
  promptFragment: string;
  /** What to avoid to maintain this style */
  negativeFragment: string;
}

export interface StyleBrainstormOption {
  id: string;
  name: string;
  description: string;
  analysis: StyleAnalysis;
  /** Preview generation prompt */
  previewPrompt: string;
  /** URL to generated preview (filled after generation) */
  previewUrl?: string;
  /** User rating (filled during brainstorm) */
  rating?: number;
}

// -----------------------------------------------------------------------------
// Vision Model Analysis Prompts
// -----------------------------------------------------------------------------

/**
 * Build the prompt for a vision model to analyze an image's visual style.
 * Works with Claude, GPT-4V, or any multimodal model.
 */
export function buildStyleAnalysisPrompt(): string {
  return `Analyze this image's visual/artistic style in detail. Return a JSON object with these fields:

{
  "artStyle": "Overall art style in one sentence (e.g., 'warm watercolor cartoon illustration with rich textures')",
  "techniques": ["list", "of", "artistic", "techniques", "used"],
  "colors": {
    "dominant": ["#hex1", "#hex2", "#hex3", "#hex4"],
    "accent": ["#hex1", "#hex2"],
    "mood": "warm/cool/neutral/vibrant/muted/etc"
  },
  "lineWork": {
    "weight": "thin/medium/thick/variable",
    "style": "clean/rough/sketchy/painterly/none"
  },
  "lighting": "Description of lighting style",
  "texture": "Description of texture characteristics",
  "mood": "Overall emotional mood of the art style",
  "composition": "How elements are arranged",
  "detailLevel": "minimal/moderate/high/hyper-detailed",
  "influences": ["Comparable artists, styles, or media"],
  "promptFragment": "A detailed text prompt that would reproduce this exact art style in an image generator. Be very specific about medium, technique, colors, and feel.",
  "negativeFragment": "What to explicitly avoid to maintain this style (e.g., 'photorealistic, 3D render, anime')"
}

Focus on the STYLE, not the content. I want to reproduce this visual style with completely different subject matter.`;
}

/**
 * Build a prompt to compare two styles and describe their differences.
 */
export function buildStyleComparisonPrompt(): string {
  return `Compare these two images' visual/artistic styles. For each, describe:
1. What makes the style distinctive
2. Key differences between them
3. Which elements from each could be combined

Return as JSON:
{
  "style1": { "distinctive": "...", "strengths": ["..."] },
  "style2": { "distinctive": "...", "strengths": ["..."] },
  "differences": ["key difference 1", "key difference 2"],
  "combinationIdeas": ["idea for merging elements"]
}`;
}

// -----------------------------------------------------------------------------
// Style Brainstorming
// -----------------------------------------------------------------------------

/**
 * Generate style brainstorm options from a base analysis.
 * Creates variations that maintain the core feel while exploring different approaches.
 */
export function generateStyleVariations(
  baseAnalysis: StyleAnalysis,
  count: number = 4
): StyleBrainstormOption[] {
  const variations: StyleBrainstormOption[] = [];

  // Variation strategies
  const strategies = [
    {
      name: 'Faithful',
      description: 'Closest to the reference style',
      modifier: '',
    },
    {
      name: 'Simplified',
      description: 'Same style but cleaner, more minimal',
      modifier: 'simplified, cleaner lines, reduced detail, bold shapes',
    },
    {
      name: 'Textured',
      description: 'Same style with more texture and painterly quality',
      modifier: 'more textured, visible brush strokes, painterly quality, rough paper texture',
    },
    {
      name: 'Cinematic',
      description: 'Same style with more dramatic lighting and depth',
      modifier: 'cinematic lighting, deeper shadows, atmospheric depth, film grain',
    },
    {
      name: 'Storybook',
      description: 'More traditional illustration book feel',
      modifier: 'storybook illustration, soft edges, vintage print quality, nostalgic',
    },
    {
      name: 'Graphic',
      description: 'Bolder, more graphic novel influenced',
      modifier: 'graphic novel style, high contrast, bold outlines, dynamic composition',
    },
    {
      name: 'Pastel',
      description: 'Softer, more muted color palette',
      modifier: 'pastel colors, soft focus, dreamy atmosphere, gentle light',
    },
    {
      name: 'Vibrant',
      description: 'Punched-up colors, more energy',
      modifier: 'vibrant saturated colors, high energy, bold palette, dynamic',
    },
  ];

  const selected = strategies.slice(0, count);

  for (let i = 0; i < selected.length; i++) {
    const strategy = selected[i];
    const prompt = strategy.modifier
      ? `${baseAnalysis.promptFragment}, ${strategy.modifier}`
      : baseAnalysis.promptFragment;

    variations.push({
      id: `style-option-${i + 1}`,
      name: strategy.name,
      description: strategy.description,
      analysis: {
        ...baseAnalysis,
        promptFragment: prompt,
      },
      previewPrompt: prompt,
    });
  }

  return variations;
}

// -----------------------------------------------------------------------------
// Style Bible Creation from Analysis
// -----------------------------------------------------------------------------

/**
 * Create a StyleBible from a style analysis.
 * This is used after the user approves a style during brainstorming.
 */
export function createStyleBibleFromAnalysis(
  name: string,
  analysis: StyleAnalysis,
  characters?: CharacterSheet[]
): StyleBible {
  return {
    id: `style-${Date.now()}`,
    name,
    artStyle: analysis.artStyle,
    colorPalette: {
      primary: analysis.colors.dominant,
      accent: analysis.colors.accent,
      mood: {
        default: [...analysis.colors.dominant, ...analysis.colors.accent],
      },
    },
    characters: characters || [],
    promptPrefix: analysis.promptFragment,
    promptSuffix: `Consistent ${analysis.artStyle} throughout. ${analysis.mood} tone.`,
    negativePrompt: analysis.negativeFragment,
    referenceImages: [],
    consistency: {
      environmentStyle: `${analysis.detailLevel} detail, ${analysis.composition}`,
      lightingStyle: analysis.lighting,
      lineWeight: `${analysis.lineWork.weight} ${analysis.lineWork.style} lines`,
    },
  };
}

/**
 * Merge multiple style analyses into a hybrid style.
 * Useful when the user likes elements from different references.
 */
export function mergeStyleAnalyses(
  analyses: StyleAnalysis[],
  weights?: number[]
): StyleAnalysis {
  if (analyses.length === 0) {
    throw new Error('Need at least one style analysis to merge');
  }
  if (analyses.length === 1) return analyses[0];

  // Default equal weights
  const w = weights || analyses.map(() => 1 / analyses.length);

  // Merge techniques (union)
  const allTechniques = new Set(analyses.flatMap((a) => a.techniques));

  // Merge colors (weighted selection)
  const allDominant = analyses.flatMap((a) => a.colors.dominant);
  const allAccent = analyses.flatMap((a) => a.colors.accent);

  // Combine prompt fragments
  const combinedPrompt = analyses
    .map((a, i) => {
      const weight = w[i];
      if (weight > 0.5) return a.promptFragment;
      // Extract key phrases for lower-weighted styles
      return a.promptFragment.split(',').slice(0, 3).join(',');
    })
    .join(', blended with ');

  // Take the negative from the primary style
  const primaryIdx = w.indexOf(Math.max(...w));

  return {
    artStyle: analyses.map((a) => a.artStyle).join(' blended with '),
    techniques: [...allTechniques],
    colors: {
      dominant: allDominant.slice(0, 5),
      accent: allAccent.slice(0, 3),
      mood: analyses[primaryIdx].colors.mood,
    },
    lineWork: analyses[primaryIdx].lineWork,
    lighting: analyses.map((a) => a.lighting).join(', with elements of '),
    texture: analyses[primaryIdx].texture,
    mood: analyses[primaryIdx].mood,
    composition: analyses[primaryIdx].composition,
    detailLevel: analyses[primaryIdx].detailLevel,
    influences: [...new Set(analyses.flatMap((a) => a.influences))],
    promptFragment: combinedPrompt,
    negativeFragment: analyses[primaryIdx].negativeFragment,
  };
}

// -----------------------------------------------------------------------------
// Preset Style Templates (Starting Points)
// -----------------------------------------------------------------------------

export const STYLE_PRESETS: Record<string, Partial<StyleAnalysis>> = {
  'watercolor-cartoon': {
    artStyle: 'warm watercolor cartoon illustration',
    techniques: ['watercolor wash', 'ink outlines', 'soft blending'],
    lineWork: { weight: 'medium', style: 'rough' },
    mood: 'warm and inviting',
    detailLevel: 'high',
    promptFragment:
      'warm watercolor cartoon illustration, rich textures, ink outlines, soft color washes, detailed backgrounds, expressive characters',
    negativeFragment: 'photorealistic, 3D render, anime, low quality',
  },
  'comic-book': {
    artStyle: 'bold comic book illustration',
    techniques: ['bold outlines', 'flat colors', 'halftone dots', 'dynamic angles'],
    lineWork: { weight: 'thick', style: 'clean' },
    mood: 'energetic and dynamic',
    detailLevel: 'moderate',
    promptFragment:
      'bold comic book illustration, thick black outlines, flat vibrant colors, halftone dot shading, dynamic composition, action-packed',
    negativeFragment: 'photorealistic, watercolor, soft, muted colors',
  },
  'studio-ghibli': {
    artStyle: 'Studio Ghibli inspired hand-painted animation',
    techniques: ['hand-painted', 'soft gradients', 'detailed nature', 'atmospheric perspective'],
    lineWork: { weight: 'thin', style: 'clean' },
    mood: 'magical and serene',
    detailLevel: 'high',
    promptFragment:
      'Studio Ghibli inspired, hand-painted animation cel, lush nature, soft lighting, detailed clouds and foliage, gentle color palette, magical atmosphere',
    negativeFragment: '3D render, harsh colors, dark, gritty',
  },
  'paper-cutout': {
    artStyle: 'layered paper cutout illustration',
    techniques: ['paper layers', 'soft shadows', 'geometric shapes', 'collage'],
    lineWork: { weight: 'medium', style: 'none' },
    mood: 'playful and crafty',
    detailLevel: 'moderate',
    promptFragment:
      'layered paper cutout illustration, soft drop shadows between layers, geometric shapes, textured paper, collage style, playful composition',
    negativeFragment: 'photorealistic, smooth gradients, anime, 3D render',
  },
  'retro-cartoon': {
    artStyle: '1960s retro cartoon illustration',
    techniques: ['limited palette', 'mid-century modern', 'geometric', 'screen print'],
    lineWork: { weight: 'variable', style: 'clean' },
    mood: 'nostalgic and cheerful',
    detailLevel: 'minimal',
    promptFragment:
      '1960s retro cartoon illustration, limited color palette, mid-century modern style, screen print texture, geometric shapes, vintage feel',
    negativeFragment: 'photorealistic, complex, dark, modern',
  },
  'pencil-sketch': {
    artStyle: 'detailed pencil sketch with subtle color',
    techniques: ['pencil hatching', 'light color wash', 'sketchy lines', 'paper texture'],
    lineWork: { weight: 'variable', style: 'sketchy' },
    mood: 'intimate and personal',
    detailLevel: 'high',
    promptFragment:
      'detailed pencil sketch illustration, subtle watercolor wash, visible pencil strokes, paper texture, intimate feeling, hand-drawn quality',
    negativeFragment: 'digital, clean lines, flat colors, photorealistic',
  },
};

// -----------------------------------------------------------------------------
// Brainstorm Session
// -----------------------------------------------------------------------------

export interface BrainstormSession {
  id: string;
  /** Reference images provided by the user */
  referenceImages: string[];
  /** Style analyses of each reference image */
  analyses: StyleAnalysis[];
  /** Generated style options */
  options: StyleBrainstormOption[];
  /** Which option was chosen (null if still brainstorming) */
  chosenOptionId: string | null;
  /** Final locked-in style bible (null until chosen) */
  finalStyleBible: StyleBible | null;
  createdAt: string;
}

/**
 * Start a new brainstorm session.
 */
export function createBrainstormSession(referenceImages: string[]): BrainstormSession {
  return {
    id: `brainstorm-${Date.now()}`,
    referenceImages,
    analyses: [],
    options: [],
    chosenOptionId: null,
    finalStyleBible: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Add a style analysis to the brainstorm session.
 * Called after a vision model analyzes a reference image.
 */
export function addAnalysis(
  session: BrainstormSession,
  analysis: StyleAnalysis
): BrainstormSession {
  return {
    ...session,
    analyses: [...session.analyses, analysis],
  };
}

/**
 * Generate options based on all analyses in the session.
 */
export function generateOptions(
  session: BrainstormSession,
  count: number = 4
): BrainstormSession {
  // If multiple analyses, create a merged base + individual options
  const baseAnalysis =
    session.analyses.length > 1
      ? mergeStyleAnalyses(session.analyses)
      : session.analyses[0];

  if (!baseAnalysis) return session;

  const options = generateStyleVariations(baseAnalysis, count);

  // Also add individual reference styles as options if there are multiple
  if (session.analyses.length > 1) {
    for (let i = 0; i < session.analyses.length; i++) {
      options.push({
        id: `style-ref-${i + 1}`,
        name: `Reference ${i + 1} Style`,
        description: `Based directly on reference image ${i + 1}`,
        analysis: session.analyses[i],
        previewPrompt: session.analyses[i].promptFragment,
      });
    }
  }

  return {
    ...session,
    options,
  };
}

/**
 * Lock in a chosen style and create the final style bible.
 */
export function chooseStyle(
  session: BrainstormSession,
  optionId: string,
  seriesName: string,
  characters?: CharacterSheet[]
): BrainstormSession {
  const option = session.options.find((o) => o.id === optionId);
  if (!option) throw new Error(`Option ${optionId} not found`);

  const styleBible = createStyleBibleFromAnalysis(
    seriesName,
    option.analysis,
    characters
  );

  return {
    ...session,
    chosenOptionId: optionId,
    finalStyleBible: styleBible,
  };
}
