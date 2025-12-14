import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { z } from 'zod'

import { MainLayout } from '@/components/layout'
import { NotFound } from '@/components/error/not-found'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { RouterPagination } from '@/components/common/router-pagination'
import { tagQueryOptions, useTag } from '@/actions/tags'
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
  page: z.number().int().min(1).optional().default(1),
})

// ============================================
// Route Config
// ============================================

const ITEMS_PER_PAGE = 20

export const Route = createFileRoute('/tags/$id')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ context, params, deps: { page } }) => {
    const offset = (page - 1) * ITEMS_PER_PAGE

    try {
      await Promise.all([
        context.queryClient.ensureQueryData(tagQueryOptions(params.id)),
        context.queryClient.ensureQueryData(
          promptsQueryOptions({
            tagId: params.id,
            limit: ITEMS_PER_PAGE,
            offset,
          }),
        ),
        context.queryClient.ensureQueryData(
          promptsCountQueryOptions({ tagId: params.id }),
        ),
      ])
    } catch {
      throw notFound()
    }
  },
  notFoundComponent: () => (
    <NotFound>
      <p>The tag you're looking for doesn't exist.</p>
    </NotFound>
  ),
  component: TagPage,
})

// ============================================
// Component
// ============================================

function TagPage() {
  const { id } = Route.useParams()
  const { page } = Route.useSearch()
  const { data: tag } = useTag(id)

  const offset = (page - 1) * ITEMS_PER_PAGE

  const { data: prompts, isLoading } = usePrompts({
    tagId: id,
    limit: ITEMS_PER_PAGE,
    offset,
  })

  const { data: totalCount } = usePromptsCount({ tagId: id })

  const totalPages = Math.ceil((totalCount ?? 0) / ITEMS_PER_PAGE)

  if (!tag) return null

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">{tag.name}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{tag.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Explore all prompts tagged with "{tag.name}"
          </p>
        </div>

        {/* Prompts grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : prompts?.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No prompts found with this tag.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {prompts?.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <RouterPagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/tags/$id"
              params={{ id }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
