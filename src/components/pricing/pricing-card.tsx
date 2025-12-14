import { useState } from 'react'
import { Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/libs/cn'
import {
  StripeProductWithPricesAndCoupon,
  useCreateCheckoutSession,
} from '@/actions/stripe'

// ============================================
// Types
// ============================================

type BillingInterval = 'month' | 'year'

type PricingCardProps = {
  product: StripeProductWithPricesAndCoupon
  className?: string
}

// ============================================
// Helper Functions
// ============================================

function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100)}`
}

function calculateDiscountedPrice(
  price: number,
  percentOff: number | null,
): number {
  if (!percentOff) return price
  const discount = percentOff / 100
  return Math.round(price * (1 - discount))
}

function getYearlySavingsPercent(
  monthlyPrice: number,
  yearlyPrice: number,
): number {
  const yearlyMonthlyEquivalent = yearlyPrice / 12
  return Math.round((1 - yearlyMonthlyEquivalent / monthlyPrice) * 100)
}

// ============================================
// Pricing Card Component
// ============================================

export function PricingCard({ product, className }: PricingCardProps) {
  const checkout = useCreateCheckoutSession()
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('year')

  // Get prices by interval
  const monthlyPrice = product.prices.find(
    (p) => p.recurring_interval === 'month',
  )
  const yearlyPrice = product.prices.find(
    (p) => p.recurring_interval === 'year',
  )

  if (!monthlyPrice || !yearlyPrice) {
    return null
  }

  const monthlyAmount = monthlyPrice.unit_amount ?? 0
  const yearlyAmount = yearlyPrice.unit_amount ?? 0

  // Calculate savings percentage for yearly
  const yearlySavings = getYearlySavingsPercent(monthlyAmount, yearlyAmount)

  // Get current price based on selection
  const currentPrice = billingInterval === 'month' ? monthlyPrice : yearlyPrice
  const currentUnitAmount = currentPrice.unit_amount ?? 0

  // Calculate per-month cost (for yearly, divide by 12)
  const perMonthAmount =
    billingInterval === 'year'
      ? Math.round(currentUnitAmount / 12)
      : currentUnitAmount

  // Apply coupon discount if available
  const coupon = product.coupon
  const discountedPerMonth = calculateDiscountedPrice(
    perMonthAmount,
    coupon?.percent_off ?? null,
  )
  const hasDiscount = coupon && discountedPerMonth < perMonthAmount

  const handleCheckout = () => {
    checkout.mutate({ priceId: currentPrice.id, couponId: coupon?.id })
  }

  return (
    <div className={cn('w-full max-w-md', className)}>
      {/* Billing Toggle */}
      <div className="mb-6 flex">
        <Tabs
          value={billingInterval}
          onValueChange={(v) => setBillingInterval(v as BillingInterval)}
        >
          <TabsList>
            <TabsTrigger value="year">
              Yearly ({yearlySavings}% Off)
            </TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing Card */}
      <div className="rounded-xl border bg-background p-6">
        {/* Limited Offer Badge */}
        {coupon && (
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
            {coupon.name}
          </div>
        )}

        {/* Price Display */}
        <div className="mb-6 flex items-end gap-2">
          {hasDiscount && (
            <span className="text-5xl font-medium text-muted-foreground line-through">
              {formatPrice(perMonthAmount)}
            </span>
          )}
          <span className="text-5xl font-bold">
            {formatPrice(discountedPerMonth)}
          </span>
          <span className="text-sm text-muted-foreground pb-1">
            per month
            {billingInterval === 'year' && (
              <>
                <br />
                billed yearly
              </>
            )}
          </span>
        </div>

        {/* Features List */}
        <ul className="mb-6 space-y-3">
          {product.marketing_features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Sparkle className="mt-0.5 size-4 shrink-0 text-primary fill-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          size="lg"
          className="w-full"
          disabled={checkout.isPending}
          onClick={handleCheckout}
        >
          {checkout.isPending ? 'Loading...' : 'Get PRO'}
        </Button>

        {/* Subscription Info */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Renews automatically &bull; Cancel anytime
        </p>
      </div>
    </div>
  )
}
