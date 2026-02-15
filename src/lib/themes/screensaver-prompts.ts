/**
 * Screensaver Prompt Templates
 *
 * Each theme has a unique DALL-E prompt that captures its aesthetic.
 * Prompts incorporate the theme's color palette and visual style.
 */

export interface ThemeScreensaverConfig {
  name: string;
  label: string;
  category: 'retro' | 'cosmic' | 'nature' | 'minimal' | 'bold' | 'warm' | 'dark' | 'brand';
  prompt: string;
  colorPalette: string; // Description of colors for the prompt
}

export const THEME_SCREENSAVER_CONFIGS: Record<string, ThemeScreensaverConfig> = {
  // =========================================================================
  // RETRO / VINTAGE
  // =========================================================================
  'kodachrome': {
    name: 'kodachrome',
    label: 'Kodachrome',
    category: 'retro',
    colorPalette: 'warm terracotta, coral pink, dusty orange, faded cream',
    prompt: '1970s retro collage aesthetic screensaver. Desert landscape with cacti silhouettes, surreal iridescent soap bubble floating in center reflecting prismatic rainbow light. Faded Kodachrome film grain texture, warm vintage color palette with coral pink and burnt orange sunset sky. Dreamy nostalgic psychedelic vibes. Vertical phone wallpaper.',
  },
  'vintage-paper': {
    name: 'vintage-paper',
    label: 'Vintage Paper',
    category: 'warm',
    colorPalette: 'aged cream, sepia, soft brown, muted gold',
    prompt: 'Vintage paper texture aesthetic screensaver. Old manuscript pages layered with botanical sketches, faded ink drawings of leaves and flowers. Aged parchment cream tones, sepia accents, soft brown edges. Warm afternoon light, scholarly nostalgic atmosphere. Vertical phone wallpaper.',
  },
  'retro-arcade': {
    name: 'retro-arcade',
    label: 'Retro Arcade',
    category: 'retro',
    colorPalette: 'neon pink, electric blue, purple, black',
    prompt: '1980s retro arcade aesthetic screensaver. Neon grid horizon with glowing wireframe mountains, pixel art stars, scanline effects. Electric pink and cyan neon lights against deep purple and black. CRT monitor glow, synthwave vibes. Vertical phone wallpaper.',
  },
  'doom-64': {
    name: 'doom-64',
    label: 'Doom 64',
    category: 'dark',
    colorPalette: 'blood red, dark brown, sickly green, black',
    prompt: 'Dark gothic video game aesthetic screensaver. Ancient stone corridors with flickering torchlight, demonic runes glowing on walls. Blood red and sickly green accents against deep shadows. Pixelated texture overlay, ominous atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // COSMIC / SPACE
  // =========================================================================
  'cosmic-night': {
    name: 'cosmic-night',
    label: 'Cosmic Night',
    category: 'cosmic',
    colorPalette: 'deep indigo, violet, silver, soft white',
    prompt: 'Cosmic night sky aesthetic screensaver. Deep space nebula with swirling indigo and violet clouds, scattered silver stars, distant galaxies. Subtle aurora wisps, dreamy ethereal atmosphere. Soft gradients from deep purple to midnight blue. Vertical phone wallpaper.',
  },
  'starry-night': {
    name: 'starry-night',
    label: 'Starry Night',
    category: 'cosmic',
    colorPalette: 'deep blue, swirling gold, luminous white, navy',
    prompt: 'Van Gogh inspired starry night aesthetic screensaver. Swirling night sky with luminous golden stars, deep blue and navy gradients, expressive brushstroke texture. Rolling hills silhouette, dreamy post-impressionist atmosphere. Vertical phone wallpaper.',
  },
  'northern-lights': {
    name: 'northern-lights',
    label: 'Northern Lights',
    category: 'cosmic',
    colorPalette: 'aurora green, electric teal, violet, deep navy',
    prompt: 'Aurora borealis aesthetic screensaver. Northern lights dancing across arctic night sky, vibrant green and teal curtains of light, hints of violet. Snowy mountain silhouettes, starfield backdrop. Ethereal magical atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // NATURE / ORGANIC
  // =========================================================================
  'kodama-grove': {
    name: 'kodama-grove',
    label: 'Kodama Grove',
    category: 'nature',
    colorPalette: 'forest green, moss, soft white, muted brown',
    prompt: 'Mystical forest aesthetic screensaver. Ancient grove with towering moss-covered trees, soft white kodama spirits floating between branches. Dappled sunlight filtering through canopy, forest green and soft earth tones. Studio Ghibli inspired atmosphere. Vertical phone wallpaper.',
  },
  'sage-garden': {
    name: 'sage-garden',
    label: 'Sage Garden',
    category: 'nature',
    colorPalette: 'sage green, cream, soft terracotta, muted gold',
    prompt: 'Peaceful garden aesthetic screensaver. Mediterranean herb garden with sage bushes, terracotta pots, olive branches. Soft morning light, muted greens and warm cream tones. Rustic tranquil atmosphere. Vertical phone wallpaper.',
  },
  'ocean-breeze': {
    name: 'ocean-breeze',
    label: 'Ocean Breeze',
    category: 'nature',
    colorPalette: 'turquoise, seafoam, soft white, sand',
    prompt: 'Coastal ocean aesthetic screensaver. Gentle turquoise waves breaking on sandy shore, seafoam patterns, distant horizon. Soft morning light, calming blue-green palette. Serene peaceful atmosphere. Vertical phone wallpaper.',
  },
  'nature': {
    name: 'nature',
    label: 'Nature',
    category: 'nature',
    colorPalette: 'leaf green, sky blue, earth brown, soft white',
    prompt: 'Natural landscape aesthetic screensaver. Rolling green hills under soft blue sky, wildflowers in meadow, distant forest edge. Golden hour light, fresh and vibrant earth tones. Peaceful countryside atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // MINIMAL / CLEAN
  // =========================================================================
  'clean-slate': {
    name: 'clean-slate',
    label: 'Clean Slate',
    category: 'minimal',
    colorPalette: 'pure white, light gray, subtle blue tint',
    prompt: 'Minimalist clean aesthetic screensaver. Abstract soft gradients from pure white to pale gray, subtle geometric shapes barely visible. Clean lines, lots of negative space. Calm serene atmosphere. Vertical phone wallpaper.',
  },
  'modern-minimal': {
    name: 'modern-minimal',
    label: 'Modern Minimal',
    category: 'minimal',
    colorPalette: 'off-white, charcoal, single accent line',
    prompt: 'Modern minimalist aesthetic screensaver. Stark composition with off-white background, single thin charcoal line creating subtle geometric form. Architectural precision, maximum negative space. Contemporary gallery atmosphere. Vertical phone wallpaper.',
  },
  'utilitarian': {
    name: 'utilitarian',
    label: 'Utilitarian',
    category: 'minimal',
    colorPalette: 'concrete gray, industrial white, muted blue',
    prompt: 'Industrial utilitarian aesthetic screensaver. Concrete texture background with subtle grid pattern, muted blue-gray tones. Functional minimalism, clean geometric forms. Understated practical atmosphere. Vertical phone wallpaper.',
  },
  'notebook': {
    name: 'notebook',
    label: 'Notebook',
    category: 'warm',
    colorPalette: 'cream paper, light blue lines, soft pencil gray',
    prompt: 'Notebook paper aesthetic screensaver. Cream colored lined paper texture, faint blue horizontal lines, red margin line. Soft pencil sketches of mathematical equations and small doodles. Academic nostalgic atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // BOLD / VIVID
  // =========================================================================
  'cyberpunk': {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    category: 'bold',
    colorPalette: 'neon magenta, electric cyan, deep purple, black',
    prompt: 'Cyberpunk neon city aesthetic screensaver. Rain-slicked streets reflecting neon signs, holographic advertisements, towering dark buildings. Vibrant magenta and cyan against deep purple shadows. Blade Runner atmosphere. Vertical phone wallpaper.',
  },
  'neo-brutalism': {
    name: 'neo-brutalism',
    label: 'Neo Brutalism',
    category: 'bold',
    colorPalette: 'stark white, bold black, bright yellow accent',
    prompt: 'Neo brutalist design aesthetic screensaver. Bold geometric shapes with thick black outlines, stark white background, bright yellow accent block. Raw unpolished edges, intentional visual weight. Graphic design rebellion atmosphere. Vertical phone wallpaper.',
  },
  'candyland': {
    name: 'candyland',
    label: 'Candyland',
    category: 'bold',
    colorPalette: 'bubblegum pink, mint green, lavender, sunny yellow',
    prompt: 'Playful candyland aesthetic screensaver. Pastel dreamscape with floating candy shapes, bubblegum pink clouds, mint green hills. Cheerful kawaii vibes, soft rounded forms. Whimsical joyful atmosphere. Vertical phone wallpaper.',
  },
  'bold-tech': {
    name: 'bold-tech',
    label: 'Bold Tech',
    category: 'bold',
    colorPalette: 'electric blue, bright orange, stark black, white',
    prompt: 'Bold tech startup aesthetic screensaver. Abstract data visualization with flowing electric blue lines, bright orange accent nodes. Dynamic movement, dark background. Innovative futuristic atmosphere. Vertical phone wallpaper.',
  },
  'soft-pop': {
    name: 'soft-pop',
    label: 'Soft Pop',
    category: 'bold',
    colorPalette: 'coral, lavender, soft teal, cream',
    prompt: 'Soft pop art aesthetic screensaver. Rounded abstract shapes in coral and lavender, floating on cream background. Playful organic forms, gentle gradients. Contemporary cheerful atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // WARM / COZY
  // =========================================================================
  'caffeine': {
    name: 'caffeine',
    label: 'Caffeine',
    category: 'warm',
    colorPalette: 'espresso brown, cream, warm tan, copper',
    prompt: 'Coffee shop aesthetic screensaver. Steaming espresso cup with latte art swirls, warm brown and cream tones, copper accents. Morning light through window, cozy cafe atmosphere. Vertical phone wallpaper.',
  },
  'mocha-mousse': {
    name: 'mocha-mousse',
    label: 'Mocha Mousse',
    category: 'warm',
    colorPalette: 'chocolate brown, dusty rose, cream, caramel',
    prompt: 'Mocha mousse dessert aesthetic screensaver. Soft swirling chocolate and dusty rose gradients, creamy textures, caramel highlights. Indulgent warmth, velvety smooth atmosphere. Vertical phone wallpaper.',
  },
  'sunset-horizon': {
    name: 'sunset-horizon',
    label: 'Sunset Horizon',
    category: 'warm',
    colorPalette: 'burnt orange, coral, warm pink, deep purple',
    prompt: 'Sunset horizon aesthetic screensaver. Dramatic sky gradients from burnt orange through coral to warm pink, silhouette of distant mountains. Golden hour warmth, contemplative peaceful atmosphere. Vertical phone wallpaper.',
  },
  'solar-dusk': {
    name: 'solar-dusk',
    label: 'Solar Dusk',
    category: 'warm',
    colorPalette: 'amber, deep orange, warm red, dusty purple',
    prompt: 'Solar dusk aesthetic screensaver. Sun setting behind desert mesas, amber and deep orange sky fading to dusty purple. Warm red rock formations, peaceful end of day atmosphere. Vertical phone wallpaper.',
  },
  'amber-minimal': {
    name: 'amber-minimal',
    label: 'Amber Minimal',
    category: 'warm',
    colorPalette: 'warm amber, soft cream, light brown',
    prompt: 'Amber minimalist aesthetic screensaver. Soft amber gradient background with subtle organic curves, warm cream tones. Simple elegant forms, gentle warmth. Calm sophisticated atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // DARK / MOODY
  // =========================================================================
  'midnight-bloom': {
    name: 'midnight-bloom',
    label: 'Midnight Bloom',
    category: 'dark',
    colorPalette: 'deep navy, dusty pink, dark teal, charcoal',
    prompt: 'Midnight bloom aesthetic screensaver. Dark botanical illustration with flowers blooming in deep navy background, dusty pink petals, dark teal leaves. Moody romantic atmosphere, subtle luminescence. Vertical phone wallpaper.',
  },
  'perpetuity': {
    name: 'perpetuity',
    label: 'Perpetuity',
    category: 'dark',
    colorPalette: 'obsidian black, silver, deep charcoal, soft white',
    prompt: 'Perpetuity dark aesthetic screensaver. Infinite void with subtle silver starfield, deep charcoal gradients fading to obsidian black. Mysterious eternal atmosphere, elegant darkness. Vertical phone wallpaper.',
  },

  // =========================================================================
  // ELEGANT / LUXURY
  // =========================================================================
  'elegant-luxury': {
    name: 'elegant-luxury',
    label: 'Elegant Luxury',
    category: 'warm',
    colorPalette: 'champagne gold, deep burgundy, cream, black',
    prompt: 'Elegant luxury aesthetic screensaver. Art deco inspired patterns in champagne gold on deep burgundy, marble textures, cream accents. Sophisticated opulence, high-end atmosphere. Vertical phone wallpaper.',
  },
  'quantum-rose': {
    name: 'quantum-rose',
    label: 'Quantum Rose',
    category: 'bold',
    colorPalette: 'rose gold, deep magenta, soft blush, platinum',
    prompt: 'Quantum rose aesthetic screensaver. Abstract quantum particle trails in rose gold and magenta, soft blush gradients, platinum highlights. Futuristic elegance, ethereal energy atmosphere. Vertical phone wallpaper.',
  },
  'violet-bloom': {
    name: 'violet-bloom',
    label: 'Violet Bloom',
    category: 'bold',
    colorPalette: 'deep violet, soft lavender, pale pink, silver',
    prompt: 'Violet bloom aesthetic screensaver. Lush violet flowers with soft lavender petals, pale pink highlights, silver dewdrops. Rich purple gradients, romantic garden atmosphere. Vertical phone wallpaper.',
  },
  'amethyst-haze': {
    name: 'amethyst-haze',
    label: 'Amethyst Haze',
    category: 'cosmic',
    colorPalette: 'amethyst purple, soft lilac, misty gray, silver',
    prompt: 'Amethyst haze aesthetic screensaver. Misty purple dreamscape with amethyst crystal formations, soft lilac fog, silver light rays. Mystical ethereal atmosphere. Vertical phone wallpaper.',
  },
  'pastel-dreams': {
    name: 'pastel-dreams',
    label: 'Pastel Dreams',
    category: 'bold',
    colorPalette: 'soft pink, baby blue, mint, lavender',
    prompt: 'Pastel dreams aesthetic screensaver. Soft gradient clouds in baby pink, soft blue, mint green, and lavender. Dreamy cotton candy sky, gentle floating shapes. Whimsical peaceful atmosphere. Vertical phone wallpaper.',
  },

  // =========================================================================
  // BRAND THEMES
  // =========================================================================
  'claude': {
    name: 'claude',
    label: 'Claude',
    category: 'warm',
    colorPalette: 'warm terracotta, soft cream, subtle orange',
    prompt: 'Claude AI aesthetic screensaver. Warm terracotta abstract shapes on soft cream background, organic flowing forms, subtle orange accents. Thoughtful approachable atmosphere, gentle warmth. Vertical phone wallpaper.',
  },
  'chatgpt': {
    name: 'chatgpt',
    label: 'ChatGPT',
    category: 'minimal',
    colorPalette: 'teal green, off-white, soft gray',
    prompt: 'ChatGPT aesthetic screensaver. Clean teal green geometric patterns on off-white background, subtle circuit-like lines, soft gray accents. Modern AI technology atmosphere. Vertical phone wallpaper.',
  },
  'vercel': {
    name: 'vercel',
    label: 'Vercel',
    category: 'minimal',
    colorPalette: 'pure black, pure white, gradient between',
    prompt: 'Vercel aesthetic screensaver. Stark black to white gradient with subtle triangular geometry, minimalist precision. Clean developer-focused atmosphere, maximum contrast. Vertical phone wallpaper.',
  },
  'cursor': {
    name: 'cursor',
    label: 'Cursor',
    category: 'dark',
    colorPalette: 'deep purple, electric violet, dark charcoal',
    prompt: 'Cursor IDE aesthetic screensaver. Deep purple code editor gradients, electric violet accent lines, dark charcoal background. Subtle syntax highlighting colors floating. Developer productivity atmosphere. Vertical phone wallpaper.',
  },
  'notion': {
    name: 'notion',
    label: 'Notion',
    category: 'minimal',
    colorPalette: 'off-white, warm gray, soft black accents',
    prompt: 'Notion aesthetic screensaver. Clean off-white background with subtle warm gray blocks, minimal black typography hints. Organized workspace atmosphere, productive calm. Vertical phone wallpaper.',
  },
  'google': {
    name: 'google',
    label: 'Google',
    category: 'bold',
    colorPalette: 'Google blue, red, yellow, green on white',
    prompt: 'Google aesthetic screensaver. Playful geometric shapes in Google colors - blue, red, yellow, green - on clean white background. Friendly modern tech atmosphere. Vertical phone wallpaper.',
  },
  'apple': {
    name: 'apple',
    label: 'Apple',
    category: 'minimal',
    colorPalette: 'silver, space gray, soft white, subtle rainbow',
    prompt: 'Apple aesthetic screensaver. Sleek silver gradient with subtle rainbow edge light, minimalist curves on space gray. Premium refined atmosphere, elegant simplicity. Vertical phone wallpaper.',
  },
  'microsoft': {
    name: 'microsoft',
    label: 'Microsoft',
    category: 'bold',
    colorPalette: 'Windows blue, orange, green, yellow squares',
    prompt: 'Microsoft aesthetic screensaver. Four-color grid inspired by Windows logo, blue, orange, green, yellow squares with soft gradients. Modern enterprise atmosphere. Vertical phone wallpaper.',
  },
  'miro': {
    name: 'miro',
    label: 'Miro',
    category: 'bold',
    colorPalette: 'bright yellow, deep purple, white',
    prompt: 'Miro aesthetic screensaver. Collaborative whiteboard with sticky notes in bright yellow, connecting lines in deep purple. Creative brainstorm atmosphere, playful productivity. Vertical phone wallpaper.',
  },
  'nike': {
    name: 'nike',
    label: 'Nike',
    category: 'bold',
    colorPalette: 'black, white, volt green accent',
    prompt: 'Nike athletic aesthetic screensaver. Dynamic motion blur in black and white, volt green swoosh energy. Bold sports atmosphere, just do it mentality. Vertical phone wallpaper.',
  },
  'adidas': {
    name: 'adidas',
    label: 'Adidas',
    category: 'bold',
    colorPalette: 'black, white, three stripes',
    prompt: 'Adidas aesthetic screensaver. Three white stripes on black background with athletic motion blur. Clean sports heritage atmosphere, street style energy. Vertical phone wallpaper.',
  },
  't3-chat': {
    name: 't3-chat',
    label: 'T3 Chat',
    category: 'dark',
    colorPalette: 'deep purple, violet, dark gray',
    prompt: 'T3 Chat aesthetic screensaver. Modern chat interface gradients in deep purple and violet, dark gray background. Conversational AI atmosphere, developer-focused design. Vertical phone wallpaper.',
  },

  // =========================================================================
  // SPECIALTY THEMES
  // =========================================================================
  'claymorphism': {
    name: 'claymorphism',
    label: 'Claymorphism',
    category: 'bold',
    colorPalette: 'soft pastel, rounded shadows, 3D clay look',
    prompt: 'Claymorphism aesthetic screensaver. Soft 3D clay-like shapes in pastel colors, rounded corners, subtle shadows. Playful tactile atmosphere, squishy digital forms. Vertical phone wallpaper.',
  },
  'tao': {
    name: 'tao',
    label: 'Tao',
    category: 'minimal',
    colorPalette: 'ink black, rice paper white, subtle gray',
    prompt: 'Tao aesthetic screensaver. Zen minimalism with ink brush strokes on rice paper texture, yin yang balance. Eastern philosophy atmosphere, meditative calm. Vertical phone wallpaper.',
  },
  'research': {
    name: 'research',
    label: 'Research',
    category: 'minimal',
    colorPalette: 'paper white, ink blue, subtle grid',
    prompt: 'Research paper aesthetic screensaver. Academic paper texture with subtle blue ink annotations, graph paper grid hints. Scholarly focused atmosphere, intellectual pursuit. Vertical phone wallpaper.',
  },
  'field-guide': {
    name: 'field-guide',
    label: 'Field Guide',
    category: 'nature',
    colorPalette: 'forest green, parchment, botanical ink',
    prompt: 'Field guide aesthetic screensaver. Vintage botanical illustration style with pressed leaves and flowers, forest green accents on aged parchment. Natural history atmosphere, explorer spirit. Vertical phone wallpaper.',
  },
  'denim': {
    name: 'denim',
    label: 'Denim',
    category: 'bold',
    colorPalette: 'indigo blue, faded wash, white thread',
    prompt: 'Denim fabric aesthetic screensaver. Close-up indigo blue denim texture with visible weave, faded wash areas, white stitching details. Casual authentic atmosphere. Vertical phone wallpaper.',
  },
  'base': {
    name: 'base',
    label: 'Default',
    category: 'minimal',
    colorPalette: 'neutral gray, soft white, subtle blue',
    prompt: 'Clean default aesthetic screensaver. Soft gradient from light gray to white, subtle blue tint, minimal abstract curves. Neutral versatile atmosphere, gentle and unobtrusive. Vertical phone wallpaper.',
  },
};

/**
 * Get the screensaver prompt for a theme
 */
export function getScreensaverPrompt(themeName: string, styleModifier?: string): string {
  const config = THEME_SCREENSAVER_CONFIGS[themeName];
  if (!config) {
    // Fallback to a generic prompt based on theme name
    return `Abstract aesthetic screensaver inspired by "${themeName}" theme. Soft gradients, elegant forms, cohesive color palette. Dreamy atmospheric mood. Vertical phone wallpaper.`;
  }

  let prompt = config.prompt;

  // Apply style modifier if provided
  if (styleModifier) {
    prompt = prompt.replace('Vertical phone wallpaper.', `${styleModifier} style emphasis. Vertical phone wallpaper.`);
  }

  return prompt;
}

/**
 * Get all themes organized by category
 */
export function getThemesByCategory(): Record<string, ThemeScreensaverConfig[]> {
  const byCategory: Record<string, ThemeScreensaverConfig[]> = {};

  for (const config of Object.values(THEME_SCREENSAVER_CONFIGS)) {
    if (!byCategory[config.category]) {
      byCategory[config.category] = [];
    }
    byCategory[config.category].push(config);
  }

  return byCategory;
}

/**
 * Get screensaver image path for a theme
 */
export function getScreensaverPath(themeName: string): string {
  return `/photos/screensavers/${themeName}.png`;
}
