'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const imageVariants = cva('', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    objectFit: {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
    shadow: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
  },
  defaultVariants: {
    rounded: 'md',
    objectFit: 'cover',
    shadow: 'none',
  },
});

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof imageVariants> {
  fallback?: string;
  aspectRatio?: number;
  overlay?: React.ReactNode;
  caption?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      rounded,
      objectFit,
      shadow,
      fallback,
      aspectRatio,
      overlay,
      caption,
      src,
      alt,
      onError,
      style,
      ...props
    },
    ref
  ) => {
    const [error, setError] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setError(true);
      onError?.(e);
    };

    const imgSrc = error && fallback ? fallback : src;

    const imageElement = (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        className={cn(
          imageVariants({ rounded, objectFit, shadow }),
          'w-full h-full transition-opacity duration-300',
          !loaded && 'opacity-0',
          className
        )}
        style={style}
        {...props}
      />
    );

    if (aspectRatio || overlay) {
      return (
        <figure className="relative">
          <div
            className={cn('relative overflow-hidden', rounded && `rounded-${rounded}`)}
            style={aspectRatio ? { paddingBottom: `${100 / aspectRatio}%` } : undefined}
          >
            <div className={cn(aspectRatio ? 'absolute inset-0' : 'relative')}>
              {!loaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              {imageElement}
              {overlay && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {overlay}
                </div>
              )}
            </div>
          </div>
          {caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    if (caption) {
      return (
        <figure>
          {imageElement}
          <figcaption className="mt-2 text-sm text-muted-foreground text-center">
            {caption}
          </figcaption>
        </figure>
      );
    }

    return imageElement;
  }
);
Image.displayName = 'Image';

export { Image, imageVariants };
