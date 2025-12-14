import { Link } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { buttonVariants } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'

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
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          {currentPage > 1 ? (
            <Link
              to={baseUrl}
              params={params}
              search={buildSearch(currentPage - 1)}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'gap-1 px-2.5 sm:pl-2.5',
              )}
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon className="size-4" />
              <span className="hidden sm:block">Previous</span>
            </Link>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'pointer-events-none gap-1 px-2.5 opacity-50 sm:pl-2.5',
              )}
            >
              <ChevronLeftIcon className="size-4" />
              <span className="hidden sm:block">Previous</span>
            </span>
          )}
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((page, idx) => (
          <PaginationItem key={page === 'ellipsis' ? `ellipsis-${idx}` : page}>
            {page === 'ellipsis' ? (
              <span
                aria-hidden
                className="flex size-9 items-center justify-center"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <Link
                to={baseUrl}
                params={params}
                search={buildSearch(page)}
                className={cn(
                  buttonVariants({
                    variant: page === currentPage ? 'outline' : 'ghost',
                    size: 'icon',
                  }),
                  page === currentPage && 'pointer-events-none',
                )}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <Link
              to={baseUrl}
              params={params}
              search={buildSearch(currentPage + 1)}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'gap-1 px-2.5 sm:pr-2.5',
              )}
              aria-label="Go to next page"
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon className="size-4" />
            </Link>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'pointer-events-none gap-1 px-2.5 opacity-50 sm:pr-2.5',
              )}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon className="size-4" />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
