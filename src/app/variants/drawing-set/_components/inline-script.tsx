// Adapted from chanhdai.com/src/components/inline-script.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
'use client'

export function InlineScript({ html }: { html: string }) {
  return (
    <script
      // React also warns in development when rendering produces <script> tags.
      // To avoid this, wrap the script in a helper that sets type="text/javascript"
      // on the server and type="text/plain" on the client.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: the script is built from our own serialized functions, never from user input
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
    />
  )
}
