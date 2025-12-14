import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/libs/cn'
import { buttonVariants } from '@/components/ui/button'

// ============================================
// Types
// ============================================

type RouterPaginationProps = {
  currentPage: number
  totalPages: number
  baseUrl: string
  params?: Record<string, string>
  searchParams?: Record<string, string | number | undefined>
  className?: string
}

// ============================================
// Helper to generate page numbers
// ============================================

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  if (total > 1) {
    pages.push(total)
  }

  return pages
}

// ============================================
// Component
// ============================================

export function RouterPagination({
  currentPage,
  totalPages,
  baseUrl,
  params = {},
  searchParams = {},
  className,
}: RouterPaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  const buildSearch = (page: number) => {
    const search: Record<string, string | number> = { ...searchParams, page }
    // Remove page param if it's 1
    if (page === 1) {
      delete search.page
    }
    return search
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          to={baseUrl}
          params={params}
          search={buildSearch(currentPage - 1)}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-9',
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Link>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex size-9 items-center justify-center text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            to={baseUrl}
            params={params}
            search={buildSearch(page)}
            className={cn(
              buttonVariants({
                variant: page === currentPage ? 'outline' : 'ghost',
                size: 'icon',
              }),
              'size-9',
              page === currentPage && 'pointer-events-none',
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          to={baseUrl}
          params={params}
          search={buildSearch(currentPage + 1)}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-9',
          )}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  )
}
