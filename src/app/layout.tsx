import { BotIdClient } from 'botid/client'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import CustomSearchDialog from '@/components/features/search'
import { ThemeProvider } from '@/components/providers/theme'
import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { description as homeDescription, owner, title } from '@/constants/site'
import { PagesProvider } from '@/contexts/pages'
import { createMetadata } from '@/lib/metadata'
import { getPosts, getWorkPages } from '@/lib/source'
import '@/styles/globals.css'
import 'fumadocs-ui/components/image-zoom2.css'
import 'katex/dist/katex.css'
import { Body } from './layout.client'
import { Provider } from './provider'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
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
  maximumScale: 1,
  themeColor: [
    { color: '#0A0A0A', media: '(prefers-color-scheme: dark)' },
    { color: '#fff', media: '(prefers-color-scheme: light)' },
  ],
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
  const pages = [
    ...getPosts().map((page) => ({
      description: page.data.description,
      tag: 'blog' as const,
      title: page.data.title ?? 'Untitled',
      url: page.url,
    })),
    ...getWorkPages().map((page) => ({
      description: page.data.description,
      tag: 'projects' as const,
      title: page.data.title ?? 'Untitled',
      url: page.url,
    })),
  ]

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      data-scroll-behavior='smooth'
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <BotIdClient
          protect={[
            {
              method: 'POST',
              path: '/*',
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
