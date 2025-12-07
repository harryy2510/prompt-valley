import type { ComponentProps } from 'react'
import { StarIcon } from 'lucide-react'

import { cn } from '@/libs/cn'

type ProBadgeProps = ComponentProps<'div'> & {
  size?: 'sm' | 'default' | 'lg'
}

function ProBadge({ className, size = 'default', ...props }: ProBadgeProps) {
  return (
    <div
      data-slot="pro-badge"
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-foreground/80 text-white backdrop-blur-sm font-medium',
        size === 'sm' && 'px-1.5 py-0.5 text-[10px] [&>svg]:size-2.5',
        size === 'default' && 'px-2 py-1 text-xs [&>svg]:size-3',
        size === 'lg' && 'px-2.5 py-1.5 text-sm [&>svg]:size-3.5',
        className,
      )}
      {...props}
    >
      <StarIcon className="fill-current" />
      <span>Pro</span>
    </div>
  )
}

export { ProBadge }
