import { useState, type ComponentProps } from 'react'
import NumberFlow from '@number-flow/react'
import { SparklesIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'
import { PricingToggle, type PricingPeriod } from '@/components/ui/pricing-toggle'
import type { Tables } from '@/types/database.types'

// Database-aligned types
type StripeProduct = Tables<'stripe_products'>
type StripePrice = Tables<'stripe_prices'>
type StripeCoupon = Tables<'stripe_coupons'>

// Price info extracted from database
type PriceInfo = {
  id: string
  amount: number // in dollars (already converted from cents)
  interval: 'month' | 'year'
}

type PricingCardProps = ComponentProps<'div'> & {
  // Product with prices
  product: StripeProduct & {
    prices: StripePrice[]
  }
  // Optional coupon for discount
  coupon?: StripeCoupon | null
  // Features list (from product.features or manual override)
  features?: string[]
  // CTA
  ctaText?: string
  onCtaClick?: (priceId: string, period: PricingPeriod) => void
  ctaLoading?: boolean
  // Fine print
  finePrint?: string
  // Default period
  defaultPeriod?: PricingPeriod
}

// Helper to extract and organize prices
function extractPrices(prices: StripePrice[]): { monthly?: PriceInfo; yearly?: PriceInfo } {
  const result: { monthly?: PriceInfo; yearly?: PriceInfo } = {}

  for (const price of prices) {
    if (!price.active) continue

    const amount = price.unit_amount / 100 // Convert cents to dollars

    if (price.recurring_interval === 'month') {
      result.monthly = { id: price.id, amount, interval: 'month' }
    } else if (price.recurring_interval === 'year') {
      // Convert yearly to monthly equivalent for display
      result.yearly = { id: price.id, amount: Math.round(amount / 12), interval: 'year' }
    }
  }

  return result
}

// Apply coupon discount
function applyDiscount(amount: number, coupon?: StripeCoupon | null): number {
  if (!coupon?.valid) return amount

  if (coupon.percent_off) {
    return Math.round(amount * (1 - coupon.percent_off / 100))
  }

  if (coupon.amount_off) {
    return Math.max(0, amount - coupon.amount_off / 100)
  }

  return amount
}

function PricingCard({
  product,
  coupon,
  features: featuresProp,
  ctaText = 'Get PRO',
  onCtaClick,
  ctaLoading = false,
  finePrint = 'Renews automatically • Cancel anytime',
  defaultPeriod = 'yearly',
  className,
  ...props
}: PricingCardProps) {
  const [period, setPeriod] = useState<PricingPeriod>(defaultPeriod)

  const prices = extractPrices(product.prices)
  // Note: After running migration, regenerate types to get marketing_features
  const features = featuresProp ?? (product as StripeProduct & { marketing_features?: string[] }).marketing_features ?? product.features ?? []

  // Get current price based on period
  const currentPriceInfo = period === 'yearly' ? prices.yearly : prices.monthly
  if (!currentPriceInfo) return null

  // Calculate prices with/without discount
  const originalPrice = currentPriceInfo.amount
  const discountedPrice = applyDiscount(originalPrice, coupon)
  const hasDiscount = coupon?.valid && discountedPrice < originalPrice

  // Calculate yearly discount percentage
  const yearlyDiscountPercent = prices.monthly && prices.yearly
    ? Math.round((1 - prices.yearly.amount / prices.monthly.amount) * 100)
    : 0

  return (
    <div
      data-slot="pricing-card"
      className={cn(
        'flex flex-col items-center w-full max-w-md rounded-xl bg-card p-8',
        className,
      )}
      {...props}
    >
      {/* Period toggle */}
      <PricingToggle
        value={period}
        onChange={setPeriod}
        yearlyDiscount={yearlyDiscountPercent > 0 ? `${yearlyDiscountPercent}% Off` : undefined}
      />

      {/* Pricing section */}
      <div className="mt-8 flex flex-col items-center">
        {/* Coupon badge */}
        {hasDiscount && coupon?.name && (
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold tracking-wide text-background uppercase">
            {coupon.name}
          </div>
        )}

        {/* Price display */}
        <div className="flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-h4 text-muted-foreground line-through">
              $<NumberFlow value={originalPrice} />
            </span>
          )}
          <span className="text-display text-foreground">
            $<NumberFlow value={discountedPrice} />
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
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start gap-3 text-body2">
            <SparklesIcon className="size-4 shrink-0 mt-0.5 text-primary" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant="brand-primary"
        size="lg"
        className="mt-8 w-full"
        onClick={() => onCtaClick?.(currentPriceInfo.id, period)}
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
export type { PricingCardProps }
