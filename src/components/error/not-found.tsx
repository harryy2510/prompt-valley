import { Link } from '@tanstack/react-router'
import { PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'
import { SearchX, Home, ArrowLeft, Sparkles } from 'lucide-react'

export function NotFound({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-purple-500/5">
      {/* Animated gradient orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* 404 Card */}
        <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-8 shadow-xl">
          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-4 shadow-lg">
              <SearchX className="size-8 text-white" />
            </div>
          </div>

          {/* 404 Title */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <span className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                404
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Page not found</h1>
            <div className="text-muted-foreground">
              {children || (
                <p>
                  The page you are looking for doesn't exist or has been moved.
                </p>
              )}
            </div>
          </div>

          {/* Decoration */}
          <div className="flex justify-center gap-2 mb-8">
            <Sparkles className="size-4 text-purple-500 animate-pulse" />
            <Sparkles className="size-3 text-blue-500 animate-pulse animation-delay-200" />
            <Sparkles className="size-4 text-purple-500 animate-pulse animation-delay-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>

            <Button variant="gradient" size="lg" asChild>
              <Link to="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Looking for something specific? Try starting from the{' '}
              <Link
                to="/"
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                homepage
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Fun message */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Looks like this prompt got lost in the void! 🌌</p>
        </div>
      </div>
    </div>
  )
}
