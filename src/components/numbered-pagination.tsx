import { Icons } from '@/components/icons/icons'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { getPaginationRange } from '@/lib/pagination'

const ellipsisClassName =
  'flex size-9 items-center justify-center text-muted-foreground text-sm'

const linkClassName = 'shadow-none hover:z-10 focus-visible:z-10'

interface NumberedPaginationProps {
  currentPage: number
  getHref: (page: number) => string
  paginationItemsToDisplay?: number
  totalPages: number
}

function NumberedPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  getHref,
}: NumberedPaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = getPaginationRange({
    currentPage,
    itemsToDisplay: paginationItemsToDisplay,
    totalPages,
  })

  return (
    <Pagination>
      <PaginationContent className='grid w-full grid-cols-[1fr_auto_1fr] items-center gap-0'>
        <PaginationItem className='flex'>
          {currentPage > 1 && (
            <PaginationLink
              aria-label='Go to previous page'
              className={linkClassName}
              href={getHref(currentPage - 1)}
              shape='square'
              variant='ghost'
            >
              <Icons.chevronLeft aria-hidden='true' size={16} strokeWidth={2} />
            </PaginationLink>
          )}
        </PaginationItem>

        <PaginationItem className='justify-self-center'>
          <ul className='inline-flex items-center gap-1 -space-x-px rtl:space-x-reverse'>
            {showLeftEllipsis && (
              <PaginationItem>
                <span aria-hidden='true' className={ellipsisClassName}>
                  ...
                </span>
              </PaginationItem>
            )}

            {pages.map((page) => (
              <PaginationItem className='w-max' key={page}>
                <PaginationLink
                  className={linkClassName}
                  href={getHref(page)}
                  isActive={page === currentPage}
                  shape='square'
                  variant={page === currentPage ? 'default' : 'ghost'}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {showRightEllipsis && (
              <PaginationItem>
                <span aria-hidden='true' className={ellipsisClassName}>
                  ...
                </span>
              </PaginationItem>
            )}
          </ul>
        </PaginationItem>

        <PaginationItem className='flex justify-end'>
          {currentPage < totalPages && (
            <PaginationLink
              aria-label='Go to next page'
              className={linkClassName}
              href={getHref(currentPage + 1)}
              shape='square'
              variant='ghost'
            >
              <Icons.chevronRight
                aria-hidden='true'
                size={16}
                strokeWidth={2}
              />
            </PaginationLink>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { NumberedPagination }
