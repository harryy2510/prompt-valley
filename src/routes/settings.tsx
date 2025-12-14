import { createFileRoute, redirect } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { userQueryOptions } from '@/actions/auth'
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/actions/profile'
import { getImageUrl } from '@/libs/storage'

// ============================================
// Route Config
// ============================================

export const Route = createFileRoute('/settings')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  component: SettingsPage,
})

// ============================================
// Component
// ============================================

function SettingsPage() {
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      avatar_url: null,
    },
    values: profile
      ? {
          name: profile.name ?? '',
          avatar_url: profile.avatar_url,
        }
      : undefined,
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    try {
      const filename = await uploadAvatar.mutateAsync(file)
      form.setValue('avatar_url', filename, { shouldDirty: true })
      toast.success('Avatar uploaded')
    } catch {
      toast.error('Failed to upload avatar')
      setAvatarPreview(null)
    }
  }

  const handleSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile.mutateAsync(data)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  // Get initials for avatar fallback
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (profile?.email?.slice(0, 2).toUpperCase() ?? 'U')

  // Determine avatar URL to display
  const displayAvatarUrl =
    avatarPreview ?? getImageUrl(form.watch('avatar_url')) ?? undefined

  if (isProfileLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile information
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="size-24 cursor-pointer" onClick={handleAvatarClick}>
                        <AvatarImage src={displayAvatarUrl} alt={profile?.name ?? ''} />
                        <AvatarFallback className="text-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={uploadAvatar.isPending}
                        className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                      >
                        {uploadAvatar.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Camera className="size-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Click to upload a new avatar
                      </p>
                      {(displayAvatarUrl || form.watch('avatar_url')) && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarPreview(null)
                            form.setValue('avatar_url', null, { shouldDirty: true })
                          }}
                          className="text-sm text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            disabled={updateProfile.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email (disabled) */}
                  <div className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <Input
                      value={profile?.email ?? ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateProfile.isPending || !form.formState.isDirty}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
