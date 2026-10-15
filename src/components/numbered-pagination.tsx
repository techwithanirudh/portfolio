'use client'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination'
import { cn } from '@/lib/utils'

// Flush square cells split by rules, so the bar sits on the section's lines
const cellClassName =
  'size-12 shadow-none ring-0 hover:z-10 focus-visible:z-10 active:scale-100'
const ellipsisClassName =
  'flex size-12 items-center justify-center font-mono text-muted-foreground text-sm'

interface NumberedPaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  paginationItemsToDisplay?: number
  totalPages: number
}

function NumberedPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  onPageChange,
}: NumberedPaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    paginationItemsToDisplay,
    totalPages,
  })

  const handlePageChange = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <Pagination>
      <PaginationContent className='grid h-12 w-full grid-cols-[auto_1fr_auto] items-stretch gap-0'>
        <PaginationItem className='flex border-line border-r'>
          <Button
            aria-label='Go to previous page'
            className={cellClassName}
            disabled={currentPage <= 1}
            onClick={handlePageChange(currentPage - 1)}
            size='icon'
            variant='ghost'
          >
            <Icons.chevronLeft aria-hidden='true' size={16} strokeWidth={2} />
          </Button>
        </PaginationItem>

        <PaginationItem className='flex justify-center'>
          <ul className='flex divide-x divide-line border-line border-x'>
            {showLeftEllipsis && (
              <PaginationItem className='flex'>
                <span aria-hidden='true' className={ellipsisClassName}>
                  ...
                </span>
              </PaginationItem>
            )}

            {pages.map((page) => (
              <PaginationItem className='flex' key={page}>
                <Button
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={cn(cellClassName, 'font-mono tabular-nums')}
                  onClick={handlePageChange(page)}
                  size='icon'
                  variant={page === currentPage ? 'default' : 'ghost'}
                >
                  {page}
                </Button>
              </PaginationItem>
            ))}

            {showRightEllipsis && (
              <PaginationItem className='flex'>
                <span aria-hidden='true' className={ellipsisClassName}>
                  ...
                </span>
              </PaginationItem>
            )}
          </ul>
        </PaginationItem>

        <PaginationItem className='flex border-line border-l'>
          <Button
            aria-label='Go to next page'
            className={cellClassName}
            disabled={currentPage >= totalPages}
            onClick={handlePageChange(currentPage + 1)}
            size='icon'
            variant='ghost'
          >
            <Icons.chevronRight aria-hidden='true' size={16} strokeWidth={2} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { NumberedPagination }
