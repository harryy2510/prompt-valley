import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
import type { Tables, TablesInsert, TablesUpdate, Enums } from '@/types/database.types'

// ============================================
// Types
// ============================================

export type Prompt = Tables<'prompts'>
export type PromptCategory = Enums<'prompt_category'>
export type AiPlatform = Enums<'ai_platform'>
export type Collection = Tables<'collections'>

export interface PromptWithCollection extends Prompt {
  collection: Collection | null
  is_favorited?: boolean
}

export type CreatePromptInput = Omit<
  TablesInsert<'prompts'>,
  'user_id' | 'created_at' | 'updated_at' | 'use_count' | 'favorite_count'
>

export type UpdatePromptInput = {
  id: string
} & Partial<CreatePromptInput>

// ============================================
// Query Keys
// ============================================

export const promptKeys = {
  all: ['prompts'] as const,
  lists: () => [...promptKeys.all, 'list'] as const,
  list: (filters?: {
    category?: PromptCategory
    platform?: AiPlatform
    search?: string
    isPublic?: boolean
    isCurated?: boolean
    isFavorited?: boolean
  }) => [...promptKeys.lists(), filters] as const,
  details: () => [...promptKeys.all, 'detail'] as const,
  detail: (id: string) => [...promptKeys.details(), id] as const,
  myPrompts: () => [...promptKeys.all, 'my-prompts'] as const,
  curatedPrompts: () => [...promptKeys.all, 'curated'] as const,
}

// ============================================
// Query Options
// ============================================

export function curatedPromptsQueryOptions() {
  return queryOptions({
    queryKey: promptKeys.curatedPrompts(),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_curated', true)
        .order('is_featured', { ascending: false })
        .order('favorite_count', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Prompt[]
    },
  })
}

export function myPromptsQueryOptions() {
  return queryOptions({
    queryKey: promptKeys.myPrompts(),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('prompts')
        .select(
          `
          *,
          collection:collections(*)
        `,
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as PromptWithCollection[]
    },
  })
}

export function promptDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: promptKeys.detail(id),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase
        .from('prompts')
        .select(
          `
          *,
          collection:collections(*)
        `,
        )
        .eq('id', id)
        .single()

      if (error) throw error

      // Check if user has favorited this prompt
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: favorite } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('prompt_id', id)
          .single()

        return {
          ...data,
          is_favorited: !!favorite,
        } as PromptWithCollection
      }

      return data as PromptWithCollection
    },
  })
}

export function searchPromptsQueryOptions(filters: {
  category?: PromptCategory
  platform?: AiPlatform
  search?: string
  isPublic?: boolean
  isCurated?: boolean
}) {
  return queryOptions({
    queryKey: promptKeys.list(filters),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()

      let query = supabase.from('prompts').select('*')

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.platform) {
        query = query.eq('platform', filters.platform)
      }
      if (filters.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic)
      }
      if (filters.isCurated !== undefined) {
        query = query.eq('is_curated', filters.isCurated)
      }
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
        )
      }

      const { data, error } = await query
        .order('is_featured', { ascending: false })
        .order('favorite_count', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Prompt[]
    },
  })
}

// ============================================
// Hooks
// ============================================

export function useCuratedPrompts() {
  return useQuery(curatedPromptsQueryOptions())
}

export function useMyPrompts() {
  return useQuery(myPromptsQueryOptions())
}

export function usePromptDetail(id: string) {
  return useQuery(promptDetailQueryOptions(id))
}

export function useSearchPrompts(filters: {
  category?: PromptCategory
  platform?: AiPlatform
  search?: string
  isPublic?: boolean
  isCurated?: boolean
}) {
  return useQuery(searchPromptsQueryOptions(filters))
}

// ============================================
// Mutations
// ============================================

export function useCreatePrompt() {
  return useMutation({
    mutationFn: async (input: CreatePromptInput) => {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('prompts')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Prompt
    },
  })
}

export function useUpdatePrompt() {
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdatePromptInput) => {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase
        .from('prompts')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Prompt
    },
  })
}

export function useDeletePrompt() {
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from('prompts').delete().eq('id', id)

      if (error) throw error
    },
  })
}

export function useToggleFavorite() {
  return useMutation({
    mutationFn: async (promptId: string) => {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.rpc('toggle_favorite', {
        prompt_uuid: promptId,
        user_uuid: user.id,
      })

      if (error) throw error
      return data as boolean
    },
  })
}

export function useIncrementUseCount() {
  return useMutation({
    mutationFn: async (promptId: string) => {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.rpc('increment_prompt_use_count', {
        prompt_uuid: promptId,
        user_uuid: user.id,
      })

      if (error) throw error
    },
  })
}

export function useCopyPrompt() {
  const incrementUseCount = useIncrementUseCount()

  return useMutation({
    mutationFn: async (prompt: Prompt) => {
      // Copy to clipboard
      await navigator.clipboard.writeText(prompt.content)

      // Increment use count
      await incrementUseCount.mutateAsync(prompt.id)

      return prompt
    },
  })
}
