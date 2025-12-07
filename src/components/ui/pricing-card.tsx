import { useState, type ComponentProps, type ReactNode } from 'react'
import { CheckIcon, PartyPopperIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'
import { PricingToggle, type PricingPeriod } from '@/components/ui/pricing-toggle'

type PricingFeature = {
  text: string
  included: boolean
}

type PricingCardProps = ComponentProps<'div'> & {
  // Header
  logo?: ReactNode
  title: string
  subtitle?: string
  // Pricing
  monthlyPrice: number
  yearlyPrice: number
  originalMonthlyPrice?: number
  originalYearlyPrice?: number
  currency?: string
  // Features
  features: (string | PricingFeature)[]
  // CTA
  ctaText?: string
  onCtaClick?: (period: PricingPeriod) => void
  ctaLoading?: boolean
  // Badge
  badge?: string
  // Fine print
  finePrint?: string
  // Default period
  defaultPeriod?: PricingPeriod
}

function PricingCard({
  logo,
  title,
  subtitle,
  monthlyPrice,
  yearlyPrice,
  originalMonthlyPrice,
  originalYearlyPrice,
  currency = '$',
  features,
  ctaText = 'Get PRO',
  onCtaClick,
  ctaLoading = false,
  badge,
  finePrint,
  defaultPeriod = 'yearly',
  className,
  ...props
}: PricingCardProps) {
  const [period, setPeriod] = useState<PricingPeriod>(defaultPeriod)

  const currentPrice = period === 'yearly' ? yearlyPrice : monthlyPrice
  const originalPrice = period === 'yearly' ? originalYearlyPrice : originalMonthlyPrice
  const hasDiscount = originalPrice && originalPrice > currentPrice

  return (
    <div
      data-slot="pricing-card"
      className={cn(
        'flex flex-col items-center w-full max-w-md rounded-xl bg-card p-8',
        className,
      )}
      {...props}
    >
      {/* Logo */}
      {logo && <div className="mb-4">{logo}</div>}

      {/* Title */}
      <h2 className="text-h4 text-center">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-body2 text-muted-foreground text-center">
          {subtitle}
        </p>
      )}

      {/* Period toggle */}
      <div className="mt-6">
        <PricingToggle value={period} onChange={setPeriod} />
      </div>

      {/* Pricing section */}
      <div className="mt-6 flex flex-col items-center">
        {badge && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
            <PartyPopperIcon className="size-3.5" />
            <span>{badge}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-h4 text-muted-foreground line-through">
              {currency}{originalPrice}
            </span>
          )}
          <span className="text-display text-foreground">
            {currency}{currentPrice}
          </span>
          <span className="text-body2 text-muted-foreground">
            per month
            {period === 'yearly' && (
              <span className="block text-caption">billed yearly</span>
            )}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="mt-8 w-full space-y-3">
        {features.map((feature, index) => {
          const featureText = typeof feature === 'string' ? feature : feature.text
          const isIncluded = typeof feature === 'string' ? true : feature.included

          return (
            <li
              key={index}
              className={cn(
                'flex items-start gap-3 text-body2',
                !isIncluded && 'opacity-50',
              )}
            >
              <CheckIcon
                className={cn(
                  'size-4 shrink-0 mt-0.5',
                  isIncluded ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              <span className={isIncluded ? 'text-foreground' : 'text-muted-foreground'}>
                {featureText}
              </span>
            </li>
          )
        })}
      </ul>

      {/* CTA Button */}
      <Button
        variant="brand-primary"
        size="lg"
        className="mt-8 w-full"
        onClick={() => onCtaClick?.(period)}
        disabled={ctaLoading}
      >
        {ctaLoading ? 'Processing...' : ctaText}
      </Button>

      {/* Fine print */}
      {finePrint && (
        <p className="mt-3 text-caption text-muted-foreground text-center">
          {finePrint}
        </p>
      )}
    </div>
  )
}

export { PricingCard }
