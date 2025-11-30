import { Badge } from '@/components/ui/badge'
import { cn } from '@/libs/cn'
import type { ComponentProps } from 'react'

interface ProBadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
  size?: 'sm' | 'md' | 'lg'
}

export function ProBadge({ size = 'md', className, ...props }: ProBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1.5 text-sm',
  }

  return (
    <span
      className={cn(
        'rounded-md bg-accent text-white font-bold inline-flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      PRO
    </span>
  )
}
