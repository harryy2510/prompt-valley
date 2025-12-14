import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PricingCard } from '../cards/pricing-card'
import { useStripeProduct } from '@/actions/stripe'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { LogoPro } from '@/components/layout/logo-pro'
import { useStoreValue } from 'zustand-x'
import { QuoteIcon } from 'lucide-react'
import { appStore } from '@/stores/app'
import { ReactNode } from 'react'

// ============================================
// Types
// ============================================

type BuyModalProps = {
  /** Trigger element that opens the dialog */
  children?: ReactNode
  /** Whether the dialog is open (controlled) */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
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

export function BuyModal({ children, open, onOpenChange }: BuyModalProps) {
  const { data: product } = useStripeProduct()
  const storeValue = useStoreValue(appStore, 'buyDialog')

  const controlledOpen = typeof open !== 'undefined' ? open : storeValue

  const setControlledOpenState = (value: boolean) =>
    typeof open !== 'undefined'
      ? onOpenChange?.(value)
      : appStore.set('buyDialog', value)

  if (!product) return null

  return (
    <Dialog open={controlledOpen} onOpenChange={setControlledOpenState}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        size="xl"
        className="max-h-[90vh] border-none overflow-y-auto"
      >
        <div className="h-2 w-full overflow-hidden absolute left-0 top-0 bg-[url(@/assets/landing/footer-upsell-background.webp)] bg-size-[auto_100%] xl:bg-size-[100%_auto] bg-center bg-no-repeat" />
        <VisuallyHidden>
          <DialogTitle>Get PromptValley Pro</DialogTitle>
        </VisuallyHidden>

        {/* Pro Badge and Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <LogoPro className="size-16" />
          </div>
          <h2 className="text-2xl font-bold">
            One simple plan unlocks everything.
          </h2>
          <p className="mt-1 text-muted-foreground">No bundles. No add-ons.</p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <PricingCard product={product} />
        </div>

        <div className="justify-center items-center flex mt-2">
          <QuoteIcon className="rotate-180 stroke-gray-200 fill-gray-200" />
        </div>

        {/* Testimonial */}
        <div className="text-center">
          <p className="text-base font-bold">{testimonial.quote}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="size-10 rounded-full bg-muted" />
            <div className="text-left">
              <p className="text-sm font-medium">{testimonial.author}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
