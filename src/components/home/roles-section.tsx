import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/common/image'

// ============================================
// Types
// ============================================

type Role = {
  id: string
  title: string
  description: string
  image: string
}

// ============================================
// Data
// ============================================

const roles: Role[] = [
  {
    id: 'marketers',
    title: 'Marketers',
    description:
      'Generate SEO content, ad copy, landing page text, and campaign ideas using optimized creative templates.',
    image: '/images/roles/marketers.jpg',
  },
  {
    id: 'designers',
    title: 'Designers',
    description:
      'Create Midjourney, creative briefs, and image concepts with prompts built for DALL-E, SDv3, Flux, and more.',
    image: '/images/roles/designers.jpg',
  },
  {
    id: 'product-managers',
    title: 'Product Managers',
    description:
      'Speed up product research, user stories, specs, and roadmap workflows with high-quality ChatGPT prompts.',
    image: '/images/roles/product-managers.jpg',
  },
  {
    id: 'developers',
    title: 'Developers',
    description:
      'Use engineering-focused prompts for code generation, refactoring, API structures, and documentation in days.',
    image: '/images/roles/developers.jpg',
  },
  {
    id: 'entrepreneurs',
    title: 'Entrepreneurs',
    description:
      'Validate ideas faster, create business plans, and launch with clarity using task-based prompts for founders.',
    image: '/images/roles/entrepreneurs.jpg',
  },
]

// ============================================
// Role Card Component
// ============================================

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <Image
          src={role.image}
          alt={role.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{role.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
          {role.description}
        </p>
      </div>
    </div>
  )
}

// ============================================
// Roles Section Component
// ============================================

export function RolesSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            FOR EVERY ROLE
          </Badge>
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            PromptValley helps you generate clearer,
            <br />
            smarter, more reliable AI output
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From lean teams to product research, discover curated prompts,
            organized templates, and workflows that improve results across
            ChatGPT, Gemini, and image models.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  )
}
