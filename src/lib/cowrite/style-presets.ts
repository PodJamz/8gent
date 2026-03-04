// ============================================================================
// CoWrite Style Presets Library v2
// 12 Suno-ready presets - MAX MODE auto-applied
// ============================================================================

export interface StylePreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  content: string;
}

// ============================================================================
// MAX MODE HEADER - Auto-applied to all style prompts
// ============================================================================

export const MAX_MODE_HEADER = `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]`;

// Helper to apply MAX MODE to any style content
export function applyMaxMode(content: string): string {
  if (content.includes('[Is_Max_Mode:Max]')) {
    return content;
  }
  return `${MAX_MODE_HEADER}\n\n${content}`;
}

// ============================================================================
// STYLE PRESETS (12 Suno-ready presets)
// ============================================================================

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'wild-cadence-neo-soul',
    name: 'Wild Cadence / Neo-Soul Hybrid',
    emoji: '⚡',
    description: 'Percussive sing-talk with elastic, jittery rhythm',
    content: `Male Irish lead. Close-mic. Percussive sing-talk with elastic, jittery rhythm. Voice as drum. Crisp consonants, clipped endings, minimal vibrato. Off-kilter push-pull timing, micro-pauses, sudden stops. Neo-soul with Brazilian rhythmic undercurrent. Minimal groove, space-forward. Calm surface, simmering bite. Slight swagger. No belting.`,
  },
  {
    id: 'brazilian-retro-soul',
    name: 'Brazilian Retro-Soul',
    emoji: '🌃',
    description: 'Late night Rio, smoky baritone, intimate storytelling',
    content: `Male deep baritone. Smoky, warm, gravelly. Conversational phrasing. Afro-Brazilian groove with semba swing, thumb bass, rim clicks, pandeiro. Rhodes, muted trumpet, bari sax stabs. Small-room warmth. Loose but intentional. Intimate storytelling.`,
  },
  {
    id: 'irish-neo-soul',
    name: 'Irish Neo-Soul Storyteller',
    emoji: '🍀',
    description: 'Reflective, grounded, talking truth quietly',
    content: `Male Irish lead, reflective and grounded. Clear diction, emotional restraint. Neo-soul with subtle folk undertones. Guitar-led, warm bass, brushed drums. Melodic but understated. Feels like talking truth quietly rather than performing.`,
  },
  {
    id: 'abstract-spoken-melody',
    name: 'Abstract Spoken-Melody',
    emoji: '🌀',
    description: 'Future monologue, philosophical, no hooks',
    content: `Male lead. Rhythmic speak-sing, half-spoken melody. Sparse production, negative space. Tempo slow-mid. Voice front and center. Philosophical, observational tone. No hooks, evolving flow. Minimal harmony, maximum intention.`,
  },
  {
    id: 'scatter-swagger',
    name: 'Scatter Swagger',
    emoji: '🎤',
    description: 'Playful syncopated flow, humor baked in',
    content: `Male lead with playful confidence. Syncopated rap-adjacent flow, unpredictable phrasing, humor baked in. Quick pivots, internal rhymes, conversational asides. Funk-leaning beat. Light bravado without aggression.`,
  },
  {
    id: 'minimal-funk',
    name: 'Minimal Funk / Pocket Discipline',
    emoji: '🎸',
    description: 'Tight pocket, groove does the talking',
    content: `Male baritone. Tight pocket, behind-the-beat delivery. Funk bass, clean guitar, minimal drums. Short phrases, restraint over flash. Groove does the talking. Repetition used as power.`,
  },
  {
    id: 'afro-soul-introspection',
    name: 'Afro-Soul Introspection',
    emoji: '🌍',
    description: 'Warm, introspective, mantra-like hooks',
    content: `Male lead, warm and introspective. Afro-influenced rhythms, rolling percussion, gentle syncopation. Emotional clarity without melodrama. Hooks are subtle, mantra-like. Organic and grounded.`,
  },
  {
    id: 'cinematic-inner-dialogue',
    name: 'Cinematic Inner Dialogue',
    emoji: '🎬',
    description: 'Slow build, internal narration, emotional payoff',
    content: `Male lead, intimate and restrained. Slow build, cinematic chords, low drums. Lyrics feel like internal narration. Sparse verses, swelling sections, emotional payoff without climax shouting.`,
  },
  {
    id: 'lofi-soul-confessional',
    name: 'Lo-Fi Soul Confessional',
    emoji: '💔',
    description: 'Close and imperfect, vulnerability as texture',
    content: `Male lead, close and imperfect. Slight grit, breath audible. Lo-fi textures, soft keys, vinyl warmth. Conversational melodies. Vulnerability as texture, not drama.`,
  },
  {
    id: 'modern-poet',
    name: 'Modern Poet / Beat-First',
    emoji: '📝',
    description: 'Voice as rhythm instrument, intelligent feel',
    content: `Male lead. Voice treated as rhythm instrument first, melody second. Short lines, clipped phrases. Experimental groove. Silence used deliberately. Intelligent, contemporary feel.`,
  },
  {
    id: 'warm-affirmation',
    name: 'Warm Affirmation Groove',
    emoji: '☀️',
    description: 'Reassuring, comforting, understated optimism',
    content: `Male lead, reassuring tone. Mid-tempo soul groove. Simple, repetitive lyrical structure. Comforting energy, understated optimism. Feels like someone steadying you rather than hyping you.`,
  },
  {
    id: 'tech-poetry-os',
    name: 'Experimental OS / Tech-Poetry',
    emoji: '💻',
    description: 'Abstract futuristic, glitch-adjacent but musical',
    content: `Male lead. Abstract, futuristic lyrical themes. Rhythmic spoken melody. Glitch-adjacent but musical. Clean low-end, minimal synths, mechanical pulse softened by soul phrasing.`,
  },
];

// Helper to get preset by ID
export function getPresetById(id: string): StylePreset | undefined {
  return STYLE_PRESETS.find((p) => p.id === id);
}

// Default preset (blank canvas)
export const BLANK_STYLE_PRESET: StylePreset = {
  id: 'blank',
  name: 'Blank Canvas',
  emoji: '📝',
  description: 'Start from scratch',
  content: `Male lead. [Describe voice qualities]

[Describe groove/instrumentation]

[Describe mood/feel]`,
};

// Get preset with MAX MODE applied
export function getPresetWithMaxMode(preset: StylePreset): string {
  return applyMaxMode(preset.content);
}
