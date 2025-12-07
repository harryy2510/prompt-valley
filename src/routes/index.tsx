import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Copy, Bookmark } from 'lucide-react'
import { LinkButton } from '@/components/ui/link-button'
import { IconButton } from '@/components/ui/icon-button'
import { CategoryFilterGroup } from '@/components/category-filter'
import { ProBadge } from '@/components/pro-badge'
import { SearchInput } from '@/components/search-input'
import { Logo } from '@/components/logo'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-[64px] items-center gap-3">
            {/* Logo */}
            <Logo />

            {/* Search */}
            <SearchInput containerClassName="w-[280px] ml-2" />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              <LinkButton to="/pricing" variant="nav-link" size="nav">
                Get PRO
              </LinkButton>
              <LinkButton to="/sign-in" variant="nav-link-muted" size="nav">
                Log in
              </LinkButton>
              <LinkButton to="/sign-up" variant="brand-primary" size="cta">
                Start <span className="text-[#e5d5a8]">Free</span>
              </LinkButton>
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Banner */}
      <div className="border-b border-border bg-orange-200 dark:bg-amber-950/20 px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-4">
          <p className="text-sm font-medium">
            New: Nano Banana Pro prompts are now available - explore the new
            collection.
          </p>
          <LinkButton to="/sign-up" variant="brand-primary" size="cta">
            Try it out
          </LinkButton>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-orange-50 px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
            High-Quality{' '}
            <span className="text-accent">AI Prompt Templates</span> for Better
            AI Results
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground max-w-3xl mx-auto">
            Discover and organize expert-crafted prompts for ChatGPT, Gemini,
            and image models to consistently get better AI output.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton
              to="/sign-up"
              variant="brand-primary"
              size="cta-lg"
              className="min-w-[160px]"
            >
              Start <span className="text-[#e5d5a8]">Free</span>
            </LinkButton>
            <LinkButton
              to="/sign-up"
              variant="brand-secondary"
              size="cta-lg"
              className="min-w-[160px]"
            >
              Get <span className="text-accent">PRO</span>
            </LinkButton>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* Prompts Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Explore the Best AI Prompts
            </h2>
            <p className="text-muted-foreground">
              Browse 50,000+ curated prompt templates for writing, creativity,
              and image generation. All fully customizable for you to make them
              truly yours.
            </p>
          </div>

          {/* Category Filters */}
          <CategoryFilterGroup
            categories={[
              { name: 'All', active: true },
              { name: 'Latest', active: false },
              { name: 'Writing', active: false },
              { name: 'Image Generation', active: false },
            ]}
            className="mb-8"
          />

          {/* PRO Upsell Card */}
          <div className="mb-8 rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ProBadge />
              </div>
              <h3 className="font-semibold text-lg mb-1">
                Unlock everything PromptValley has to offer.
              </h3>
              <p className="text-sm text-muted-foreground">Cancel anytime.</p>
            </div>
            <LinkButton
              to="/pricing"
              variant="default"
              className="rounded-full bg-accent hover:bg-accent/90"
            >
              Upgrade
            </LinkButton>
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Elegant Fashion Portraits',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: false,
              },
              {
                title: 'Futuristic Flight Designs',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: false,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: false,
              },
              {
                title: 'Fantasy Wildlife',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Futuristic Flight Designs',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Elegant Fashion Portraits',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
              {
                title: 'Loving Lifestyle Scenes',
                description:
                  'Dramatic, ultra-realistic close-up in black and white with high-contrast li...',
                image:
                  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&h=300&fit=crop&q=80',
                category: 'Gemini',
                tag: 'Image generation',
                pro: true,
              },
            ].map((prompt, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Copy & Bookmark Buttons */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    variant="outline"
                    className="bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
                  >
                    <Copy className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="outline"
                    className="bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
                  >
                    <Bookmark className="h-4 w-4" />
                  </IconButton>
                </div>

                {/* PRO Badge */}
                {prompt.pro && (
                  <div className="absolute top-3 left-3 z-10">
                    <ProBadge />
                  </div>
                )}

                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={prompt.image}
                    alt={prompt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-1">
                    {prompt.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {prompt.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-xs font-medium border border-border">
                      {prompt.category}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium border border-border">
                      {prompt.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-muted/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-8">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground mb-8">
            Is my content private and secure? Does Freeple use my log-in or
            outputs to train its models?
          </p>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-3xl font-bold mb-8">
            Sign up and elevate your vision
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center gap-3"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Continue with Email
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-950 text-slate-300 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                <div className="h-6 w-6 rounded bg-white" />
                <span className="text-lg font-bold text-white">
                  prompt valley
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Get better output from AI with PromptValley.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="hover:text-white transition-colors"
                  >
                    X (Twitter)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © PromptValley 2018-2025. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
