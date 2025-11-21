import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import type { Prompt } from './prompts'

// ============================================
// Types
// ============================================

export type Collection = Tables<'collections'>

export interface CollectionWithPrompts extends Collection {
  prompts: Prompt[]
  prompt_count?: number
}

export type CreateCollectionInput = Omit<
  TablesInsert<'collections'>,
  'user_id' | 'created_at' | 'updated_at'
>

export type UpdateCollectionInput = {
  id: string
} & Partial<CreateCollectionInput>

// ============================================
// Query Keys
// ============================================

export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: () => [...collectionKeys.lists()] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
}

// ============================================
// Query Options
// ============================================

export function collectionsQueryOptions() {
  return queryOptions({
    queryKey: collectionKeys.list(),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('collections')
        .select(
          `
          *,
          prompts:prompts(count)
        `,
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((collection) => ({
        ...collection,
        prompt_count: collection.prompts?.[0]?.count || 0,
        prompts: [],
      })) as CollectionWithPrompts[]
    },
  })
}

export function collectionDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: collectionKeys.detail(id),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase
        .from('collections')
        .select(
          `
          *,
          prompts:prompts(*)
        `,
        )
        .eq('id', id)
        .single()

      if (error) throw error
      return data as CollectionWithPrompts
    },
  })
}

// ============================================
// Hooks
// ============================================

export function useCollections() {
  return useQuery(collectionsQueryOptions())
}

export function useCollectionDetail(id: string) {
  return useQuery(collectionDetailQueryOptions(id))
}

// ============================================
// Mutations
// ============================================

export function useCreateCollection() {
  return useMutation({
    mutationFn: async (input: CreateCollectionInput) => {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('collections')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Collection
    },
  })
}

export function useUpdateCollection() {
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateCollectionInput) => {
      const supabase = getSupabaseBrowserClient()

      const { data, error } = await supabase
        .from('collections')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Collection
    },
  })
}

export function useDeleteCollection() {
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from('collections').delete().eq('id', id)

      if (error) throw error
    },
  })
}
