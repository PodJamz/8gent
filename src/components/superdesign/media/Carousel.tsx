'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const carouselVariants = cva('relative overflow-hidden', {
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
    rounded: 'lg',
  },
});

export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      rounded,
      items,
      autoPlay = false,
      autoPlayInterval = 5000,
      showArrows = true,
      showDots = true,
      loop = true,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);

    const slideVariants = {
      enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
      }),
    };

    const goToSlide = (index: number) => {
      const newDirection = index > currentIndex ? 1 : -1;
      setDirection(newDirection);
      setCurrentIndex(index);
    };

    const nextSlide = () => {
      if (currentIndex === items.length - 1) {
        if (loop) {
          setDirection(1);
          setCurrentIndex(0);
        }
      } else {
        setDirection(1);
        setCurrentIndex(currentIndex + 1);
      }
    };

    const prevSlide = () => {
      if (currentIndex === 0) {
        if (loop) {
          setDirection(-1);
          setCurrentIndex(items.length - 1);
        }
      } else {
        setDirection(-1);
        setCurrentIndex(currentIndex - 1);
      }
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
      const swipeThreshold = 50;
      if (info.offset.x > swipeThreshold) {
        prevSlide();
      } else if (info.offset.x < -swipeThreshold) {
        nextSlide();
      }
    };

    React.useEffect(() => {
      if (!autoPlay) return;

      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, currentIndex]);

    return (
      <div ref={ref} className={cn(carouselVariants({ rounded }), className)} {...props}>
        <div className="relative aspect-video overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0"
            >
              {items[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {showArrows && items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={!loop && currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground shadow-md hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={!loop && currentIndex === items.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground shadow-md hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {showDots && items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = 'Carousel';

export { Carousel, carouselVariants };
