import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-red-500/5">
      {/* Animated gradient orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-br from-red-500/20 via-orange-500/20 to-transparent blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Error Card */}
        <div className="rounded-2xl border border-red-500/20 bg-card/80 backdrop-blur-sm p-8 shadow-xl">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-4 shadow-lg">
              <AlertCircle className="size-8 text-white" />
            </div>
          </div>

          {/* Error Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Don't worry, we're on it!
            </p>
          </div>

          {/* Error Details */}
          <div className="mb-8 rounded-lg bg-muted/50 p-4 max-h-48 overflow-auto">
            <ErrorComponent error={error} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => router.invalidate()}
              variant="gradient"
              size="lg"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>

            {isRoot ? (
              <Button variant="outline" size="lg" asChild>
                <Link to="/">
                  <Home className="size-4" />
                  Go Home
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="size-4" />
                Go Back
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              If this problem persists, please contact support or try refreshing
              the page.
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Error occurred at {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
