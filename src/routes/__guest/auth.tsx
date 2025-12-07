import { createFileRoute } from '@tanstack/react-router'

import { SignInForm } from '@/components/auth/sign-in-form'
import { Logo } from '@/components/layout/logo'

export const Route = createFileRoute('/__guest/auth')({
  component: AuthPage,
})

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-8">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Logo className="size-10" />
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  )
}
