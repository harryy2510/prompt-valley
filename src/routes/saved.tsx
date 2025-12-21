import { createFileRoute, redirect } from '@tanstack/react-router'
import { Bookmark } from 'lucide-react'

import { MainLayout } from '@/components/layout'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { userFavoritesQueryOptions, useUserFavorites } from '@/actions/favorites'
import { userQueryOptions } from '@/actions/auth'
import { seo } from '@/utils/seo'

// ============================================
// Route Config
// ============================================

export const Route = createFileRoute('/saved')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())
    if (!user) {
      throw redirect({ to: '/auth' })
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(userFavoritesQueryOptions())
  },
  head: () => ({
    meta: seo({
      title: 'Saved Prompts',
      description: 'View and manage your saved AI prompts on Prompt Valley.',
      noIndex: true,
    }),
  }),
  component: SavedPage,
})

// ============================================
// Component
// ============================================

function SavedPage() {
  const { data: favorites = [], isLoading } = useUserFavorites()

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Bookmark className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Saved Prompts</h1>
              <p className="text-sm text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'prompt' : 'prompts'} saved
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
        ) : favorites.length === 0 ? (
          <div className="py-16 text-center">
            <Bookmark className="mx-auto size-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No saved prompts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Save prompts by clicking the bookmark icon to find them here later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((fav) => (
              <PromptCard key={fav.id} prompt={fav.prompt} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
