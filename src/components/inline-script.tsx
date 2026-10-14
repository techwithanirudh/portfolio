'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
// Runs before hydration on the server render, and stays inert on the client so
// React does not warn about script tags.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: callers pass serialized functions they own, never user input
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
    />
  )
}
