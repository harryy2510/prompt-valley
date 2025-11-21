import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
import { authKeys } from '@/actions/auth'

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
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
        queryClient.invalidateQueries()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  return <>{children}</>
}
