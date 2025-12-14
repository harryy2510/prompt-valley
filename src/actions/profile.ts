import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import type { Tables } from '@/types/database.types'
import { useUser } from '@/actions/auth'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type UserProfile = Tables<'users'>

export type Tier = 'free' | 'pro'
export type UserRole = 'user' | 'admin'

// ============================================
// Zod Schemas
// ============================================

const profileInputSchema = z.object({
  userId: z.uuid(),
})

export type ProfileInput = z.infer<typeof profileInputSchema>

// ============================================
// Server Functions
// ============================================

export const fetchProfile = createServerFn({ method: 'GET' })
  .inputValidator(profileInputSchema)
  .handler(async ({ data: { userId } }) => {
    const supabase = getSupabaseServerClient()

    // RLS on users table filters to current user automatically
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // User might not have a profile yet (new user) or not authenticated
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return data as UserProfile
  })

// ============================================
// Query Keys
// ============================================

export const profileKeys = {
  all: ['profile'] as const,
  current: (input: ProfileInput) =>
    [...profileKeys.all, 'current', input] as const,
}

// ============================================
// Query Options (for loaders)
// ============================================

export function profileQueryOptions(
  input: ProfileInput,
  options?: Partial<UseQueryOptions<UserProfile | null>>,
) {
  return queryOptions({
    queryKey: profileKeys.current(input),
    queryFn: () => fetchProfile({ data: input }),
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
  const userId = user?.id ?? ''
  return useQuery({
    ...profileQueryOptions({ userId }, options),
    enabled: !!userId && options?.enabled,
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
