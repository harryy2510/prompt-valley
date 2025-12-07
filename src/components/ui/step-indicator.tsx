import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'

type StepIndicatorProps = ComponentProps<'div'> & {
  totalSteps: number
  currentStep: number
}

function StepIndicator({
  totalSteps,
  currentStep,
  className,
  ...props
}: StepIndicatorProps) {
  return (
    <div
      data-slot="step-indicator"
      className={cn('flex items-center gap-2', className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      {...props}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep

        return (
          <div
            key={step}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              isCompleted && 'bg-primary',
              isCurrent && 'bg-primary',
              !isCompleted && !isCurrent && 'bg-muted',
            )}
            aria-label={`Step ${step} of ${totalSteps}`}
          />
        )
      })}
    </div>
  )
}

// Numbered step indicator variant
type NumberedStepIndicatorProps = ComponentProps<'div'> & {
  steps: string[]
  currentStep: number
}

function NumberedStepIndicator({
  steps,
  currentStep,
  className,
  ...props
}: NumberedStepIndicatorProps) {
  return (
    <div
      data-slot="numbered-step-indicator"
      className={cn('flex items-center justify-between', className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      {...props}
    >
      {steps.map((label, index) => {
        const step = index + 1
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center gap-2">
            {/* Step circle */}
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                isCompleted && 'bg-primary text-primary-foreground',
                isCurrent && 'bg-primary text-primary-foreground',
                !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
              )}
            >
              {isCompleted ? (
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-sm font-medium hidden sm:inline',
                isCurrent ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>

            {/* Connector line (except for last step) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-px flex-1 min-w-8',
                  isCompleted ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export { StepIndicator, NumberedStepIndicator }
