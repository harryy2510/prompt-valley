import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

// ============================================
// Search Schema
// ============================================

const guestSearchSchema = z.object({
  redirect: z.string().optional(),
})

// ============================================
// Guest Layout Route
// ============================================

export const Route = createFileRoute('/__guest')({
  beforeLoad: async ({ context, search }) => {
    // Session is already in context from root route
    if (context.user) {
      throw redirect({
        to: search.redirect || '/dashboard',
      })
    }
  },
  validateSearch: guestSearchSchema,
})
