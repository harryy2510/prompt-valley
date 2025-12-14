import { Button } from '@/components/ui/button'

import image1 from '@/assets/landing/carousel-image-1.webp'
import icon1 from '@/assets/landing/carousel-icon-1.webp'
import icon2 from '@/assets/landing/carousel-icon-2.webp'
import icon3 from '@/assets/landing/carousel-icon-3.webp'
import { cn } from '@/libs/cn'
import { Link } from '@tanstack/react-router'
import { AuthGate } from '@/components/common/gate'
import { Image } from '@/components/common/image'

// ============================================
// Carousel Card Component
// ============================================

function CarouselCardItem({ src }: { src: string }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-muted">
      <Image alt="" src={src} className="size-full object-cover" />
    </div>
  )
}

// ============================================
// Vertical Carousel Column
// ============================================

function VerticalCarousel({
  direction = 'up',
  className,
  images,
}: {
  direction?: 'up' | 'down'
  className?: string
  images: string[]
}) {
  const items = [...images, ...images, ...images, ...images]
  return (
    <div
      className={cn(
        'relative h-[800px] overflow-hidden pointer-events-none',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-4',
          direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down',
        )}
      >
        {items.map((src, index) => (
          <div key={`${src}-${index}`} className="w-full shrink-0 px-1">
            <CarouselCardItem src={src} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Hero Section Component
// ============================================

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-secondary-100 to-transparent">
      <div className="container mx-auto px-2">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 py-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              High-Quality{' '}
              <span className="text-primary">AI Prompt Templates</span> for
              Better AI Results
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Discover and explore expert-crafted prompts for ChatGPT, Gemini,
              and Image models to create high-quality AI output.
            </p>

            <AuthGate
              fallback={
                <>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button asChild className="w-60 max-w-100" size="xl">
                      <Link to="/auth">
                        <span>
                          Start{' '}
                          <span className="font-bold text-amber-200">Free</span>
                        </span>
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Free forever. No credit card required.
                  </p>
                </>
              }
            />
          </div>

          {/* Right - 3 Vertical Scrolling Carousels */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-3 gap-4">
              <VerticalCarousel images={[image1, icon1]} direction="up" />
              <VerticalCarousel images={[image1, icon2]} direction="down" />
              <VerticalCarousel images={[image1, icon3]} direction="up" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
