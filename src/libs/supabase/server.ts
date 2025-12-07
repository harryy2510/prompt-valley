import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'

import type { Database } from '@/types/database.types'

import { STORAGE_KEY } from './constants'

/**
 * Server-side Supabase with cookie-based session management
 * Uses service role key for data operations (bypasses RLS)
 */
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storageKey: STORAGE_KEY,
      },
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value)
          })
        },
      },
    },
  )
}
