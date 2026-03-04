/**
 * User Preferences System
 *
 * Preferences as compile-time constraints, not runtime hints.
 * Following Autoship principle: preferences influence view compilation,
 * not optional UI decorations.
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Deep partial type - makes all nested properties optional.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// =============================================================================
// Preference Types
// =============================================================================

/**
 * Complete user preferences specification.
 * These are NOT optional hints - they are constraints that MUST be applied.
 */
export interface UserPreferences {
  /** Motion and animation preferences */
  motion: MotionPreferences;

  /** Layout density preferences */
  density: DensityPreferences;

  /** Accessibility requirements */
  accessibility: AccessibilityPreferences;

  /** Color and theme preferences */
  color: ColorPreferences;

  /** Interaction mode preferences */
  interaction: InteractionPreferences;

  /** Data display preferences */
  data: DataPreferences;

  /** AI behavior preferences */
  ai: AIPreferences;
}

export interface MotionPreferences {
  /** Whether to reduce motion (from OS setting or user choice) */
  reducedMotion: boolean;

  /** Animation speed multiplier */
  animationSpeed: "slow" | "normal" | "fast";

  /** Whether to show ambient/decorative animations */
  ambientAnimations: boolean;

  /** Transition style preference */
  transitionStyle: "fade" | "slide" | "scale" | "morph";

  /** Spring stiffness preference */
  springStyle: "smooth" | "snappy" | "bouncy" | "gentle";
}

export interface DensityPreferences {
  /** Overall density level */
  level: "compact" | "comfortable" | "spacious";

  /** Card size preference */
  cardSize: "sm" | "md" | "lg";

  /** Grid columns preference (auto = responsive) */
  gridColumns: number | "auto";

  /** Gap multiplier (1.0 = default) */
  gapMultiplier: number;

  /** Font size multiplier (1.0 = default) */
  fontSizeMultiplier: number;
}

export interface AccessibilityPreferences {
  /** High contrast mode */
  highContrast: boolean;

  /** Larger text */
  largeText: boolean;

  /** Screen reader optimizations */
  screenReaderOptimized: boolean;

  /** Minimum touch target size (px) */
  minTouchTarget: number;

  /** Focus indicator style */
  focusIndicator: "ring" | "outline" | "glow" | "underline";

  /** Whether to announce state changes */
  announceChanges: boolean;

  /** Preferred reduced transparency */
  reduceTransparency: boolean;
}

export interface ColorPreferences {
  /** Color blind mode */
  colorBlindMode?: "protanopia" | "deuteranopia" | "tritanopia";

  /** Prefer dark mode */
  preferDarkMode: boolean;

  /** Custom accent color (hex) */
  accentColor?: string;

  /** Theme preference */
  theme?: string;

  /** Whether to use system theme */
  useSystemTheme: boolean;
}

export interface InteractionPreferences {
  /** Prefer keyboard navigation */
  preferKeyboard: boolean;

  /** Enable haptic feedback */
  hapticFeedback: boolean;

  /** Double-click to edit (vs single click) */
  doubleClickToEdit: boolean;

  /** Swipe gestures enabled */
  swipeGestures: boolean;

  /** Confirmation for destructive actions */
  confirmDestructive: boolean;

  /** Tooltip delay (ms) */
  tooltipDelay: number;
}

export interface DataPreferences {
  /** Default sort order */
  defaultSortOrder: "asc" | "desc";

  /** Default sort field */
  defaultSortField: "createdAt" | "updatedAt" | "name" | "importance";

  /** Items per page */
  itemsPerPage: number;

  /** Show archived items */
  showArchived: boolean;

  /** Date format */
  dateFormat: "relative" | "absolute" | "both";

  /** Time format */
  timeFormat: "12h" | "24h";

  /** First day of week */
  weekStartsOn: 0 | 1 | 6; // Sunday, Monday, Saturday
}

export interface AIPreferences {
  /** Voice for TTS */
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

  /** Auto-play voice responses */
  autoPlayVoice: boolean;

  /** Proactive suggestions */
  proactiveSuggestions: boolean;

  /** Memory enabled (RLM) */
  memoryEnabled: boolean;

  /** Tool confirmation level */
  toolConfirmation: "always" | "destructive" | "never";

  /** Response verbosity */
  verbosity: "concise" | "balanced" | "detailed";
}

// =============================================================================
// Default Preferences
// =============================================================================

export const DEFAULT_PREFERENCES: UserPreferences = {
  motion: {
    reducedMotion: false,
    animationSpeed: "normal",
    ambientAnimations: true,
    transitionStyle: "morph",
    springStyle: "smooth",
  },
  density: {
    level: "comfortable",
    cardSize: "md",
    gridColumns: "auto",
    gapMultiplier: 1.0,
    fontSizeMultiplier: 1.0,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false,
    minTouchTarget: 44,
    focusIndicator: "ring",
    announceChanges: true,
    reduceTransparency: false,
  },
  color: {
    preferDarkMode: true,
    useSystemTheme: true,
  },
  interaction: {
    preferKeyboard: false,
    hapticFeedback: true,
    doubleClickToEdit: false,
    swipeGestures: true,
    confirmDestructive: true,
    tooltipDelay: 500,
  },
  data: {
    defaultSortOrder: "desc",
    defaultSortField: "updatedAt",
    itemsPerPage: 25,
    showArchived: false,
    dateFormat: "relative",
    timeFormat: "12h",
    weekStartsOn: 0,
  },
  ai: {
    voice: "nova",
    autoPlayVoice: false,
    proactiveSuggestions: true,
    memoryEnabled: true,
    toolConfirmation: "destructive",
    verbosity: "balanced",
  },
};

// =============================================================================
// Computed Values
// =============================================================================

/**
 * Computed values derived from preferences.
 * These are the actual values that components use.
 */
export interface ComputedPreferences {
  /** Motion timing in ms */
  motionDuration: number;

  /** Spring configuration */
  spring: {
    stiffness: number;
    damping: number;
    mass: number;
  };

  /** Item size in pixels */
  itemSize: number;

  /** Gap size in pixels */
  gap: number;

  /** Font size in pixels */
  fontSize: number;

  /** Touch target size in pixels */
  touchTarget: number;

  /** Grid columns (resolved number) */
  gridColumns: number;

  /** Transition CSS */
  transitionCSS: string;

  /** ARIA live region */
  ariaLive: "off" | "polite" | "assertive";
}

/**
 * Compute actual values from user preferences.
 * This is the "compile" step - preferences become constraints.
 */
export function computePreferences(
  preferences: UserPreferences,
  viewport?: { width: number; height: number }
): ComputedPreferences {
  // Motion duration
  const baseDuration = preferences.motion.reducedMotion ? 0 :
    preferences.motion.animationSpeed === "slow" ? 400 :
    preferences.motion.animationSpeed === "fast" ? 150 : 250;

  // Spring configuration
  const springConfigs: Record<string, { stiffness: number; damping: number; mass: number }> = {
    smooth: { stiffness: 200, damping: 25, mass: 1 },
    snappy: { stiffness: 400, damping: 30, mass: 0.8 },
    bouncy: { stiffness: 300, damping: 15, mass: 1 },
    gentle: { stiffness: 100, damping: 20, mass: 1.2 },
  };
  const spring = preferences.motion.reducedMotion
    ? { stiffness: 1000, damping: 100, mass: 1 } // Instant
    : springConfigs[preferences.motion.springStyle];

  // Density multiplier
  const densityMultiplier =
    preferences.density.level === "compact" ? 0.75 :
    preferences.density.level === "spacious" ? 1.5 : 1;

  // Base item size
  const baseItemSize =
    preferences.density.cardSize === "sm" ? 48 :
    preferences.density.cardSize === "lg" ? 96 : 64;

  // Item size with density
  const itemSize = Math.round(baseItemSize * densityMultiplier);

  // Gap
  const gap = Math.round(16 * preferences.density.gapMultiplier * densityMultiplier);

  // Font size
  const baseFontSize = preferences.accessibility.largeText ? 18 : 14;
  const fontSize = Math.round(baseFontSize * preferences.density.fontSizeMultiplier);

  // Touch target
  const touchTarget = Math.max(
    preferences.accessibility.minTouchTarget,
    preferences.accessibility.largeText ? 56 : 44
  );

  // Grid columns
  let gridColumns = 4;
  if (preferences.density.gridColumns === "auto" && viewport) {
    // Responsive calculation
    gridColumns = Math.max(1, Math.floor(viewport.width / (itemSize + gap)));
  } else if (typeof preferences.density.gridColumns === "number") {
    gridColumns = preferences.density.gridColumns;
  }

  // Transition CSS
  const transitionCSS = preferences.motion.reducedMotion
    ? "none"
    : `all ${baseDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  // ARIA live
  const ariaLive = preferences.accessibility.screenReaderOptimized
    ? "assertive"
    : preferences.accessibility.announceChanges
      ? "polite"
      : "off";

  return {
    motionDuration: baseDuration,
    spring,
    itemSize,
    gap,
    fontSize,
    touchTarget,
    gridColumns,
    transitionCSS,
    ariaLive,
  };
}

// =============================================================================
// Preference Validation
// =============================================================================

/**
 * Validate preferences against constraints.
 */
export function validatePreferences(preferences: Partial<UserPreferences>): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate motion
  if (preferences.motion) {
    if (preferences.motion.animationSpeed &&
        !["slow", "normal", "fast"].includes(preferences.motion.animationSpeed)) {
      errors.push(`Invalid animation speed: ${preferences.motion.animationSpeed}`);
    }
  }

  // Validate density
  if (preferences.density) {
    if (preferences.density.gapMultiplier !== undefined) {
      if (preferences.density.gapMultiplier < 0.5 || preferences.density.gapMultiplier > 2) {
        warnings.push("Gap multiplier outside recommended range (0.5-2)");
      }
    }
    if (preferences.density.fontSizeMultiplier !== undefined) {
      if (preferences.density.fontSizeMultiplier < 0.75 || preferences.density.fontSizeMultiplier > 1.5) {
        warnings.push("Font size multiplier outside recommended range (0.75-1.5)");
      }
    }
  }

  // Validate accessibility
  if (preferences.accessibility) {
    if (preferences.accessibility.minTouchTarget !== undefined) {
      if (preferences.accessibility.minTouchTarget < 44) {
        errors.push("Minimum touch target must be at least 44px (WCAG requirement)");
      }
    }
  }

  // Validate data
  if (preferences.data) {
    if (preferences.data.itemsPerPage !== undefined) {
      if (preferences.data.itemsPerPage < 5 || preferences.data.itemsPerPage > 100) {
        errors.push("Items per page must be between 5 and 100");
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// Preference Merging
// =============================================================================

/**
 * Deep merge preferences with defaults.
 */
export function mergePreferences(
  partial: Partial<UserPreferences>
): UserPreferences {
  return {
    motion: { ...DEFAULT_PREFERENCES.motion, ...partial.motion },
    density: { ...DEFAULT_PREFERENCES.density, ...partial.density },
    accessibility: { ...DEFAULT_PREFERENCES.accessibility, ...partial.accessibility },
    color: { ...DEFAULT_PREFERENCES.color, ...partial.color },
    interaction: { ...DEFAULT_PREFERENCES.interaction, ...partial.interaction },
    data: { ...DEFAULT_PREFERENCES.data, ...partial.data },
    ai: { ...DEFAULT_PREFERENCES.ai, ...partial.ai },
  };
}

/**
 * Detect system preferences from browser APIs.
 */
export function detectSystemPreferences(): DeepPartial<UserPreferences> {
  if (typeof window === "undefined") {
    return {};
  }

  const detected: DeepPartial<UserPreferences> = {
    motion: {},
    color: {},
    accessibility: {},
  };

  // Reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    detected.motion!.reducedMotion = true;
  }

  // Color scheme
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    detected.color!.preferDarkMode = true;
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    detected.color!.preferDarkMode = false;
  }

  // Contrast
  if (window.matchMedia("(prefers-contrast: more)").matches) {
    detected.accessibility!.highContrast = true;
  }

  // Reduced transparency
  if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) {
    detected.accessibility!.reduceTransparency = true;
  }

  return detected;
}

// =============================================================================
// Storage
// =============================================================================

const PREFERENCES_STORAGE_KEY = "jamos_user_preferences";
const PREFERENCES_VERSION = "0.1.0";

interface StoredPreferences {
  version: string;
  preferences: UserPreferences;
  updatedAt: number;
}

/**
 * Load preferences from localStorage.
 */
export function loadPreferences(): UserPreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredPreferences = JSON.parse(stored);

    // Version check
    if (parsed.version !== PREFERENCES_VERSION) {
      console.warn(`Preferences version mismatch: ${parsed.version} vs ${PREFERENCES_VERSION}`);
      // Could migrate here in the future
    }

    return parsed.preferences;
  } catch {
    console.error("Failed to load preferences");
    return null;
  }
}

/**
 * Save preferences to localStorage.
 */
export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  const stored: StoredPreferences = {
    version: PREFERENCES_VERSION,
    preferences,
    updatedAt: Date.now(),
  };

  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(stored));
}

/**
 * Clear stored preferences.
 */
export function clearPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(PREFERENCES_STORAGE_KEY);
}

// =============================================================================
// CSS Custom Properties Generation
// =============================================================================

/**
 * Generate CSS custom properties from computed preferences.
 * These can be applied to :root to influence all components.
 */
export function generateCSSProperties(computed: ComputedPreferences): Record<string, string> {
  return {
    "--pref-motion-duration": `${computed.motionDuration}ms`,
    "--pref-spring-stiffness": String(computed.spring.stiffness),
    "--pref-spring-damping": String(computed.spring.damping),
    "--pref-spring-mass": String(computed.spring.mass),
    "--pref-item-size": `${computed.itemSize}px`,
    "--pref-gap": `${computed.gap}px`,
    "--pref-font-size": `${computed.fontSize}px`,
    "--pref-touch-target": `${computed.touchTarget}px`,
    "--pref-grid-columns": String(computed.gridColumns),
    "--pref-transition": computed.transitionCSS,
  };
}

/**
 * Apply CSS properties to document root.
 */
export function applyCSSProperties(computed: ComputedPreferences): void {
  if (typeof document === "undefined") return;

  const properties = generateCSSProperties(computed);
  const root = document.documentElement;

  for (const [key, value] of Object.entries(properties)) {
    root.style.setProperty(key, value);
  }
}
