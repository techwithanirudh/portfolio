import { BotIdClient } from 'botid/client'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Viewport } from 'next'
import { Caveat, Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import Analytics from '@/components/analytics'
import { SignInModalProvider } from '@/components/features/auth/sign-in-modal'
import CustomSearchDialog from '@/components/features/search'
import { ThemeColorSync } from '@/components/theme-color-sync'
import { ThemeProvider } from '@/components/theme-provider'
import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { description as homeDescription, owner, title } from '@/constants/site'
import { PagesProvider } from '@/contexts/pages'
import { createMetadata } from '@/lib/metadata'
import { revealScript } from '@/lib/reveal-script'
import { getPageEntries } from '@/lib/source'
import { themeColor } from '@/lib/theme-color'
import '@/styles/globals.css'
import 'fumadocs-ui/components/image-zoom2.css'
import 'katex/dist/katex.css'
import { Provider, SoundsProvider } from './provider'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
})

export const metadata = createMetadata({
  applicationName: title,
  authors: [
    {
      name: owner,
      url: baseUrl.toString(),
    },
  ],
  description: homeDescription,
  metadataBase: baseUrl,
  title: {
    default: title,
    template: `%s | ${title}`,
  },
})

export const viewport: Viewport = {
  // Android: the keyboard shrinks the layout viewport, so dvh panels stay above it
  interactiveWidget: 'resizes-content',
  themeColor: [
    { color: themeColor.dark, media: '(prefers-color-scheme: dark)' },
    { color: themeColor.light, media: '(prefers-color-scheme: light)' },
  ],
  // Required for Safari 26 to tint the bottom bar and for env(safe-area-inset-*).
  viewportFit: 'cover',
}

const baseUrlString = baseUrl.toString()
const socialUrls = socials
  .map((social) => social.url)
  .filter((url) => url.startsWith('http'))

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@id': `${baseUrlString}#person`,
      '@type': 'Person',
      description: homeDescription,
      jobTitle: 'Full-stack Developer',
      knowsAbout: ['Next.js', 'React', 'TypeScript', 'Web Development', 'AI'],
      name: owner,
      sameAs: socialUrls,
      url: baseUrlString,
    },
    {
      '@id': `${baseUrlString}#website`,
      '@type': 'WebSite',
      description: homeDescription,
      name: title,
      publisher: {
        '@id': `${baseUrlString}#person`,
      },
      url: baseUrlString,
    },
  ],
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  const pages = getPageEntries()

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      data-scroll-behavior='smooth'
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: our own static code, it has to run before hydration
          dangerouslySetInnerHTML={{ __html: revealScript }}
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
          type='application/ld+json'
        />
        <BotIdClient
          protect={[
            {
              method: 'POST',
              path: '/*',
            },
          ]}
        />
      </head>
      <body className='relative flex min-h-svh flex-col overflow-x-hidden'>
        <PagesProvider pages={pages}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
            enableSystem
          >
            <ThemeColorSync />
            <SoundsProvider>
              <SignInModalProvider>
                <RootProvider
                  search={{
                    SearchDialog: CustomSearchDialog,
                  }}
                  theme={{
                    enabled: false,
                  }}
                >
                  <Provider>{children}</Provider>
                </RootProvider>
              </SignInModalProvider>
            </SoundsProvider>
          </ThemeProvider>
        </PagesProvider>
        {/* Rendered on the server so the env schema (and zod) stays out of the client bundle */}
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
