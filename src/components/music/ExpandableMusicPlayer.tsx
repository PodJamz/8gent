'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useMusicPlayerMorph } from '@/hooks/useMusicPlayerMorph';
import { IPodSkinProvider, useIPodSkin } from './iPodSkin';
import { Maximize2, Minimize2, Disc3 } from 'lucide-react';

interface ExpandableMusicPlayerProps {
  children: React.ReactNode; // The iPod component
  libraryPanel?: React.ReactNode;
  queuePanel?: React.ReactNode;
  playlistPanel?: React.ReactNode;
}

// The morphable iPod container
function MorphableIPod({
  children,
  onExpand,
  onCollapse,
  morphProgress,
  ipodScale,
  ipodBorderRadius,
  isDragging,
  isMobile,
}: {
  children: React.ReactNode;
  onExpand: () => void;
  onCollapse: () => void;
  morphProgress: number;
  ipodScale: any;
  ipodBorderRadius: any;
  isDragging: boolean;
  isMobile: boolean;
}) {
  const skin = useIPodSkin();
  const isExpanded = morphProgress > 0.5;

  return (
    <motion.div
      className="relative z-20"
      style={{
        scale: ipodScale,
        borderRadius: ipodBorderRadius,
      }}
      layout
    >
      {/* Expand/Collapse button */}
      <motion.button
        className="absolute -top-3 -right-3 z-30 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
        onClick={isExpanded ? onCollapse : onExpand}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        title={isExpanded ? 'Collapse to iPod' : 'Expand player'}
      >
        {isExpanded ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </motion.button>

      {/* The iPod itself */}
      <motion.div
        className={`${skin.bodyClass} transition-shadow duration-300`}
        style={{
          background: `linear-gradient(to bottom, var(--ipod-body-from), var(--ipod-body-to))`,
          borderColor: 'var(--ipod-body-border)',
          boxShadow: isDragging
            ? '0 35px 60px -15px var(--ipod-shadow), 0 0 40px var(--ipod-glow)'
            : '0 25px 50px -12px var(--ipod-shadow)',
        }}
        whileHover={!isDragging ? { y: -2 } : undefined}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Side panel that slides out
function SidePanel({
  children,
  side,
  opacity,
  isVisible,
}: {
  children: React.ReactNode;
  side: 'left' | 'right';
  opacity: any;
  isVisible: boolean;
}) {
  return (
    <motion.div
      className={`absolute top-0 ${side === 'left' ? 'right-full mr-4' : 'left-full ml-4'} w-[300px] h-full`}
      style={{ opacity }}
      initial={{ x: side === 'left' ? 50 : -50, opacity: 0 }}
      animate={{
        x: isVisible ? 0 : side === 'left' ? 50 : -50,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="h-full rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// Mobile Dynamic Island mini player
function DynamicIslandPlayer({
  children,
  morphProgress,
  onTap,
}: {
  children: React.ReactNode;
  morphProgress: number;
  onTap: () => void;
}) {
  const isIsland = morphProgress >= 0.4 && morphProgress <= 0.6;

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: -100 }}
      animate={{
        y: morphProgress > 0.3 ? 0 : -100,
        scale: isIsland ? 1 : 0.9,
      }}
      onClick={onTap}
    >
      <motion.div
        className="bg-black rounded-[22px] px-4 py-2 flex items-center gap-3 shadow-2xl border border-white/10"
        style={{
          width: isIsland ? 'auto' : 160,
        }}
        layoutId="island-content"
      >
        <Disc3 className="w-5 h-5 text-white/80 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="text-white text-sm font-medium truncate max-w-[120px]">
          Now Playing
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main expandable layout
export function ExpandableMusicPlayer({
  children,
  libraryPanel,
  queuePanel,
  playlistPanel,
}: ExpandableMusicPlayerProps) {
  const {
    morphProgress,
    morphState,
    isDragging,
    isMobile,
    progress,
    ipodScale,
    ipodBorderRadius,
    panelOpacity,
    expand,
    collapse,
    toggleExpanded,
    onDragStart,
    onDrag,
    onDragEnd,
  } = useMusicPlayerMorph();

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);

  // Handle drag gestures for morphing
  const handleDragStart = useCallback((e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    dragStartY.current = info.point.y;
    onDragStart();
  }, [onDragStart]);

  const handleDrag = useCallback((e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Calculate progress based on drag distance
    // Dragging down = collapse (decrease progress)
    // Dragging up = expand (increase progress)
    const dragDistance = dragStartY.current - info.point.y;
    const maxDragDistance = 300; // pixels to go from 0 to 1
    const currentProgress = progress.get();
    const deltaProgress = dragDistance / maxDragDistance;

    onDrag(Math.max(0, Math.min(1, deltaProgress + (morphState === 'expanded' ? 1 : 0))));
  }, [progress, morphState, onDrag]);

  const handleDragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  const isExpanded = morphProgress > 0.5;
  const showPanels = morphProgress > 0.3 && !isMobile;

  return (
    <IPodSkinProvider>
      <div
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* Background blur overlay when expanded */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Desktop: Side panels that unfold */}
        {!isMobile && (
          <>
            {/* Left panel - Library */}
            <SidePanel
              side="left"
              opacity={panelOpacity}
              isVisible={showPanels}
            >
              {libraryPanel || (
                <div className="text-white/60 text-sm">
                  <h3 className="text-white font-semibold mb-4">Library</h3>
                  <p>Your music collection</p>
                </div>
              )}
            </SidePanel>

            {/* Right panel - Queue */}
            <SidePanel
              side="right"
              opacity={panelOpacity}
              isVisible={showPanels}
            >
              {queuePanel || (
                <div className="text-white/60 text-sm">
                  <h3 className="text-white font-semibold mb-4">Up Next</h3>
                  <p>Queue is empty</p>
                </div>
              )}
            </SidePanel>
          </>
        )}

        {/* Mobile: Dynamic Island when morphing */}
        {isMobile && morphProgress > 0.3 && (
          <DynamicIslandPlayer morphProgress={morphProgress} onTap={toggleExpanded}>
            Now Playing
          </DynamicIslandPlayer>
        )}

        {/* The iPod - always centered */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <MorphableIPod
            onExpand={expand}
            onCollapse={collapse}
            morphProgress={morphProgress}
            ipodScale={ipodScale}
            ipodBorderRadius={ipodBorderRadius}
            isDragging={isDragging}
            isMobile={isMobile}
          >
            {children}
          </MorphableIPod>
        </motion.div>

        {/* Mobile: Full UI below the island when expanded */}
        {isMobile && isExpanded && (
          <motion.div
            className="fixed inset-0 top-20 bg-black/90 backdrop-blur-xl z-10 p-4 overflow-auto"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <div className="max-w-md mx-auto space-y-6">
              {/* Library section */}
              <section>
                <h2 className="text-white font-semibold text-lg mb-3">Library</h2>
                {libraryPanel || (
                  <div className="text-white/60 text-sm p-4 rounded-xl bg-white/5">
                    Your music collection
                  </div>
                )}
              </section>

              {/* Queue section */}
              <section>
                <h2 className="text-white font-semibold text-lg mb-3">Up Next</h2>
                {queuePanel || (
                  <div className="text-white/60 text-sm p-4 rounded-xl bg-white/5">
                    Queue is empty
                  </div>
                )}
              </section>

              {/* Playlists section */}
              <section>
                <h2 className="text-white font-semibold text-lg mb-3">Playlists</h2>
                {playlistPanel || (
                  <div className="text-white/60 text-sm p-4 rounded-xl bg-white/5">
                    Your playlists
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        )}

        {/* Morph progress indicator (dev/demo) */}
        {isDragging && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/80 rounded-full text-white text-sm font-mono">
            {(morphProgress * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </IPodSkinProvider>
  );
}

export default ExpandableMusicPlayer;
