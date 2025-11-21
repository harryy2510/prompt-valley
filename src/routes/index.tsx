import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  Library,
  FolderSync,
  Search,
  ChevronRight,
  Check,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useIsAuthenticated } from '@/actions/auth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const { isAuthenticated } = useIsAuthenticated()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5 dark:to-purple-500/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PromptValley
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/sign-out">Sign Out</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link to="/sign-in">Get Started</Link>
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-32 pb-32 lg:px-8">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 size-[800px] rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -left-1/4 size-[600px] rounded-full bg-gradient-to-tr from-purple-500/20 via-amber-500/20 to-transparent blur-3xl animate-pulse-slow animation-delay-1000" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center animate-fade-in-up">
            <Badge
              variant="outline"
              className="gap-2 border-blue-500/50 bg-blue-500/10 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span className="text-sm font-semibold">
                Coming Soon - Join the Waitlist
              </span>
              <ChevronRight className="size-3.5" />
            </Badge>
          </div>

          {/* Hero Title */}
          <div className="text-center animate-fade-in-up animation-delay-200">
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Stop losing your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                best prompts
              </span>{' '}
              across tools
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              One library that works across ChatGPT, Claude, Gemini, and more.
              Organize, discover, and access your prompts instantly.
            </p>
          </div>

          {/* Email Capture */}
          <div className="mt-10 flex flex-col items-center gap-4 animate-fade-in-up animation-delay-400">
            <div className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              />
              <Button variant="gradient" size="lg">
                Join Waitlist
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              50-100 email signups goal • No spam, ever
            </p>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex justify-center gap-8 text-sm text-muted-foreground animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Cross-platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Always synced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative px-6 py-24 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
            >
              The Problem
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Your prompts are{' '}
              <span className="text-destructive">scattered</span> everywhere
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Google Docs, Notes, screenshots, random folders. You waste 10-15
              minutes daily hunting for that perfect prompt you created last
              week.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Inconsistent Results',
                description:
                  'You try 100+ different prompts before getting it right. Success rate: 72%.',
                color: 'text-red-500',
              },
              {
                icon: FolderSync,
                title: 'Prompt Chaos',
                description:
                  'Valuable prompts scattered across Google Docs, Apple Notes, and desktop screenshots.',
                color: 'text-amber-500',
              },
              {
                icon: Search,
                title: 'Time Wasted',
                description:
                  '67% more time spent searching for prompts than actually using AI tools.',
                color: 'text-orange-500',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`inline-flex rounded-lg bg-muted p-3 ${item.color}`}
                >
                  <item.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            >
              The Solution
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Everything you need,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                all in one place
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                icon: Library,
                title: 'Curated Prompt Library',
                description:
                  'Discover expert-crafted prompts with 2-3 variations for ChatGPT, Claude, Gemini, Grok, and more.',
                features: [
                  'Platform-specific optimization',
                  'Content-type categories',
                  'Parameters & model versions',
                ],
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: FolderSync,
                title: 'Personal Prompt Manager',
                description:
                  'Organize your 50+ prompts with smart categories, instant search, and cross-device sync.',
                features: [
                  'Quick access anywhere',
                  'Version control',
                  'Multi-device sync',
                ],
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border bg-card p-8 shadow-sm hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-lg`}
                >
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">
                  {feature.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="size-4 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-500/10 p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ready to get organized?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our waitlist and be the first to know when we launch. Goal:
              50-100 signups before launch.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button variant="gradient" size="lg">
                  Get Early Access
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                $10-15/month pricing • Launch: January 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 PromptValley. Built for content creators, marketers, and
            AI enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  )
}
