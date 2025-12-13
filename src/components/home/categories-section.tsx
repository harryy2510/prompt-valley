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

import {
  CategoryWithPrompts,
  useCategoriesWithPrompts,
} from '@/actions/categories'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { compact } from 'lodash-es'
import { ImageGrid } from '@/components/common/image-grid'

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

function CategoryCard({ category }: { category: CategoryWithPrompts }) {
  const Icon = getCategoryIcon(category.name)
  const images = compact(
    category.prompts?.map((prompt) => prompt.images?.[0]),
  ).slice(0, 3)

  return (
    <Link
      // @ts-ignore
      to={`/categories/${category.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-muted transition-shadow hover:shadow-xs"
    >
      {/* Header with Icon and Name */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary">
          <Icon className="size-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground">{category.name}</span>
      </div>

      {/* Images */}
      <ImageGrid images={images} />
    </Link>
  )
}

// ============================================
// Categories Section Component
// ============================================

export function CategoriesSection() {
  const { data: categories } = useCategoriesWithPrompts()

  // Flatten child categories for display
  const displayCategories =
    categories?.flatMap((cat) => cat.children ?? []) ?? []

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
                  <CategoryCard category={category} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
