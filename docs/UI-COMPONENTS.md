# Prompt Valley - UI Components & Architecture Documentation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Design System](#design-system)
3. [Base UI Components](#base-ui-components)
4. [Layout Components](#layout-components)
5. [Card Components](#card-components)
6. [Common Components](#common-components)
7. [Error Components](#error-components)
8. [Routes & Pages](#routes--pages)
9. [Actions & Data Fetching](#actions--data-fetching)
10. [Hooks](#hooks)
11. [Utilities & Libraries](#utilities--libraries)

---

## Project Structure

```
src/
├── actions/           # Server functions & React Query hooks
│   ├── auth.ts        # Authentication (OTP login)
│   ├── categories.ts  # Category fetching
│   ├── favorites.ts   # User favorites management
│   ├── prompts.ts     # Prompt CRUD operations
│   ├── stripe.ts      # Stripe product/pricing
│   └── tags.ts        # Tag fetching
├── components/
│   ├── cards/         # Business-specific card components
│   ├── common/        # Reusable utility components
│   ├── error/         # Error boundary & 404 pages
│   ├── layout/        # Layout & navigation components
│   └── ui/            # Base shadcn/ui components
├── hooks/             # Custom React hooks
├── libs/              # External library configurations
│   ├── react-query/   # TanStack Query setup
│   └── supabase/      # Supabase client configuration
├── routes/            # TanStack Router file-based routes
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

---

## Design System

### Color Palette

The app uses a custom design system with CSS variables defined in `src/styles.css`:

**Primary Colors (Purple/Indigo)**
- `--color-primary-50` to `--color-primary-900`
- Primary brand color: `#5a5aed` (primary-500)

**Secondary Colors (Warm/Gold)**
- `--color-secondary-50` to `--color-secondary-900`
- Used for warm accents: `#e9d8a6` (secondary-500)

**Gray Scale**
- `--color-gray-50` to `--color-gray-900`
- Dark mode background: `#0a0a12` (gray-900)

### Typography

Font: **Satoshi Variable** (custom web font)

**Text Utilities:**
- `.text-display` - 128px, bold (marketing hero)
- `.text-h1` to `.text-h6` - Heading hierarchy
- `.text-body1`, `.text-body1-medium`, `.text-body1-semibold` - 16px body text
- `.text-body2`, `.text-body2-medium`, `.text-body2-semibold` - 14px body text
- `.text-caption`, `.text-caption-medium` - 12px small text
- `.text-overline` - 11px uppercase labels

### Border Radius

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-full`: 9999px (pills)

---

## Base UI Components

Located in `src/components/ui/`. Built on shadcn/ui with Radix primitives.

### Button (`button.tsx`)

Highly customizable button with many variants.

**Variants:**
- `default` - Primary filled button
- `destructive` - Red danger button
- `outline` - Border only
- `secondary` - Muted background
- `ghost` - No background until hover
- `link` - Text link style
- `gradient` - Primary gradient (blue to purple)
- `brand-primary` - Solid primary with hover effects
- `brand-secondary` - Outline primary style
- `inverse` - White button for dark backgrounds
- `inverse-outline` - Outline for dark backgrounds
- `overlay` - For image overlays with blur
- `nav-link` - Navigation links
- `nav-link-muted` - Muted nav links

**Sizes:**
- `default` - h-9 px-4
- `sm` - h-8 px-3
- `lg` - h-10 px-6
- `xs` - h-6 px-2 text-xs
- `icon`, `icon-sm`, `icon-lg` - Square icon buttons
- `nav` - Navigation size
- `cta`, `cta-lg` - Call-to-action sizes

```tsx
import { Button } from '@/components/ui/button'

<Button variant="gradient" size="lg">Get Started</Button>
```

### Badge (`badge.tsx`)

Label/tag component with semantic variants.

**Variants:**
- `default` - Primary background
- `secondary` - Muted gray
- `destructive` - Red for errors
- `outline` - Border only
- `success` - Green
- `warning` - Yellow
- `info` - Blue
- `category` - Purple gradient for categories
- `tag` - Muted for tags
- `provider` - For AI provider badges

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="category">Writing</Badge>
<Badge variant="tag">SEO</Badge>
```

### Input Components

**Input (`input.tsx`)** - Standard text input with focus ring
**Textarea (`textarea.tsx`)** - Multi-line text input
**Label (`label.tsx`)** - Form labels with disabled state
**Checkbox (`checkbox.tsx`)** - Radix checkbox with checkmark
**Switch (`switch.tsx`)** - Toggle switch
**RadioGroup (`radio-group.tsx`)** - Radio button group
**Select (`select.tsx`)** - Dropdown select with search
**InputOTP (`input-otp.tsx`)** - OTP/verification code input

### Form (`form.tsx`)

React Hook Form integration with Zod validation.

**Components:**
- `Form` - Provider wrapper
- `FormField` - Field controller
- `FormItem` - Field container
- `FormLabel` - Accessible label
- `FormControl` - Input wrapper
- `FormDescription` - Help text
- `FormMessage` - Error messages

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Dialog (`dialog.tsx`)

Modal dialog using Radix.

**Components:**
- `Dialog` - Root provider
- `DialogTrigger` - Open trigger
- `DialogContent` - Modal content
- `DialogHeader/Footer` - Layout helpers
- `DialogTitle/Description` - Semantic content
- `DialogClose` - Close button

### Sheet (`sheet.tsx`)

Slide-out panel (drawer).

**Props:**
- `side`: `"top" | "right" | "bottom" | "left"`

### Tabs (`tabs.tsx`)

Tab navigation component.

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Card (`card.tsx`)

Container component for content blocks.

**Components:**
- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Subtitle
- `CardAction` - Action buttons area
- `CardContent` - Main content
- `CardFooter` - Footer section

### Navigation Components

**DropdownMenu (`dropdown-menu.tsx`)** - Context menus
**Popover (`popover.tsx`)** - Floating content
**Tooltip (`tooltip.tsx`)** - Hover tooltips
**Command (`command.tsx`)** - Command palette (cmdk)
**NavigationMenu (`navigation-menu.tsx`)** - Main nav
**Breadcrumb (`breadcrumb.tsx`)** - Path breadcrumbs

### Layout Components

**ScrollArea (`scroll-area.tsx`)** - Custom scrollbars
**Separator (`separator.tsx`)** - Horizontal/vertical lines
**AspectRatio (`aspect-ratio.tsx`)** - Maintain aspect ratios
**Resizable (`resizable.tsx`)** - Resizable panels
**Collapsible (`collapsible.tsx`)** - Expandable sections
**Accordion (`accordion.tsx`)** - Accordion panels

### Feedback Components

**Alert (`alert.tsx`)** - Alert banners
**AlertDialog (`alert-dialog.tsx`)** - Confirmation dialogs
**Progress (`progress.tsx`)** - Progress bars
**Skeleton (`skeleton.tsx`)** - Loading placeholders
**Spinner (`spinner.tsx`)** - Loading spinner
**Empty (`empty.tsx`)** - Empty state component
**Sonner (`sonner.tsx`)** - Toast notifications

### Data Display

**Table (`table.tsx`)** - Data tables
**Avatar (`avatar.tsx`)** - User avatars with fallback
**Calendar (`calendar.tsx`)** - Date picker calendar
**Carousel (`carousel.tsx`)** - Image carousel
**HoverCard (`hover-card.tsx`)** - Hover preview cards
**Drawer (`drawer.tsx`)** - Bottom drawer (vaul)

### Special Components

**Item (`item.tsx`)** - List item with media, title, description
**Kbd (`kbd.tsx`)** - Keyboard shortcut display
**Field (`field.tsx`)** - Form field container
**Toggle (`toggle.tsx`)** - Toggle buttons
**ToggleGroup (`toggle-group.tsx`)** - Grouped toggles
**Slider (`slider.tsx`)** - Range slider
**Pagination (`pagination.tsx`)** - Page navigation
**InputGroup (`input-group.tsx`)** - Input with addon
**ButtonGroup (`button-group.tsx`)** - Grouped buttons

### Sidebar (`sidebar.tsx`)

Full-featured sidebar navigation system with:
- `SidebarProvider` - State management
- `Sidebar` - Main container (collapsible)
- `SidebarHeader/Footer/Content` - Layout
- `SidebarMenu/MenuItem/MenuButton` - Navigation items
- `SidebarGroup/GroupLabel` - Grouped sections
- `SidebarTrigger` - Toggle button
- `useSidebar()` - Hook for sidebar state

---

## Layout Components

Located in `src/components/layout/`.

### Logo (`logo.tsx`)

SVG logo with gradient effects and noise texture.

```tsx
import { Logo } from '@/components/layout/logo'

<Logo className="size-8" />
```

### LogoWithText (`logo-with-text.tsx`)

Full logo with "promptvalley" text.

### ThemeToggle (`theme-toggle.tsx`)

Dark/light mode toggle button.

**Features:**
- Persists to localStorage (`prompt-valley-theme`)
- Respects system preference on first load
- Animated icon rotation on hover

```tsx
import { ThemeToggle } from '@/components/layout/theme-toggle'

<ThemeToggle />
```

### MegaMenu (`mega-menu.tsx`)

Navigation mega menu with sections.

**Types:**
```tsx
type MegaMenuCategory = {
  title: string
  href?: string
  description?: string
  icon?: ReactNode
}

type MegaMenuSection = {
  title?: string
  categories: MegaMenuCategory[]
}
```

**Usage:**
```tsx
<MegaMenu
  trigger="Products"
  sections={[
    {
      title: "Categories",
      categories: [
        { title: "Writing", href: "/writing", description: "..." }
      ]
    }
  ]}
  align="left"
/>
```

### CategoryFilter (`category-filter.tsx`)

Pill-style category filter buttons.

```tsx
<CategoryFilterGroup
  categories={[
    { name: "All", active: true },
    { name: "Writing", active: false }
  ]}
  onCategoryClick={(name) => setFilter(name)}
/>
```

### ImageGallery (`image-gallery.tsx`)

Image gallery with thumbnails and lightbox.

**Components:**
- `ImageGallery` - Main gallery with thumbnails
- `ImageLightbox` - Full-screen lightbox viewer

```tsx
<ImageGallery
  images={[
    { src: "/image1.jpg", alt: "Image 1" }
  ]}
  aspectRatio={4/3}
  maxThumbnails={5}
/>
```

---

## Card Components

Located in `src/components/cards/`.

### PromptCard (`prompt-card.tsx`)

Main prompt display card for grids.

**Props:**
```tsx
type PromptCardProps = {
  prompt?: PromptWithRelations  // From database
  title?: string
  description?: string | null
  imageUrl?: string
  imagePlaceholder?: ReactNode
  promptText?: string
  category?: string
  tags?: string[]
  tier?: 'free' | 'pro'
  isSaved?: boolean
  onSave?: () => void
  onCopy?: () => void
  onClick?: () => void
}
```

**Features:**
- Image with hover zoom effect
- Pro badge overlay
- Copy button on hover
- Bookmark button
- Category/tag badges
- Provider badges

```tsx
<PromptCard
  prompt={promptData}
  onSave={() => toggleFavorite(promptData.id)}
  onCopy={() => trackCopy(promptData.id)}
/>

// Loading state
<PromptCardSkeleton />
```

### PricingCard (`pricing-card.tsx`)

Subscription pricing display.

**Props:**
```tsx
type PricingCardProps = {
  product: StripeProduct & { prices: StripePrice[] }
  coupon?: StripeCoupon | null
  features?: string[]
  ctaText?: string
  onCtaClick?: (priceId: string, period: PricingPeriod) => void
  ctaLoading?: boolean
  finePrint?: string
  defaultPeriod?: 'monthly' | 'yearly'
}
```

**Features:**
- Monthly/yearly toggle with discount display
- Animated price changes (NumberFlow)
- Coupon discount application
- Feature list with sparkle icons

### PricingToggle (`pricing-toggle.tsx`)

Period toggle for pricing cards.

```tsx
<PricingToggle
  value={period}
  onChange={setPeriod}
  yearlyDiscount="33% Off"
/>
```

### TestimonialCard (`testimonial-card.tsx`)

Customer testimonial display.

**Variants:**
- `default` - Standard left-aligned
- `minimal` - Compact version
- `featured` - Centered with larger quote icon

```tsx
<TestimonialCard
  quote="This product is amazing!"
  authorName="John Doe"
  authorRole="CEO"
  authorCompany="Acme Inc"
  authorImage="/avatar.jpg"
  variant="featured"
/>

// Grid layout helper
<TestimonialGrid>
  {testimonials.map(t => <TestimonialCard {...t} />)}
</TestimonialGrid>
```

### UpsellCard (`upsell-card.tsx`)

Premium upsell CTA cards.

**Variants:**
- `default` - Full card for grid placement
- `compact` - Smaller with vertical layout
- `inline` - Horizontal banner style

```tsx
<UpsellCard
  title="Unlock Pro Features"
  description="Get access to all prompts"
  ctaText="Upgrade Now"
  onCtaClick={() => navigate('/pricing')}
  variant="inline"
/>

// Premium content block for modals
<PremiumContentBlock
  label="Pro Feature"
  description="Upgrade to access this content"
  ctaText="Get PRO"
/>
```

---

## Common Components

Located in `src/components/common/`.

### CopyButton (`copy-button.tsx`)

Clipboard copy button with feedback.

```tsx
<CopyButton
  textToCopy={promptText}
  onCopied={() => trackCopy()}
  showLabel={true}  // Show "Copy"/"Copied" text
/>
```

### ProBadge (`pro-badge.tsx`)

Premium content indicator.

**Sizes:** `sm`, `default`, `lg`

```tsx
<ProBadge size="sm" />
```

### ProviderBadge (`provider-badge.tsx`)

AI provider badge with logo.

```tsx
<ProviderBadge
  provider={providerData}  // { name, logo_url }
  showIcon={true}
  comingSoon={false}
/>
```

### IconButton (`icon-button.tsx`)

Simplified icon-only button.

```tsx
<IconButton variant="ghost" size="icon-sm">
  <HeartIcon />
</IconButton>
```

### SocialButton (`social-button.tsx`)

OAuth login buttons.

**Providers:** `google`, `apple`, `email`

```tsx
<SocialButton provider="google" />

// Group with dividers
<SocialButtonGroup
  providers={['google', 'apple']}
  onProviderClick={(provider) => signIn(provider)}
  dividerText="or"
/>
```

### SearchInput (`search-input.tsx`)

Search input with icon and clear button.

```tsx
<SearchInput
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onClear={() => setSearch('')}
  placeholder="Search prompts..."
/>
```

### LinkButton (`link-button.tsx`)

TanStack Router Link styled as Button.

```tsx
<LinkButton to="/pricing" variant="gradient" size="lg">
  View Pricing
</LinkButton>
```

### StepIndicator (`step-indicator.tsx`)

Progress step indicators.

```tsx
// Simple bar indicator
<StepIndicator totalSteps={4} currentStep={2} />

// Numbered with labels
<NumberedStepIndicator
  steps={['Account', 'Profile', 'Settings', 'Complete']}
  currentStep={2}
/>
```

### Image (`image.tsx`)

Smart image component with Supabase storage support.

```tsx
<Image
  src="path/in/bucket.jpg"  // Or full URL
  alt="Description"
  className="size-full object-cover"
/>
```

---

## Error Components

Located in `src/components/error/`.

### DefaultCatchBoundary (`default-catch-boundary.tsx`)

Error boundary with gradient background and retry options.

**Features:**
- Animated gradient orb background
- Error details display
- "Try Again" button (router.invalidate)
- "Go Back" or "Go Home" buttons

### NotFound (`not-found.tsx`)

404 page with animated design.

**Features:**
- Large "404" gradient text
- Sparkle decorations
- "Go Back" and "Back to Home" buttons

---

## Routes & Pages

Uses TanStack Router with file-based routing.

### Route Structure

```
routes/
├── __root.tsx        # Root layout with HTML shell
├── __guest.tsx       # Guest-only layout (redirects if authed)
├── __authed.tsx      # Protected layout (redirects if not authed)
├── __guest/
│   └── auth.tsx      # /auth - OTP login page
├── __authed/
│   └── dashboard.tsx # /dashboard - User dashboard
└── index.tsx         # / - Home page
```

### Root Route (`__root.tsx`)

- Sets up HTML document shell
- Manages authentication state via React Query
- Configures SEO meta tags
- Initializes dark mode from localStorage
- Sets up TanStack devtools

**Router Context:**
```tsx
interface RouterContext {
  queryClient: QueryClient
  user: User | null
}
```

### Auth Route (`__guest/auth.tsx`)

OTP email authentication flow:
1. Email input step
2. 6-digit OTP verification step

**Features:**
- Gradient animated background
- Back to home button
- Error message display
- Loading states

### Guest Layout (`__guest.tsx`)

Redirects authenticated users to `/dashboard` or `?redirect` param.

### Authed Layout (`__authed.tsx`)

Redirects unauthenticated users to `/auth` with return URL.

---

## Actions & Data Fetching

Located in `src/actions/`. Uses TanStack Query + TanStack Start server functions.

### Auth Actions (`auth.ts`)

**Server Functions:**
- `getUserServer()` - Get current user
- `signOutServer()` - Sign out
- `sendOtpServer({ email })` - Send OTP
- `verifyOtpServer({ email, token })` - Verify OTP

**Query Options:**
- `userQueryOptions()` - User query config

**Hooks:**
- `useUser()` - Get current user
- `useSignOut()` - Sign out mutation
- `useAuthStateListener()` - Sync auth state changes

### Prompts Actions (`prompts.ts`)

**Server Functions:**
- `fetchPrompts(filters)` - List prompts with relations
- `fetchPromptById(id)` - Get single prompt
- `fetchFeaturedPrompts(limit)` - Featured prompts
- `fetchPromptsByCategory(categoryId, limit)` - By category
- `incrementPromptCopies(id)` - Track copies

**Filter Schema:**
```tsx
type PromptFilters = {
  categoryId?: string
  tagId?: string
  tier?: 'free' | 'pro'
  search?: string
  isFeatured?: boolean
  limit?: number
  offset?: number
}
```

**Hooks:**
- `usePrompts(filters)` - List prompts
- `usePromptDetail(id)` - Single prompt
- `useFeaturedPrompts(limit)` - Featured list
- `usePromptsByCategory(categoryId, limit)` - By category
- `useIncrementCopies()` - Copy tracking mutation

### Categories Actions (`categories.ts`)

**Server Functions:**
- `fetchCategories()` - All categories (nested)
- `fetchCategoryById(id)` - Single category

**Hooks:**
- `useCategories()` - All categories
- `useCategory(id)` - Single category

### Tags Actions (`tags.ts`)

**Server Functions:**
- `fetchTags()` - All tags
- `fetchTagById(id)` - Single tag

**Hooks:**
- `useTags()` - All tags
- `useTag(id)` - Single tag

### Favorites Actions (`favorites.ts`)

**Server Functions:**
- `fetchUserFavorites()` - User's favorites with prompts
- `fetchFavoriteIds()` - Just IDs for quick lookup
- `checkIsFavorite({ promptId, userId })` - Check single
- `addFavorite({ promptId, userId })` - Add favorite
- `removeFavorite({ promptId, userId })` - Remove favorite

**Hooks:**
- `useUserFavorites()` - Favorites with prompt data
- `useFavoriteIds()` - Just IDs
- `useIsFavorite(promptId)` - Check single (requires auth)
- `useAddFavorite()` - Add mutation
- `useRemoveFavorite()` - Remove mutation

### Stripe Actions (`stripe.ts`)

**Server Functions:**
- `fetchStripeProduct()` - Active product with prices and coupon

**Types:**
```tsx
type StripeProductWithPricesAndCoupon = StripeProduct & {
  prices: StripePrice[]
  coupon?: StripeCoupon | null
}
```

**Hooks:**
- `useStripeProduct()` - Get product for pricing

---

## Hooks

Located in `src/hooks/`.

### useIsMobile (`use-mobile.ts`)

Responsive breakpoint hook.

```tsx
const isMobile = useIsMobile()  // true if < 768px
```

---

## Utilities & Libraries

### cn (`libs/cn.ts`)

Tailwind class merging utility (clsx + tailwind-merge).

```tsx
import { cn } from '@/libs/cn'

<div className={cn('base-class', isActive && 'active-class', className)} />
```

### Storage (`libs/storage.ts`)

Supabase storage URL helpers.

```tsx
import { getImageUrl, isFullUrl } from '@/libs/storage'

const url = getImageUrl('path/in/bucket.jpg')  // Returns full public URL
const isExternal = isFullUrl(url)  // Check if already full URL
```

### Supabase Client (`libs/supabase/client.ts`)

Browser-side Supabase client (singleton).

```tsx
import { getSupabaseBrowserClient } from '@/libs/supabase/client'

const supabase = getSupabaseBrowserClient()
```

### Supabase Server (`libs/supabase/server.ts`)

Server-side Supabase client with cookie session.

```tsx
import { getSupabaseServerClient } from '@/libs/supabase/server'

const supabase = getSupabaseServerClient()
```

### React Query Provider (`libs/react-query/root-provider.tsx`)

TanStack Query setup.

```tsx
import * as TanstackQuery from '@/libs/react-query/root-provider'

const context = TanstackQuery.getContext()
<TanstackQuery.Provider {...context}>
  {children}
</TanstackQuery.Provider>
```

### SEO Utility (`utils/seo.ts`)

Meta tag generation for TanStack Router.

```tsx
import { seo } from '@/utils/seo'

head: () => ({
  meta: seo({
    title: 'Page Title',
    description: 'Page description',
    keywords: 'keyword1, keyword2',
    image: '/og-image.jpg'
  })
})
```

---

## Database Types

Generated types from Supabase in `src/types/database.types.ts`.

### Main Tables

- `prompts` - AI prompts with content, images, tier
- `categories` - Hierarchical categories (parent_id)
- `tags` - Flat tags
- `prompt_tags` - Many-to-many join
- `prompt_models` - Many-to-many join with AI models
- `ai_models` - Model definitions with capabilities
- `ai_providers` - Provider info (OpenAI, etc.)
- `user_favorites` - User saved prompts
- `stripe_products/prices/coupons` - Billing data

### Enums

- `tier`: `'free' | 'pro'`
- `model_capability`: AI model capabilities

### Common Extended Types

```tsx
// Prompt with all relations loaded
type PromptWithRelations = Prompt & {
  category?: Category | null
  tags?: Array<{ tag: Tag }>
  models?: Array<{
    model: AIModel & { provider?: AIProvider }
  }>
}
```

---

## Router Configuration (`router.tsx`)

TanStack Router setup with:
- React Query integration via SSR
- Default error boundary
- Default 404 component
- Scroll restoration
- Preloading on intent

```tsx
const router = createRouter({
  scrollRestoration: true,
  routeTree,
  context: { queryClient, user: null },
  defaultPreload: 'intent',
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
})
```
