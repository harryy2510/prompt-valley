import {
  SocialButtonGroup,
  SocialProvider,
} from '@/components/common/social-button'
import { SignInDialog } from '@/components/auth'
import { useBoolean } from 'usehooks-ts'
import { getSupabaseBrowserClient } from '@/libs/supabase/client'
import bgImage from '@/assets/landing/cta-section-background.webp'

// ============================================
// CTA Section Component
// ============================================

export function CtaSection() {
  const { value, setTrue, setValue } = useBoolean()

  const handleClick = (provider: SocialProvider) => {
    switch (provider) {
      case 'email':
        setTrue()
        break
      case 'apple':
      case 'google':
        getSupabaseBrowserClient().auth.signInWithOAuth({
          provider,
        })
        break
    }
  }

  return (
    <section className="relative overflow-hidden bg-secondary-50">
      <img
        alt=""
        src={bgImage}
        className="absolute top-[50%] translate-y-[-50%] left-0 max-w-40 hidden sm:block"
      />
      <div className="container mx-auto max-w-[320px] text-center py-20">
        {/* Heading */}
        <h4 className="text-xl font-bold lg:text-2xl">
          Sign up for free and elevate your vision
        </h4>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-4 max-w-60 mx-auto">
          <SocialButtonGroup
            buttonClassName="bg-secondary-200 hover:bg-secondary-300 text-foreground border-none"
            onProviderClick={handleClick}
          />

          <SignInDialog open={value} onOpenChange={setValue} />
        </div>
      </div>
      <img
        alt=""
        src={bgImage}
        className="absolute top-[50%] translate-y-[-50%] right-0 max-w-40 -scale-x-100 hidden sm:block"
      />
    </section>
  )
}
