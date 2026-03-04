/**
 * ERV Dimension Header
 *
 * Navigation header with back/forward arrows for dimension navigation.
 * Integrates with DimensionNavigationContext for history management.
 *
 * Phase 3, Story 3.2: Navigation Header
 */

"use client";

import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDimensionNavigation } from "@/context/DimensionNavigationContext";
import type { DimensionConfig } from "@/lib/erv/types";

// =============================================================================
// Animation Configuration
// =============================================================================

const buttonSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

const titleVariants = {
  initial: { opacity: 0, y: -10, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: buttonSpring,
  },
  exit: { opacity: 0, y: 10, filter: "blur(4px)" },
};

// =============================================================================
// Type Definitions
// =============================================================================

export interface DimensionHeaderProps {
  /** Current dimension config */
  config?: DimensionConfig;
  /** Show home button */
  showHome?: boolean;
  /** Show 8gent context indicator */
  showAIContext?: boolean;
  /** Callback when home is clicked */
  onHomeClick?: () => void;
  /** Callback when AI context is clicked */
  onAIContextClick?: () => void;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Navigation Button Component
// =============================================================================

interface NavButtonProps {
  direction: "back" | "forward";
  disabled: boolean;
  onClick: () => void;
}

const NavButton = memo(function NavButton({
  direction,
  disabled,
  onClick,
}: NavButtonProps) {
  const Icon = direction === "back" ? ChevronLeft : ChevronRight;
  const label = direction === "back" ? "Go back" : "Go forward";

  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center",
        "w-10 h-10 rounded-full",
        "transition-colors duration-200",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-[hsl(var(--theme-accent))] active:scale-95"
      )}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={buttonSpring}
    >
      {/* Glow effect on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-full bg-[hsl(var(--theme-primary))]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <Icon
        className={cn(
          "w-5 h-5",
          disabled
            ? "text-[hsl(var(--theme-muted-foreground))]"
            : "text-[hsl(var(--theme-foreground))]"
        )}
      />
    </motion.button>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const DimensionHeader = memo(function DimensionHeader({
  config,
  showHome = true,
  showAIContext = true,
  onHomeClick,
  onAIContextClick,
  className,
}: DimensionHeaderProps) {
  const {
    state,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    getAIContext,
  } = useDimensionNavigation();

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleForward = useCallback(() => {
    goForward();
  }, [goForward]);

  // Breadcrumb trail (last 3 locations)
  const breadcrumbs = state.history.slice(-3).map((loc) => loc.label);

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "h-14 px-4",
        "bg-[hsl(var(--theme-background)/0.8)]",
        "backdrop-blur-xl",
        "border-b border-[hsl(var(--theme-border)/0.5)]",
        className
      )}
    >
      {/* Left section - Navigation */}
      <div className="flex items-center gap-1">
        {/* Home button */}
        {showHome && (
          <motion.button
            type="button"
            aria-label="Go home"
            onClick={onHomeClick}
            className={cn(
              "flex items-center justify-center",
              "w-10 h-10 rounded-full",
              "hover:bg-[hsl(var(--theme-accent))]",
              "transition-colors duration-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5 text-[hsl(var(--theme-foreground))]" />
          </motion.button>
        )}

        {/* Divider */}
        {showHome && (canGoBack || canGoForward) && (
          <div className="w-px h-6 bg-[hsl(var(--theme-border))] mx-1" />
        )}

        {/* Back button */}
        <NavButton
          direction="back"
          disabled={!canGoBack}
          onClick={handleBack}
        />

        {/* Forward button */}
        <NavButton
          direction="forward"
          disabled={!canGoForward}
          onClick={handleForward}
        />
      </div>

      {/* Center section - Title & Breadcrumbs */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 mx-4">
        {/* Breadcrumb trail */}
        {breadcrumbs.length > 0 && (
          <motion.div
            className="flex items-center gap-1 text-xs text-[hsl(var(--theme-muted-foreground))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="truncate max-w-[80px]">{crumb}</span>
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3 h-3 opacity-50" />
                )}
              </span>
            ))}
            <ChevronRight className="w-3 h-3 opacity-50" />
          </motion.div>
        )}

        {/* Current dimension title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.current.dimensionId}
            variants={titleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2"
          >
            {config?.icon ? (
              <span className="text-lg">{config.icon}</span>
            ) : (
              <Layers className="w-4 h-4 text-[hsl(var(--theme-primary))]" />
            )}
            <h1 className="font-semibold text-[hsl(var(--theme-foreground))] truncate">
              {config?.name || state.current.label}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* Project context */}
        {state.projectName && (
          <motion.span
            className="text-xs text-[hsl(var(--theme-muted-foreground))] truncate"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {state.projectName}
          </motion.span>
        )}
      </div>

      {/* Right section - AI Context & Actions */}
      <div className="flex items-center gap-2">
        {/* AI Context indicator */}
        {showAIContext && (
          <motion.button
            type="button"
            aria-label="8gent is watching"
            onClick={onAIContextClick}
            className={cn(
              "flex items-center gap-2",
              "px-3 py-1.5 rounded-full",
              "bg-[hsl(var(--theme-primary)/0.1)]",
              "hover:bg-[hsl(var(--theme-primary)/0.2)]",
              "transition-colors duration-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--theme-primary))]" />
            </motion.div>
            <span className="text-xs font-medium text-[hsl(var(--theme-primary))] hidden sm:inline">
              AI Synced
            </span>
          </motion.button>
        )}

        {/* Navigation depth indicator */}
        {state.history.length > 0 && (
          <motion.div
            className={cn(
              "flex items-center justify-center",
              "w-6 h-6 rounded-full",
              "bg-[hsl(var(--theme-muted))]",
              "text-xs font-medium text-[hsl(var(--theme-muted-foreground))]"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={buttonSpring}
          >
            {state.history.length}
          </motion.div>
        )}
      </div>
    </header>
  );
});

export default DimensionHeader;
