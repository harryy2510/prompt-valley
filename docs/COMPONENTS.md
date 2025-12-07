# Reusable Components Guide

This document outlines all the reusable components created for consistent UI across the application.

## Button Component (Updated)

**Location**: `src/components/ui/button.tsx`

### New Variants Added

#### Brand Variants
- `brand-primary` - Black background with white text (your primary CTA style)
- `brand-secondary` - White background with border and black text
- `nav-link` - Navigation link style (semibold, hover effect)
- `nav-link-muted` - Muted navigation link style

#### New Sizes
- `nav` - Navigation button size (px-3 py-1.5)
- `cta` - Call-to-action size (px-5 py-2)
- `cta-lg` - Large CTA size (px-6 py-3)

### Usage Examples

```tsx
// Primary brand button
<Button variant="brand-primary" size="cta">
  Start Free
</Button>

// Secondary brand button
<Button variant="brand-secondary" size="cta-lg">
  Get PRO
</Button>

// Navigation link button
<Button variant="nav-link" size="nav">
  Get PRO
</Button>
```

---

## LinkButton Component

**Location**: `src/components/ui/link-button.tsx`

A button styled as a link using TanStack Router's Link component. Combines Button styling with navigation.

### Props
- All Button props (variant, size, className)
- All TanStack Router Link props (to, params, search, etc.)

### Usage

```tsx
import { LinkButton } from '@/components/ui/link-button'

// Navigation button
<LinkButton to="/pricing" variant="nav-link" size="nav">
  Get PRO
</LinkButton>

// CTA button with link
<LinkButton to="/sign-up" variant="brand-primary" size="cta">
  Start Free
</LinkButton>

// Secondary CTA
<LinkButton to="/pricing" variant="brand-secondary" size="cta-lg">
  Upgrade
</LinkButton>
```

---

## IconButton Component

**Location**: `src/components/ui/icon-button.tsx`

Specialized button for icon-only use cases (like copy, bookmark, etc.)

### Props
- `variant`: 'default' | 'ghost' | 'outline' (default: 'ghost')
- `size`: 'icon' | 'icon-sm' | 'icon-lg' (default: 'icon')
- All other button props

### Usage

```tsx
import { IconButton } from '@/components/ui/icon-button'
import { Copy, Bookmark } from 'lucide-react'

// Ghost icon button
<IconButton>
  <Copy className="h-4 w-4" />
</IconButton>

// Outlined icon button with custom styling
<IconButton
  variant="outline"
  className="bg-background/90 backdrop-blur-sm"
>
  <Bookmark className="h-4 w-4" />
</IconButton>
```

---

## Logo Component

**Location**: `src/components/logo.tsx`

Reusable logo component with icon and stacked text.

### Props
- `to`: Link destination (default: '/')
- `showText`: Show/hide text (default: true)
- `iconSize`: 'sm' | 'md' | 'lg' (default: 'md')
- All TanStack Router Link props

### Usage

```tsx
import { Logo } from '@/components/logo'

// Default logo (icon + text)
<Logo />

// Icon only
<Logo showText={false} />

// Large logo
<Logo iconSize="lg" />

// Custom destination
<Logo to="/dashboard" />
```

---

## SearchInput Component

**Location**: `src/components/search-input.tsx`

Reusable search input with icon.

### Props
- `placeholder`: Placeholder text (default: 'Search')
- `containerClassName`: Additional classes for container div
- All native input props

### Usage

```tsx
import { SearchInput } from '@/components/search-input'

// Basic search
<SearchInput />

// With custom width
<SearchInput containerClassName="w-[280px]" />

// With custom placeholder
<SearchInput placeholder="Search prompts..." />
```

---

## ProBadge Component

**Location**: `src/components/pro-badge.tsx`

Reusable PRO badge for premium features.

### Props
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- All native span props

### Usage

```tsx
import { ProBadge } from '@/components/pro-badge'

// Default size
<ProBadge />

// Small badge
<ProBadge size="sm" />

// Large badge
<ProBadge size="lg" />
```

---

## CategoryFilter Components

**Location**: `src/components/category-filter.tsx`

Reusable category filter buttons and group.

### CategoryFilter Props
- `active`: Boolean for active state
- `children`: Button content
- All native button props

### CategoryFilterGroup Props
- `categories`: Array of `{ name: string, active?: boolean }`
- `onCategoryClick`: Optional click handler
- `className`: Additional classes

### Usage

```tsx
import { CategoryFilter, CategoryFilterGroup } from '@/components/category-filter'

// Single filter button
<CategoryFilter active={true}>
  All
</CategoryFilter>

// Group of filters
<CategoryFilterGroup
  categories={[
    { name: 'All', active: true },
    { name: 'Latest', active: false },
    { name: 'Writing', active: false },
  ]}
  onCategoryClick={(name) => console.log('Clicked:', name)}
/>
```

---

## Easy Import

All components can be imported from a single location:

```tsx
import {
  Logo,
  SearchInput,
  ProBadge,
  CategoryFilter,
  CategoryFilterGroup,
  Button,
  LinkButton,
  IconButton,
  Badge,
} from '@/components'
```

---

## Design System Benefits

1. **Consistency**: All buttons now use the same variants and sizes
2. **Maintainability**: Update one component to change all instances
3. **Type Safety**: Full TypeScript support with proper prop types
4. **Theming**: All components respect light/dark mode from CSS variables
5. **Accessibility**: Built on shadcn/ui components with proper a11y
6. **Performance**: Optimized with proper React patterns

---

## Migration Guide

### Before (Custom Buttons)

```tsx
<Link
  to="/pricing"
  className="text-sm font-semibold text-foreground hover:bg-muted px-3 py-1.5 rounded-sm transition-colors"
>
  Get PRO
</Link>
```

### After (LinkButton Component)

```tsx
<LinkButton to="/pricing" variant="nav-link" size="nav">
  Get PRO
</LinkButton>
```

### Before (Custom Icon Button)

```tsx
<button className="p-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border hover:bg-background transition-colors">
  <Copy className="h-4 w-4" />
</button>
```

### After (IconButton Component)

```tsx
<IconButton
  variant="outline"
  className="bg-background/90 backdrop-blur-sm border border-border hover:bg-background"
>
  <Copy className="h-4 w-4" />
</IconButton>
```

---

## Next Steps

Consider creating additional reusable components:

1. **PromptCard** - Reusable card for prompt grid items
2. **Header** - Extract header into its own component
3. **Footer** - Extract footer into its own component
4. **AnnouncementBanner** - Reusable banner component
5. **HeroSection** - Reusable hero section
6. **UpsellCard** - Reusable PRO upsell card component

These would further reduce code duplication and improve maintainability.
