import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, LogOut, Check } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/actions/auth'

export const Route = createFileRoute('/__authed/sign-out')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState<'signing-out' | 'success' | 'error'>(
    'signing-out',
  )
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const signOut = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.auth.signOut()

        if (error) throw error

        // Clear auth cache
        queryClient.setQueryData(authKeys.user(), null)

        setStatus('success')

        // Redirect to home after 1 second
        setTimeout(() => {
          navigate({ to: '/' })
        }, 1000)
      } catch (err: any) {
        setError(err.message || 'Failed to sign out. Please try again.')
        setStatus('error')
      }
    }

    signOut()
  }, [navigate, queryClient])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-purple-500/5">
      {/* Animated gradient orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Sign Out Card */}
        <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-8 shadow-xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PromptValley
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-8">
            {status === 'signing-out' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-4 shadow-lg">
                    <Loader2 className="size-8 text-white animate-spin" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Signing you out</h1>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-4 shadow-lg">
                    <Check className="size-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Successfully signed out
                </h1>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to home...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-4 shadow-lg">
                    <LogOut className="size-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Something went wrong
                </h1>
                <p className="text-sm text-destructive mb-6">{error}</p>
                <Button
                  variant="gradient"
                  onClick={() => navigate({ to: '/' })}
                  className="w-full"
                >
                  Go to Home
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
