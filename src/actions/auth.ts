import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import dayjs from 'dayjs'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'

// ============================================
// Server Functions
// ============================================

export const fetchSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session?.access_token) {
      return { session: null, user: null }
    }

    if (dayjs.unix(data.session.expires_at!).isBefore(dayjs())) {
      return { session: null, user: null }
    }

    return {
      session: data.session,
      user: data.session.user,
    }
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
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// ============================================
// Query Options (for use in loaders and components)
// ============================================

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.session(),
    queryFn: () => fetchSession(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })

// ============================================
// Hooks
// ============================================

export function useSession() {
  return useQuery(sessionQueryOptions())
}

export function useUser() {
  const { data, ...rest } = useSession()
  return {
    ...rest,
    data: data?.user ?? null,
  }
}

export function useIsAuthenticated() {
  const { data, isLoading } = useSession()
  return {
    isAuthenticated: !!data?.session,
    isLoading,
  }
}

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOutServer,
    onSuccess: () => {
      // Clear the session from cache
      queryClient.setQueryData(authKeys.session(), {
        session: null,
        user: null,
      })
      // Optionally invalidate all queries that depend on auth
      queryClient.invalidateQueries()
    },
  })
}

// ============================================
// Auth State Listener (for client-side sync)
// ============================================

export function useAuthStateSync() {
  const queryClient = useQueryClient()

  // Set up listener for auth state changes on the client
  if (typeof window !== 'undefined') {
    const supabase = getSupabaseBrowserClient()

    supabase.auth.onAuthStateChange((event, session) => {
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
        queryClient.invalidateQueries()
      }
    })
  }
}
