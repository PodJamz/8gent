'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const paginationItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 w-8 text-xs rounded-md',
        md: 'h-9 w-9 text-sm rounded-md',
        lg: 'h-10 w-10 text-base rounded-lg',
      },
      active: {
        true: 'bg-primary text-primary-foreground hover:bg-primary/90',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
    },
  }
);

export interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationItemVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      variant,
      size,
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      showPrevNext = true,
      ...props
    },
    ref
  ) => {
    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };

    const generatePages = () => {
      const totalPageNumbers = siblingCount * 2 + 3; // siblings + first + last + current

      if (totalPages <= totalPageNumbers) {
        return range(1, totalPages);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = range(1, leftItemCount);
        return [...leftRange, 'dots', totalPages];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = range(totalPages - rightItemCount + 1, totalPages);
        return [1, 'dots', ...rightRange];
      }

      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, 'dots', ...middleRange, 'dots', totalPages];
    };

    const pages = generatePages();

    return (
      <nav ref={ref} role="navigation" aria-label="Pagination" className={cn('flex items-center gap-1', className)} {...props}>
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(paginationItemVariants({ variant, size }))}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
        {showPrevNext && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(paginationItemVariants({ variant, size }))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {pages.map((page, index) => {
          if (page === 'dots') {
            return (
              <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(paginationItemVariants({ variant, size, active: currentPage === page }))}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {showPrevNext && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(paginationItemVariants({ variant, size }))}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(paginationItemVariants({ variant, size }))}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';

export { Pagination, paginationItemVariants };
