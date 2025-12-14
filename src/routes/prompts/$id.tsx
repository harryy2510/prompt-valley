import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Heart, Bookmark, Copy, ExternalLink, Sparkles } from 'lucide-react'

import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProviderBadge } from '@/components/common/provider-badge'
import { promptDetailQueryOptions, usePromptDetail } from '@/actions/prompts'
import { useGate } from '@/components/common/gate'
import {
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from '@/actions/favorites'
import { cn } from '@/libs/cn'
import { compact, uniqBy } from 'lodash-es'
import { useState } from 'react'
import { toast } from 'sonner'
import { BuyModal } from '@/components/pricing/buy-modal'
import { Image } from '@/components/common/image'

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
    <MainLayout>
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">Prompt not found</h1>
        <p className="mt-2 text-muted-foreground">
          The prompt you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </MainLayout>
  ),
  component: PromptDetailPage,
})

function PromptDetailPage() {
  const { id } = Route.useParams()
  const { data: prompt } = usePromptDetail(id)
  const { isAuthenticated, isPro, isLoading } = useGate()
  const { data: isFavorited } = useIsFavorite(id)
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()
  const [buyModalOpen, setBuyModalOpen] = useState(false)

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
  const tagsList = uniqBy(prompt.tags?.map((t) => t.tag), 'id') ?? []

  // Main image is first, rest are thumbnails
  const images = prompt.images ?? []
  const [selectedImage, setSelectedImage] = useState(0)

  const handleCopy = async () => {
    if (!prompt.content) return
    await navigator.clipboard.writeText(prompt.content)
    toast.success('Prompt copied to clipboard!')
  }

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save prompts')
      return
    }
    if (isFavorited) {
      removeFavorite.mutate(id)
    } else {
      addFavorite.mutate(id)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Title row */}
        <div className="mb-6 flex items-start justify-between">
          <h1 className="text-3xl font-bold">{prompt.title}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              disabled={addFavorite.isPending || removeFavorite.isPending}
            >
              <Heart
                className={cn(
                  'size-5',
                  isFavorited && 'fill-current text-red-500',
                )}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="size-5" />
            </Button>
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
              onGetPro={() => setBuyModalOpen(true)}
            />

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <span>
                <strong>{prompt.saves_count ?? 0}</strong> Saves
              </span>
              <span>
                <strong>{prompt.views_count ?? 0}</strong> Likes
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
                    <Link key={model.id} to="/models/$id" params={{ id: model.id }}>
                      {model.provider ? (
                        <ProviderBadge provider={model.provider} />
                      ) : (
                        <Badge variant="outline">{model.name}</Badge>
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
                  <Badge variant="category">{prompt.category.name}</Badge>
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
                      <Badge variant="tag">{tag.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BuyModal open={buyModalOpen} onOpenChange={setBuyModalOpen} />
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
  onGetPro: () => void
}

function PromptContent({
  content,
  isAuthenticated,
  hasAccess,
  isPremium,
  isLoading,
  onCopy,
  onGetPro,
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
      <div className="rounded-xl border bg-gradient-to-br from-violet-500/10 to-purple-600/10 p-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Premium Content
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Join PromptValley Pro to access this prompt along with hundreds of
          expert-crafted templates that deliver better AI results.
        </p>
        <Button
          variant="outline"
          className="mt-4 bg-background"
          onClick={onGetPro}
        >
          Get <span className="ml-1 font-bold">PRO</span>
        </Button>
      </div>
    )
  }

  // State 2: Not logged in (show truncated content with sign in)
  if (!isAuthenticated) {
    const truncatedContent =
      content.slice(0, 200) + (content.length > 200 ? '...' : '')

    return (
      <div className="rounded-xl border bg-card p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Prompt Details
        </span>
        <p className="mt-4 text-sm text-muted-foreground">{truncatedContent}</p>
        <Button asChild className="mt-4">
          <Link to="/auth">Sign in to continue</Link>
        </Button>
      </div>
    )
  }

  // State 1: Full access - show complete content with actions
  return (
    <div className="rounded-xl border bg-card p-6">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Prompt Details
      </span>
      <p className="mt-4 whitespace-pre-wrap text-sm">{content}</p>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={onCopy}>
          <Copy className="mr-2 size-4" />
          Copy
        </Button>
        <Button variant="outline">
          Try Out
          <ExternalLink className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}
