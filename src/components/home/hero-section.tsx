import { SignInDialog } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/common/image'

// ============================================
// Hero Section Component
// ============================================

export function HeroSection() {
  return (
    <section className="container py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            High-Quality{' '}
            <span className="text-primary">AI Prompt Templates</span> for Better
            AI Results
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg">
            Discover and explore expert-crafted prompts for ChatGPT, Gemini, and
            Image models to create high-quality AI output.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <SignInDialog>
              <Button className="w-[240px] max-w-100" size="xl">
                <span>
                  Start <span className="font-bold text-amber-200">Free</span>
                </span>
              </Button>
            </SignInDialog>
          </div>

          <p className="text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>

        {/* Right - Hero Image */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-muted/50 overflow-hidden">
            <Image
              src="/images/hero-preview.jpg"
              alt="AI Prompt Preview"
              className="size-full object-cover"
            />
          </div>

          {/* Floating accent element */}
          <div className="absolute -bottom-4 -left-4 size-24 rounded-xl bg-primary/10 blur-2xl" />
          <div className="absolute -top-4 -right-4 size-32 rounded-xl bg-primary/10 blur-2xl" />
        </div>
      </div>
    </section>
  )
}
