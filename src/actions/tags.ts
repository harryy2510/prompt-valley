import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type Tag = Tables<'tags'>

// ============================================
// Zod Schemas
// ============================================

const tagIdSchema = z.string()

// ============================================
// Server Functions
// ============================================

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
  list: () => [...tagKeys.all, 'list'] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function tagsQueryOptions() {
  return queryOptions({
    queryKey: tagKeys.list(),
    queryFn: () => fetchTags(),
  })
}

export function tagQueryOptions(id: string) {
  return queryOptions({
    queryKey: tagKeys.detail(id),
    queryFn: () => fetchTagById({ data: id }),
  })
}

// ============================================
// Hooks
// ============================================

export function useTags() {
  return useQuery(tagsQueryOptions())
}

export function useTag(id: string) {
  return useQuery(tagQueryOptions(id))
}
