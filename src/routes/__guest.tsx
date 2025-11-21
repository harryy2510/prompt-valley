import { createFileRoute, redirect } from '@tanstack/react-router'

// ============================================
// Protected Layout Route
// ============================================

export const Route = createFileRoute('/__guest')({
  beforeLoad: async ({ context, location }) => {
    // Session is already in context from root route
    if (context.session) {
      throw redirect({
        to: location.search.redirect || '/dashboard',
      })
    }
  },
})
