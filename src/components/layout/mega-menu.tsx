import { useState, type ComponentProps, type ReactNode } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'

// Types
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

type MegaMenuProps = ComponentProps<'div'> & {
  trigger: string
  sections: MegaMenuSection[]
  footer?: ReactNode
  align?: 'left' | 'center' | 'right'
}

function MegaMenu({
  trigger,
  sections,
  footer,
  align = 'left',
  className,
  ...props
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      data-slot="mega-menu"
      className={cn('relative', className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      {...props}
    >
      {/* Trigger */}
      <Button
        variant="nav-link"
        size="nav"
        className="gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDownIcon
          className={cn(
            'size-4 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full pt-2 z-50',
            align === 'left' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'right' && 'right-0',
          )}
        >
          <div className="min-w-[400px] rounded-lg border bg-popover p-4 shadow-lg">
            <div className="flex gap-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex-1">
                  {section.title && (
                    <div className="text-overline text-muted-foreground mb-3">
                      {section.title}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {section.categories.map((category, categoryIndex) => (
                      <li key={categoryIndex}>
                        <MegaMenuCategoryItem {...category} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {footer && (
              <div className="mt-4 pt-4 border-t border-border">
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Category item component
function MegaMenuCategoryItem({
  title,
  href,
  description,
  icon,
}: MegaMenuCategory) {
  const Comp = href ? 'a' : 'button'

  return (
    <Comp
      href={href}
      className={cn(
        'flex items-start gap-3 w-full rounded-md p-2 text-left transition-colors',
        'hover:bg-muted focus:bg-muted focus:outline-none',
      )}
    >
      {icon && (
        <div className="shrink-0 mt-0.5 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-body2-medium text-foreground">{title}</div>
        {description && (
          <div className="text-caption text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </div>
        )}
      </div>
    </Comp>
  )
}

// Navigation bar with mega menus
type NavMegaMenuProps = ComponentProps<'nav'> & {
  items: Array<{
    trigger: string
    sections: MegaMenuSection[]
    footer?: ReactNode
  } | {
    label: string
    href: string
  }>
}

function NavMegaMenu({ items, className, ...props }: NavMegaMenuProps) {
  return (
    <nav
      data-slot="nav-mega-menu"
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      {items.map((item, index) => {
        if ('sections' in item) {
          return (
            <MegaMenu
              key={index}
              trigger={item.trigger}
              sections={item.sections}
              footer={item.footer}
            />
          )
        }

        return (
          <Button
            key={index}
            variant="nav-link"
            size="nav"
            asChild
          >
            <a href={item.href}>{item.label}</a>
          </Button>
        )
      })}
    </nav>
  )
}

// Specific menu for Writing categories (from Figma)
const writingCategories: MegaMenuSection = {
  title: 'Categories',
  categories: [
    { title: 'Email sequences', href: '/category/email-sequences' },
    { title: 'LinkedIn Post', href: '/category/linkedin-post' },
    { title: 'Social media captions', href: '/category/social-media-captions' },
    { title: 'Blog posts', href: '/category/blog-posts' },
    { title: 'Ad copy', href: '/category/ad-copy' },
    { title: 'Product descriptions', href: '/category/product-descriptions' },
  ],
}

// Specific menu for Image Generation categories (from Figma)
const imageGenerationCategories: MegaMenuSection = {
  title: 'Categories',
  categories: [
    { title: 'Illustrations', href: '/category/illustrations' },
    { title: 'Website hero images', href: '/category/website-hero-images' },
    { title: 'Product photos', href: '/category/product-photos' },
    { title: 'Portraits', href: '/category/portraits' },
    { title: 'Landscapes', href: '/category/landscapes' },
    { title: 'Abstract art', href: '/category/abstract-art' },
  ],
}

export {
  MegaMenu,
  MegaMenuCategoryItem,
  NavMegaMenu,
  writingCategories,
  imageGenerationCategories,
}
export type { MegaMenuCategory, MegaMenuSection, MegaMenuProps }
