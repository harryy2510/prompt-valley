import { Search } from 'lucide-react'
import { cn } from '@/libs/cn'
import type { ComponentProps } from 'react'

interface SearchInputProps extends ComponentProps<'input'> {
  containerClassName?: string
}

export function SearchInput({
  placeholder = 'Search',
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full h-9 rounded-lg bg-muted dark:bg-muted/20 pl-9 pr-4 text-sm placeholder:text-muted-foreground/80 focus:outline-none border-0 transition-colors',
          className
        )}
        {...props}
      />
    </div>
  )
}
