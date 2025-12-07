import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'

type PricingPeriod = 'monthly' | 'yearly'

type PricingToggleProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  value: PricingPeriod
  onChange: (value: PricingPeriod) => void
  yearlyDiscount?: string
}

function PricingToggle({
  value,
  onChange,
  yearlyDiscount = '33% Off',
  className,
  ...props
}: PricingToggleProps) {
  return (
    <div
      data-slot="pricing-toggle"
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background p-1',
        className,
      )}
      role="radiogroup"
      aria-label="Billing period"
      {...props}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === 'yearly'}
        onClick={() => onChange('yearly')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
          value === 'yearly'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <span>Yearly</span>
        {yearlyDiscount && (
          <span
            className={cn(
              'text-xs',
              value === 'yearly' ? 'text-background/80' : 'text-primary',
            )}
          >
            ({yearlyDiscount})
          </span>
        )}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === 'monthly'}
        onClick={() => onChange('monthly')}
        className={cn(
          'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all',
          value === 'monthly'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Monthly
      </button>
    </div>
  )
}

export { PricingToggle }
export type { PricingPeriod }
