import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'

const badgeVariants = cva(
  'inline-flex items-center justify-center border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'rounded-full border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'rounded-full border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'rounded-full border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'rounded-full text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        // Tag variant - for prompt tags (Sand, Serenity, etc.)
        tag: 'rounded-md border-border bg-background text-foreground hover:bg-muted',
        // Category variant - for category badges (Image Generation, Writing)
        category:
          'rounded-md border-border bg-muted text-muted-foreground hover:bg-muted/80',
        // Platform variant - for AI provider badges (ChatGPT, Gemini, etc.)
        provider:
          'rounded-md border-border bg-background text-foreground [&>svg]:size-3.5',
        // Pro variant - purple PRO badge
        pro: 'rounded-md border-transparent bg-primary text-primary-foreground font-semibold',
        // Copy variant - overlay copy badge
        copy: 'rounded-md border-transparent bg-foreground/80 text-white backdrop-blur-sm',
        // Success variant
        success:
          'rounded-full border-transparent bg-success text-success-foreground',
        // Warning variant
        warning:
          'rounded-full border-transparent bg-warning text-warning-foreground',
      },
      size: {
        default: 'px-2 py-0.5 text-xs',
        sm: 'px-1.5 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
