import type { ComponentProps, ReactNode } from 'react'
import { LockIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'
import type { Tables } from '@/types/database.types'

type StripeProduct = Tables<'stripe_products'>

type UpsellCardProps = ComponentProps<'div'> & {
  // Can accept product from database or manual props
  product?: StripeProduct
  // Manual overrides
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  icon?: ReactNode
  variant?: 'default' | 'compact' | 'inline'
}

function UpsellCard({
  product,
  label,
  title: titleProp,
  description: descriptionProp,
  ctaText = 'Get PRO',
  onCtaClick,
  icon,
  variant = 'default',
  className,
  ...props
}: UpsellCardProps) {
  // Extract from product or use props
  const title = titleProp ?? product?.name
  const description = descriptionProp ?? product?.description

  if (variant === 'inline') {
    return (
      <div
        data-slot="upsell-card"
        data-variant="inline"
        className={cn(
          'flex items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {icon}
          <div>
            {title && <p className="text-body2-semibold">{title}</p>}
            {description && (
              <p className="text-caption text-white/70">{description}</p>
            )}
          </div>
        </div>
        <Button
          variant="inverse"
          size="sm"
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        data-slot="upsell-card"
        data-variant="compact"
        className={cn(
          'flex flex-col items-start gap-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white',
          className,
        )}
        {...props}
      >
        {label && <div className="text-overline text-white/80">{label}</div>}
        {title && <p className="text-body2-semibold">{title}</p>}
        {description && (
          <p className="text-caption text-white/70">{description}</p>
        )}
        <Button
          variant="inverse-outline"
          size="sm"
          onClick={onCtaClick}
          className="mt-auto"
        >
          {ctaText}
        </Button>
      </div>
    )
  }

  // Default variant - card style for grid placement
  return (
    <div
      data-slot="upsell-card"
      data-variant="default"
      className={cn(
        'flex flex-col rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-6 text-white',
        className,
      )}
      {...props}
    >
      {label && <div className="text-overline text-white/80 mb-2">{label}</div>}
      {title && <h3 className="text-h5 font-semibold mb-2">{title}</h3>}
      {description && (
        <p className="text-body2 text-white/80 mb-6">{description}</p>
      )}
      <Button
        variant="inverse-outline"
        className="mt-auto w-fit"
        onClick={onCtaClick}
      >
        {ctaText}
      </Button>
    </div>
  )
}

// Premium content block for modals (purple gradient with lock icon)
type PremiumContentBlockProps = ComponentProps<'div'> & {
  label?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
}

function PremiumContentBlock({
  label,
  description,
  ctaText,
  onCtaClick,
  className,
  ...props
}: PremiumContentBlockProps) {
  return (
    <div
      data-slot="premium-content-block"
      className={cn(
        'rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-6 text-white',
        className,
      )}
      {...props}
    >
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <LockIcon className="size-4" />
          <span className="text-overline">{label}</span>
        </div>
      )}
      {description && (
        <p className="text-body2 text-white/90 mb-4">{description}</p>
      )}
      {ctaText && (
        <Button variant="inverse" onClick={onCtaClick}>
          {ctaText}
        </Button>
      )}
    </div>
  )
}

export { UpsellCard, PremiumContentBlock }
export type { UpsellCardProps, PremiumContentBlockProps }
