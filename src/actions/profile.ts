import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/libs/supabase/server'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
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

// ============================================
// Update Profile
// ============================================

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  avatar_url: z.string().nullable().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!user?.id) throw new Error('Not authenticated')

      const supabase = getSupabaseBrowserClient()

      // Update auth.users metadata - trigger syncs to public.users
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: input.name,
          avatar_url: input.avatar_url,
        },
      })

      if (authError) throw authError

      // Fetch updated profile from public.users (synced by trigger)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data as UserProfile
    },
    onSuccess: (data) => {
      // Update the profile cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.current({ userId: user.id }), data)
      }
    },
  })
}

// ============================================
// Avatar Upload
// ============================================

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.id) throw new Error('Not authenticated')

      // Generate unique filename
      const ext = file.name.split('.').pop()
      const filename = `avatars/${user.id}/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('content-bucket')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) throw error

      return filename
    },
  })
}
