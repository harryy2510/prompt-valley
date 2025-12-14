import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { SignInForm } from './sign-in-form'
import { useStoreValue } from 'zustand-x'
import { appStore } from '@/stores/app'

export type SignInDialogProps = {
  /** Trigger element that opens the dialog */
  children?: ReactNode
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
  const storeValue = useStoreValue(appStore, 'signInDialog')

  const controlledOpen = typeof open !== 'undefined' ? open : storeValue

  const setControlledOpenState = (value: boolean) =>
    typeof open !== 'undefined'
      ? onOpenChange?.(value)
      : appStore.set('signInDialog', value)

  return (
    <Dialog open={controlledOpen} onOpenChange={setControlledOpenState}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-md p-8">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <SignInForm onSuccess={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  )
}
