'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Grid3X3,
  Layers,
  RefreshCw,
  MousePointer,
  Eye,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';
export type LayoutMode = 'single' | 'grid';

export interface PreviewCanvasProps {
  /** Content to render in the preview */
  children?: ReactNode;
  /** HTML content to render in iframe */
  htmlContent?: string;
  /** Current viewport mode */
  viewport?: ViewportMode;
  /** Callback when viewport changes */
  onViewportChange?: (viewport: ViewportMode) => void;
  /** Enable zoom controls */
  enableZoom?: boolean;
  /** Enable viewport toggle */
  enableViewportToggle?: boolean;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Component name for display */
  componentName?: string;
  /** Custom class name */
  className?: string;
}

// ============================================================================
// Viewport Configurations
// ============================================================================

const viewportSizes: Record<ViewportMode, { width: number; height: number; label: string }> = {
  mobile: { width: 375, height: 667, label: 'Mobile' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  desktop: { width: 1280, height: 800, label: 'Desktop' },
};

// ============================================================================
// Preview Canvas Component
// ============================================================================

export function PreviewCanvas({
  children,
  htmlContent,
  viewport = 'mobile',
  onViewportChange,
  enableZoom = true,
  enableViewportToggle = true,
  showToolbar = true,
  componentName = 'Preview',
  className = '',
}: PreviewCanvasProps) {
  const [currentViewport, setCurrentViewport] = useState<ViewportMode>(viewport);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync viewport prop with state
  useEffect(() => {
    setCurrentViewport(viewport);
  }, [viewport]);

  const handleViewportChange = (newViewport: ViewportMode) => {
    setCurrentViewport(newViewport);
    onViewportChange?.(newViewport);

    // Reset zoom when viewport changes
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  };

  const handleZoomIn = () => {
    transformRef.current?.zoomIn(0.25);
  };

  const handleZoomOut = () => {
    transformRef.current?.zoomOut(0.25);
  };

  const handleResetZoom = () => {
    transformRef.current?.resetTransform();
  };

  const handleFitToView = () => {
    transformRef.current?.centerView(0.9);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current && htmlContent) {
      iframeRef.current.srcdoc = htmlContent;
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleZoomChange = (ref: ReactZoomPanPinchRef) => {
    setCurrentZoom(ref.state.scale);
  };

  const { width, height, label } = viewportSizes[currentViewport];

  // Generate iframe HTML with proper styling
  const iframeHtml = htmlContent || `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .placeholder {
            text-align: center;
          }
          .placeholder h1 {
            font-size: 24px;
            margin-bottom: 8px;
          }
          .placeholder p {
            opacity: 0.8;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="placeholder">
          <h1>Preview Canvas</h1>
          <p>Your component will render here</p>
        </div>
      </body>
    </html>
  `;

  return (
    <div className={`flex flex-col h-full bg-[#0d1117] rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 sm:px-3 py-2 bg-[#161b22] border-b border-white/5">
          {/* Left: Preview info */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60 hidden sm:inline">{componentName}</span>
          </div>

          {/* Center: Zoom controls */}
          {enableZoom && (
            <div className="flex items-center gap-1 px-1 py-0.5 bg-white/5 rounded-lg">
              <button
                onClick={handleZoomOut}
                className="p-1 sm:p-1.5 rounded transition-colors hover:bg-white/10 text-white/60 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-white/60 min-w-[40px] text-center">
                {Math.round(currentZoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 sm:p-1.5 rounded transition-colors hover:bg-white/10 text-white/60 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button
                onClick={handleResetZoom}
                className="p-1 sm:p-1.5 rounded transition-colors hover:bg-white/10 text-white/60 hover:text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleFitToView}
                className="p-1 sm:p-1.5 rounded transition-colors hover:bg-white/10 text-white/60 hover:text-white"
                title="Fit to View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Right: Viewport & actions */}
          <div className="flex items-center gap-2">
            {/* Viewport selector */}
            {enableViewportToggle && (
              <div className="flex items-center gap-1 px-1 py-0.5 bg-white/5 rounded-lg">
                {([
                  { id: 'mobile', icon: Smartphone },
                  { id: 'tablet', icon: Tablet },
                  { id: 'desktop', icon: Monitor },
                ] as const).map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleViewportChange(id)}
                    className={`p-1 sm:p-1.5 rounded transition-colors ${
                      currentViewport === id
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                    title={viewportSizes[id].label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition-colors"
              title="Refresh Preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden bg-[#0a0a0a] relative">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          limitToBounds={false}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          panning={{ velocityDisabled: true }}
          onTransformed={handleZoomChange}
        >
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!flex !items-center !justify-center !min-h-full !min-w-full !p-4 sm:!p-8"
          >
            {/* Device frame */}
            <motion.div
              layout
              className="relative rounded-xl overflow-hidden bg-black"
              style={{
                width: width,
                height: height,
                boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Device notch (for mobile) */}
              {currentViewport === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-10 flex items-center justify-center">
                  <div className="w-16 h-1 bg-white/10 rounded-full" />
                </div>
              )}

              {/* Content area */}
              <div
                className={`w-full h-full ${
                  currentViewport === 'mobile' ? 'pt-6' : ''
                }`}
              >
                {children || (
                  <iframe
                    ref={iframeRef}
                    srcDoc={iframeHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                    title="Preview"
                  />
                )}
              </div>

              {/* Device home indicator (for mobile) */}
              {currentViewport === 'mobile' && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
              )}
            </motion.div>
          </TransformComponent>
        </TransformWrapper>

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer info bar */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 bg-[#161b22] border-t border-white/5 text-[10px] sm:text-xs text-white/40">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">{label}</span>
          </span>
          <span className="flex items-center gap-1">
            <Grid3X3 className="w-3 h-3" />
            <span>{width} × {height}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MousePointer className="w-3 h-3" />
          <span className="hidden sm:inline">Pan & Zoom</span>
        </div>
      </div>
    </div>
  );
}

export default PreviewCanvas;
