import { fileURLToPath } from 'node:url'
import bundleAnalyzer from '@next/bundle-analyzer'
import { withBotId } from 'botid/next/config'
import { createMDX } from 'fumadocs-mdx/next'
import type { NextConfig } from 'next'

async function createNextConfig(): Promise<NextConfig> {
  const { createJiti } = await import('jiti')
  const jiti = createJiti(fileURLToPath(import.meta.url))

  await jiti.import('./src/env')

  const nextConfig: NextConfig = {
    allowedDevOrigins: [
      '3000--main--portfolio--techwithanirudh.coder.techwithanirudh.com',
    ],
    devIndicators: false,
    experimental: {
      // TypeScript 7 dropped the compiler API Next.js reaches for directly, so
      // it has to shell out to tsc instead.
      useTypeScriptCli: true,
      viewTransition: true,
    },
    images: {
      dangerouslyAllowSVG: true,
      qualities: [100, 75, 85, 95],
      remotePatterns: [
        {
          hostname: 'avatars.githubusercontent.com',
          port: '',
          protocol: 'https',
        },
        {
          hostname: 'raw.githubusercontent.com',
          pathname: '/techwithanirudh/**',
          port: '',
          protocol: 'https',
        },
        {
          hostname: 'raw.githubusercontent.com',
          pathname: '/Meeting-BaaS/**',
          port: '',
          protocol: 'https',
        },
        {
          hostname: 'fumadocs.dev',
          port: '',
          protocol: 'https',
        },
      ],
    },
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    poweredByHeader: false,
    productionBrowserSourceMaps: process.env.SOURCE_MAPS === 'true',
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          destination: '/blog.mdx/:path*',
          source: '/blog/:path*.mdx',
        },
        {
          destination: '/work.mdx/:path*',
          source: '/work/:path*.mdx',
        },
        {
          destination: '/blog/rss.xml',
          source: '/rss.xml',
        },
      ]
    },
    serverExternalPackages: [
      'ts-morph',
      'typescript',
      'oxc-transform',
      'twoslash',
      'twoslash-protocol',
      'shiki',
      '@takumi-rs/image-response',
    ],
    typescript: {
      ignoreBuildErrors: true,
    },
  }

  return nextConfig
}

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const mdxPlugin = createMDX()

const NextApp = async () => {
  const nextConfig = await createNextConfig()
  const plugins = [bundleAnalyzerPlugin, mdxPlugin]
  const config = plugins.reduce((config, plugin) => plugin(config), nextConfig)
  return withBotId(config)
}

export default NextApp
