import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

import { useCategories } from '@/actions/categories'
import { IconButton } from '@/components/common/icon-button'

// ============================================
// Category Card Component
// ============================================

function CategoryCard({
  name,
  image,
  href,
  color,
}: {
  name: string
  image?: string
  href: string
  color?: string
}) {
  return (
    <Link
      to={href}
      className="group relative flex shrink-0 flex-col overflow-hidden rounded-xl"
    >
      {/* Image */}
      <div className="aspect-[3/4] w-48 overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="size-full"
            style={{ backgroundColor: color ?? '#e5e5e5' }}
          />
        )}
      </div>

      {/* Label Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
        <span className="text-sm font-medium text-white">{name}</span>
      </div>
    </Link>
  )
}

// ============================================
// Categories Section Component
// ============================================

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: categories } = useCategories()

  // Flatten child categories for display
  const displayCategories =
    categories?.flatMap((cat) => cat.children ?? []).slice(0, 10) ?? []

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 400
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-16">
      <div className="container">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Prompts for everything
          </h2>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <IconButton
              variant="outline"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </IconButton>
            <IconButton
              variant="outline"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4" />
            </IconButton>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide"
        >
          {displayCategories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              href={`/?category=${category.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
