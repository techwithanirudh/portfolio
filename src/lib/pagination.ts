const PAGE_PATTERN = /^\d+$/

export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value

  if (raw === undefined) {
    return 1
  }

  if (!(raw && PAGE_PATTERN.test(raw))) {
    return 0
  }

  const page = Number(raw)
  return Number.isSafeInteger(page) && page > 0 ? page : 0
}

interface PaginationRangeOptions {
  currentPage: number
  itemsToDisplay: number
  totalPages: number
}

export function getPaginationRange({
  currentPage,
  totalPages,
  itemsToDisplay,
}: PaginationRangeOptions) {
  const shouldShowEllipsis = totalPages > itemsToDisplay
  const showLeftEllipsis =
    shouldShowEllipsis && currentPage - 1 > itemsToDisplay / 2
  const showRightEllipsis =
    shouldShowEllipsis && totalPages - currentPage + 1 > itemsToDisplay / 2

  if (totalPages <= itemsToDisplay) {
    return {
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      showLeftEllipsis,
      showRightEllipsis,
    }
  }

  const halfDisplay = Math.floor(itemsToDisplay / 2)
  let start = Math.max(1, currentPage - halfDisplay)
  let end = Math.min(totalPages, currentPage + halfDisplay)

  if (start === 1) {
    end = itemsToDisplay
  }
  if (end === totalPages) {
    start = totalPages - itemsToDisplay + 1
  }
  if (showLeftEllipsis) {
    start++
  }
  if (showRightEllipsis) {
    end--
  }

  return {
    pages: Array.from({ length: end - start + 1 }, (_, i) => start + i),
    showLeftEllipsis,
    showRightEllipsis,
  }
}

/** Page 1 lives at the bare path, so it matches the canonical URL */
export const getPageHref = (path: string, page: number) =>
  page === 1 ? path : `${path}?page=${page}`
