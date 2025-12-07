import { useAuthStateSync } from '@/actions/auth'
import { PropsWithChildren } from 'react'

export function AuthStateProvider({ children }: PropsWithChildren) {
  useAuthStateSync()

  return <>{children}</>
}
