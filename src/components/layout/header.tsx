import { useState, useEffect } from 'react'
import {
  Link,
  useNavigate,
  useSearch,
  useLocation,
} from '@tanstack/react-router'
import {
  Bookmark,
  Settings,
  CreditCard,
  Flag,
  HelpCircle,
  LogOut,
  Heart,
} from 'lucide-react'
import { useDebounceCallback } from 'usehooks-ts'

import { useCategories, type Category } from '@/actions/categories'
import { useProfile } from '@/actions/profile'
import { useSignOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { LogoWithText } from './logo-with-text'
import { NavMegaMenu, type MegaMenuSection } from './mega-menu'
import { AuthGate, ProGate } from '@/components/common/gate'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SearchInput } from '@/components/common/search-input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { openFeedback, openAnnouncements } from '@/libs/userback'

// ============================================
// Header Component
// ============================================

export function Header() {
  const { data: categories } = useCategories()

  // Build navigation items from categories
  const navItems = buildNavItems(categories ?? [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <LogoWithText className="h-6 w-20" />
        </Link>

        {/* Search */}
        <HeaderSearch />

        {/* Navigation */}
        <NavMegaMenu items={navItems} className="hidden md:flex" />

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          <ProGate />

          <AuthGate />

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
// Header Search Component
// ============================================

function HeaderSearch() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get current search query from URL if on search page
  const searchParams = useSearch({ strict: false }) as
    | { q?: string }
    | undefined
  const currentQuery =
    location.pathname === '/search' ? (searchParams?.q ?? '') : ''

  const [value, setValue] = useState(currentQuery)

  // Sync input value when URL changes (e.g., navigating back)
  useEffect(() => {
    if (location.pathname === '/search') {
      setValue(searchParams?.q ?? '')
    } else {
      setValue('')
    }
  }, [location.pathname, searchParams?.q])

  // Debounced navigation to search page
  const debouncedNavigate = useDebounceCallback((query: string) => {
    if (query.trim()) {
      navigate({ to: '/search', search: { q: query.trim(), page: 1 } })
    } else if (location.pathname === '/search') {
      navigate({ to: '/' })
    }
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedNavigate(newValue)
  }

  const handleClear = () => {
    setValue('')
    if (location.pathname === '/search') {
      navigate({ to: '/' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      // Immediately navigate on Enter
      navigate({ to: '/search', search: { q: value.trim(), page: 1 } })
    }
  }

  return (
    <div className="flex-1 max-w-sm">
      <SearchInput
        placeholder="Search prompts..."
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        onKeyDown={handleKeyDown}
      />
    </div>
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

  const handleWhatsNew = () => {
    openAnnouncements()
  }

  // Get initials for fallback
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (profile?.email?.slice(0, 2).toUpperCase() ?? 'U')

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
          <DropdownMenuItem asChild>
            <a href="/settings">
              <Settings className="size-4" />
              Account Settings
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/billing">
              <CreditCard className="size-4" />
              Billing & Subscription
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleWhatsNew}>
            <Flag className="size-4" />
            What's New
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openFeedback}>
            <HelpCircle className="size-4" />
            Feedback
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={signOut.isPending}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
