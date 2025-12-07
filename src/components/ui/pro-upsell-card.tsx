import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'

type ProUpsellCardProps = ComponentProps<'div'> & {
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  icon?: ReactNode
  variant?: 'default' | 'compact' | 'inline'
}

function ProUpsellCard({
  title = 'Unlock everything PromptValley has to offer.',
  description = 'Cancel anytime.',
  ctaText = 'Get PRO',
  onCtaClick,
  icon,
  variant = 'default',
  className,
  ...props
}: ProUpsellCardProps) {
  if (variant === 'inline') {
    return (
      <div
        data-slot="pro-upsell-card"
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
            <p className="text-body2-semibold">{title}</p>
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
        data-slot="pro-upsell-card"
        data-variant="compact"
        className={cn(
          'flex flex-col items-start gap-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white',
          className,
        )}
        {...props}
      >
        <div className="text-overline text-white/80">PRO</div>
        <p className="text-body2-semibold">{title}</p>
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
      data-slot="pro-upsell-card"
      data-variant="default"
      className={cn(
        'flex flex-col rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-6 text-white',
        className,
      )}
      {...props}
    >
      {/* PRO label */}
      <div className="text-overline text-white/80 mb-2">PRO</div>

      {/* Title */}
      <h3 className="text-h5 font-semibold mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-body2 text-white/80 mb-6">{description}</p>
      )}

      {/* CTA Button */}
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

// Premium content block for modals (purple gradient with blur prompt)
type PremiumContentBlockProps = ComponentProps<'div'> & {
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
}

function PremiumContentBlock({
  title = 'PREMIUM CONTENT',
  description = 'Join PromptValley Pro to access this prompt along with hundreds of expert-crafted templates that deliver better AI results.',
  ctaText = 'Get PRO',
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
      {/* Label with icon */}
      <div className="flex items-center gap-2 mb-3">
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-overline">{title}</span>
      </div>

      {/* Description */}
      <p className="text-body2 text-white/90 mb-4">{description}</p>

      {/* CTA Button */}
      <Button variant="inverse" onClick={onCtaClick}>
        {ctaText}
      </Button>
    </div>
  )
}

export { ProUpsellCard, PremiumContentBlock }
