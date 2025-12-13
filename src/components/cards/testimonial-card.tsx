import type { ComponentProps } from 'react'

import { cn } from '@/libs/cn'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type TestimonialCardProps = ComponentProps<'blockquote'> & {
  quote: string
  authorName: string
  authorRole?: string
  authorCompany?: string
  authorImage?: string
}

function TestimonialCard({
  quote,
  authorName,
  authorRole,
  authorCompany,
  authorImage,
  className,
  ...props
}: TestimonialCardProps) {
  const initials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <blockquote
      data-slot="testimonial-card"
      className={cn('flex flex-col', className)}
      {...props}
    >
      {/* Author */}
      <header className={cn('flex items-center gap-3 mb-4')}>
        <Avatar className="size-10">
          {authorImage && <AvatarImage src={authorImage} alt={authorName} />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div>
          <cite className="text-body1-semibold not-italic text-foreground block">
            {authorName}
          </cite>
          {(authorRole || authorCompany) && (
            <span className="text-body2 text-muted-foreground">
              {authorRole}
              {authorRole && authorCompany && ' at '}
              {authorCompany}
            </span>
          )}
        </div>
      </header>

      {/* Quote text */}
      <p className={cn('text-foreground')}>{quote}</p>
    </blockquote>
  )
}

// Grid layout helper for multiple testimonials
function TestimonialGrid({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="testimonial-grid"
      className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { TestimonialCard, TestimonialGrid }
