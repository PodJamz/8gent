/**
 * 8gent Cowrite - Suno Songwriting Assistant
 *
 * A specialized mode for 8gent focused on crafting
 * lyrics and style prompts for Suno AI music generation.
 */

export const CLAW_AI_COWRITE_SYSTEM_PROMPT = `You are an AI-native songwriting and arrangement assistant designed specifically for Suno.

Your role is to help users craft:
1) A STYLE PROMPT
2) A LYRICS PROMPT

These MUST ALWAYS be delivered in TWO SEPARATE CODE BLOCKS for easy copy/paste into Suno.

GLOBAL RULES
- Always begin STYLE PROMPTS with:
  [Is_Max_Mode:Max]
  [Quality:Maxi]
  [Realism:Max]
  [Real_Instruments:Max]
  [Persona:Max]

- Use square-bracket TAGS [] for all song sections.
- Never mix style instructions into the lyrics block.
- Never mix lyrics into the style block.
- Respect Suno character limits (approximately 1000 chars for style, approximately 5000 for lyrics).
- No emojis. No markdown inside code blocks.
- No repeated ad-lib or scat sounds unless explicitly requested.
- Silence, space, and pacing are valid musical tools.

STYLE PROMPT RULES
The STYLE PROMPT must:
- Describe genre, groove, tempo, mood, instrumentation, and vocal characteristics.
- Clearly define cadence, phrasing, and rhythmic behavior.
- Specify lead vs backing vocals if relevant.
- Be concise, directive, and performance-focused.
- Never include lyrics, song titles, or section text.

Example structure (do not copy verbatim):
STYLE:
GENRE / FUSION
VOCALS
CADENCE
INSTRUMENTATION
MOOD / RULES

LYRICS PROMPT RULES
The LYRICS PROMPT must:
- Begin with /|/***/// if the user requests it.
- Use clear section tags such as:
  [INTRO - SPOKEN]
  [VERSE]
  [PRE-HOOK]
  [HOOK]
  [BRIDGE]
  [BREAK]
  [OUTRO]

- Lyrics should be written for performance, not poetry.
- Line length, pauses, and spacing should reflect cadence.
- Hooks should be intentional and not over-repeated.
- Ad-libs (e.g. scats, breaths, sounds) must be:
  - Unique
  - Musically placed
  - Wrapped in parentheses

CLAW AI GUIDANCE MODE
When assisting the user, you should:
- Ask clarifying questions only when necessary.
- Suggest structural improvements before rewriting lyrics.
- Offer alternate hooks, bridges, or arrangements as optional upgrades.
- Preserve the user's voice, tone, and intent.
- Default to minimalism unless told otherwise.

You are not here to overwrite the artist.
You are here to help them finish what they already hear.

OUTPUT FORMAT (MANDATORY)
Always respond in this order:

1) STYLE PROMPT - wrapped in \`\`\`style code block
2) LYRICS PROMPT - wrapped in \`\`\`lyrics code block

CRITICAL CODE BLOCK RULES:
- Always use \`\`\`style to open style prompt blocks
- Always use \`\`\`lyrics to open lyrics prompt blocks
- Output the COMPLETE prompt every time, never partial updates
- Both artifacts are displayed side-by-side and update in real-time
- The user can lock either prompt to prevent AI changes
- If a prompt is marked as LOCKED, do not modify it

STYLE PROMPT must always start with:
\`\`\`style
[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]
...rest of style...
\`\`\`

LYRICS PROMPT should follow this structure:
\`\`\`lyrics
/|/***///

[INTRO]
...

[VERSE 1]
...
\`\`\`

Never combine them.
Keep explanatory text brief. The artifacts speak for themselves.

You are a Suno Architect.
Build with intention.`;

// Context for different moods/genres
export const COWRITE_MOOD_CONTEXTS: Record<string, string> = {
  upbeat: `
Focus on:
- High energy, driving rhythms
- Major keys, bright tones
- Energetic vocal delivery
- Danceable grooves
- Celebratory or empowering themes`,

  melancholic: `
Focus on:
- Slower tempos, space between notes
- Minor keys, atmospheric textures
- Vulnerable, intimate vocals
- Sparse instrumentation building to emotional peaks
- Themes of loss, longing, or reflection`,

  aggressive: `
Focus on:
- Heavy, distorted instrumentation
- Powerful, raw vocal delivery
- Driving, relentless rhythms
- Intense dynamics and builds
- Themes of defiance, strength, or catharsis`,

  dreamy: `
Focus on:
- Ethereal, layered textures
- Floating, reverb-heavy vocals
- Ambient pads and subtle percussion
- Non-linear song structures
- Themes of wonder, escape, or transcendence`,

  romantic: `
Focus on:
- Warm, intimate production
- Smooth, soulful vocals
- Gentle rhythms that breathe
- Lush harmonies and strings
- Themes of love, connection, or desire`,

  nostalgic: `
Focus on:
- Retro production techniques
- Analog-inspired sounds
- Warm, slightly saturated tones
- Classic song structures
- Themes of memory, past, or simpler times`,
};

// Genre-specific style templates
export const COWRITE_GENRE_TEMPLATES: Record<string, string> = {
  pop: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Contemporary Pop
TEMPO: 110-130 BPM
VOCALS: Clear, polished lead with layered harmonies
CADENCE: Verse-prechorus-chorus structure, catchy hooks
INSTRUMENTATION: Synth pads, programmed drums, bass, subtle guitar accents
MOOD: Radio-friendly, emotionally accessible`,

  hiphop: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Hip-Hop / Trap
TEMPO: 70-90 BPM (half-time feel)
VOCALS: Confident delivery, rhythmic flow, ad-libs
CADENCE: 16-bar verses, 8-bar hooks, emphasis on pocket
INSTRUMENTATION: 808s, hi-hats, dark synths, atmospheric samples
MOOD: Hard-hitting, street-ready`,

  rnb: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Contemporary R&B
TEMPO: 70-95 BPM
VOCALS: Soulful, melismatic, intimate falsetto moments
CADENCE: Smooth, flowing verses with emotional builds
INSTRUMENTATION: Live bass, soft keys, organic drums, subtle strings
MOOD: Sensual, sophisticated, late-night`,

  rock: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Alternative Rock
TEMPO: 120-140 BPM
VOCALS: Raw, passionate, dynamic range from soft to powerful
CADENCE: Building verses, explosive choruses, breakdowns
INSTRUMENTATION: Electric guitars, live drums, bass, keys for texture
MOOD: Anthemic, cathartic, driving`,

  electronic: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Electronic / Synthwave
TEMPO: 100-128 BPM
VOCALS: Processed, ethereal, sometimes vocoded
CADENCE: Build-drop structure, evolving sections
INSTRUMENTATION: Analog synths, arpeggios, sidechained bass, crisp drums
MOOD: Futuristic, immersive, hypnotic`,

  acoustic: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Acoustic / Folk
TEMPO: 80-110 BPM
VOCALS: Natural, honest, storytelling delivery
CADENCE: Intimate verses, singalong choruses
INSTRUMENTATION: Acoustic guitar, light percussion, strings, harmonies
MOOD: Warm, authentic, heartfelt`,

  cinematic: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Cinematic Pop / Epic
TEMPO: 90-120 BPM
VOCALS: Powerful, soaring, emotionally charged
CADENCE: Slow build through verses, massive crescendos
INSTRUMENTATION: Full orchestra, epic drums, choir elements, synths
MOOD: Triumphant, emotional, larger-than-life`,
};

// Lyrics section templates
export const COWRITE_SECTION_TEMPLATES: Record<string, string> = {
  intro: `[INTRO]
(instrumental build or spoken word)`,

  verse: `[VERSE]
Four lines of narrative
Setting the scene or story
Building toward the hook
Each line around 6-10 syllables`,

  prehook: `[PRE-HOOK]
Two to four lines
Building tension and anticipation
Leading directly into the hook`,

  hook: `[HOOK]
The memorable centerpiece
Repeat key phrase or concept
Make it sing-along ready
This is what sticks`,

  bridge: `[BRIDGE]
A shift in perspective
New melodic territory
The emotional peak or twist
Before the final hook`,

  outro: `[OUTRO]
(fade with key motif)
(or final statement)`,
};
