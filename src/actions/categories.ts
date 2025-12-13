import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import partition from 'lodash-es/partition'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type Category = Tables<'categories'> & {
  children?: Category[]
}

export type Prompt = Tables<'prompts'> & {
  category?: Category | null
  tags?: Array<{ tag: Tables<'tags'> }>
  models?: Array<{
    model: Tables<'ai_models'> & {
      provider?: Tables<'ai_providers'>
    }
  }>
}

export type CategoryWithPrompts = Tables<'categories'> & {
  prompts: Prompt[]
  children?: CategoryWithPrompts[]
}

export type CategoriesFilters = z.infer<typeof categoriesFiltersSchema>
export type CategoriesWithPromptsFilters = z.infer<typeof categoriesWithPromptsFiltersSchema>

// ============================================
// Zod Schemas
// ============================================

const categoriesFiltersSchema = z
  .object({
    search: z.string().max(200).optional(),
    parentId: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    orderBy: z.enum(['name', 'created_at']).optional(),
    orderAsc: z.boolean().optional(),
  })
  .optional()

const categoriesWithPromptsFiltersSchema = z.object({
  // Category filters
  categoryLimit: z.number().int().min(1).max(50).optional(), // Limit root categories returned
  // Prompt filters per category
  promptLimit: z.number().int().min(1).max(100).optional(), // Limit prompts per category
  promptTier: z.enum(['free', 'pro']).optional(),
  promptOrderBy: z
    .enum(['created_at', 'sort_order', 'view_count', 'copy_count'])
    .optional(),
  promptOrderAsc: z.boolean().optional(),
})

const categoryIdSchema = z.string()

// ============================================
// Server Functions
// ============================================

export const fetchCategories = createServerFn({ method: 'GET' })
  .inputValidator(categoriesFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase.from('categories').select('*')

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    if (filters?.parentId) {
      query = query.eq('parent_id', filters.parentId)
    }

    query = query.order(filters?.orderBy ?? 'name', {
      ascending: filters?.orderAsc ?? true,
    })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error

    // Build nested structure
    const categories = data as Category[]
    const [childCategories, rootCategories] = partition(
      categories,
      (c) => c.parent_id,
    )

    const nested: Category[] = rootCategories.map((parent) => ({
      ...parent,
      children: childCategories.filter((c) => c.parent_id === parent.id),
    }))

    return nested
  })

export const fetchCategoryById = createServerFn({ method: 'GET' })
  .inputValidator(categoryIdSchema)
  .handler(async ({ data: id }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Category
  })

export const fetchCategoriesWithPrompts = createServerFn({ method: 'GET' })
  .inputValidator(categoriesWithPromptsFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    // Fetch ALL categories to build nested structure
    const { data: allCategories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (catError) throw catError
    if (!allCategories?.length) return []

    // Get all category IDs for prompt query
    const allCategoryIds = allCategories.map((c) => c.id)

    // Fetch prompts for all categories
    let promptQuery = supabase
      .from('prompts_with_access')
      .select(
        `
        *,
        category:categories!category_id(*),
        tags:prompt_tags(tag:tags(*)),
        models:prompt_models(model:ai_models(*, provider:ai_providers(*)))
      `,
      )
      .eq('is_published', true)
      .or(
        allCategoryIds
          .map((id) => `category_id.eq.${id},parent_category_id.eq.${id}`)
          .join(','),
      )

    if (filters.promptTier) {
      promptQuery = promptQuery.eq('tier', filters.promptTier)
    }

    // Order prompts - match the default ordering from fetchPrompts
    if (filters.promptOrderBy) {
      promptQuery = promptQuery.order(filters.promptOrderBy, {
        ascending: filters.promptOrderAsc ?? false,
      })
    } else {
      promptQuery = promptQuery
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
    }

    const { data: allPrompts, error: promptError } = await promptQuery

    if (promptError) throw promptError

    // Helper to get prompts for a category
    const promptLimit = filters.promptLimit
    const getPromptsForCategory = (categoryId: string): Prompt[] => {
      let categoryPrompts = (allPrompts ?? []).filter(
        (p) =>
          p.category_id === categoryId || p.parent_category_id === categoryId,
      ) as Prompt[]

      if (promptLimit) {
        categoryPrompts = categoryPrompts.slice(0, promptLimit)
      }

      return categoryPrompts
    }

    // Build nested structure with prompts
    const [childCategories, rootCategories] = partition(
      allCategories,
      (c) => c.parent_id,
    )

    const nested: CategoryWithPrompts[] = rootCategories.map((parent) => {
      const children: CategoryWithPrompts[] = childCategories
        .filter((c) => c.parent_id === parent.id)
        .map((child) => ({
          ...child,
          prompts: getPromptsForCategory(child.id),
        }))

      return {
        ...parent,
        prompts: getPromptsForCategory(parent.id),
        children: children.length > 0 ? children : undefined,
      }
    })

    // Apply category limit if specified
    let result = nested
    if (filters.categoryLimit) {
      result = result.slice(0, filters.categoryLimit)
    }

    // Filter out categories with no prompts (and no children with prompts)
    return result.filter(
      (c) =>
        c.prompts.length > 0 ||
        (c.children?.some((child) => child.prompts.length > 0) ?? false),
    )
  })

// ============================================
// Query Keys
// ============================================

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: CategoriesFilters) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  withPrompts: () => [...categoryKeys.all, 'withPrompts'] as const,
  withPromptsList: (filters?: CategoriesWithPromptsFilters) =>
    [...categoryKeys.withPrompts(), filters] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function categoriesQueryOptions(
  filters?: CategoriesFilters,
  options?: Partial<UseQueryOptions<Category[]>>,
) {
  return queryOptions({
    queryKey: categoryKeys.list(filters),
    queryFn: () => fetchCategories({ data: filters }),
    ...options,
  })
}

export function categoryQueryOptions(
  id: string,
  options?: Partial<UseQueryOptions<Category>>,
) {
  return queryOptions({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryById({ data: id }),
    ...options,
  })
}

export function categoriesWithPromptsQueryOptions(
  filters: CategoriesWithPromptsFilters = {},
  options?: Partial<UseQueryOptions<CategoryWithPrompts[]>>,
) {
  return queryOptions({
    queryKey: categoryKeys.withPromptsList(filters),
    queryFn: () => fetchCategoriesWithPrompts({ data: filters }),
    ...options,
  })
}

// ============================================
// Hooks
// ============================================

export function useCategories(
  filters?: CategoriesFilters,
  options?: Partial<UseQueryOptions<Category[]>>,
) {
  return useQuery(categoriesQueryOptions(filters, options))
}

export function useCategory(
  id: string,
  options?: Partial<UseQueryOptions<Category>>,
) {
  return useQuery(categoryQueryOptions(id, options))
}

export function useCategoriesWithPrompts(
  filters: CategoriesWithPromptsFilters = {},
  options?: Partial<UseQueryOptions<CategoryWithPrompts[]>>,
) {
  return useQuery(categoriesWithPromptsQueryOptions(filters, options))
}
