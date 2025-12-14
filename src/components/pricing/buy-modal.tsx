import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { PricingCard } from './pricing-card'
import { useStripeProduct } from '@/actions/stripe'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// ============================================
// Types
// ============================================

type BuyModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckout?: (priceId: string) => void
  isLoading?: boolean
}

// ============================================
// Testimonial Data
// ============================================

const testimonial = {
  quote:
    'By using the PromptValley app, I save both my research time and space in my photo galleries filled with random screenshots. I love how easy it is to search for different patterns and copy and paste flows into Figma. It is a wonderful design tool you cannot live without!',
  author: 'Daryl Ginn',
  role: 'Product Manager',
  avatar: '/testimonials/daryl.jpg',
}

// ============================================
// Buy Modal Component
// ============================================

export function BuyModal({
  open,
  onOpenChange,
  onCheckout,
  isLoading,
}: BuyModalProps) {
  const { data: product } = useStripeProduct()

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Get PromptValley Pro</DialogTitle>
        </VisuallyHidden>

        {/* Pro Badge and Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
            <svg
              className="size-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3l14 9-14 9V3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">
            One simple plan unlocks everything.
          </h2>
          <p className="mt-1 text-muted-foreground">
            No bundles. No add-ons.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <PricingCard
            product={product}
            onCheckout={onCheckout}
            isLoading={isLoading}
            className="max-w-sm"
          />
        </div>

        {/* Testimonial */}
        <div className="mt-4 border-t pt-6">
          <div className="text-center">
            <p className="text-lg italic text-muted-foreground">
              "{testimonial.quote}"
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="size-10 rounded-full bg-muted" />
              <div className="text-left">
                <p className="text-sm font-medium">{testimonial.author}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
