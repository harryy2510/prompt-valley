import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-[url(@/assets/pro-upsell-bg.webp)] bg-size-[100%_200%] bg-center text-white',
        // Brand variants - main CTA buttons
        'brand-primary':
          'bg-foreground text-background hover:bg-foreground/90 rounded-md',
        'brand-secondary':
          'text-foreground rounded-md border border-border hover:bg-muted',
        // Navigation variants
        'nav-link': 'text-sm text-foreground hover:bg-muted rounded-md',
        'nav-link-muted':
          'text-sm text-muted-foreground hover:bg-muted rounded-md',
        // Inverse variants - for dark/colored backgrounds
        inverse: 'bg-white text-foreground hover:bg-white/90 shadow-sm',
        'inverse-outline':
          'bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/60',
        // Overlay variant - for card overlays
        overlay:
          'bg-foreground/80 text-white backdrop-blur-sm hover:bg-foreground/90 text-xs',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: 'h-6 rounded-md gap-1 px-2 text-xs has-[>svg]:px-1.5',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-md px-8 text-base has-[>svg]:px-6',
        icon: 'size-9',
        'icon-xs': 'size-6',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        nav: 'px-3 py-1.5',
        cta: 'px-5 py-2',
        'cta-lg': 'px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'brand-primary',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
