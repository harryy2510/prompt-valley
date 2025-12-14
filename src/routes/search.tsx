import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Search } from 'lucide-react'

import { MainLayout } from '@/components/layout'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { RouterPagination } from '@/components/common/router-pagination'
import {
  promptsQueryOptions,
  usePrompts,
  promptsCountQueryOptions,
  usePromptsCount,
} from '@/actions/prompts'

// ============================================
// Search Params Schema
// ============================================

const searchSchema = z.object({
  q: z.string().optional().default(''),
  page: z.number().int().min(1).optional().default(1),
})

// ============================================
// Route Config
// ============================================

const ITEMS_PER_PAGE = 20

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { q, page } }) => ({ q, page }),
  loader: async ({ context, deps: { q, page } }) => {
    if (!q) return

    const offset = (page - 1) * ITEMS_PER_PAGE

    await Promise.all([
      context.queryClient.ensureQueryData(
        promptsQueryOptions({
          search: q,
          limit: ITEMS_PER_PAGE,
          offset,
        }),
      ),
      context.queryClient.ensureQueryData(
        promptsCountQueryOptions({ search: q }),
      ),
    ])
  },
  component: SearchPage,
})

// ============================================
// Component
// ============================================

function SearchPage() {
  const { q, page } = Route.useSearch()

  const { data: prompts = [], isLoading } = usePrompts(
    { search: q, limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE },
    { enabled: !!q },
  )
  const { data: totalCount = 0 } = usePromptsCount(
    { search: q },
    { enabled: !!q },
  )

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // Empty state - no query
  if (!q) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <Search className="mx-auto size-12 text-muted-foreground/50" />
          <h1 className="mt-4 text-2xl font-bold">Search Prompts</h1>
          <p className="mt-2 text-muted-foreground">
            Enter a search term in the search bar above to find prompts.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Search className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Search Results</h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    {totalCount} {totalCount === 1 ? 'result' : 'results'} for "{q}"
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="py-16 text-center">
            <Search className="mx-auto size-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No results found</h2>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search terms or browse our categories.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <RouterPagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl="/search"
                  searchParams={{ q }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
