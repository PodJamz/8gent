'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

const videoVariants = cva('', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
  },
  defaultVariants: {
    rounded: 'md',
  },
});

export interface VideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement>,
    VariantProps<typeof videoVariants> {
  aspectRatio?: number;
  showControls?: 'native' | 'custom' | 'none';
  thumbnail?: string;
}

const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      className,
      rounded,
      aspectRatio = 16 / 9,
      showControls = 'custom',
      thumbnail,
      src,
      ...props
    },
    ref
  ) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(props.muted || false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [showOverlay, setShowOverlay] = React.useState(true);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
        setShowOverlay(false);
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const toggleFullscreen = async () => {
      if (!containerRef.current) return;

      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);
      }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (videoRef.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = percent * videoRef.current.duration;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowOverlay(true);
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden bg-black group',
          videoVariants({ rounded }),
          className
        )}
        style={{ paddingBottom: `${100 / aspectRatio}%` }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className="absolute inset-0 w-full h-full object-contain"
          controls={showControls === 'native'}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          {...props}
        />

        {showControls === 'custom' && (
          <>
            {/* Play/Pause overlay */}
            {(showOverlay || !isPlaying) && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:opacity-100"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 text-black" aria-hidden="true">
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </div>
              </button>
            )}

            {/* Controls bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress bar */}
              <div
                className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" role="group" aria-label="Video controls">
                  <button onClick={togglePlay} className="text-white hover:text-white/80" aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-white/80" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                <button onClick={toggleFullscreen} className="text-white hover:text-white/80" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                  {isFullscreen ? <Minimize className="h-5 w-5" aria-hidden="true" /> : <Maximize className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);
Video.displayName = 'Video';

export { Video, videoVariants };
