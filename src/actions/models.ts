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

export type AIModel = Tables<'ai_models'> & {
  provider?: Tables<'ai_providers'> | null
}

export type ModelsFilters = z.infer<typeof modelsFiltersSchema>

// ============================================
// Zod Schemas
// ============================================

const modelsFiltersSchema = z
  .object({
    search: z.string().max(200).optional(),
    providerId: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    orderBy: z.enum(['name', 'created_at']).optional(),
    orderAsc: z.boolean().optional(),
  })
  .optional()

// ============================================
// Server Functions
// ============================================

export const fetchModels = createServerFn({ method: 'GET' })
  .inputValidator(modelsFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase
      .from('ai_models')
      .select('*, provider:ai_providers(*)')

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    if (filters?.providerId) {
      query = query.eq('provider_id', filters.providerId)
    }

    query = query.order(filters?.orderBy ?? 'name', {
      ascending: filters?.orderAsc ?? true,
    })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data as AIModel[]
  })

// ============================================
// Query Keys
// ============================================

export const modelKeys = {
  all: ['models'] as const,
  lists: () => [...modelKeys.all, 'list'] as const,
  list: (filters?: ModelsFilters) => [...modelKeys.lists(), filters] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function modelsQueryOptions(
  filters?: ModelsFilters,
  options?: Partial<UseQueryOptions<AIModel[]>>,
) {
  return queryOptions({
    queryKey: modelKeys.list(filters),
    queryFn: () => fetchModels({ data: filters }),
    ...options,
  })
}

// ============================================
// Hooks
// ============================================

export function useModels(
  filters?: ModelsFilters,
  options?: Partial<UseQueryOptions<AIModel[]>>,
) {
  return useQuery(modelsQueryOptions(filters, options))
}
