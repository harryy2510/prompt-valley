import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { MainLayout } from '@/components/layout'
import { userQueryOptions } from '@/actions/auth'
import { useCreatePortalSession } from '@/actions/stripe'

// ============================================
// Route Config
// ============================================

export const Route = createFileRoute('/billing')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  component: BillingPage,
})

// ============================================
// Component
// ============================================

function BillingPage() {
  const createPortalSession = useCreatePortalSession()

  useEffect(() => {
    createPortalSession.mutate(undefined, {
      onSuccess: (result) => {
        if (result?.url) {
          // Use replace so back button doesn't return to this redirect page
          window.location.replace(result.url)
        }
      },
      onError: () => {
        // If error (e.g., no subscription), redirect to pricing
        window.location.replace('/pricing')
      },
    })
  }, [])

  return (
    <MainLayout>
      <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Redirecting to billing portal...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
