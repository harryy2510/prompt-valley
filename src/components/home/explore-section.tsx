import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { useCategories } from '@/actions/categories'
import { useModels } from '@/actions/models'
import { usePrompts } from '@/actions/prompts'
import { PromptCard, PromptCardSkeleton } from '@/components/cards/prompt-card'
import { UpsellCard } from '@/components/cards/upsell-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfile } from '@/actions/profile'
import { AuthGate, ProGate } from '@/components/common/gate'

// ============================================
// Explore Section Component
// ============================================

export function ExploreSection() {
  const [selectedModel, setSelectedModel] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('latest')
  const { data: profile } = useProfile()

  const { data: prompts = [], isLoading } = usePrompts({
    limit: profile?.tier === 'pro' ? 12 : 11,
    categoryId: activeTab !== 'latest' ? activeTab : undefined,
    modelId: selectedModel !== 'all' ? selectedModel : undefined,
  })
  const { data: categories } = useCategories()
  const { data: models } = useModels()

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

      {/* Filter Controls: Model Dropdown + Separator + Category Tabs */}
      <div className="mb-8 flex items-center gap-4">
        {/* Model Dropdown */}
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="min-w-20">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {models?.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Vertical Separator */}
        <Separator orientation="vertical" className="h-6" />

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="latest">Latest</TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

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
            {prompts.slice(0, 3).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}

            {/* Upsell Card */}
            <ProGate fallback={<UpsellCard />} />

            {/* Remaining prompts */}
            {prompts.slice(3).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </>
        )}
      </div>

      {/* Load More */}
      <AuthGate
        fallback={
          <div className="mt-12 text-center">
            <Button variant="brand-primary" size="lg" asChild>
              <Link to="/auth">Sign up to Continue</Link>
            </Button>
          </div>
        }
      />
    </section>
  )
}
