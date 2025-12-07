import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useSendOtp, useVerifyOtp } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

// ============================================
// Schemas
// ============================================

const emailSchema = z.object({
  email: z.email('Please enter a valid email address'),
  otp: z.string().optional(),
})

const otpSchema = z.object({
  email: z.email('Please enter a valid email address'),
  otp: z.string().length(6, 'Please enter the 6-digit code'),
})

type FormValues = z.infer<typeof emailSchema>

// ============================================
// Types
// ============================================

export type SignInFormProps = {
  /** Callback when sign in succeeds */
  onSuccess?: () => void
}

// ============================================
// Component
// ============================================

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const router = useRouter()

  const sendOtp = useSendOtp()
  const verifyOtp = useVerifyOtp()

  const isPending = sendOtp.isPending || verifyOtp.isPending
  const error =
    sendOtp.error ||
    verifyOtp.error ||
    (sendOtp.data && !sendOtp.data.success ? sendOtp.data.error : null) ||
    (verifyOtp.data && !verifyOtp.data.success ? verifyOtp.data.error : null)

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      otp: '',
    },
    resolver: zodResolver(step === 'email' ? emailSchema : otpSchema),
  })

  const handleSubmit = async (data: FormValues) => {
    if (step === 'email') {
      const result = await sendOtp.mutateAsync(data.email)
      if (result.success) {
        setStep('otp')
      }
    } else {
      const result = await verifyOtp.mutateAsync({
        email: data.email,
        token: data.otp!,
      })
      if (result.success) {
        onSuccess?.()
        router.invalidate()
      }
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    form.setValue('otp', '')
    form.clearErrors()
    sendOtp.reset()
    verifyOtp.reset()
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-h5 font-semibold">
          {step === 'email' ? 'Welcome to PromptValley' : 'Verify your email'}
        </h2>
        <p className="mt-2 text-body2 text-muted-foreground">
          {step === 'email'
            ? 'Enter your email to receive a one-time password'
            : `We sent a 6-digit code to ${form.getValues('email')}`}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Email field - hidden when on OTP step */}
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem hidden={step !== 'email'}>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* OTP field - hidden when on email step */}
          <FormField
            name="otp"
            render={({ field }) => (
              <FormItem hidden={step !== 'otp'}>
                <FormLabel className="sr-only">One-time password</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      disabled={isPending}
                      autoFocus={step === 'otp'}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {typeof error === 'string' ? error : error.message}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {step === 'email' ? 'Sending...' : 'Verifying...'}
                </>
              ) : step === 'email' ? (
                'Continue'
              ) : (
                'Verify and sign in'
              )}
            </Button>

            {step === 'otp' && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isPending}
                onClick={handleBackToEmail}
              >
                Use a different email
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-center text-caption text-muted-foreground">
        By continuing, you agree to our{' '}
        <a
          href="/terms"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Terms
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  )
}
