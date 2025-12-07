import { queryOptions, useQuery } from '@tanstack/react-query'
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

// ============================================
// Zod Schemas
// ============================================

const categoryIdSchema = z.uuid()

// ============================================
// Server Functions
// ============================================

export const fetchCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

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
  },
)

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
  list: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: categoryKeys.list(),
    queryFn: () => fetchCategories(),
  })
}

export function categoryQueryOptions(id: string) {
  return queryOptions({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryById({ data: id }),
  })
}

// ============================================
// Hooks
// ============================================

export function useCategories() {
  return useQuery(categoriesQueryOptions())
}

export function useCategory(id: string) {
  return useQuery(categoryQueryOptions(id))
}
