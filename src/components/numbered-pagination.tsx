import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
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

// Both arrows always render, greyed out at the ends, so the page numbers
// stay centered and the bar doesn't jump between pages
function StepLink({
  children,
  href,
  label,
}: {
  children: ReactNode
  href?: string
  label: string
}) {
  if (!href) {
    return (
      // Just a placeholder for sighted users; there's nowhere to go
      <span
        aria-hidden
        className={buttonVariants({
          className: 'opacity-40',
          shape: 'square',
          size: 'icon',
          variant: 'ghost',
        })}
      >
        {children}
      </span>
    )
  }

  return (
    <PaginationLink
      aria-label={label}
      className={linkClassName}
      href={href}
      shape='square'
      variant='ghost'
    >
      {children}
    </PaginationLink>
  )
}

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
          <StepLink
            href={currentPage > 1 ? getHref(currentPage - 1) : undefined}
            label='Go to previous page'
          >
            <Icons.chevronLeft aria-hidden='true' size={16} strokeWidth={2} />
          </StepLink>
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
          <StepLink
            href={
              currentPage < totalPages ? getHref(currentPage + 1) : undefined
            }
            label='Go to next page'
          >
            <Icons.chevronRight aria-hidden='true' size={16} strokeWidth={2} />
          </StepLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { NumberedPagination }
