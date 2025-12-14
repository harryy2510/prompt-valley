import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import { promptKeys, type PromptWithRelations } from './prompts'
import { useUser } from '@/actions/auth'
import { z } from 'zod'
import { trackPromptLiked, trackPromptUnliked } from '@/libs/posthog'

// ============================================
// Types
// ============================================

export type UserLike = Tables<'user_likes'>

export type LikeWithPrompt = UserLike & {
  prompt: PromptWithRelations
}

// ============================================
// Zod Schemas
// ============================================

const likesFiltersSchema = z
  .object({
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
    orderBy: z.enum(['created_at']).optional(),
    orderAsc: z.boolean().optional(),
  })
  .optional()

const likeInputSchema = z.object({
  promptId: z.string(),
  userId: z.string().uuid(),
})

export type LikeInput = z.infer<typeof likeInputSchema>
export type LikesFilters = z.infer<typeof likesFiltersSchema>

// ============================================
// Server Functions
// ============================================

export const fetchUserLikes = createServerFn({ method: 'GET' })
  .inputValidator(likesFiltersSchema)
  .handler(async ({ data: filters }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase.from('user_likes').select(
      `
        *,
        prompt:prompts(
          *,
          category:categories(*),
          tags:prompt_tags(tag:tags(*)),
          models:prompt_models(model:ai_models(*, provider:ai_providers(*)))
        )
      `,
    )

    query = query.order(filters?.orderBy ?? 'created_at', {
      ascending: filters?.orderAsc ?? false,
    })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit ?? 12) - 1,
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data as LikeWithPrompt[]
  })

export const fetchLikeIds = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_likes')
      .select('prompt_id')

    if (error) throw error
    return data.map((l) => l.prompt_id)
  },
)

export const checkIsLiked = createServerFn({ method: 'GET' })
  .inputValidator(likeInputSchema)
  .handler(async ({ data: { promptId, userId } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_likes')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    return !!data
  })

export const addLike = createServerFn({ method: 'POST' })
  .inputValidator(likeInputSchema)
  .handler(async ({ data: { promptId, userId } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_likes')
      .insert({
        user_id: userId,
        prompt_id: promptId,
      })
      .select()
      .single()

    if (error) {
      // Handle duplicate gracefully
      if (error.code === '23505') {
        return { alreadyExists: true }
      }
      throw error
    }

    return { like: data as UserLike }
  })

export const removeLike = createServerFn({ method: 'POST' })
  .inputValidator(likeInputSchema)
  .handler(async ({ data: { promptId, userId } }) => {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('user_likes')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId)

    if (error) throw error

    return { success: true }
  })

// ============================================
// Query Keys
// ============================================

export const likeKeys = {
  all: ['likes'] as const,
  lists: () => [...likeKeys.all, 'list'] as const,
  list: (filters?: LikesFilters) => [...likeKeys.lists(), filters] as const,
  ids: () => [...likeKeys.all, 'ids'] as const,
  check: (input: LikeInput) => [...likeKeys.all, 'check', input] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function userLikesQueryOptions(
  filters?: LikesFilters,
  options?: Partial<UseQueryOptions<LikeWithPrompt[]>>,
) {
  return queryOptions({
    queryKey: likeKeys.list(filters),
    queryFn: () => fetchUserLikes({ data: filters }),
    ...options,
  })
}

export function likeIdsQueryOptions(
  options?: Partial<UseQueryOptions<string[]>>,
) {
  return queryOptions({
    queryKey: likeKeys.ids(),
    queryFn: () => fetchLikeIds(),
    ...options,
  })
}

export function isLikedQueryOptions(
  input: LikeInput,
  options?: Partial<UseQueryOptions<boolean>>,
) {
  return queryOptions({
    queryKey: likeKeys.check(input),
    queryFn: () => checkIsLiked({ data: input }),
    ...options,
  })
}

// ============================================
// Hooks
// ============================================

export function useUserLikes(
  filters?: LikesFilters,
  options?: Partial<UseQueryOptions<LikeWithPrompt[]>>,
) {
  const { data: user } = useUser()
  const userId = user?.id ?? ''
  return useQuery({
    ...userLikesQueryOptions(filters, options),
    enabled: !!userId && options?.enabled !== false,
  })
}

export function useLikeIds(options?: Partial<UseQueryOptions<string[]>>) {
  const { data: user } = useUser()
  const userId = user?.id ?? ''
  return useQuery({
    ...likeIdsQueryOptions(options),
    enabled: !!userId && options?.enabled !== false,
  })
}

export function useIsLiked(
  promptId: string,
  options?: Partial<UseQueryOptions<boolean>>,
) {
  const { data: user } = useUser()
  const userId = user?.id ?? ''
  return useQuery({
    ...isLikedQueryOptions({ promptId, userId }, options),
    enabled: !!userId && options?.enabled !== false,
  })
}

export function useAddLike() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()

  return useMutation({
    mutationFn: (promptId: string) => {
      if (!user?.id) throw new Error('User not authenticated')
      return addLike({ data: { promptId, userId: user.id } })
    },
    onSuccess: async (_, promptId) => {
      trackPromptLiked(promptId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: likeKeys.all }),
        queryClient.invalidateQueries({
          queryKey: promptKeys.detail(promptId),
        }),
      ])
    },
  })
}

export function useRemoveLike() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()

  return useMutation({
    mutationFn: (promptId: string) => {
      if (!user?.id) throw new Error('User not authenticated')
      return removeLike({ data: { promptId, userId: user.id } })
    },
    onSuccess: async (_, promptId) => {
      trackPromptUnliked(promptId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: likeKeys.all }),
        queryClient.invalidateQueries({
          queryKey: promptKeys.detail(promptId),
        }),
      ])
    },
  })
}
