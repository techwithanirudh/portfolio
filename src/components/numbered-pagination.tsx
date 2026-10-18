import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button-variants'
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
  totalPages: number
}

function NumberedPagination({
  currentPage,
  totalPages,
  getHref,
}: NumberedPaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = getPaginationRange({
    currentPage,
    itemsToDisplay: 5,
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
            {/* TODO(slopradar): shadcn-extend: both ellipsis items hand-roll a span with three periods while ui/pagination exports PaginationEllipsis, use it (x2 in this file) */}
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
