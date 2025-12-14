import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
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
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  modelId: z.string().optional(),
  tier: z.enum(['free', 'pro']).optional(),
  search: z.string().max(200).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
  orderBy: z
    .enum(['created_at', 'sort_order', 'title', 'view_count', 'copy_count'])
    .optional(),
  orderAsc: z.boolean().optional(),
})

const promptIdSchema = z.string()

// ============================================
// Server Functions
// ============================================

export const fetchPrompts = createServerFn({ method: 'GET' })
  .inputValidator(promptFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    // Use !inner join when filtering by modelId or tagId to only get matching prompts
    const modelsSelect = filters.modelId
      ? 'models:prompt_models!inner(model:ai_models(*, provider:ai_providers(*)))'
      : 'models:prompt_models(model:ai_models(*, provider:ai_providers(*)))'

    const tagsSelect = filters.tagId
      ? 'tags:prompt_tags!inner(tag:tags(*))'
      : 'tags:prompt_tags(tag:tags(*))'

    let query = supabase
      .from('prompts_with_access')
      .select(
        `
        *,
        category:categories!category_id(*),
        ${tagsSelect},
        ${modelsSelect}
      `,
      )

    // Default to published only
    if (filters.isPublished !== false) {
      query = query.eq('is_published', true)
    }

    if (filters.modelId) {
      query = query.eq('models.model_id', filters.modelId)
    }
    if (filters.tagId) {
      query = query.eq('tags.tag_id', filters.tagId)
    }
    if (filters.categoryId) {
      // Match prompts where category_id matches OR parent_category_id matches
      query = query.or(
        `category_id.eq.${filters.categoryId},parent_category_id.eq.${filters.categoryId}`,
      )
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

    // Custom ordering or default
    if (filters.orderBy) {
      query = query.order(filters.orderBy, {
        ascending: filters.orderAsc ?? false,
      })
    } else {
      query = query
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit ?? 12) - 1,
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
        category:categories!category_id(*),
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

export const incrementPromptViews = createServerFn({ method: 'POST' })
  .inputValidator(promptIdSchema)
  .handler(async ({ data: id }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.rpc('increment_prompt_views', {
      prompt_text_id: id,
    })
    if (error) throw error
    return { success: true }
  })

export const fetchPromptsCount = createServerFn({ method: 'GET' })
  .inputValidator(promptFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    // Build select clause with inner joins for filtering
    const joins: string[] = ['id']
    if (filters.tagId) {
      joins.push('tags:prompt_tags!inner(tag_id)')
    }
    if (filters.modelId) {
      joins.push('models:prompt_models!inner(model_id)')
    }
    const selectClause = joins.join(', ')

    let query = supabase
      .from('prompts_with_access')
      .select(selectClause, { count: 'exact', head: true })

    if (filters.isPublished !== false) {
      query = query.eq('is_published', true)
    }
    if (filters.categoryId) {
      query = query.or(
        `category_id.eq.${filters.categoryId},parent_category_id.eq.${filters.categoryId}`,
      )
    }
    if (filters.tagId) {
      query = query.eq('tags.tag_id', filters.tagId)
    }
    if (filters.modelId) {
      query = query.eq('models.model_id', filters.modelId)
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

    const { count, error } = await query

    if (error) throw error
    return count ?? 0
  })

// ============================================
// Query Keys
// ============================================

export const promptKeys = {
  all: ['prompts'] as const,
  lists: () => [...promptKeys.all, 'list'] as const,
  list: (filters?: PromptFilters) => [...promptKeys.lists(), filters] as const,
  counts: () => [...promptKeys.all, 'count'] as const,
  count: (filters?: PromptFilters) => [...promptKeys.counts(), filters] as const,
  details: () => [...promptKeys.all, 'detail'] as const,
  detail: (id: string) => [...promptKeys.details(), id] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function promptsQueryOptions(
  filters: PromptFilters = {},
  options?: Partial<UseQueryOptions<PromptWithRelations[]>>,
) {
  return queryOptions({
    queryKey: promptKeys.list(filters),
    queryFn: () => fetchPrompts({ data: filters }),
    ...options,
  })
}

export function promptDetailQueryOptions(
  id: string,
  options?: Partial<UseQueryOptions<PromptWithRelations>>,
) {
  return queryOptions({
    queryKey: promptKeys.detail(id),
    queryFn: () => fetchPromptById({ data: id }),
    ...options,
  })
}

export function promptsCountQueryOptions(
  filters: PromptFilters = {},
  options?: Partial<UseQueryOptions<number>>,
) {
  return queryOptions({
    queryKey: promptKeys.count(filters),
    queryFn: () => fetchPromptsCount({ data: filters }),
    ...options,
  })
}

// ============================================
// Hooks
// ============================================

export function usePrompts(
  filters: PromptFilters = {},
  options?: Partial<UseQueryOptions<PromptWithRelations[]>>,
) {
  return useQuery(promptsQueryOptions({ limit: 12, ...filters }, options))
}

export function usePromptDetail(
  id: string,
  options?: Partial<UseQueryOptions<PromptWithRelations>>,
) {
  return useQuery(promptDetailQueryOptions(id, options))
}

export function useFeaturedPrompts(
  limit = 12,
  options?: Partial<UseQueryOptions<PromptWithRelations[]>>,
) {
  return useQuery(promptsQueryOptions({ isFeatured: true, limit }, options))
}

export function usePromptsByCategory(
  categoryId: string,
  limit = 12,
  options?: Partial<UseQueryOptions<PromptWithRelations[]>>,
) {
  return useQuery(promptsQueryOptions({ categoryId, limit }, options))
}

export function usePromptsByModel(
  modelId: string,
  limit = 12,
  options?: Partial<UseQueryOptions<PromptWithRelations[]>>,
) {
  return useQuery(promptsQueryOptions({ modelId, limit }, options))
}

export function usePromptsByTag(
  tagId: string,
  limit = 12,
  options?: Partial<UseQueryOptions<PromptWithRelations[]>>,
) {
  return useQuery(promptsQueryOptions({ tagId, limit }, options))
}

export function usePromptsCount(
  filters: PromptFilters = {},
  options?: Partial<UseQueryOptions<number>>,
) {
  return useQuery(promptsCountQueryOptions(filters, options))
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

export function useIncrementViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => incrementPromptViews({ data: id }),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: promptKeys.detail(id) })
    },
  })
}
