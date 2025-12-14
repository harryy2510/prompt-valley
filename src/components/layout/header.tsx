import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import { useCategories, type Category } from '@/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogoWithText } from './logo-with-text'
import { NavMegaMenu, type MegaMenuSection } from './mega-menu'
import { AuthGate, ProGate } from '@/components/common/gate'

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

          <AuthGate>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </AuthGate>

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
          />
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
