import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import { promptKeys, type PromptWithRelations } from './prompts'
import { useUser } from '@/actions/auth'

// ============================================
// Types
// ============================================

export type UserFavorite = Tables<'user_favorites'>

export type FavoriteWithPrompt = UserFavorite & {
  prompt: PromptWithRelations
}

// ============================================
// Server Functions
// ============================================

export const fetchUserFavorites = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_favorites')
      .select(
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
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as FavoriteWithPrompt[]
  },
)

export const fetchFavoriteIds = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_favorites')
      .select('prompt_id')

    if (error) throw error
    return data.map((f) => f.prompt_id)
  },
)

export const checkIsFavorite = createServerFn({ method: 'GET' })
  .inputValidator((promptId: string) => promptId)
  .handler(async ({ data: promptId }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('prompt_id', promptId)
      .maybeSingle()

    if (error) throw error
    return !!data
  })

export const addFavorite = createServerFn({ method: 'POST' })
  .inputValidator(
    ({ promptId, userId }: { promptId: string; userId: string }) =>
      promptId && userId,
  )
  .handler(async ({ data: { promptId, userId } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_favorites')
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

    return { favorite: data as UserFavorite }
  })

export const removeFavorite = createServerFn({ method: 'POST' })
  .inputValidator(
    ({ promptId, userId }: { promptId: string; userId: string }) =>
      promptId && userId,
  )
  .handler(async ({ data: { promptId, userId } }) => {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId)

    if (error) throw error

    return { success: true }
  })

// ============================================
// Query Keys
// ============================================

export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: () => [...favoriteKeys.lists()] as const,
  ids: () => [...favoriteKeys.all, 'ids'] as const,
  check: ({ userId, promptId }: { promptId: string; userId: string }) =>
    [...favoriteKeys.all, 'check', { userId, promptId }] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function userFavoritesQueryOptions() {
  return queryOptions({
    queryKey: favoriteKeys.list(),
    queryFn: () => fetchUserFavorites(),
  })
}

export function favoriteIdsQueryOptions() {
  return queryOptions({
    queryKey: favoriteKeys.ids(),
    queryFn: () => fetchFavoriteIds(),
  })
}

export function isFavoriteQueryOptions({
  promptId,
  userId,
}: {
  promptId: string
  userId: string
}) {
  return queryOptions({
    queryKey: favoriteKeys.check({ promptId, userId }),
    queryFn: () => checkIsFavorite({ data: { promptId, userId } }),
  })
}

// ============================================
// Hooks
// ============================================

export function useUserFavorites() {
  return useQuery(userFavoritesQueryOptions())
}

export function useFavoriteIds() {
  return useQuery(favoriteIdsQueryOptions())
}

export function useIsFavorite(promptId: string) {
  const { data: user } = useUser()
  return useQuery(isFavoriteQueryOptions({ promptId, userId: user?.id }))
}

export function useAddFavorite() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()

  return useMutation({
    mutationFn: (promptId: string) =>
      addFavorite({ data: { promptId, userId: user?.id } }),
    onSuccess: (_, promptId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: promptKeys.detail(promptId) })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()

  return useMutation({
    mutationFn: (promptId: string) =>
      removeFavorite({ data: { promptId, userId: user?.id } }),
    onSuccess: (_, promptId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: promptKeys.detail(promptId) })
    },
  })
}
