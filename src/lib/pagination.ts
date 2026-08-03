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
