import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
import { useEffect } from 'react'

// ============================================
// Server Functions
// ============================================

export const getUserServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    return data.user
  },
)

export const signOutServer = createServerFn({ method: 'POST' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    await supabase.auth.signOut()
    return { success: true }
  },
)

// ============================================
// Query Keys
// ============================================

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// ============================================
// Query Options (for use in loaders and components)
// ============================================

export const userQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.user(),
    queryFn: getUserServer,
  })

// ============================================
// Hooks
// ============================================

export function useUser() {
  return useQuery(userQueryOptions())
}

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOutServer,
    onSuccess: async () => {
      // Clear the session from cache
      queryClient.setQueryData(authKeys.user(), null)
      // Invalidate all queries that depend on auth
      await queryClient.invalidateQueries()
    },
  })
}

// ============================================
// Auth State Listener (for client-side sync)
// ============================================

export function useAuthStateSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Set up listener for auth state changes on the client
    if (typeof window !== 'undefined') {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('[Auth] State changed:', event)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          queryClient.setQueryData(authKeys.session(), {
            session,
            user: session?.user ?? null,
          })
        } else if (event === 'SIGNED_OUT') {
          queryClient.setQueryData(authKeys.session(), {
            session: null,
            user: null,
          })
          // Invalidate all queries to refetch with new auth state
          void queryClient.invalidateQueries()
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [queryClient])
}
