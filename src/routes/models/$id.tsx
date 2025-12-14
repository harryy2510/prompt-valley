import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { z } from 'zod'

import { MainLayout } from '@/components/layout'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { RouterPagination } from '@/components/common/router-pagination'
import { modelQueryOptions, useModel } from '@/actions/models'
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

export const Route = createFileRoute('/models/$id')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ context, params, deps: { page } }) => {
    const offset = (page - 1) * ITEMS_PER_PAGE

    try {
      await Promise.all([
        context.queryClient.ensureQueryData(modelQueryOptions(params.id)),
        context.queryClient.ensureQueryData(
          promptsQueryOptions({
            modelId: params.id,
            limit: ITEMS_PER_PAGE,
            offset,
          }),
        ),
        context.queryClient.ensureQueryData(
          promptsCountQueryOptions({ modelId: params.id }),
        ),
      ])
    } catch {
      throw notFound()
    }
  },
  notFoundComponent: () => (
    <MainLayout>
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">Model not found</h1>
        <p className="mt-2 text-muted-foreground">
          The AI model you're looking for doesn't exist.
        </p>
      </div>
    </MainLayout>
  ),
  component: ModelPage,
})

// ============================================
// Component
// ============================================

function ModelPage() {
  const { id } = Route.useParams()
  const { page } = Route.useSearch()
  const { data: model } = useModel(id)

  const offset = (page - 1) * ITEMS_PER_PAGE

  const { data: prompts, isLoading } = usePrompts({
    modelId: id,
    limit: ITEMS_PER_PAGE,
    offset,
  })

  const { data: totalCount } = usePromptsCount({ modelId: id })

  const totalPages = Math.ceil((totalCount ?? 0) / ITEMS_PER_PAGE)

  if (!model) return null

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          {model.provider && (
            <>
              <span>{model.provider.name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{model.name}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {model.icon_url && (
              <img
                src={model.icon_url}
                alt={model.name}
                className="size-10 rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{model.name}</h1>
              {model.provider && (
                <p className="text-sm text-muted-foreground">
                  by {model.provider.name}
                </p>
              )}
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">
            Explore all prompts for {model.name}
          </p>
        </div>

        {/* Prompts grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : prompts?.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No prompts found for this model.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
              baseUrl="/models/$id"
              params={{ id }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
