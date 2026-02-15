/**
 * Claw AI OS - Core Components
 *
 * These components form the foundation of the operating system UI.
 */

export { ErrorBoundary, useErrorHandler } from './ErrorBoundary';
export { PrototypeState, DisabledFeature } from './PrototypeState';
export { ProjectSelector, ActiveProjectIndicator } from './ProjectSelector';
export { SimulationLabel, withSimulationLabel } from './SimulationLabel';
export {
  KonamiEasterEgg,
  ClickCountEasterEgg,
  DeveloperModeEasterEgg,
} from './EasterEgg';
export { AppTaxonomy, APP_TAXONOMY } from './AppTaxonomy';
export type { TaxonomyGroup, TaxonomyAppItem } from './AppTaxonomy';
export { AppHeader } from './AppHeader';
