import { createFileRoute } from '@tanstack/react-router'

import { SignInForm } from '@/components/auth/sign-in-form'
import { Logo } from '@/components/layout/logo'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/__guest/auth')({
  component: AuthPage,
})

function AuthPage() {
  return (
    <MainLayout>
      <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
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
    </MainLayout>
  )
}
