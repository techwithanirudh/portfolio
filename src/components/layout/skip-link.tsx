// not-sr-only resets position and padding, so they're restored on focus
export const SkipLink = () => (
  <a
    className='sr-only bg-primary font-medium text-primary-foreground text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2'
    href='#main-content'
  >
    Skip to content
  </a>
)
