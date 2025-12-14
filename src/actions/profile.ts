import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import { useUser } from '@/actions/auth'

// ============================================
// Types
// ============================================

export type UserProfile = Tables<'users'>

export type Tier = 'free' | 'pro'
export type UserRole = 'user' | 'admin'

// ============================================
// Server Functions
// ============================================

export const fetchProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()

    // RLS on users table filters to current user automatically
    const { data, error } = await supabase.from('users').select('*').single()

    if (error) {
      // User might not have a profile yet (new user) or not authenticated
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return data as UserProfile
  },
)

// ============================================
// Query Keys
// ============================================

export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function profileQueryOptions(
  options?: Partial<UseQueryOptions<UserProfile | null>>,
) {
  return queryOptions({
    queryKey: profileKeys.current(),
    queryFn: () => fetchProfile(),
    ...options,
  })
}

// ============================================
// Hooks
// ============================================

export function useProfile(
  options?: Partial<UseQueryOptions<UserProfile | null>>,
) {
  const { data: user } = useUser()
  return useQuery({
    ...profileQueryOptions(options),
    enabled: options?.enabled && !!user?.id,
  })
}

// ============================================
// Access Helpers
// ============================================

export function hasProAccess(profile: UserProfile | null | undefined): boolean {
  return profile?.tier === 'pro'
}

export function hasAdminAccess(
  profile: UserProfile | null | undefined,
): boolean {
  return profile?.role === 'admin'
}

export function isSubscriptionActive(
  profile: UserProfile | null | undefined,
): boolean {
  if (!profile) return false

  const activeStatuses = ['active', 'trialing']
  return (
    profile.stripe_subscription_status !== null &&
    activeStatuses.includes(profile.stripe_subscription_status)
  )
}
