import { BotIdClient } from 'botid/client'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import CustomSearchDialog from '@/components/search'
import { ThemeProvider } from '@/components/theme-provider'
import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { description as homeDescription, owner, title } from '@/constants/site'
import { PagesProvider } from '@/contexts/pages'
import { createMetadata } from '@/lib/metadata'
import { getPosts, getWorkPages } from '@/lib/source'
import '@/styles/globals.css'
import 'katex/dist/katex.css'
import { Body } from './layout.client'
import { Provider } from './provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = createMetadata({
  title: {
    template: `%s | ${title}`,
    default: title,
  },
  applicationName: title,
  authors: [
    {
      name: owner,
      url: baseUrl.toString(),
    },
  ],
  description: homeDescription,
  metadataBase: baseUrl,
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
  maximumScale: 1,
}

const baseUrlString = baseUrl.toString()
const socialUrls = socials
  .map((social) => social.url)
  .filter((url) => url.startsWith('http'))

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${baseUrlString}#person`,
      name: owner,
      url: baseUrlString,
      description: homeDescription,
      jobTitle: 'Full-stack Developer',
      knowsAbout: ['Next.js', 'React', 'TypeScript', 'Web Development', 'AI'],
      sameAs: socialUrls,
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrlString}#website`,
      name: title,
      url: baseUrlString,
      description: homeDescription,
      publisher: {
        '@id': `${baseUrlString}#person`,
      },
    },
  ],
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  const pages = [
    ...getPosts().map((page) => ({
      title: page.data.title ?? 'Untitled',
      url: page.url,
      tag: 'blog' as const,
      description: page.data.description,
    })),
    ...getWorkPages().map((page) => ({
      title: page.data.title ?? 'Untitled',
      url: page.url,
      tag: 'projects' as const,
      description: page.data.description,
    })),
  ]

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <BotIdClient
          protect={[
            {
              path: '/*',
              method: 'POST',
            },
          ]}
        />
      </head>
      <Body>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
          type='application/ld+json'
        />
        <PagesProvider pages={pages}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
            enableSystem
          >
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
          </ThemeProvider>
        </PagesProvider>
      </Body>
    </html>
  )
}

export default RootLayout
