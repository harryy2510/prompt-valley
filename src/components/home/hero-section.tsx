import { Button } from '@/components/ui/button'

import { cn } from '@/libs/cn'
import { Link } from '@tanstack/react-router'
import { AuthGate } from '@/components/common/gate'
import { useFeaturedPrompts } from '@/actions/prompts'
import shuffle from 'lodash-es/shuffle'
import compact from 'lodash-es/compact'
import { Image } from '@/components/common/image'
import { useMemo } from 'react'

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
        'relative h-200 overflow-hidden pointer-events-none',
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

function distributePromptImages<
  T extends {
    id: string
    images?: (string | null | undefined)[] | null | undefined
  },
>(
  prompts: T[] | null | undefined,
  imagesPerPrompt = 3,
): [string[], string[], string[]] {
  const chunks: [string[], string[], string[]] = [[], [], []]

  if (!prompts) return chunks

  for (const prompt of shuffle(prompts)) {
    const images = shuffle(compact(prompt.images)).slice(0, imagesPerPrompt)

    // Randomize starting chunk so distribution isn't predictable
    const startChunk = Math.floor(Math.random() * 3)

    images.forEach((image, index) => {
      // Each image from same prompt goes to a different chunk
      chunks[(startChunk + index) % 3].push(image)
    })
  }

  // Shuffle within each chunk for final randomization
  return [shuffle(chunks[0]), shuffle(chunks[1]), shuffle(chunks[2])]
}

// ============================================
// Hero Section Component
// ============================================

export function HeroSection() {
  const { data: prompts } = useFeaturedPrompts()
  const chunks = useMemo(() => distributePromptImages(prompts), [prompts])
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-secondary-100 to-transparent">
      <div className="container mx-auto px-4">
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
              {chunks.map((images, index) => {
                return (
                  <VerticalCarousel
                    key={index}
                    images={images}
                    direction={index % 2 === 0 ? 'up' : 'down'}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
