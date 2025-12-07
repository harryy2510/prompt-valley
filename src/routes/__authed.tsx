import { createFileRoute, redirect } from '@tanstack/react-router'

// ============================================
// Protected Layout Route
// ============================================

export const Route = createFileRoute('/__authed')({
  beforeLoad: async ({ context, location }) => {
    // Session is already in context from root route
    if (!context.user) {
      throw redirect({
        search: {
          to: location.href,
        },
        to: '/auth',
      })
    }
  },
})
