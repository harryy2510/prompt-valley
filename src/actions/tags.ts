import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type Tag = Tables<'tags'>

export type TagsFilters = z.infer<typeof tagsFiltersSchema>

// ============================================
// Zod Schemas
// ============================================

const tagsFiltersSchema = z
  .object({
    search: z.string().max(200).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    orderBy: z.enum(['name', 'created_at']).optional(),
    orderAsc: z.boolean().optional(),
  })
  .optional()

const tagIdSchema = z.string()

// ============================================
// Server Functions
// ============================================

export const fetchTags = createServerFn({ method: 'GET' })
  .inputValidator(tagsFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase.from('tags').select('*')

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    query = query.order(filters?.orderBy ?? 'name', {
      ascending: filters?.orderAsc ?? true,
    })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Tag[]
  })

export const fetchTagById = createServerFn({ method: 'GET' })
  .inputValidator(tagIdSchema)
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

// ============================================
// Query Keys
// ============================================

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters?: TagsFilters) => [...tagKeys.lists(), filters] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function tagsQueryOptions(
  filters?: TagsFilters,
  options?: Partial<UseQueryOptions<Tag[]>>,
) {
  return queryOptions({
    queryKey: tagKeys.list(filters),
    queryFn: () => fetchTags({ data: filters }),
    ...options,
  })
}

export function tagQueryOptions(
  id: string,
  options?: Partial<UseQueryOptions<Tag>>,
) {
  return queryOptions({
    queryKey: tagKeys.detail(id),
    queryFn: () => fetchTagById({ data: id }),
    ...options,
  })
}

// ============================================
// Hooks
// ============================================

export function useTags(
  filters?: TagsFilters,
  options?: Partial<UseQueryOptions<Tag[]>>,
) {
  return useQuery(tagsQueryOptions(filters, options))
}

export function useTag(id: string, options?: Partial<UseQueryOptions<Tag>>) {
  return useQuery(tagQueryOptions(id, options))
}
