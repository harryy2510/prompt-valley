import { cn } from '@/libs/cn'
import type { ComponentProps, ReactNode } from 'react'

interface CategoryFilterProps extends Omit<ComponentProps<'button'>, 'children'> {
  active?: boolean
  children: ReactNode
}

export function CategoryFilter({
  active = false,
  className,
  children,
  ...props
}: CategoryFilterProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'border border-border bg-background hover:bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface CategoryFilterGroupProps {
  categories: Array<{ name: string; active?: boolean }>
  onCategoryClick?: (categoryName: string) => void
  className?: string
}

export function CategoryFilterGroup({
  categories,
  onCategoryClick,
  className,
}: CategoryFilterGroupProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2', className)}>
      {categories.map((category) => (
        <CategoryFilter
          key={category.name}
          active={category.active}
          onClick={() => onCategoryClick?.(category.name)}
        >
          {category.name}
        </CategoryFilter>
      ))}
    </div>
  )
}
