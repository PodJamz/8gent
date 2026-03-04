// =============================================================================
// Style Bible - Consistent Cartoon Style Management
// =============================================================================
// Maintains visual consistency across all generated clips in an episode series.
// Manages character sheets, color palettes, art direction, and prompt generation.
// =============================================================================

import type { StyleBible, CharacterSheet, Scene } from './types';

// -----------------------------------------------------------------------------
// Example Style Bible: Dad & Lad (Reference Only)
// -----------------------------------------------------------------------------
// This is an EXAMPLE, not a default. Every new series should start with a
// style brainstorm session (see style-analyzer.ts) where the user provides
// reference images, analyzes styles with vision models, generates variations,
// and locks in their chosen look. Never assume a style - always brainstorm first.
// -----------------------------------------------------------------------------

/**
 * Example style bible based on initial concept illustrations.
 * Use createStyleBibleFromAnalysis() or the brainstorm workflow
 * to create the actual style bible for each project.
 */
export const EXAMPLE_DAD_AND_LAD_STYLE: StyleBible = {
  id: 'dad-and-lad-v1',
  name: 'Dad & Lad',
  artStyle:
    'warm detailed watercolor-style cartoon illustration, rich textures, expressive characters, slightly rough ink lines, children\'s storybook quality with adult sophistication',

  colorPalette: {
    primary: ['#4A7C59', '#8B6914', '#2C5F7C', '#5B4A3F'],
    accent: ['#E87040', '#FFD700', '#6BBF59', '#4ECDC4'],
    mood: {
      playful: ['#FFD700', '#E87040', '#6BBF59', '#87CEEB'],
      tender: ['#F5E6CC', '#D4A574', '#8B7355', '#C4A882'],
      adventurous: ['#2C5F7C', '#4A7C59', '#E87040', '#FFD700'],
      cozy: ['#8B6914', '#5B4A3F', '#D4A574', '#F5E6CC'],
      chaotic: ['#E87040', '#FF4757', '#FFD700', '#6BBF59'],
      magical: ['#7B68EE', '#4ECDC4', '#FFD700', '#E87040'],
    },
  },

  characters: [
    {
      name: 'Dad',
      description:
        'Mid-30s man with warm, expressive face. Messy tousled brown hair. Light stubble. Big genuine smile with visible teeth. Athletic but approachable build.',
      distinguishingFeatures: [
        'messy tousled brown hair',
        'light stubble / scruffy beard',
        'blue zip-up hoodie over grey t-shirt',
        'warm brown eyes',
        'big open-mouth laugh',
        'slightly wind-swept look',
      ],
      expressions: {
        happy: 'big wide open-mouth smile, eyes crinkled, radiating warmth',
        excited: 'mouth open in delighted surprise, eyebrows raised, leaning forward',
        tender: 'soft closed-mouth smile, eyes gentle, head slightly tilted',
        thinking: 'slight smile, one eyebrow raised, hand on chin',
        laughing: 'head thrown back, mouth wide open, eyes squeezed shut',
      },
      referenceImages: [],
      promptFragment:
        'a man in his mid-30s with messy tousled brown hair, light stubble, wearing a blue zip-up hoodie over grey t-shirt, warm expressive face',
    },
    {
      name: 'Son (Nolan)',
      description:
        'Young boy (around 4-5 years old) with curly brown hair and freckles. Always wearing oversized green headphones. Huge expressive dark eyes. Boundless energy.',
      distinguishingFeatures: [
        'curly/wavy brown hair',
        'oversized bright green headphones',
        'freckles across nose and cheeks',
        'big dark expressive eyes',
        'small gap in front teeth when smiling',
        'often wearing blue or green jacket',
      ],
      expressions: {
        happy: 'huge beaming smile showing teeth gap, eyes sparkling, bouncing energy',
        excited: 'mouth open wide, arms raised or pointing, whole body leaning forward',
        curious: 'eyes wide, head tilted, one hand reaching out to touch',
        laughing: 'head tilted back, mouth wide open, squeezing eyes shut',
        content: 'soft smile, headphones on, swaying gently to music',
      },
      referenceImages: [],
      promptFragment:
        'a young boy around 4-5 years old with curly brown hair, freckles, wearing oversized bright green headphones, big dark expressive eyes',
    },
  ],

  promptPrefix:
    'Warm detailed watercolor-style cartoon illustration, children\'s storybook quality with rich textures and expressive characters. Slightly rough ink outlines. Warm golden-hour lighting. Detailed lush background.',

  promptSuffix:
    'Consistent art style, warm color palette with earth tones and green accents, emotionally expressive faces, rich environmental detail, playful and heartwarming tone.',

  negativePrompt:
    'photorealistic, 3D render, anime, manga, pixel art, low quality, blurry, distorted faces, uncanny valley, dark or scary, violent, inappropriate',

  referenceImages: [],

  consistency: {
    environmentStyle:
      'rich detailed backgrounds with nature elements, toys, and whimsical details. Hidden creatures and objects that reward close looking.',
    lightingStyle:
      'warm golden-hour feel, soft shadows, occasional dappled light through trees or windows',
    lineWeight:
      'medium-weight slightly rough ink lines, thicker for character outlines, thinner for background details',
  },
};

// -----------------------------------------------------------------------------
// Prompt Building
// -----------------------------------------------------------------------------

/**
 * Build a complete generation prompt for a scene.
 * Combines the style bible with scene-specific details.
 */
export function buildScenePrompt(
  styleBible: StyleBible,
  scene: Scene,
  options?: {
    /** Override characters to include */
    characters?: string[];
    /** Additional style modifiers */
    modifiers?: string[];
    /** Whether this is for video (motion) or still image */
    isVideo?: boolean;
  }
): string {
  const parts: string[] = [];

  // Style prefix
  parts.push(styleBible.promptPrefix);

  // Characters in this scene
  const charactersToInclude = options?.characters || styleBible.characters.map((c) => c.name);
  for (const charName of charactersToInclude) {
    const char = styleBible.characters.find((c) => c.name === charName);
    if (char) {
      parts.push(char.promptFragment);
      // Add expression if emotion matches
      const expression = char.expressions[scene.emotion];
      if (expression) {
        parts.push(`${char.name.split(' ')[0]} is ${expression}`);
      }
    }
  }

  // Scene description
  parts.push(scene.description);

  // Mood colors
  const moodColors = styleBible.colorPalette.mood[scene.emotion];
  if (moodColors) {
    parts.push(`Color palette emphasizing ${moodColors.join(', ')}`);
  }

  // Video-specific additions
  if (options?.isVideo) {
    parts.push('Smooth natural motion, consistent character appearance throughout');
  }

  // Additional modifiers
  if (options?.modifiers) {
    parts.push(...options.modifiers);
  }

  // Style suffix
  parts.push(styleBible.promptSuffix);

  return parts.join('. ');
}

/**
 * Build a negative prompt from the style bible.
 */
export function buildNegativePrompt(styleBible: StyleBible): string {
  return styleBible.negativePrompt;
}

/**
 * Build a character reference prompt for consistent character generation.
 * Useful for IP-Adapter or character-reference workflows.
 */
export function buildCharacterPrompt(
  character: CharacterSheet,
  expression?: string
): string {
  const parts = [character.promptFragment];

  if (expression && character.expressions[expression]) {
    parts.push(character.expressions[expression]);
  }

  parts.push(character.distinguishingFeatures.join(', '));

  return parts.join('. ');
}

// -----------------------------------------------------------------------------
// Style Bible Management
// -----------------------------------------------------------------------------

/**
 * Create a new style bible from a description.
 * Can be used by 8gent to set up a new series.
 */
export function createStyleBible(params: {
  name: string;
  artStyle: string;
  characters: CharacterSheet[];
  colorPalette?: StyleBible['colorPalette'];
}): StyleBible {
  return {
    id: `style-${Date.now()}`,
    name: params.name,
    artStyle: params.artStyle,
    colorPalette: params.colorPalette || {
      primary: [],
      accent: [],
      mood: {},
    },
    characters: params.characters,
    promptPrefix: params.artStyle,
    promptSuffix: 'Consistent art style throughout.',
    negativePrompt: 'photorealistic, 3D render, low quality, blurry, distorted',
    referenceImages: [],
    consistency: {
      environmentStyle: '',
      lightingStyle: '',
      lineWeight: '',
    },
  };
}

/**
 * Add a character to an existing style bible.
 */
export function addCharacter(
  styleBible: StyleBible,
  character: CharacterSheet
): StyleBible {
  return {
    ...styleBible,
    characters: [...styleBible.characters, character],
  };
}

/**
 * Update a character in the style bible.
 */
export function updateCharacter(
  styleBible: StyleBible,
  name: string,
  updates: Partial<CharacterSheet>
): StyleBible {
  return {
    ...styleBible,
    characters: styleBible.characters.map((c) =>
      c.name === name ? { ...c, ...updates } : c
    ),
  };
}

/**
 * Get prompt fragments for all characters, useful for batch generation.
 */
export function getAllCharacterPrompts(styleBible: StyleBible): Record<string, string> {
  const prompts: Record<string, string> = {};
  for (const char of styleBible.characters) {
    prompts[char.name] = char.promptFragment;
  }
  return prompts;
}
