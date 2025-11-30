import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/libs/cn'

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
