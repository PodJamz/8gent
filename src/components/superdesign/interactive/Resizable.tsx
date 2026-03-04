'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  directions?: ResizeDirection[];
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  onResize?: (width: number, height: number) => void;
  handleClassName?: string;
  disabled?: boolean;
}

const directionCursors: Record<ResizeDirection, string> = {
  n: 'cursor-n-resize',
  s: 'cursor-s-resize',
  e: 'cursor-e-resize',
  w: 'cursor-w-resize',
  ne: 'cursor-ne-resize',
  nw: 'cursor-nw-resize',
  se: 'cursor-se-resize',
  sw: 'cursor-sw-resize',
};

const directionPositions: Record<ResizeDirection, string> = {
  n: 'top-0 left-0 right-0 h-2 -translate-y-1/2',
  s: 'bottom-0 left-0 right-0 h-2 translate-y-1/2',
  e: 'right-0 top-0 bottom-0 w-2 translate-x-1/2',
  w: 'left-0 top-0 bottom-0 w-2 -translate-x-1/2',
  ne: 'top-0 right-0 w-4 h-4 -translate-y-1/2 translate-x-1/2',
  nw: 'top-0 left-0 w-4 h-4 -translate-y-1/2 -translate-x-1/2',
  se: 'bottom-0 right-0 w-4 h-4 translate-y-1/2 translate-x-1/2',
  sw: 'bottom-0 left-0 w-4 h-4 translate-y-1/2 -translate-x-1/2',
};

const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  (
    {
      className,
      directions = ['e', 's', 'se'],
      minWidth = 100,
      maxWidth = Infinity,
      minHeight = 100,
      maxHeight = Infinity,
      defaultWidth,
      defaultHeight,
      onResize,
      handleClassName,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({
      width: defaultWidth,
      height: defaultHeight,
    });

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const handleMouseDown = (direction: ResizeDirection) => (e: React.MouseEvent) => {
      if (disabled) return;

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = containerRef.current?.offsetWidth || 0;
      const startHeight = containerRef.current?.offsetHeight || 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on direction
        if (direction.includes('e')) newWidth = startWidth + deltaX;
        if (direction.includes('w')) newWidth = startWidth - deltaX;
        if (direction.includes('s')) newHeight = startHeight + deltaY;
        if (direction.includes('n')) newHeight = startHeight - deltaY;

        // Apply constraints
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

        setDimensions({ width: newWidth, height: newHeight });
        onResize?.(newWidth, newHeight);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <div
        ref={containerRef}
        className={cn('relative', className)}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          ...style,
        }}
        {...props}
      >
        {children}
        {!disabled &&
          directions.map((direction) => (
            <div
              key={direction}
              className={cn(
                'absolute z-10',
                directionCursors[direction],
                directionPositions[direction],
                handleClassName
              )}
              onMouseDown={handleMouseDown(direction)}
            >
              {/* Corner handles get a visible indicator */}
              {['ne', 'nw', 'se', 'sw'].includes(direction) && (
                <div className="w-2 h-2 bg-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity" />
              )}
            </div>
          ))}
      </div>
    );
  }
);
Resizable.displayName = 'Resizable';

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
}

const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ className, direction = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, defaultSize = 50, minSize = 10, maxSize = 90, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('overflow-hidden', className)}
        style={{
          flexBasis: `${defaultSize}%`,
          flexGrow: 0,
          flexShrink: 0,
          minWidth: `${minSize}%`,
          maxWidth: `${maxSize}%`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResizablePanel.displayName = 'ResizablePanel';

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  withHandle?: boolean;
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, direction = 'horizontal', withHandle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center bg-border',
          direction === 'horizontal'
            ? 'w-px cursor-col-resize hover:w-1 hover:bg-primary/50'
            : 'h-px cursor-row-resize hover:h-1 hover:bg-primary/50',
          'transition-all',
          className
        )}
        {...props}
      >
        {withHandle && (
          <div
            className={cn(
              'z-10 flex items-center justify-center rounded-sm border bg-border',
              direction === 'horizontal' ? 'h-8 w-3' : 'h-3 w-8'
            )}
          >
            <div
              className={cn(
                'flex gap-0.5',
                direction === 'horizontal' ? 'flex-col' : 'flex-row'
              )}
            >
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    );
  }
);
ResizableHandle.displayName = 'ResizableHandle';

export { Resizable, ResizablePanelGroup, ResizablePanel, ResizableHandle };
