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
import { promptKeys } from './prompts'
import { useUser } from '@/actions/auth'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type UserLike = Tables<'user_likes'>

// ============================================
// Zod Schemas
// ============================================

const likeInputSchema = z.object({
  promptId: z.string(),
  userId: z.string().uuid(),
})

export type LikeInput = z.infer<typeof likeInputSchema>

// ============================================
// Server Functions
// ============================================

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
  ids: () => [...likeKeys.all, 'ids'] as const,
  check: (input: LikeInput) => [...likeKeys.all, 'check', input] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: likeKeys.all }),
        queryClient.invalidateQueries({
          queryKey: promptKeys.detail(promptId),
        }),
      ])
    },
  })
}
