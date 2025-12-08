import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { useFeaturedPrompts } from '@/actions/prompts'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { UpsellCard } from '@/components/cards/upsell-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ============================================
// Types
// ============================================

type FilterTab = 'all' | 'latest' | 'writing' | 'image'

// ============================================
// Explore Section Component
// ============================================

export function ExploreSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const { data: prompts, isLoading } = useFeaturedPrompts(100)

  // Filter prompts based on tab (for demo - in real app this would be server-side)
  const filteredPrompts = prompts ?? []

  return (
    <section id="explore" className="container py-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Explore the Best AI Prompts
        </h2>
        <p className="mt-2 text-muted-foreground">
          Browse 50,400+ curated prompt templates for writing, creativity, and
          image generation. All fully customizable for you to make them truly
          yours.
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">Model</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="image">Image Generation</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Prompts Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <PromptCardSkeleton key={i} />
          ))
        ) : (
          <>
            {/* First row of prompts */}
            {filteredPrompts.slice(0, 3).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}

            {/* Upsell Card */}
            <UpsellCard
              label="PRO"
              title="Unlock everything PromptValley has to offer."
              ctaText="Get PRO"
              className="h-full"
            />

            {/* Remaining prompts */}
            {filteredPrompts.slice(3).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </>
        )}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" asChild>
          <Link to="/">Sign up to Continue</Link>
        </Button>
      </div>
    </section>
  )
}
