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
import { z } from 'zod'

// ============================================
// Zod Schemas
// ============================================

const sendOtpSchema = z.object({
  email: z.email(),
})
const verifyOtpSchema = z.object({
  email: z.email(),
  token: z.string().length(6),
})

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

export const sendOtpServer = createServerFn({ method: 'POST' })
  .inputValidator(sendOtpSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      return { error: error.message, success: false as const }
    }

    return { success: true as const }
  })

export const verifyOtpServer = createServerFn({ method: 'POST' })
  .inputValidator(verifyOtpSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.token,
      type: 'email',
    })

    if (error) {
      return { error: error.message, success: false as const }
    }

    return {
      success: true as const,
    }
  })

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
      // Clear the user from cache
      queryClient.setQueryData(authKeys.user(), null)
      // Invalidate all queries that depend on auth
      await queryClient.invalidateQueries()
    },
  })
}

// ============================================
// Auth State Listener (for client-side sync)
// ============================================

export function useAuthStateListener() {
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
          queryClient.setQueryData(authKeys.user(), session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          queryClient.setQueryData(authKeys.user(), null)
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
