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

export type CategoriesFilters = z.infer<typeof categoriesFiltersSchema>

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
