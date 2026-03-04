/**
 * ERV Architecture Module
 *
 * Entity-Relationship-View architecture for infinite dimensional rendering.
 * Import from "@/lib/erv" to use.
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

// Types
export * from "./types";

// Presets
export * from "./presets";

// Context
export { DimensionProvider, useDimension, useDimensionKeyboardShortcuts } from "./context";

// View Contract (Autoship Pattern: Plans before execution)
export * from "./view-contract";

// Mutation Gateway (Autoship Pattern: Explicit convergence)
export * from "./mutation-gateway";
