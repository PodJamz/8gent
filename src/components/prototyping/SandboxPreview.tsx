'use client';

import React, { useState, useCallback } from 'react';
import {
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Loader2,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface SandboxPreviewProps {
  url: string | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const DEVICE_SIZES: Record<DeviceSize, { width: string; label: string; icon: React.ReactNode }> = {
  mobile: { width: '375px', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
  tablet: { width: '768px', label: 'Tablet', icon: <Tablet className="w-4 h-4" /> },
  desktop: { width: '100%', label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
};

// ============================================================================
// Main Component
// ============================================================================

export function SandboxPreview({
  url,
  isLoading,
  onRefresh,
}: SandboxPreviewProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setIframeKey((prev) => prev + 1);
    onRefresh?.();
  }, [onRefresh]);

  const handleOpenExternal = useCallback(() => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [url]);

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Preview
          </span>
          {url && (
            <span className="text-xs text-white/30 truncate max-w-[200px]">
              {new URL(url).hostname}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Device size toggles */}
          {Object.entries(DEVICE_SIZES).map(([size, { label, icon }]) => (
            <button
              key={size}
              onClick={() => setDeviceSize(size as DeviceSize)}
              className={`
                p-1.5 rounded transition-colors
                ${deviceSize === size ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}
              `}
              title={label}
            >
              {icon}
            </button>
          ))}

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={!url || isLoading}
            className="p-1.5 text-white/40 hover:text-white/60 rounded transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Open external button */}
          <button
            onClick={handleOpenExternal}
            disabled={!url}
            className="p-1.5 text-white/40 hover:text-white/60 rounded transition-colors disabled:opacity-50"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] p-4 overflow-auto">
        {!url ? (
          <div className="text-center text-white/30">
            <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No preview available</p>
            <p className="text-xs mt-1">Start a sandbox to see your app here</p>
          </div>
        ) : isLoading ? (
          <div className="text-center text-white/30">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
            <p className="text-sm">Loading preview...</p>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
            style={{
              width: DEVICE_SIZES[deviceSize].width,
              height: deviceSize === 'desktop' ? '100%' : '600px',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <iframe
              key={iframeKey}
              src={url}
              className="w-full h-full border-0"
              title="Sandbox Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SandboxPreview;
