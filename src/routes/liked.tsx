import { createFileRoute, redirect } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

import { MainLayout } from '@/components/layout'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { userLikesQueryOptions, useUserLikes } from '@/actions/likes'
import { userQueryOptions } from '@/actions/auth'
import { seo } from '@/utils/seo'

// ============================================
// Route Config
// ============================================

export const Route = createFileRoute('/liked')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())
    if (!user) {
      throw redirect({ to: '/auth' })
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(userLikesQueryOptions())
  },
  head: () => ({
    meta: seo({
      title: 'Liked Prompts',
      description: 'View prompts you have liked on Prompt Valley.',
      noIndex: true,
    }),
  }),
  component: LikedPage,
})

// ============================================
// Component
// ============================================

function LikedPage() {
  const { data: likes = [], isLoading } = useUserLikes()

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
              <Heart className="size-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Liked Prompts</h1>
              <p className="text-sm text-muted-foreground">
                {likes.length} {likes.length === 1 ? 'prompt' : 'prompts'} liked
              </p>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : likes.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto size-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No liked prompts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Like prompts by clicking the heart icon to find them here later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {likes.map((like) => (
              <PromptCard key={like.id} prompt={like.prompt} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
