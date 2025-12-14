import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { z } from 'zod'

import { MainLayout } from '@/components/layout'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { RouterPagination } from '@/components/common/router-pagination'
import { Badge } from '@/components/ui/badge'
import {
  categoryQueryOptions,
  useCategory,
  useCategories,
} from '@/actions/categories'
import {
  promptsQueryOptions,
  usePrompts,
  promptsCountQueryOptions,
  usePromptsCount,
} from '@/actions/prompts'
import { cn } from '@/libs/cn'

// ============================================
// Search Params Schema
// ============================================

const searchSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  sub: z.string().optional(), // subcategory filter
})

// ============================================
// Route Config
// ============================================

const ITEMS_PER_PAGE = 20

export const Route = createFileRoute('/categories/$id')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page, sub } }) => ({ page, sub }),
  loader: async ({ context, params, deps: { page, sub } }) => {
    const categoryId = sub || params.id
    const offset = (page - 1) * ITEMS_PER_PAGE

    try {
      await Promise.all([
        context.queryClient.ensureQueryData(categoryQueryOptions(params.id)),
        context.queryClient.ensureQueryData(
          promptsQueryOptions({
            categoryId,
            limit: ITEMS_PER_PAGE,
            offset,
          }),
        ),
        context.queryClient.ensureQueryData(
          promptsCountQueryOptions({ categoryId }),
        ),
      ])
    } catch {
      throw notFound()
    }
  },
  notFoundComponent: () => (
    <MainLayout>
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">
          The category you're looking for doesn't exist.
        </p>
      </div>
    </MainLayout>
  ),
  component: CategoryPage,
})

// ============================================
// Component
// ============================================

function CategoryPage() {
  const { id } = Route.useParams()
  const { page, sub } = Route.useSearch()
  const { data: category } = useCategory(id)
  const { data: allCategories } = useCategories()

  // Check if current id is a subcategory (has a parent)
  const parentOfCurrentCategory = allCategories?.find((c) =>
    c.children?.some((child) => child.id === id),
  )
  const isDirectSubcategory = !!parentOfCurrentCategory

  // Get the current category's children (if it's a parent category)
  const currentCategoryChildren =
    allCategories?.find((c) => c.id === id)?.children || []

  // Determine the parent category for tabs and breadcrumb
  // - If accessing subcategory directly: parent is parentOfCurrentCategory
  // - If using ?sub= param: parent is the current category (id)
  const parentCategory = isDirectSubcategory
    ? parentOfCurrentCategory
    : sub
      ? category
      : parentOfCurrentCategory

  // Get subcategories for tabs
  // - If current category has children, show them
  // - Otherwise show siblings (from parent)
  const subcategories =
    currentCategoryChildren.length > 0
      ? currentCategoryChildren
      : parentOfCurrentCategory?.children || []

  // Determine which subcategory is active for tab highlighting
  // - If ?sub= is set, use that
  // - If we're directly at a subcategory, use id
  const activeSubcategoryId = sub || (isDirectSubcategory ? id : null)

  // Find the active subcategory object for display
  const activeSubcategory = activeSubcategoryId
    ? subcategories.find((sc) => sc.id === activeSubcategoryId)
    : null

  // Determine display info based on whether we're viewing a subcategory
  const displayCategory = activeSubcategory || category

  // Determine which category to filter prompts by
  const activeCategoryId = sub || id
  const offset = (page - 1) * ITEMS_PER_PAGE

  const { data: prompts, isLoading } = usePrompts({
    categoryId: activeCategoryId,
    limit: ITEMS_PER_PAGE,
    offset,
  })

  const { data: totalCount } = usePromptsCount({
    categoryId: activeCategoryId,
  })

  const totalPages = Math.ceil((totalCount ?? 0) / ITEMS_PER_PAGE)

  if (!category) return null

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          {parentCategory && (
            <>
              <Link
                to="/categories/$id"
                params={{ id: parentCategory.id }}
                className="hover:text-foreground"
              >
                {parentCategory.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{displayCategory?.name}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{displayCategory?.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Explore all {displayCategory?.name.toLowerCase()} prompts
          </p>
        </div>

        {/* Subcategory tabs */}
        {subcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {/* "All" tab - links to parent category */}
            <Link
              to="/categories/$id"
              params={{ id: parentCategory?.id || id }}
              search={{ page: 1 }}
              className="inline-block"
            >
              <Badge
                variant={!activeSubcategoryId ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer px-4 py-2',
                  !activeSubcategoryId && 'bg-primary text-primary-foreground',
                )}
              >
                All
              </Badge>
            </Link>
            {/* Subcategory tabs - link directly to subcategory */}
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                to="/categories/$id"
                params={{ id: subcat.id }}
                search={{ page: 1 }}
                className="inline-block"
              >
                <Badge
                  variant={activeSubcategoryId === subcat.id ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer px-4 py-2',
                    activeSubcategoryId === subcat.id &&
                      'bg-primary text-primary-foreground',
                  )}
                >
                  {subcat.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Prompts grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : prompts?.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No prompts found in this category.</p>
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
              baseUrl="/categories/$id"
              params={{ id: activeCategoryId }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
