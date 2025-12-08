import type { ComponentProps, ReactNode } from 'react'
import { BookmarkIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/common/copy-button'
import { ProBadge } from '@/components/common/pro-badge'
import { ProviderBadge } from '@/components/common/provider-badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { IconButton } from '@/components/common/icon-button'
import type { Tables, Enums } from '@/types/database.types'
import { compact, uniqBy } from 'lodash-es'
import { Image } from '@/components/common/image'

// Database-aligned prompt type
type Prompt = Tables<'prompts'>
type Tier = Enums<'tier'>

// Extended prompt with relations (for joined queries)
type PromptWithRelations = Prompt & {
  category?: Tables<'categories'> | null
  tags?: Array<{ tag: Tables<'tags'> }>
  models?: Array<{
    model: Tables<'ai_models'> & { provider?: Tables<'ai_providers'> }
  }>
}

type PromptCardProps = ComponentProps<'article'> & {
  // Can accept either raw props or a prompt object
  prompt?: PromptWithRelations
  // Individual props (for flexibility)
  title?: string
  description?: string | null
  imageUrl?: string
  imagePlaceholder?: ReactNode
  promptText?: string
  category?: string
  tags?: string[]
  tier?: Tier
  isSaved?: boolean
  onSave?: () => void
  onCopy?: () => void
  onClick?: () => void
}

function PromptCard({
  prompt,
  title: titleProp,
  description: descriptionProp,
  imageUrl: imageUrlProp,
  imagePlaceholder,
  promptText: promptTextProp,
  category: categoryProp,
  tags: tagsProp = [],
  tier: tierProp,
  isSaved = false,
  onSave,
  onCopy,
  onClick,
  className,
  ...props
}: PromptCardProps) {
  // Resolve props from prompt object or individual props
  const title = titleProp ?? prompt?.title ?? ''
  const description = descriptionProp ?? prompt?.description
  const imageUrl = imageUrlProp ?? prompt?.images?.[0]
  const promptText = promptTextProp ?? prompt?.content ?? ''
  const category = categoryProp ?? prompt?.category?.name
  const tier = tierProp ?? prompt?.tier ?? 'free'
  const isPro = tier === 'pro'

  // Extract tag names from relations or use prop
  const tags =
    tagsProp.length > 0
      ? tagsProp
      : (prompt?.tags?.map((t) => t.tag.name) ?? [])

  const providers = compact(
    uniqBy(
      prompt?.models?.map((model) => model.model.provider),
      'id',
    ),
  )

  return (
    <article
      data-slot="prompt-card"
      className={cn('group flex flex-col gap-3 cursor-pointer', className)}
      onClick={onClick}
      {...props}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <AspectRatio ratio={4 / 3}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            imagePlaceholder || (
              <div className="size-full bg-gradient-to-br from-secondary-200 to-secondary-400" />
            )
          )}
        </AspectRatio>

        {/* Overlay badges */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between">
          {/* Copy button - bottom left */}
          <CopyButton
            textToCopy={promptText}
            onCopied={onCopy}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Pro badge - top left */}
        {isPro && (
          <div className="absolute top-3 left-3">
            <ProBadge size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        {/* Title row with bookmark */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-body2-semibold text-foreground line-clamp-1">
            {title}
          </h3>
          <IconButton
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              onSave?.()
            }}
            className="shrink-0 -mr-2 -mt-1 size-7"
            aria-label={isSaved ? 'Remove from saved' : 'Save prompt'}
          >
            <BookmarkIcon className={cn('size-4', isSaved && 'fill-current')} />
          </IconButton>
        </div>

        {/* Description */}
        {description && (
          <p className="text-caption text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {providers.map((provider) => (
            <ProviderBadge provider={provider} showIcon={false} />
          ))}
          {category && <Badge variant="category">{category}</Badge>}
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  )
}

// Skeleton variant for loading states
function PromptCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="prompt-card-skeleton"
      className={cn('flex flex-col gap-3', className)}
    >
      <div className="overflow-hidden rounded-lg bg-muted">
        <AspectRatio ratio={4 / 3}>
          <div className="size-full animate-pulse bg-muted" />
        </AspectRatio>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export { PromptCard, PromptCardSkeleton }
export type { PromptCardProps, PromptWithRelations }
