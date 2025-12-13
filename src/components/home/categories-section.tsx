import { Link } from '@tanstack/react-router'
import {
  Brush,
  Sparkles,
  FileText,
  Share2,
  Megaphone,
  Code,
  Mail,
  PenTool,
  MessageSquare,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react'

import { useCategories } from '@/actions/categories'
import { Image } from '@/components/common/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

// ============================================
// Icon Mapping
// ============================================

const categoryIcons: Record<string, LucideIcon> = {
  illustrations: Brush,
  logo: Sparkles,
  'landing page copy': FileText,
  'social media': Share2,
  'ad copy': Megaphone,
  code: Code,
  email: Mail,
  design: PenTool,
  chat: MessageSquare,
  ideas: Lightbulb,
}

function getCategoryIcon(name: string): LucideIcon {
  const lowerName = name.toLowerCase()
  return categoryIcons[lowerName] ?? Sparkles
}

// ============================================
// Category Card Component
// ============================================

function CategoryCard({
  name,
  image,
  href,
}: {
  name: string
  image?: string
  href: string
}) {
  const Icon = getCategoryIcon(name)

  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-xl bg-muted transition-shadow hover:shadow-xs"
    >
      {/* Header with Icon and Name */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary">
          <Icon className="size-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground">{name}</span>
      </div>

      {/* Image */}
      <div className="aspect-4/3 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}
      </div>
    </Link>
  )
}

// ============================================
// Categories Section Component
// ============================================

export function CategoriesSection() {
  const { data: categories } = useCategories()

  // Flatten child categories for display
  const displayCategories =
    categories?.flatMap((cat) => cat.children ?? []) ?? []

  console.log(displayCategories)

  return (
    <section className="py-16">
      <div className="container">
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
        >
          {/* Section Header */}
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Prompts for everything
            </h2>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>

          <CarouselContent>
            {displayCategories.map((category) => (
              <CarouselItem key={category.id} className="basis-auto">
                <div className="w-56">
                  <CategoryCard
                    name={category.name}
                    href={`/?category=${category.id}`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
