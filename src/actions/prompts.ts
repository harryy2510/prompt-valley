import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables, Enums } from '@/types/database.types'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type Prompt = Tables<'prompts'>
export type Category = Tables<'categories'>
export type Tag = Tables<'tags'>
export type Tier = Enums<'tier'>

export type PromptWithRelations = Prompt & {
  category?: Category | null
  tags?: Array<{ tag: Tag }>
  models?: Array<{
    model: Tables<'ai_models'> & {
      provider?: Tables<'ai_providers'>
    }
  }>
}

export type PromptFilters = z.infer<typeof promptFiltersSchema>

// ============================================
// Zod Schemas
// ============================================

const promptFiltersSchema = z.object({
  categoryId: z.uuid().optional(),
  tagId: z.uuid().optional(),
  tier: z.enum(['free', 'pro']).optional(),
  search: z.string().max(200).optional(),
  isFeatured: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
})

const promptIdSchema = z.uuid()

const limitSchema = z.number().int().min(1).max(100).optional()

const promptsByCategorySchema = z.object({
  categoryId: z.uuid(),
  limit: z.number().int().min(1).max(100).optional(),
})

// ============================================
// Server Functions
// ============================================

export const fetchPrompts = createServerFn({ method: 'GET' })
  .inputValidator(promptFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase
      .from('prompts_with_access')
      .select(
        `
        *,
        category:categories(*),
        tags:prompt_tags(tag:tags(*)),
        models:prompt_models(model:ai_models(*, provider:ai_providers(*)))
      `,
      )
      .eq('is_published', true)

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters.tier) {
      query = query.eq('tier', filters.tier)
    }
    if (filters.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured)
    }
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      )
    }

    query = query
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit ?? 20) - 1,
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data as PromptWithRelations[]
  })

export const fetchPromptById = createServerFn({ method: 'GET' })
  .inputValidator(promptIdSchema)
  .handler(async ({ data: id }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('prompts_with_access')
      .select(
        `
        *,
        category:categories(*),
        tags:prompt_tags(tag:tags(*)),
        models:prompt_models(model:ai_models(*, provider:ai_providers(*)))
      `,
      )
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) throw error

    // Increment view count
    await supabase.rpc('increment_prompt_views', { prompt_text_id: id })

    return data as PromptWithRelations
  })

export const fetchFeaturedPrompts = createServerFn({ method: 'GET' })
  .inputValidator(limitSchema)
  .handler(async ({ data: limitInput }) => {
    const limit = limitInput ?? 12
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('prompts_with_access')
      .select(
        `
        *,
        category:categories(*),
        tags:prompt_tags(tag:tags(*)),
        models:prompt_models(model:ai_models(*, provider:ai_providers(*)))
      `,
      )
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as PromptWithRelations[]
  })

export const fetchPromptsByCategory = createServerFn({ method: 'GET' })
  .inputValidator(promptsByCategorySchema)
  .handler(async ({ data: { categoryId, limit = 20 } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('prompts_with_access')
      .select(
        `
        *,
        category:categories(*),
        tags:prompt_tags(tag:tags(*)),
        models:prompt_models(model:ai_models(*, provider:ai_providers(*)))
      `,
      )
      .eq('is_published', true)
      .eq('category_id', categoryId)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as PromptWithRelations[]
  })

export const incrementPromptCopies = createServerFn({ method: 'POST' })
  .inputValidator(promptIdSchema)
  .handler(async ({ data: id }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.rpc('increment_prompt_copies', {
      prompt_text_id: id,
    })
    if (error) throw error
    return { success: true }
  })

// ============================================
// Query Keys
// ============================================

export const promptKeys = {
  all: ['prompts'] as const,
  lists: () => [...promptKeys.all, 'list'] as const,
  list: (filters?: PromptFilters) => [...promptKeys.lists(), filters] as const,
  details: () => [...promptKeys.all, 'detail'] as const,
  detail: (id: string) => [...promptKeys.details(), id] as const,
  featured: (limit?: number) => [...promptKeys.all, 'featured', limit] as const,
  byCategory: (categoryId: string) =>
    [...promptKeys.all, 'category', categoryId] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function promptsQueryOptions(filters: PromptFilters = {}) {
  return queryOptions({
    queryKey: promptKeys.list(filters),
    queryFn: () => fetchPrompts({ data: filters }),
  })
}

export function promptDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: promptKeys.detail(id),
    queryFn: () => fetchPromptById({ data: id }),
  })
}

export function featuredPromptsQueryOptions(limit?: number) {
  return queryOptions({
    queryKey: promptKeys.featured(limit),
    queryFn: () => fetchFeaturedPrompts({ data: limit }),
  })
}

export function promptsByCategoryQueryOptions(
  categoryId: string,
  limit?: number,
) {
  return queryOptions({
    queryKey: promptKeys.byCategory(categoryId),
    queryFn: () => fetchPromptsByCategory({ data: { categoryId, limit } }),
  })
}

// ============================================
// Hooks
// ============================================

export function usePrompts(filters: PromptFilters = {}) {
  return useQuery(promptsQueryOptions(filters))
}

export function usePromptDetail(id: string) {
  return useQuery(promptDetailQueryOptions(id))
}

export function useFeaturedPrompts(limit?: number) {
  return useQuery(featuredPromptsQueryOptions(limit))
}

export function usePromptsByCategory(categoryId: string, limit?: number) {
  return useQuery(promptsByCategoryQueryOptions(categoryId, limit))
}

export function useIncrementCopies() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => incrementPromptCopies({ data: id }),
    onSuccess: async (_, id) => {
      // Invalidate the prompt detail to reflect new count
      await queryClient.invalidateQueries({ queryKey: promptKeys.detail(id) })
    },
  })
}
