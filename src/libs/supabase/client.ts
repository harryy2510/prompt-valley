import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

let browserClient: SupabaseClient<Database, 'public'> | null = null

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient
  }

  browserClient = createBrowserClient<Database, 'public'>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
  )

  return browserClient
}
