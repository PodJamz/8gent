/**
 * Migration Guide: Integrating Three-Tier Soul Architecture
 *
 * This file documents the changes needed in route.ts to switch
 * from the monolithic system prompt to the composable soul layers.
 *
 * The migration is backwards-compatible:
 * - soul-layers.ts exports CLAW_AI_SYSTEM_PROMPT for compatibility
 * - assembleSoulPrompt() is the new entry point
 * - All existing theme contexts are preserved
 * - Access control logic is unchanged
 *
 * Changes required in: src/app/api/chat/route.ts
 */

// ============================================================================
// STEP 1: Update imports
// ============================================================================

// BEFORE:
// import { CLAW_AI_SYSTEM_PROMPT, THEME_CONTEXTS } from '@/lib/8gent/system-prompt';

// AFTER:
// import { assembleSoulPrompt } from '@/lib/8gent/soul-layers';

// ============================================================================
// STEP 2: Remove manual prompt assembly (lines ~626-639 in current route.ts)
// ============================================================================

// BEFORE:
/*
const themeContext = THEME_CONTEXTS[model] || THEME_CONTEXTS[theme] || THEME_CONTEXTS.default;
const identityContext = getIdentityContext(accessLevel);
const appContextPrompt = getAppContextPrompt(appContext as AppContextPayload | null);
const accessContext = `\n\n## Access Level\nUser access level: ${accessLevel}. ${describeAccessLevel(accessLevel)}`;
const providerContext = useLocalProvider
  ? `\n\n## Provider Context\n...`
  : `\n\n## Provider Context\n...`;
const systemPrompt = CLAW_AI_SYSTEM_PROMPT + themeContext + identityContext + appContextPrompt + accessContext + providerContext + memoryContext;
*/

// AFTER:
/*
const systemPrompt = assembleSoulPrompt({
  accessLevel,
  theme: model || theme,
  appContext: appContext as AppContextPayload | null,
  memoryContext: memoryContext || undefined,
  providerContext: useLocalProvider
    ? `\n\n## Provider Context\nRunning on LOCAL inference (${providerSettings.primaryProvider === 'lynkr' ? 'Lynkr tunnel' : 'Ollama direct'}). Responses stay on the host machine with zero cloud cost.`
    : `\n\n## Provider Context\nRunning on CLOUD inference (GPT-4o). Full tool calling available.`,
});
*/

// ============================================================================
// STEP 3: Remove the getIdentityContext() function from route.ts
// ============================================================================

// The identity context is now handled inside soul-layers.ts.
// The getIdentityContext() function in route.ts (lines ~466-500) can be removed.
// The getAppContextPrompt() function (lines ~444-461) can also be removed,
// as it's now built into assembleSoulPrompt via buildAppContext().

// ============================================================================
// STEP 4: Verify logging (optional but recommended)
// ============================================================================

// Add layer loading logging for security monitoring:
/*
import { getLoadedLayers } from '@/lib/8gent/soul-layers';

// In the POST handler, after determining accessLevel:
const loadedLayers = getLoadedLayers(accessLevel);
console.log(`[Soul Layers] Access: ${accessLevel}, Layers: [${loadedLayers.join(', ')}]`);
*/

// ============================================================================
// STEP 5: No changes needed for access-control.ts
// ============================================================================

// Tool gating remains unchanged. The soul layers handle PROMPT isolation.
// The access-control.ts handles TOOL isolation. Both are required.
//
// Defense in depth:
//   Layer 1: Prompt isolation (soul-layers.ts) — what the AI KNOWS
//   Layer 2: Tool gating (access-control.ts) — what the AI CAN DO
//   Layer 3: Tool execution filtering (tool-executor.ts) — runtime safety net

// ============================================================================
// Full diff summary
// ============================================================================

/*
Files changed:
  - src/lib/claw-ai/soul-layers.ts        (NEW) — Three-tier prompt system
  - src/lib/claw-ai/soul-layers.migration.ts (NEW) — This migration guide
  - src/app/api/chat/route.ts              (MODIFY) — Switch to assembleSoulPrompt
  - src/lib/claw-ai/system-prompt.ts      (KEEP) — Retained for reference, can deprecate later

What moves where:
  - Base personality → soul-layers.ts BASE_LAYER
  - Theme contexts → soul-layers.ts THEME_CONTEXTS (copied, unchanged)
  - Identity context → soul-layers.ts getIdentityFrame()
  - App context → soul-layers.ts buildAppContext()
  - Professional context → soul-layers.ts PROFESSIONAL_LAYER (NEW)
  - Private/owner context → soul-layers.ts PRIVATE_LAYER (NEW)
  - Prompt assembly → soul-layers.ts assembleSoulPrompt()

What's new:
  - Professional layer: Working style, technical stances, collaboration patterns
  - Private layer: Digital twin framing, Nick context, 2028 arc, emotional sovereignty
  - Clean separation: private content never loaded for non-owner tiers
  - Composable: layers are additive, not filtered

Security guarantee:
  A visitor's request path:
    1. Auth check → visitor
    2. getLayersForAccess('visitor') → ['base']
    3. PRIVATE_LAYER string never appears in the assembled prompt
    4. Tool gating further restricts to 6 system tools
    5. No memory loaded, no memory stored

  The private context doesn't exist in the visitor's universe.
  It's not redacted. It was never there.
*/

export { };
