import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'gradient'
    | 'brand-primary'
    | 'brand-secondary'
    | 'nav-link'
    | 'nav-link-muted'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg' | 'nav' | 'cta' | 'cta-lg'
  className?: string
}

export function LinkButton({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link {...props}>{children}</Link>
    </Button>
  )
}
