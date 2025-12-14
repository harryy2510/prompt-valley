import type { ComponentProps } from 'react'
import { BookmarkIcon, Heart } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/libs/cn'
import { Badge } from '@/components/ui/badge'
import { ProBadge } from '@/components/common/pro-badge'
import { ProviderBadge } from '@/components/common/provider-badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { IconButton } from '@/components/common/icon-button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Tables } from '@/types/database.types'
import { compact, uniqBy } from 'lodash-es'
import { ImageGrid } from '@/components/common/image-grid'
import {
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from '@/actions/favorites'
import { useIsLiked, useAddLike, useRemoveLike } from '@/actions/likes'
import { useGate } from '@/components/common/gate'
import { showSignInDialog } from '@/stores/app'

// Database-aligned prompt type
type Prompt = Tables<'prompts'>

// Extended prompt with relations (for joined queries)
type PromptWithRelations = Prompt & {
  category?: Tables<'categories'> | null
  tags?: Array<{ tag: Tables<'tags'> }>
  models?: Array<{
    model: Tables<'ai_models'> & { provider?: Tables<'ai_providers'> }
  }>
}

type PromptCardProps = ComponentProps<'article'> & {
  prompt: PromptWithRelations
  onClick?: () => void
}

function PromptCard({ prompt, onClick, className, ...props }: PromptCardProps) {
  const isPro = prompt.tier === 'pro'
  const tagsList = uniqBy(
    prompt.tags?.map((t) => t.tag),
    'id',
  )
  const models = compact(
    uniqBy(
      prompt.models?.map((m) => m.model),
      'id',
    ),
  )

  // Auth state
  const { isAuthenticated, isLoading: isAuthLoading } = useGate()

  // Save functionality (self-contained)
  const { data: isSaved } = useIsFavorite(prompt.id)
  const addSave = useAddFavorite()
  const removeSave = useRemoveFavorite()

  // Like functionality (self-contained)
  const { data: isLiked } = useIsLiked(prompt.id)
  const addLike = useAddLike()
  const removeLike = useRemoveLike()

  const handleSave = () => {
    if (!isAuthenticated) {
      showSignInDialog()
      return
    }
    if (isSaved) {
      removeSave.mutate(prompt.id)
    } else {
      addSave.mutate(prompt.id)
    }
  }

  const handleLike = () => {
    if (!isAuthenticated) {
      showSignInDialog()
      return
    }
    if (isLiked) {
      removeLike.mutate(prompt.id)
    } else {
      addLike.mutate(prompt.id)
    }
  }

  return (
    <Link
      to="/prompts/$id"
      params={{ id: prompt.id }}
      onClick={onClick}
      className="block"
    >
      <article
        data-slot="prompt-card"
        className={cn('group flex flex-col gap-3 cursor-pointer', className)}
        {...props}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg bg-muted">
          <ImageGrid images={prompt.images} title={prompt.title} />

          {/* Pro badge - bottom left */}
          {isPro && (
            <div className="absolute bottom-3 left-3">
              <ProBadge />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* Title row with like and bookmark */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-body2-semibold text-foreground line-clamp-1">
              {prompt.title}
            </h3>
            <div className="flex shrink-0 -mr-2 -mt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleLike()
                    }}
                    className="size-7"
                    disabled={
                      isAuthLoading || addLike.isPending || removeLike.isPending
                    }
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                  >
                    <Heart
                      className={cn(
                        'size-4',
                        isLiked && 'fill-current text-red-500',
                      )}
                    />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>{isLiked ? 'Unlike' : 'Like'}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleSave()
                    }}
                    className="size-7"
                    disabled={
                      isAuthLoading || addSave.isPending || removeSave.isPending
                    }
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                  >
                    <BookmarkIcon
                      className={cn('size-4', isSaved && 'fill-current')}
                    />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>{isSaved ? 'Unsave' : 'Save'}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Description */}
          {prompt.description && (
            <p className="text-caption text-muted-foreground line-clamp-2">
              {prompt.description}
            </p>
          )}

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {models.map((model) => (
              <Link
                key={model.id}
                to="/models/$id"
                params={{ id: model.id }}
                onClick={(e) => e.stopPropagation()}
              >
                {model.provider ? (
                  <ProviderBadge provider={model.provider} />
                ) : (
                  <Badge variant="secondary">{model.name}</Badge>
                )}
              </Link>
            ))}
            {prompt.category && (
              <Link
                to="/categories/$id"
                params={{ id: prompt.category.id }}
                onClick={(e) => e.stopPropagation()}
              >
                <Badge variant="secondary">{prompt.category.name}</Badge>
              </Link>
            )}
            {tagsList.slice(0, 2).map((tag) => (
              <Link
                key={tag.id}
                to="/tags/$id"
                params={{ id: tag.id }}
                onClick={(e) => e.stopPropagation()}
              >
                <Badge variant="secondary">{tag.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </Link>
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
