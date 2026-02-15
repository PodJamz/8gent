'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const stepperVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col',
    },
    size: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
  },
});

const stepVariants = cva(
  'flex items-center justify-center rounded-full font-medium transition-colors',
  {
    variants: {
      status: {
        upcoming: 'bg-muted text-muted-foreground',
        current: 'bg-primary text-primary-foreground',
        completed: 'bg-primary text-primary-foreground',
      },
      size: {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      status: 'upcoming',
      size: 'md',
    },
  }
);

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  showConnector?: boolean;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      orientation = 'horizontal',
      size,
      steps,
      currentStep,
      onStepClick,
      showConnector = true,
      ...props
    },
    ref
  ) => {
    const getStatus = (index: number) => {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'upcoming';
    };

    return (
      <div
        ref={ref}
        className={cn(stepperVariants({ orientation, size }), className)}
        {...props}
      >
        {steps.map((step, index) => {
          const status = getStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  'flex gap-3',
                  orientation === 'horizontal' ? 'items-center' : 'items-start',
                  onStepClick && 'cursor-pointer'
                )}
                onClick={() => onStepClick?.(index)}
              >
                <div className={cn(stepVariants({ status, size }))}>
                  {status === 'completed' ? (
                    step.icon || <Check className="h-4 w-4" />
                  ) : (
                    step.icon || index + 1
                  )}
                </div>
                <div className={cn(orientation === 'vertical' && 'pb-8')}>
                  <p
                    className={cn(
                      'font-medium',
                      status === 'upcoming' && 'text-muted-foreground',
                      size === 'sm' && 'text-sm',
                      size === 'lg' && 'text-lg'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  )}
                </div>
              </div>

              {showConnector && !isLast && (
                <div
                  className={cn(
                    'transition-colors',
                    orientation === 'horizontal'
                      ? 'flex-1 h-0.5 min-w-[2rem]'
                      : 'w-0.5 h-8 ml-4',
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);
Stepper.displayName = 'Stepper';

export { Stepper, stepperVariants, stepVariants };
