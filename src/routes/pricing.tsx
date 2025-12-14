import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { MainLayout } from '@/components/layout'
import { trackPricingViewed } from '@/libs/posthog'
import { PricingCard, PricingFaq } from '@/components/pricing'
import { useStripeProduct, stripeProductQueryOptions } from '@/actions/stripe'
import { LogoPro } from '@/components/layout/logo-pro'

export const Route = createFileRoute('/pricing')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(stripeProductQueryOptions())
  },
  component: PricingPage,
})

function PricingPage() {
  const { data: product } = useStripeProduct()

  // Track pricing page view (only once)
  const hasTracked = useRef(false)
  useEffect(() => {
    if (!hasTracked.current) {
      trackPricingViewed()
      hasTracked.current = true
    }
  }, [])

  return (
    <MainLayout>
      <div className="container mx-auto py-16 bg-linear-to-b from-primary-50 to-transparent">
        {/* Hero Section */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left - Text */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2">
              <LogoPro className="size-16" />
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              One simple plan unlocks everything.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              No bundles. No add-ons.
            </p>
          </div>

          {/* Right - Pricing Card */}
          <div className="flex justify-center lg:justify-end">
            {product && <PricingCard product={product} />}
          </div>
        </div>

        {/* FAQ Section */}
        <PricingFaq />
      </div>
    </MainLayout>
  )
}
