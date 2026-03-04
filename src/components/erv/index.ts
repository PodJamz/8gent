/**
 * ERV Components
 *
 * Rendering primitives for the Entity-Relationship-View architecture.
 */

// Entity rendering
export { EntityCard, type EntityCardProps } from "./EntityCard";

// Connection primitives
export {
  Connection,
  LineConnection,
  CurveConnection,
  ArrowConnection,
  GlowConnection,
  ConnectionContainer,
  type ConnectionProps,
  type ConnectionContainerProps,
  type Point,
} from "./Connection";

// Dimension rendering
export {
  DimensionRenderer,
  type DimensionRendererProps,
} from "./DimensionRenderer";

// Dimension navigation
export {
  DimensionHeader,
  type DimensionHeaderProps,
} from "./DimensionHeader";

// Reality-bending transitions
export {
  DimensionPortal,
  type DimensionPortalProps,
} from "./DimensionPortal";
