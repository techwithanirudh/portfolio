'use client'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination'

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
      <PaginationContent className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-0 -space-x-px rtl:space-x-reverse'>
        <div className='flex'>
          {currentPage > 1 && (
            <PaginationItem>
              <Button
                aria-label='Go to previous page'
                className='shadow-none hover:z-10 focus-visible:z-10'
                onClick={handlePageChange(currentPage - 1)}
                shape='square'
                size='icon'
                variant='ghost'
              >
                <Icons.chevronLeft
                  aria-hidden='true'
                  size={16}
                  strokeWidth={2}
                />
              </Button>
            </PaginationItem>
          )}
        </div>

        <div className='inline-flex justify-self-center'>
          {showLeftEllipsis && (
            <PaginationItem>
              <Button
                className='pointer-events-none shadow-none'
                shape='square'
                size='icon'
                variant='ghost'
              >
                ...
              </Button>
            </PaginationItem>
          )}

          {pages.map((page) => (
            <PaginationItem className='w-max' key={page}>
              <Button
                aria-current={page === currentPage ? 'page' : undefined}
                className='shadow-none hover:z-10 focus-visible:z-10'
                onClick={handlePageChange(page)}
                shape='square'
                size='icon'
                variant={page === currentPage ? 'default' : 'ghost'}
              >
                {page}
              </Button>
            </PaginationItem>
          ))}

          {showRightEllipsis && (
            <PaginationItem>
              <Button
                className='pointer-events-none shadow-none'
                shape='square'
                size='icon'
                variant='ghost'
              >
                ...
              </Button>
            </PaginationItem>
          )}
        </div>

        <div className='flex justify-end'>
          {currentPage < totalPages && (
            <PaginationItem>
              <Button
                aria-label='Go to next page'
                className='shadow-none hover:z-10 focus-visible:z-10'
                onClick={handlePageChange(currentPage + 1)}
                shape='square'
                size='icon'
                variant='ghost'
              >
                <Icons.chevronRight
                  aria-hidden='true'
                  size={16}
                  strokeWidth={2}
                />
              </Button>
            </PaginationItem>
          )}
        </div>
      </PaginationContent>
    </Pagination>
  )
}

export { NumberedPagination }
