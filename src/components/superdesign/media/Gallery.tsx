'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const galleryVariants = cva('grid', {
  variants: {
    columns: {
      2: 'grid-cols-2',
      3: 'grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      auto: 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    columns: 3,
    gap: 'md',
  },
});

export interface GalleryImage {
  src: string;
  alt?: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

export interface GalleryProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof galleryVariants> {
  images: GalleryImage[];
  lightbox?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  aspectRatio?: number;
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      className,
      columns,
      gap,
      images,
      lightbox = true,
      rounded = 'md',
      aspectRatio = 1,
      ...props
    },
    ref
  ) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

    const openLightbox = (index: number) => {
      if (lightbox) {
        setSelectedIndex(index);
        document.body.style.overflow = 'hidden';
      }
    };

    const closeLightbox = () => {
      setSelectedIndex(null);
      document.body.style.overflow = '';
    };

    const goToNext = () => {
      if (selectedIndex !== null) {
        setSelectedIndex((selectedIndex + 1) % images.length);
      }
    };

    const goToPrev = () => {
      if (selectedIndex !== null) {
        setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
      }
    };

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedIndex === null) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrev();
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    const roundedClass = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
    }[rounded];

    return (
      <>
        <div ref={ref} className={cn(galleryVariants({ columns, gap }), className)} {...props}>
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                'relative overflow-hidden cursor-pointer group',
                roundedClass
              )}
              style={{ paddingBottom: `${100 / aspectRatio}%` }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.thumbnail || image.src}
                alt={image.alt || ''}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {lightbox && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={closeLightbox}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}

              {/* Image */}
              <motion.div
                key={selectedIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt || ''}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                {(images[selectedIndex].title || images[selectedIndex].description) && (
                  <div className="mt-4 text-center text-white">
                    {images[selectedIndex].title && (
                      <h3 className="text-lg font-semibold">{images[selectedIndex].title}</h3>
                    )}
                    {images[selectedIndex].description && (
                      <p className="text-sm text-white/70 mt-1">{images[selectedIndex].description}</p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);
Gallery.displayName = 'Gallery';

export { Gallery, galleryVariants };
