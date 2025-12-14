import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export type UpsellCardProps = ComponentProps<'div'>

export function UpsellCard({ className, ...props }: UpsellCardProps) {
  return (
    <div
      data-slot="upsell-card"
      data-variant="default"
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl bg-cover p-6 text-white bg-[url(@/assets/pro-upsell-bg.webp)]',
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 font-extrabold text-primary-200">PRO</div>

        <h3 className="mb-2 text-xl font-bold leading-tight">
          Unlock everything PromptValley has to offer.
        </h3>

        <p className="text-sm text-white/70">Cancel anytime.</p>
        <Button variant="inverse" className="mt-auto w-fit" asChild>
          <Link to="/pricing">
            <span>
              Get <span className="font-extrabold text-primary-500">PRO</span>
            </span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
