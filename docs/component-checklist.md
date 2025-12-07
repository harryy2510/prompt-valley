# PromptValley Component Checklist

> Auto-generated from Figma design analysis. Track component implementation progress.

## Status Legend
- [ ] Not started
- [x] Completed
- [~] In progress

---

## 1. Button Component Updates

### Variants to Add
- [x] `inverse` - White button for dark/colored backgrounds
- [x] `inverse-outline` - Outline button for dark backgrounds
- [x] `overlay` - Semi-transparent overlay button (for card copy buttons)

### Variants to Update
- [x] `brand-primary` - Change `rounded-sm` to `rounded-md`
- [x] `brand-secondary` - Change `rounded-sm` to `rounded-md`

### Sizes to Add
- [x] `xs` - Extra small for overlay buttons
- [x] `xl` - Extra large for hero CTAs
- [x] `icon-xs` - Extra small icon button

---

## 2. Badge Component Updates

### Variants to Add
- [x] `platform` - For ChatGPT/Gemini/Claude badges with icons
- [x] `category` - For category tags (Image Generation, Writing)
- [x] `tag` - For prompt tags (Sand, Serenity, Walking)
- [x] `pro` - Purple PRO badge
- [x] `copy` - Copy button badge style
- [x] `success` - Success state badge
- [x] `warning` - Warning state badge

### Sizes Added
- [x] `sm` - Small badge
- [x] `lg` - Large badge

---

## 3. New Components

### Core Components
- [x] `PromptCard` - Main content card with image, title, description, tags
- [x] `CopyButton` - Floating copy button overlay for cards
- [x] `ProBadge` - "Pro" star badge overlay
- [x] `PlatformBadge` - Platform icon + name badge (ChatGPT, Gemini, etc.)

### Navigation
- [x] `SearchInput` - Search input with icon
- [ ] `MegaMenu` - Multi-column dropdown navigation

### Marketing/Conversion
- [x] `PricingCard` - Pricing modal/page card
- [x] `PricingToggle` - Yearly/Monthly toggle switch
- [x] `TestimonialCard` - Quote with avatar and attribution
- [x] `ProUpsellCard` - Purple gradient upsell card
- [x] `PremiumContentBlock` - Premium content block for modals

### Onboarding
- [x] `StepIndicator` - Progress indicator for onboarding flow
- [x] `NumberedStepIndicator` - Numbered step indicator variant

### Media
- [x] `ImageGallery` - Thumbnail row for modal
- [x] `ImageLightbox` - Full-screen image viewer

### Social Auth
- [x] `SocialButton` - OAuth buttons (Google, Email, Apple)
- [x] `SocialButtonGroup` - Group of social buttons with dividers

---

## 4. Existing Component Updates

### Dialog
- [x] Add `size` prop for larger modals (sm, default, lg, xl, full)
- [x] Support two-column layout (via className)

### Tabs
- [x] Add `variant` prop (default, filter, underline)
- [x] Filter tab styling (pill style with active state)
- [x] Underline variant for category pages

### Checkbox
- [x] Purple checked state matches design (using primary color)

### Select
- [x] Dropdown styling matches Model filter

---

## 5. Component File Mapping

| Component | File Path | Status |
|-----------|-----------|--------|
| Button (update) | `src/components/ui/button.tsx` | [x] |
| Badge (update) | `src/components/ui/badge.tsx` | [x] |
| PromptCard | `src/components/ui/prompt-card.tsx` | [x] |
| CopyButton | `src/components/ui/copy-button.tsx` | [x] |
| ProBadge | `src/components/ui/pro-badge.tsx` | [x] |
| PlatformBadge | `src/components/ui/platform-badge.tsx` | [x] |
| SearchInput | `src/components/ui/search-input.tsx` | [x] |
| MegaMenu | `src/components/ui/mega-menu.tsx` | [x] |
| PricingCard | `src/components/ui/pricing-card.tsx` | [x] |
| PricingToggle | `src/components/ui/pricing-toggle.tsx` | [x] |
| TestimonialCard | `src/components/ui/testimonial-card.tsx` | [x] |
| ProUpsellCard | `src/components/ui/pro-upsell-card.tsx` | [x] |
| StepIndicator | `src/components/ui/step-indicator.tsx` | [x] |
| ImageGallery | `src/components/ui/image-gallery.tsx` | [x] |
| SocialButton | `src/components/ui/social-button.tsx` | [x] |
| Dialog (update) | `src/components/ui/dialog.tsx` | [x] |
| Tabs (update) | `src/components/ui/tabs.tsx` | [x] |

---

## 6. Design Specifications Reference

### Colors (from styles.css)
- Primary: `#5A5AED` (purple)
- Foreground: `#000128` (near black)
- Background: `#F5F5FA` (light gray)
- Card: `#FFFFFF`
- Border: `#DFDFE5`

### Border Radius
- `rounded-sm`: 4px
- `rounded-md`: 8px
- `rounded-lg`: 12px
- `rounded-full`: 9999px

### Typography
- Headings: Satoshi Bold/Semibold
- Body: Satoshi Regular 16px/22px
- Caption: 12px
- Button text: Medium weight

---

## Progress Log

| Date | Component | Notes |
|------|-----------|-------|
| 2025-12-07 | Button | Added inverse, inverse-outline, overlay variants; xs, xl, icon-xs sizes |
| 2025-12-07 | Badge | Added tag, category, platform, pro, copy, success, warning variants; sm, lg sizes |
| 2025-12-07 | PromptCard | New component with image, copy, pro badge, tags support |
| 2025-12-07 | CopyButton | New overlay copy button with clipboard API |
| 2025-12-07 | ProBadge | New PRO star badge overlay component |
| 2025-12-07 | PlatformBadge | New ChatGPT/Gemini/Claude badge with icons |
| 2025-12-07 | SearchInput | New search input with icon and clear button |
| 2025-12-07 | MegaMenu | New mega menu dropdown with multi-column support |
| 2025-12-07 | PricingCard | New pricing card with toggle and features list |
| 2025-12-07 | PricingToggle | New yearly/monthly toggle switch |
| 2025-12-07 | TestimonialCard | New testimonial quote card with avatar |
| 2025-12-07 | ProUpsellCard | New PRO upsell card with gradient background |
| 2025-12-07 | StepIndicator | New onboarding step indicator (bar and numbered) |
| 2025-12-07 | ImageGallery | New image gallery with thumbnails and lightbox |
| 2025-12-07 | SocialButton | New OAuth buttons (Google, Apple, Email) |
| 2025-12-07 | Dialog | Added size prop (sm, default, lg, xl, full) |
| 2025-12-07 | Tabs | Added variant prop (default, filter, underline) |

---

## Summary

**Total Components Created/Updated: 17**

### New Components (12)
- PromptCard, PromptCardSkeleton
- CopyButton
- ProBadge
- PlatformBadge
- SearchInput
- MegaMenu, NavMegaMenu
- PricingCard
- PricingToggle
- TestimonialCard, TestimonialGrid
- ProUpsellCard, PremiumContentBlock
- StepIndicator, NumberedStepIndicator
- ImageGallery, ImageLightbox
- SocialButton, SocialButtonGroup

### Updated Components (5)
- Button (3 new variants, 3 new sizes)
- Badge (7 new variants, 2 new sizes)
- Dialog (size prop)
- Tabs (variant prop with 3 options)
- (Input styling already compatible)
