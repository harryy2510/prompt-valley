import type { ComponentProps } from 'react'
import { QuoteIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type TestimonialCardProps = ComponentProps<'blockquote'> & {
  quote: string
  authorName: string
  authorRole?: string
  authorCompany?: string
  authorImage?: string
  variant?: 'default' | 'minimal' | 'featured'
}

function TestimonialCard({
  quote,
  authorName,
  authorRole,
  authorCompany,
  authorImage,
  variant = 'default',
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
      className={cn(
        'flex flex-col',
        variant === 'featured' && 'items-center text-center',
        className,
      )}
      {...props}
    >
      {/* Quote icon for featured variant */}
      {variant === 'featured' && (
        <QuoteIcon className="size-8 text-muted-foreground/30 mb-4" />
      )}

      {/* Quote text */}
      <p
        className={cn(
          'text-foreground',
          variant === 'featured' ? 'text-h5 italic' : 'text-body1',
          variant === 'minimal' && 'text-body2',
        )}
      >
        {variant !== 'featured' && '"'}
        {quote}
        {variant !== 'featured' && '"'}
      </p>

      {/* Author */}
      <footer
        className={cn(
          'flex items-center gap-3 mt-4',
          variant === 'featured' && 'flex-col gap-2 mt-6',
        )}
      >
        <Avatar className={variant === 'featured' ? 'size-12' : 'size-10'}>
          {authorImage && <AvatarImage src={authorImage} alt={authorName} />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div className={variant === 'featured' ? 'text-center' : ''}>
          <cite className="text-body2-semibold not-italic text-foreground block">
            {authorName}
          </cite>
          {(authorRole || authorCompany) && (
            <span className="text-caption text-muted-foreground">
              {authorRole}
              {authorRole && authorCompany && ' at '}
              {authorCompany}
            </span>
          )}
        </div>
      </footer>
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
      className={cn(
        'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { TestimonialCard, TestimonialGrid }
