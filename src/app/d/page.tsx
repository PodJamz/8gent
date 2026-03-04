/**
 * Dimensions Index Page
 *
 * Shows all available preset and custom dimensions.
 * Entry point for exploring the ERV architecture.
 */

"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  List,
  GitBranch,
  Orbit,
  Calendar,
  Table2,
  Music,
  Sword,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DimensionHeader } from "@/components/erv/DimensionHeader";
import { useSwipeNavigation } from "@/context/DimensionNavigationContext";
import { PageTransitionWrapper } from "@/components/ios/PageTransitionWrapper";

// =============================================================================
// Preset Dimension Data
// =============================================================================

interface PresetDimensionInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  metaphor: string;
}

const PRESET_DIMENSIONS: PresetDimensionInfo[] = [
  {
    id: "feed",
    name: "Feed",
    description: "Chronological stream of all entities",
    icon: <List className="w-6 h-6" />,
    gradient: "from-blue-500 to-cyan-500",
    metaphor: "river",
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "Ticket and task management board",
    icon: <LayoutGrid className="w-6 h-6" />,
    gradient: "from-violet-500 to-purple-500",
    metaphor: "board",
  },
  {
    id: "graph",
    name: "Graph",
    description: "Entity relationship visualization",
    icon: <GitBranch className="w-6 h-6" />,
    gradient: "from-emerald-500 to-green-500",
    metaphor: "constellation",
  },
  {
    id: "graph-3d",
    name: "Graph 3D",
    description: "Immersive 3D relationship space",
    icon: <Orbit className="w-6 h-6" />,
    gradient: "from-pink-500 to-rose-500",
    metaphor: "solar",
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Time-based event visualization",
    icon: <Calendar className="w-6 h-6" />,
    gradient: "from-amber-500 to-orange-500",
    metaphor: "timeline",
  },
  {
    id: "grid",
    name: "Grid",
    description: "Gallery-style entity browser",
    icon: <LayoutGrid className="w-6 h-6" />,
    gradient: "from-cyan-500 to-teal-500",
    metaphor: "mosaic",
  },
  {
    id: "table",
    name: "Table",
    description: "Spreadsheet-like data view",
    icon: <Table2 className="w-6 h-6" />,
    gradient: "from-slate-500 to-zinc-500",
    metaphor: "ledger",
  },
  {
    id: "ipod",
    name: "iPod",
    description: "Music-centric navigation",
    icon: <Music className="w-6 h-6" />,
    gradient: "from-indigo-500 to-blue-500",
    metaphor: "vinyl",
  },
  {
    id: "quest-log",
    name: "Quest Log",
    description: "Gamified task progression",
    icon: <Sword className="w-6 h-6" />,
    gradient: "from-red-500 to-orange-500",
    metaphor: "dungeon",
  },
];

// =============================================================================
// Animation Configuration
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

// =============================================================================
// Dimension Card Component
// =============================================================================

interface DimensionCardProps {
  dimension: PresetDimensionInfo;
  onClick: () => void;
}

const DimensionCard = memo(function DimensionCard({
  dimension,
  onClick,
}: DimensionCardProps) {
  return (
    <motion.button
      type="button"
      variants={itemVariants}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden",
        "flex flex-col items-start",
        "p-6 rounded-2xl",
        "bg-[hsl(var(--theme-card))]",
        "border border-[hsl(var(--theme-border))]",
        "hover:border-[hsl(var(--theme-primary)/0.5)]",
        "transition-all duration-300",
        "text-left"
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient background on hover */}
      <motion.div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10",
          "bg-gradient-to-br",
          dimension.gradient,
          "transition-opacity duration-300"
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center",
          "w-12 h-12 rounded-xl mb-4",
          "bg-gradient-to-br",
          dimension.gradient,
          "text-white"
        )}
      >
        {dimension.icon}
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg text-[hsl(var(--theme-foreground))] mb-1">
        {dimension.name}
      </h3>
      <p className="text-sm text-[hsl(var(--theme-muted-foreground))] mb-3">
        {dimension.description}
      </p>

      {/* Metaphor tag */}
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          "bg-[hsl(var(--theme-muted))]",
          "text-[hsl(var(--theme-muted-foreground))]"
        )}
      >
        ✨ {dimension.metaphor}
      </span>

      {/* Arrow indicator */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronRight className="w-5 h-5 text-[hsl(var(--theme-muted-foreground))]" />
      </motion.div>
    </motion.button>
  );
});

// =============================================================================
// Main Page Component
// =============================================================================

export default function DimensionsPage() {
  const router = useRouter();

  // Swipe navigation handlers
  const { touchHandlers } = useSwipeNavigation();

  const handleDimensionClick = useCallback(
    (dimensionId: string) => {
      router.push(`/d/${dimensionId}`);
    },
    [router]
  );

  const handleHomeClick = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <PageTransitionWrapper>
      <div
        className="min-h-screen bg-[hsl(var(--theme-background))]"
        {...touchHandlers}
      >
        {/* Header */}
        <DimensionHeader
          config={{
            id: "dimensions",
            name: "Dimensions",
            description: "Explore infinite views",
            icon: "✨",
            container: "frame",
            arrangement: "grid",
            entityShape: "square",
            connectionStyle: "none",
            decorations: [],
            interactions: [],
            transition: "morph",
          }}
          onHomeClick={handleHomeClick}
          showAIContext={true}
        />

        {/* Content */}
        <main className="p-6 md:p-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-6"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Layers className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--theme-foreground))] mb-3">
              Infinite Dimensions
            </h1>
            <p className="text-lg text-[hsl(var(--theme-muted-foreground))] max-w-2xl mx-auto">
              Explore your entities through different lenses. Each dimension
              reveals unique patterns and relationships in your data.
            </p>
          </motion.div>

          {/* Presets Grid */}
          <section className="mb-12">
            <motion.h2
              className="text-xl font-semibold text-[hsl(var(--theme-foreground))] mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-5 h-5 text-[hsl(var(--theme-primary))]" />
              Preset Dimensions
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {PRESET_DIMENSIONS.map((dimension) => (
                <DimensionCard
                  key={dimension.id}
                  dimension={dimension}
                  onClick={() => handleDimensionClick(dimension.id)}
                />
              ))}
            </motion.div>
          </section>

          {/* Custom Dimension CTA */}
          <motion.section
            className={cn(
              "p-8 rounded-2xl",
              "bg-gradient-to-br from-[hsl(var(--theme-primary)/0.1)] to-[hsl(var(--theme-primary)/0.05)]",
              "border border-[hsl(var(--theme-primary)/0.2)]"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-[hsl(var(--theme-primary))] flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 hsl(var(--theme-primary) / 0)",
                      "0 0 0 10px hsl(var(--theme-primary) / 0.1)",
                      "0 0 0 0 hsl(var(--theme-primary) / 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[hsl(var(--theme-foreground))] mb-2">
                  Create Custom Dimensions
                </h3>
                <p className="text-[hsl(var(--theme-muted-foreground))]">
                  Describe your ideal view in natural language and let 8gent
                  conjure a custom dimension just for you.
                </p>
              </div>
              <motion.button
                type="button"
                className={cn(
                  "px-6 py-3 rounded-xl",
                  "bg-[hsl(var(--theme-primary))]",
                  "text-white font-medium",
                  "hover:opacity-90",
                  "transition-opacity duration-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ask 8gent
              </motion.button>
            </div>
          </motion.section>
        </main>
      </div>
    </PageTransitionWrapper>
  );
}
