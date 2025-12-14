import { Link, useNavigate } from '@tanstack/react-router'
import { Search, Heart, Bookmark, LogOut, User } from 'lucide-react'

import { useCategories, type Category } from '@/actions/categories'
import { useProfile } from '@/actions/profile'
import { useSignOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogoWithText } from './logo-with-text'
import { NavMegaMenu, type MegaMenuSection } from './mega-menu'
import { AuthGate, ProGate } from '@/components/common/gate'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ============================================
// Header Component
// ============================================

export function Header() {
  const { data: categories } = useCategories()

  // Build navigation items from categories
  const navItems = buildNavItems(categories ?? [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-2 flex h-14 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <LogoWithText className="h-6 w-20" />
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background"
          />
        </div>

        {/* Navigation */}
        <NavMegaMenu items={navItems} className="hidden md:flex" />

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          <ProGate />

          <AuthGate
            fallback={
              <Button size="sm" asChild>
                <Link to="/auth">
                  <span>
                    Start <span className="font-bold text-amber-200">Free</span>
                  </span>
                </Link>
              </Button>
            }
          >
            <UserMenu />
          </AuthGate>
        </div>
      </div>
    </header>
  )
}

// ============================================
// Helpers
// ============================================

function buildNavItems(categories: Category[]) {
  // Group categories by parent for mega menu
  const items: Array<{
    trigger: string
    sections: MegaMenuSection[]
  }> = []

  // For now, create a dropdown for each root category with its children
  categories.forEach((category) => {
    if (category.children && category.children.length > 0) {
      items.push({
        trigger: category.name,
        sections: [
          {
            categories: category.children.map((child) => ({
              title: child.name,
              href: `/categories/${child.id}`,
            })),
          },
        ],
      })
    }
  })

  return items
}

// ============================================
// User Menu Component
// ============================================

function UserMenu() {
  const { data: profile } = useProfile()
  const signOut = useSignOut()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/' })
      },
    })
  }

  // Get initials for fallback
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.name ?? ''} />
            )}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            {profile?.name && (
              <p className="text-sm font-medium">{profile.name}</p>
            )}
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/saved">
              <Bookmark className="size-4" />
              Saved Prompts
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/liked">
              <Heart className="size-4" />
              Liked Prompts
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard">
            <User className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={signOut.isPending}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
