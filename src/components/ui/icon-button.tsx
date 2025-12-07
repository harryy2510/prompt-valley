import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'

type IconButtonProps = Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size'
> & {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'icon' | 'icon-sm' | 'icon-lg'
}

export function IconButton({
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('rounded-lg', className)}
      {...props}
    />
  )
}
