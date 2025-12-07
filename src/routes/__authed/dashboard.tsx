import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sparkles,
  Plus,
  Search,
  Copy,
  Heart,
  LayoutGrid,
  List,
  Check,
  Loader2,
  Pencil,
  Trash2,
  Share2,
  MoreVertical,
} from 'lucide-react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import {
  useCuratedPrompts,
  useMyPrompts,
  useCopyPrompt,
  useToggleFavorite,
  useDeletePrompt,
  type Prompt,
  type PromptCategory,
  type AiPlatform,
} from '@/actions/prompts'
import { useCollections } from '@/actions/collections'
import { useQueryClient } from '@tanstack/react-query'
import { promptKeys } from '@/actions/prompts'
import { Constants } from '@/types/database.types'
import { startCase } from 'lodash-es'
import { PromptDialog } from '@/components/prompt-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/__authed/dashboard')({
  component: RouteComponent,
})

const platformColors: Record<AiPlatform, string> = {
  chatgpt:
    'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  claude:
    'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  gemini:
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  grok: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  midjourney:
    'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  stable_diffusion:
    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  all: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
}

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<'curated' | 'my-prompts'>(
    'curated',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<PromptCategory | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | undefined>()

  const { data: curatedPrompts = [], isLoading: isLoadingCurated } =
    useCuratedPrompts()
  const { data: myPrompts = [], isLoading: isLoadingMyPrompts } = useMyPrompts()
  const { data: collections = [] } = useCollections()

  const handleCreatePrompt = () => {
    setDialogMode('create')
    setSelectedPrompt(undefined)
    setDialogOpen(true)
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setDialogMode('edit')
    setSelectedPrompt(prompt)
    setDialogOpen(true)
  }

  const prompts = activeTab === 'curated' ? curatedPrompts : myPrompts
  const isLoading =
    activeTab === 'curated' ? isLoadingCurated : isLoadingMyPrompts

  // Filter prompts
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      !searchQuery ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || prompt.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5 dark:to-purple-500/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
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
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/sign-out">Sign Out</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prompt Library
            </span>
          </h1>
          <p className="text-muted-foreground">
            Discover curated prompts or manage your personal collection
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'curated' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('curated')}
            >
              Curated Library
            </Button>
            <Button
              variant={activeTab === 'my-prompts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('my-prompts')}
            >
              My Prompts ({myPrompts.length})
            </Button>
          </div>

          {activeTab === 'my-prompts' && (
            <Button variant="gradient" onClick={handleCreatePrompt}>
              <Plus className="size-4" />
              New Prompt
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {Constants.public.Enums.prompt_category.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {startCase(category)}
            </Button>
          ))}
        </div>

        {/* Prompts Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">
              <div className="inline-flex rounded-full bg-muted p-4">
                <Sparkles className="size-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory
                ? 'Try adjusting your filters'
                : activeTab === 'my-prompts'
                  ? 'Create your first prompt to get started'
                  : 'No curated prompts available yet'}
            </p>
            {activeTab === 'my-prompts' && (
              <Button variant="gradient" onClick={handleCreatePrompt}>
                <Plus className="size-4" />
                Create Your First Prompt
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                viewMode={viewMode}
                onEdit={handleEditPrompt}
                isOwned={activeTab === 'my-prompts'}
              />
            ))}
          </div>
        )}

        {/* Prompt Dialog */}
        <PromptDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          prompt={selectedPrompt}
          mode={dialogMode}
        />
      </div>
    </div>
  )
}

function PromptCard({
  prompt,
  viewMode,
  onEdit,
  isOwned,
}: {
  prompt: Prompt
  viewMode: 'grid' | 'list'
  onEdit: (prompt: Prompt) => void
  isOwned: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const queryClient = useQueryClient()
  const copyPrompt = useCopyPrompt()
  const toggleFavorite = useToggleFavorite()
  const deletePrompt = useDeletePrompt()

  const handleCopy = async () => {
    try {
      await copyPrompt.mutateAsync(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Invalidate queries to update use count
      queryClient.invalidateQueries({ queryKey: promptKeys.all })
    } catch (error) {
      console.error('Failed to copy prompt:', error)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite.mutateAsync(prompt.id)
      queryClient.invalidateQueries({ queryKey: promptKeys.all })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prompt?')) return

    try {
      await deletePrompt.mutateAsync(prompt.id)
      queryClient.invalidateQueries({ queryKey: promptKeys.all })
    } catch (error) {
      console.error('Failed to delete prompt:', error)
    }
  }

  const handleShare = async () => {
    const shareText = `${prompt.title}\n\n${prompt.content}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt.title,
          text: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch (error) {
      console.error('Failed to share prompt:', error)
    }
  }

  return (
    <div
      className={`group relative rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all ${
        viewMode === 'grid' ? 'hover:-translate-y-1' : ''
      }`}
    >
      {/* Featured badge */}
      {prompt.is_featured && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
            Featured
          </Badge>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">
            {prompt.title}
          </h3>
          {prompt.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {prompt.description}
            </p>
          )}
        </div>
      </div>

      {/* Platform and Category badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className={platformColors[prompt.platform]}>
          {startCase(prompt.platform)}
        </Badge>
        <Badge variant="secondary">{startCase(prompt.category)}</Badge>
      </div>

      {/* Content preview */}
      <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground line-clamp-3 font-mono text-xs">
        {prompt.content}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{prompt.use_count} uses</span>
          <span>{prompt.favorite_count} favorites</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            disabled={toggleFavorite.isPending}
          >
            <Heart className={`size-4`} />
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleCopy}
            disabled={copyPrompt.isPending}
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy
              </>
            )}
          </Button>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="size-4" />
                {shared ? 'Copied to clipboard!' : 'Share'}
              </DropdownMenuItem>
              {isOwned && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(prompt)}>
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={deletePrompt.isPending}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    {deletePrompt.isPending ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
