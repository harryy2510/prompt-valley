import { forwardRef, type ComponentProps } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Input } from '@/components/ui/input'

type SearchInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, showClearButton = true, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== ''

    return (
      <div className="relative">
        {/* Search icon */}
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />

        {/* Input */}
        <Input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'pl-9 pr-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-input',
            '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            className,
          )}
          {...props}
        />

        {/* Clear button */}
        {showClearButton && hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
