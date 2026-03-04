'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook to enable mouse wheel scrolling on horizontal scroll containers.
 *
 * Converts vertical wheel movement (deltaY) to horizontal scroll,
 * allowing users to scroll horizontal lists with their mouse wheel.
 *
 * @param options.speed - Multiplier for scroll speed (default: 1)
 * @param options.smooth - Enable smooth scrolling behavior (default: false)
 * @returns A ref to attach to the scrollable container
 *
 * @example
 * ```tsx
 * function HorizontalList() {
 *   const scrollRef = useHorizontalScroll<HTMLDivElement>();
 *   return (
 *     <div ref={scrollRef} className="flex overflow-x-auto">
 *       {items.map(item => <Card key={item.id} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHorizontalScroll<T extends HTMLElement>(
  options: { speed?: number; smooth?: boolean } = {}
) {
  const { speed = 1, smooth = false } = options;
  const ref = useRef<T>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const el = ref.current;
      if (!el) return;

      // Don't hijack if user is scrolling horizontally naturally (trackpad)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Don't hijack if container can't scroll horizontally
      const canScrollHorizontally = el.scrollWidth > el.clientWidth;
      if (!canScrollHorizontally) return;

      // Check if we're at the scroll boundaries
      const isAtStart = el.scrollLeft <= 0;
      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;

      // Allow natural page scroll if at boundaries and trying to scroll past
      if ((isAtStart && e.deltaY < 0) || (isAtEnd && e.deltaY > 0)) {
        return;
      }

      // Prevent default vertical scroll and convert to horizontal
      e.preventDefault();

      if (smooth) {
        el.scrollBy({
          left: e.deltaY * speed,
          behavior: 'smooth',
        });
      } else {
        el.scrollLeft += e.deltaY * speed;
      }
    },
    [speed, smooth]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Must use { passive: false } to enable preventDefault()
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return ref;
}

export default useHorizontalScroll;
