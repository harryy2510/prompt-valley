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
import { MainLayout } from '@/components/layout'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>

          {/* Title */}
          <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            We encountered an unexpected error. Don't worry, we're on it!
          </p>

          {/* Error Details */}
          <div className="mt-6 w-full max-w-lg rounded-lg border bg-muted/50 p-4 text-left">
            <div className="max-h-32 overflow-auto text-sm">
              <ErrorComponent error={error} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center gap-3">
            <Button onClick={() => router.invalidate()}>
              <RefreshCw className="size-4" />
              Try Again
            </Button>

            {isRoot ? (
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="size-4" />
                  Go Home
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="size-4" />
                Go Back
              </Button>
            )}
          </div>

          {/* Help Text */}
          <p className="mt-6 text-sm text-muted-foreground">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
