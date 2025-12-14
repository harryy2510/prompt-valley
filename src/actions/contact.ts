import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { supabaseInvoke } from '@/libs/supabase/client'

// ============================================
// Zod Schemas
// ============================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// ============================================
// Types
// ============================================

export type ContactFormInput = z.infer<typeof contactFormSchema>

// ============================================
// Hooks
// ============================================

export function useSendContactEmail() {
  return useMutation({
    mutationFn: async (input: ContactFormInput) => {
      return supabaseInvoke<{ success: boolean }>('send-contact-email', input)
    },
  })
}
