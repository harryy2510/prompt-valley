import { queryOptions, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'

// ============================================
// Types
// ============================================

export type AIModel = Tables<'ai_models'> & {
  provider?: Tables<'ai_providers'> | null
}

// ============================================
// Server Functions
// ============================================

export const fetchModels = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('ai_models')
      .select('*, provider:ai_providers(*)')
      .order('name', { ascending: true })

    if (error) throw error
    return data as AIModel[]
  },
)

// ============================================
// Query Keys
// ============================================

export const modelKeys = {
  all: ['models'] as const,
  list: () => [...modelKeys.all, 'list'] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function modelsQueryOptions() {
  return queryOptions({
    queryKey: modelKeys.list(),
    queryFn: () => fetchModels(),
  })
}

// ============================================
// Hooks
// ============================================

export function useModels() {
  return useQuery(modelsQueryOptions())
}
