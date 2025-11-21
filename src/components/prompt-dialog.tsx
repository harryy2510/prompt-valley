import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import {
  useCreatePrompt,
  useUpdatePrompt,
  type Prompt,
  type CreatePromptInput,
} from '@/actions/prompts'
import { useCollections } from '@/actions/collections'
import { Constants } from '@/types/database.types'
import { startCase } from 'lodash-es'
import { useQueryClient } from '@tanstack/react-query'
import { promptKeys } from '@/actions/prompts'

interface PromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt?: Prompt
  mode: 'create' | 'edit'
}

export function PromptDialog({
  open,
  onOpenChange,
  prompt,
  mode,
}: PromptDialogProps) {
  const queryClient = useQueryClient()
  const { data: collections = [] } = useCollections()
  const createPrompt = useCreatePrompt()
  const updatePrompt = useUpdatePrompt()

  const [formData, setFormData] = useState<CreatePromptInput>({
    title: '',
    description: '',
    content: '',
    category: 'other',
    platform: 'all',
    tags: [],
    collection_id: undefined,
    is_public: false,
  })

  // Reset form when prompt changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && prompt) {
        setFormData({
          title: prompt.title,
          description: prompt.description || '',
          content: prompt.content,
          category: prompt.category,
          platform: prompt.platform,
          tags: prompt.tags || [],
          collection_id: prompt.collection_id || undefined,
          is_public: prompt.is_public,
        })
      } else {
        setFormData({
          title: '',
          description: '',
          content: '',
          category: 'other',
          platform: 'all',
          tags: [],
          collection_id: undefined,
          is_public: false,
        })
      }
    }
  }, [open, mode, prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (mode === 'edit' && prompt) {
        await updatePrompt.mutateAsync({
          id: prompt.id,
          ...formData,
        })
      } else {
        await createPrompt.mutateAsync(formData)
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: promptKeys.all })

      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save prompt:', error)
    }
  }

  const isLoading = createPrompt.isPending || updatePrompt.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Prompt' : 'Create New Prompt'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update your prompt details below.'
              : 'Fill in the details to create a new prompt.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Blog Post Writer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this prompt does"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Prompt Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Enter your prompt here..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              minLength={10}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use [PLACEHOLDERS] for variable parts of your prompt
            </p>
          </div>

          {/* Category and Platform */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as CreatePromptInput['category'],
                  })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Constants.public.Enums.prompt_category.map((category) => (
                    <SelectItem key={category} value={category}>
                      {startCase(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">AI Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    platform: value as CreatePromptInput['platform'],
                  })
                }
              >
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Constants.public.Enums.ai_platform.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {startCase(platform)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection">Collection (Optional)</Label>
            <Select
              value={formData.collection_id || 'none'}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  collection_id: value === 'none' ? undefined : value,
                })
              }
            >
              <SelectTrigger id="collection">
                <SelectValue placeholder="No collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No collection</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., marketing, social media, instagram"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
              className="size-4 rounded border-input"
            />
            <Label htmlFor="is_public" className="cursor-pointer">
              Make this prompt public
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : mode === 'edit' ? (
                'Update Prompt'
              ) : (
                'Create Prompt'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
