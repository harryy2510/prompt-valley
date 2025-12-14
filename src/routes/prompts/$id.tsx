import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Heart, Bookmark, Copy, ExternalLink, LucideLock } from 'lucide-react'
import { useEffect, useState } from 'react'

import { MainLayout } from '@/components/layout'
import { NotFound } from '@/components/error/not-found'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ProviderBadge } from '@/components/common/provider-badge'
import {
  promptDetailQueryOptions,
  usePromptDetail,
  useIncrementCopies,
  useIncrementViews,
} from '@/actions/prompts'
import { AuthGate, useGate } from '@/components/common/gate'
import { showBuyDialog, showSignInDialog } from '@/stores/app'
import {
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from '@/actions/favorites'
import { useIsLiked, useAddLike, useRemoveLike } from '@/actions/likes'
import { cn } from '@/libs/cn'
import { compact, uniqBy } from 'lodash-es'
import { toast } from 'sonner'
import { Image } from '@/components/common/image'
import { trackPromptViewed, trackPromptCopied } from '@/libs/posthog'

export const Route = createFileRoute('/prompts/$id')({
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        promptDetailQueryOptions(params.id),
      )
    } catch {
      throw notFound()
    }
  },
  notFoundComponent: () => (
    <NotFound>
      <p>The prompt you're looking for doesn't exist or has been removed.</p>
    </NotFound>
  ),
  component: PromptDetailPage,
})

function PromptDetailPage() {
  const { id } = Route.useParams()
  const { data: prompt } = usePromptDetail(id)
  const { isAuthenticated, isPro, isLoading } = useGate()

  // Saves (bookmark icon)
  const { data: isSaved } = useIsFavorite(id)
  const addSave = useAddFavorite()
  const removeSave = useRemoveFavorite()

  // Likes (heart icon)
  const { data: isLiked } = useIsLiked(id)
  const addLike = useAddLike()
  const removeLike = useRemoveLike()

  // Engagement tracking
  const incrementViews = useIncrementViews()
  const incrementCopies = useIncrementCopies()

  // Track view on mount (only once per session)
  useEffect(() => {
    if (id && prompt) {
      incrementViews.mutate(id)
      trackPromptViewed(id, prompt.title, prompt.tier)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, prompt?.id])

  if (!prompt) return null

  const isPremium = prompt.tier === 'pro'
  const hasAccess = !isPremium || isPro

  // Get unique models
  const models = compact(
    uniqBy(
      prompt.models?.map((m) => m.model),
      'id',
    ),
  )

  // Get tags (full objects for linking)
  const tagsList =
    uniqBy(
      prompt.tags?.map((t) => t.tag),
      'id',
    ) ?? []

  // Main image is first, rest are thumbnails
  const images = prompt.images ?? []
  const [selectedImage, setSelectedImage] = useState(0)

  const handleCopy = async () => {
    if (!prompt.content) return
    await navigator.clipboard.writeText(prompt.content)
    incrementCopies.mutate(id)
    trackPromptCopied(id, prompt.title, prompt.tier)
    toast.success('Prompt copied to clipboard!')
  }

  const handleLike = () => {
    if (isLiked) {
      removeLike.mutate(id)
    } else {
      addLike.mutate(id)
    }
  }

  const handleSave = () => {
    if (isSaved) {
      removeSave.mutate(id)
    } else {
      addSave.mutate(id)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Title row */}
        <div className="mb-6 flex items-start justify-between">
          <h1 className="text-3xl font-bold">{prompt.title}</h1>
          <div className="flex items-center gap-2">
            {/* Like button (Heart) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AuthGate
                    fallback={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={showSignInDialog}
                      >
                        <Heart className="size-5" />
                      </Button>
                    }
                    loadingFallback={
                      <Button variant="ghost" size="icon" disabled>
                        <Heart className="size-5" />
                      </Button>
                    }
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLike}
                      disabled={addLike.isPending || removeLike.isPending}
                    >
                      <Heart
                        className={cn(
                          'size-5',
                          isLiked && 'fill-current text-red-500',
                        )}
                      />
                    </Button>
                  </AuthGate>
                </div>
              </TooltipTrigger>
              <TooltipContent>{isLiked ? 'Unlike' : 'Like'}</TooltipContent>
            </Tooltip>
            {/* Save button (Bookmark) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AuthGate
                    fallback={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={showSignInDialog}
                      >
                        <Bookmark className="size-5" />
                      </Button>
                    }
                    loadingFallback={
                      <Button variant="ghost" size="icon" disabled>
                        <Bookmark className="size-5" />
                      </Button>
                    }
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSave}
                      disabled={addSave.isPending || removeSave.isPending}
                    >
                      <Bookmark
                        className={cn('size-5', isSaved && 'fill-current')}
                      />
                    </Button>
                  </AuthGate>
                </div>
              </TooltipTrigger>
              <TooltipContent>{isSaved ? 'Unsave' : 'Save'}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main image */}
            {images.length > 0 && (
              <div className="overflow-hidden rounded-xl bg-muted">
                <Image
                  src={images[selectedImage]}
                  alt={prompt.title}
                  className="aspect-square w-full object-cover"
                />
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'overflow-hidden rounded-lg border-2 transition-colors',
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/50',
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${prompt.title} - ${idx + 1}`}
                      className="aspect-square w-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Prompt details */}
          <div className="space-y-6">
            <PromptContent
              content={prompt.content ?? ''}
              isAuthenticated={isAuthenticated}
              hasAccess={hasAccess}
              isPremium={isPremium}
              isLoading={isLoading}
              onCopy={handleCopy}
              url={prompt.models?.[0].model?.provider?.website_url}
            />

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <span>
                <strong>{prompt.likes_count ?? 0}</strong> Likes
              </span>
              <span>
                <strong>{prompt.saves_count ?? 0}</strong> Saves
              </span>
            </div>

            {/* Models */}
            {models.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {models.length === 1 ? 'Model' : 'Models'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {models.map((model) => (
                    <Link
                      key={model.id}
                      to="/models/$id"
                      params={{ id: model.id }}
                    >
                      {model.provider ? (
                        <ProviderBadge provider={model.provider} />
                      ) : (
                        <Badge variant="secondary">{model.name}</Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {prompt.category && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category</span>
                <Link to="/categories/$id" params={{ id: prompt.category.id }}>
                  <Badge variant="secondary">{prompt.category.name}</Badge>
                </Link>
              </div>
            )}

            {/* Tags */}
            {tagsList.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag) => (
                    <Link key={tag.id} to="/tags/$id" params={{ id: tag.id }}>
                      <Badge variant="secondary">{tag.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// ============================================
// Prompt Content Component with 3 states
// ============================================

type PromptContentProps = {
  content: string
  isAuthenticated: boolean
  hasAccess: boolean
  isPremium: boolean
  isLoading: boolean
  onCopy: () => void
  url?: string | null
}

function PromptContent({
  content,
  isAuthenticated,
  hasAccess,
  isPremium,
  isLoading,
  onCopy,
  url,
}: PromptContentProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  // State 3: Logged in but no PRO access for premium content
  if (isAuthenticated && isPremium && !hasAccess) {
    return (
      <div className="rounded-xl border bg-[url(@/assets/pro-upsell-bg.webp)] bg-size-[100%_200%] bg-center p-6">
        <div className="mb-4 select-none flex items-center gap-2">
          <LucideLock className="size-4 text-white" />
          <span className="text-xs font-semibold uppercase tracking-wide text-white">
            Premium Content
          </span>
        </div>
        <p className="mb-8 select-none text-white">
          Join PromptValley Pro to access this prompt along with hundreds of
          expert-crafted templates that deliver better AI results.
        </p>
        <Button variant="outline" size="xl" onClick={showBuyDialog}>
          <span>
            Get <span className="font-bold">PRO</span>
          </span>
        </Button>
      </div>
    )
  }

  // State 2: Not logged in (show truncated content with sign in)
  if (!isAuthenticated) {
    const dummyContent =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."

    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-xs mb-4 select-none font-semibold uppercase tracking-wide text-muted-foreground">
          Prompt Details
        </p>
        <p className="mb-8 select-none text-sm text-muted-foreground blur-xs">
          {dummyContent}
        </p>
        <Button onClick={showSignInDialog} size="xl">
          Sign in to continue
        </Button>
      </div>
    )
  }

  // State 1: Full access - show complete content with actions
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="text-xs mb-4 select-none font-semibold uppercase tracking-wide text-muted-foreground">
        Prompt Details
      </p>
      <p className="mb-8 select-none whitespace-pre-wrap text-sm">{content}</p>
      <div className="flex items-center gap-3">
        <Button onClick={onCopy}>
          <Copy className="size-4" />
          Copy
        </Button>
        {url && (
          <Button variant="outline" asChild>
            <a target="_blank" href={url}>
              Try Out
              <ExternalLink className="size-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
