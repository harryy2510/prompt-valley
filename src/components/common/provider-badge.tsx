import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'
import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/database.types'
import { Image } from '@/components/common/image'

type PlatformBadgeProps = Omit<ComponentProps<typeof Badge>, 'variant'> & {
  provider: Tables<'ai_providers'>
  showIcon?: boolean
  comingSoon?: boolean
}

function ProviderBadge({
  provider,
  showIcon = true,
  comingSoon = false,
  className,
  ...props
}: PlatformBadgeProps) {
  return (
    <Badge
      variant="provider"
      className={cn(comingSoon && 'opacity-60', className)}
      {...props}
    >
      {showIcon && <Image alt={provider.name} src={provider.logo_url}  className="size-3.5" />}
      <span>{provider.name}</span>
      {comingSoon && (
        <span className="text-[10px] text-muted-foreground ml-1">
          Coming soon
        </span>
      )}
    </Badge>
  )
}

export { ProviderBadge }
