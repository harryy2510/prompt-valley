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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as FavoriteWithPrompt[]
  },
)

export const fetchFavoriteIds = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('prompt_id')
      .eq('user_id', user.id)

    if (error) throw error
    return data.map((f) => f.prompt_id)
  },
)

export const checkIsFavorite = createServerFn({ method: 'GET' })
  .inputValidator((promptId: string) => promptId)
  .handler(async ({ data: promptId }) => {
    const supabase = getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .maybeSingle()

    if (error) throw error
    return !!data
  })

export const addFavorite = createServerFn({ method: 'POST' })
  .inputValidator((promptId: string) => promptId)
  .handler(async ({ data: promptId }) => {
    const supabase = getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Must be logged in to add favorites')
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
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
  .inputValidator((promptId: string) => promptId)
  .handler(async ({ data: promptId }) => {
    const supabase = getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Must be logged in to remove favorites')
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)

    if (error) throw error

    return { success: true }
  })

export const toggleFavorite = createServerFn({ method: 'POST' })
  .inputValidator((promptId: string) => promptId)
  .handler(async ({ data: promptId }) => {
    const supabase = getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Must be logged in to toggle favorites')
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .maybeSingle()

    if (existing) {
      // Remove favorite
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_id', promptId)

      return { isFavorited: false }
    } else {
      // Add favorite
      await supabase.from('user_favorites').insert({
        user_id: user.id,
        prompt_id: promptId,
      })

      return { isFavorited: true }
    }
  })

// ============================================
// Query Keys
// ============================================

export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: () => [...favoriteKeys.lists()] as const,
  ids: () => [...favoriteKeys.all, 'ids'] as const,
  check: (promptId: string) => [...favoriteKeys.all, 'check', promptId] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function userFavoritesQueryOptions() {
  return queryOptions({
    queryKey: favoriteKeys.list(),
    queryFn: () => fetchUserFavorites(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export function favoriteIdsQueryOptions() {
  return queryOptions({
    queryKey: favoriteKeys.ids(),
    queryFn: () => fetchFavoriteIds(),
    staleTime: 1000 * 60 * 2,
  })
}

export function isFavoriteQueryOptions(promptId: string) {
  return queryOptions({
    queryKey: favoriteKeys.check(promptId),
    queryFn: () => checkIsFavorite({ data: promptId }),
    staleTime: 1000 * 60 * 2,
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
  return useQuery(isFavoriteQueryOptions(promptId))
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (promptId: string) => addFavorite({ data: promptId }),
    onSuccess: (_, promptId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: promptKeys.detail(promptId) })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (promptId: string) => removeFavorite({ data: promptId }),
    onSuccess: (_, promptId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: promptKeys.detail(promptId) })
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (promptId: string) => toggleFavorite({ data: promptId }),
    onMutate: async (promptId) => {
      // Optimistic update for favorite IDs
      await queryClient.cancelQueries({ queryKey: favoriteKeys.ids() })
      const previousIds = queryClient.getQueryData<string[]>(favoriteKeys.ids())

      if (previousIds) {
        const isFavorited = previousIds.includes(promptId)
        queryClient.setQueryData<string[]>(
          favoriteKeys.ids(),
          isFavorited
            ? previousIds.filter((id) => id !== promptId)
            : [...previousIds, promptId],
        )
      }

      return { previousIds }
    },
    onError: (_, __, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(favoriteKeys.ids(), context.previousIds)
      }
    },
    onSettled: (_, __, promptId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: promptKeys.detail(promptId) })
    },
  })
}
