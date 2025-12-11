import { ImageGrid } from '@/components/common/image-grid'

// ============================================
// Types
// ============================================

type Role = {
  id: string
  title: string
  description: string
  images: string[]
}

// ============================================
// Data
// ============================================

const roles: Role[] = [
  {
    id: 'marketers',
    title: 'Marketers',
    description:
      'Generate SEO content, ad copy, landing page text, and campaign ideas using optimized prompt templates.',
    images: [
      'prompts/edjsp7fxt89-1765187680324.png',
      'prompts/3jl52goo8uo-1765189830518.png',
      'prompts/swiss-style-abstract-vector-logo-1.webp',
    ],
  },
  {
    id: 'designers',
    title: 'Designers',
    description:
      'Create UI microcopy, creative briefs, and image concepts with prompts built for DALL·E, Midjourney, and more.',
    images: [
      'prompts/a491a13w5vh-1765214996149.png',
      'prompts/d3s1ws7560n-1765208408546.png',
      'prompts/hzpvn5hhg4-1765183159977.png',
    ],
  },
  {
    id: 'product-managers',
    title: 'Product Managers',
    description:
      'Speed up product research, user stories, specs, and roadmap workflows with high-quality ChatGPT prompts.',
    images: [
      'prompts/beauty-skincare-portrait-1.webp',
      'prompts/frosted-glass-icon-1.webp',
      'prompts/vinyl-toy-3d-object-2.webp',
    ],
  },
  {
    id: 'developers',
    title: 'Developers',
    description:
      'Use engineering-focused prompts for code generation, refactoring, API structures, and automation scripts.',
    images: [
      'prompts/3d-keycap-translucent-gummy-2.webp',
      'prompts/3d-keycap-solid-opaque-3.webp',
      'prompts/3d-emblem-on-podium-1.webp',
    ],
  },
  {
    id: 'entrepreneurs',
    title: 'Entrepreneurs',
    description:
      'Validate ideas faster, create business plans, and launch with clarity using optimized prompts for founders.',
    images: [
      'prompts/claymorphism-3d-sports-icon-2.webp',
      'prompts/qzzuf0w9yx9-1765208408546.png',
      'prompts/hand-holding-glowing-logo-3.webp',
    ],
  },
]

// ============================================
// Role Card Component
// ============================================

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="group flex flex-col rounded-2xl bg-muted p-5 pb-0 overflow-hidden">
      <h3 className="text-lg font-bold text-foreground">{role.title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{role.description}</p>
      <div className="mt-4 max-w-100 overflow-hidden rounded-lg rounded-b-none shadow-xs">
        <ImageGrid images={role.images} title={role.title} ratio={16 / 9} />
      </div>
    </div>
  )
}

// ============================================
// Roles Section Component
// ============================================

export function RolesSection() {
  return (
    <section className="py-16">
      <div className="container">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary-300 px-4 py-2 text-sm font-medium tracking-wide text-foreground">
            FOR EVERY ROLE
          </span>
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

        {/* Top Row - 3 cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.slice(0, 3).map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>

        {/* Bottom Row - 2 cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {roles.slice(3, 5).map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  )
}
