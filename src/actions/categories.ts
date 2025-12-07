import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'

// ============================================
// Types
// ============================================

export type Category = Tables<'categories'>
export type Tag = Tables<'tags'>

export type CategoryWithChildren = Category & {
  children?: Category[]
}

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
    return data as Category[]
  },
)

export const fetchCategoriesNested = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    // Build nested structure
    const categories = data as Category[]
    const rootCategories = categories.filter((c) => !c.parent_id)
    const childCategories = categories.filter((c) => c.parent_id)

    const nested: CategoryWithChildren[] = rootCategories.map((parent) => ({
      ...parent,
      children: childCategories.filter((c) => c.parent_id === parent.id),
    }))

    return nested
  },
)

export const fetchCategoryById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
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

export const fetchTags = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data as Tag[]
})

export const fetchTagById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Tag
  })

export const fetchPopularTags = createServerFn({ method: 'GET' })
  .inputValidator((limit?: number) => limit ?? 20)
  .handler(async ({ data: limit }) => {
    const supabase = getSupabaseServerClient()

    // Get tags ordered by usage count (number of prompts using them)
    const { data, error } = await supabase
      .from('tags')
      .select(
        `
        *,
        prompt_tags(count)
      `,
      )
      .order('name', { ascending: true })
      .limit(limit)

    if (error) throw error

    // Sort by usage count descending
    const sorted = (data as (Tag & { prompt_tags: { count: number }[] })[])
      .sort((a, b) => {
        const aCount = a.prompt_tags?.[0]?.count ?? 0
        const bCount = b.prompt_tags?.[0]?.count ?? 0
        return bCount - aCount
      })
      .map(({ prompt_tags, ...tag }) => tag)

    return sorted as Tag[]
  })

// ============================================
// Query Keys
// ============================================

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  nested: () => [...categoryKeys.all, 'nested'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: () => [...tagKeys.lists()] as const,
  popular: (limit?: number) => [...tagKeys.all, 'popular', limit] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: categoryKeys.list(),
    queryFn: () => fetchCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes - categories rarely change
  })
}

export function categoriesNestedQueryOptions() {
  return queryOptions({
    queryKey: categoryKeys.nested(),
    queryFn: () => fetchCategoriesNested(),
    staleTime: 1000 * 60 * 30,
  })
}

export function categoryQueryOptions(id: string) {
  return queryOptions({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryById({ data: id }),
    staleTime: 1000 * 60 * 30,
  })
}

export function tagsQueryOptions() {
  return queryOptions({
    queryKey: tagKeys.list(),
    queryFn: () => fetchTags(),
    staleTime: 1000 * 60 * 30,
  })
}

export function tagQueryOptions(id: string) {
  return queryOptions({
    queryKey: tagKeys.detail(id),
    queryFn: () => fetchTagById({ data: id }),
    staleTime: 1000 * 60 * 30,
  })
}

export function popularTagsQueryOptions(limit?: number) {
  return queryOptions({
    queryKey: tagKeys.popular(limit),
    queryFn: () => fetchPopularTags({ data: limit }),
    staleTime: 1000 * 60 * 10, // 10 minutes for popular tags
  })
}

// ============================================
// Hooks
// ============================================

export function useCategories() {
  return useQuery(categoriesQueryOptions())
}

export function useCategoriesNested() {
  return useQuery(categoriesNestedQueryOptions())
}

export function useCategory(id: string) {
  return useQuery(categoryQueryOptions(id))
}

export function useTags() {
  return useQuery(tagsQueryOptions())
}

export function useTag(id: string) {
  return useQuery(tagQueryOptions(id))
}

export function usePopularTags(limit?: number) {
  return useQuery(popularTagsQueryOptions(limit))
}
