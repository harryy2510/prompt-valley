import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'
import { SearchX, Home, ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout'

type NotFoundProps = PropsWithChildren<{
  data?: unknown
}>

export function NotFound({ children }: NotFoundProps) {
  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-8 text-muted-foreground" />
          </div>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-bold">404</h1>
          <h2 className="mt-2 text-xl font-semibold">Page not found</h2>

          {/* Description */}
          <div className="mt-3 max-w-md text-muted-foreground">
            {children || (
              <p>The page you are looking for doesn't exist or has been moved.</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center gap-3">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
