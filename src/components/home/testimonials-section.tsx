import { TestimonialCard } from '@/components/cards/testimonial-card'

// ============================================
// Types
// ============================================

type Testimonial = {
  id: string
  quote: string
  authorName: string
  authorRole: string
  authorImage?: string
}

// ============================================
// Data (placeholder - can be fetched from API)
// ============================================

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Mobbin is a game changer for designers looking to stay up-to-date on the latest trends and patterns. It is an incredible encyclopedia of mobile interfaces. Has deep, user flows, and even a Figma plugin! It is indispensable in the modern designers toolbox.',
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-1.jpg',
  },
  {
    id: '2',
    quote:
      'Mobbin is one of my favorite resources for product design and UX apps. I love discovering new examples to see different apps and companies handle specific UX patterns and flows.',
    authorName: 'Daryl Ginn',
    authorRole: 'Product Designer',
    authorImage: '/images/testimonials/avatar-2.jpg',
  },
  {
    id: '3',
    quote:
      'Mobbin is a great resource and I always come in handy to see what the best practices or standards are for mobile patterns in our current landscape.',
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-3.jpg',
  },
  {
    id: '4',
    quote:
      "Mobbin has quickly become our team's inspiration resource for designing mobile apps or mobile-first in the inspiration gallery.",
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-4.jpg',
  },
  {
    id: '5',
    quote:
      "Mobbin is a crucial part of design process, without Mobbin, I'm not sure what I'd do. I use it for pretty much every app-specific UX pattern and flow.",
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-5.jpg',
  },
  {
    id: '6',
    quote:
      "By using the Mobbin app. I search for patterns, generations that I'm on in today accustoms. I love how easy it is to search for different patterns and copy and paste flows to Figma. It is a wonderful design that you cannot live without.",
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-6.jpg',
  },
  {
    id: '7',
    quote:
      'Mobbin is a great resource and I always come in handy to see what the best practices or standards are for mobile patterns in our current landscape.',
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-7.jpg',
  },
  {
    id: '8',
    quote:
      'Mobbin is a great resource and I always come in handy to see what the best practices or standards are for mobile patterns in our current landscape.',
    authorName: 'Daryl Ginn',
    authorRole: 'Product Manager',
    authorImage: '/images/testimonials/avatar-8.jpg',
  },
]

// ============================================
// Testimonials Section Component
// ============================================

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            What our users are saying.
          </h2>
        </div>

        {/* Testimonials Grid - 4 columns masonry-like */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="mb-6 break-inside-avoid">
              <TestimonialCard
                quote={testimonial.quote}
                authorName={testimonial.authorName}
                authorRole={testimonial.authorRole}
                authorImage={testimonial.authorImage}
                className="rounded-xl border bg-card p-6"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
