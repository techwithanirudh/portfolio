// not-sr-only resets position and padding, so they're restored on focus
export const SkipLink = () => (
  <a
    className='sr-only rounded-md bg-primary font-medium text-primary-foreground text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    href='#main-content'
  >
    Skip to content
  </a>
)
