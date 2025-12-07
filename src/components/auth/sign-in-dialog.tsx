import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { SignInForm } from './sign-in-form'

export type SignInDialogProps = {
  /** Trigger element that opens the dialog */
  children: ReactNode
  /** Whether the dialog is open (controlled) */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

export function SignInDialog({
  children,
  open,
  onOpenChange,
}: SignInDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md p-8">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <SignInForm onSuccess={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  )
}
