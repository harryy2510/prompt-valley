import { Link } from '@tanstack/react-router'
import { cn } from '@/libs/cn'
import type { ComponentProps } from 'react'

interface LogoProps extends Omit<ComponentProps<typeof Link>, 'to'> {
  to?: string
  showText?: boolean
  iconSize?: 'sm' | 'md' | 'lg'
}

export function Logo({
  to = '/',
  showText = true,
  iconSize = 'md',
  className,
  ...props
}: LogoProps) {
  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-[13px]',
    lg: 'text-base',
  }

  return (
    <Link
      to={to}
      className={cn('flex items-center gap-2 shrink-0', className)}
      {...props}
    >
      <img
        src="/icon.svg"
        alt="Prompt Valley"
        className={iconSizes[iconSize]}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={cn(textSizes[iconSize], 'font-semibold leading-none')}>
            prompt
          </span>
          <span className={cn(textSizes[iconSize], 'font-semibold leading-none')}>
            valley
          </span>
        </div>
      )}
    </Link>
  )
}
