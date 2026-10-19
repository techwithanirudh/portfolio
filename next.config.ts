import bundleAnalyzer from '@next/bundle-analyzer'
import { withBotId } from 'botid/next/config'
import { createMDX } from 'fumadocs-mdx/next'
import type { NextConfig } from 'next'
import { env } from './src/env'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '3000--main--portfolio--techwithanirudh.coder.techwithanirudh.com',
  ],
  devIndicators: false,
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
        pathname: '/techwithanirudh/**',
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
  productionBrowserSourceMaps: env.SOURCE_MAPS === 'true',
  async redirects() {
    return [
      {
        destination: '/?signin=%2F',
        permanent: false,
        source: '/login',
      },
      {
        destination: '/resume',
        permanent: true,
        source: '/resume.pdf',
      },
      // Tags are inline filters on /blog, so the tag index redirects there
      {
        destination: '/blog',
        permanent: true,
        source: '/blog/tags',
      },
      {
        destination: '/projects/:path*',
        permanent: true,
        source: '/work/:path*',
      },
      {
        destination: '/stack.md',
        permanent: true,
        source: '/skills.md',
      },
      {
        destination: '/blog/rss.xml',
        permanent: true,
        source: '/rss.xml',
      },
    ]
  },
  async rewrites() {
    return [
      {
        destination: '/blog.mdx/:path*',
        source: '/blog/:path*.mdx',
      },
      {
        destination: '/work.mdx/:path*',
        source: '/projects/:path*.mdx',
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
  turbopack: {
    resolveAlias: {
      // motion/react reads `motion` off a namespace import of framer-motion,
      // which keeps the full motion component (drag, pan, layout) in every
      // page even though we only render `m` under LazyMotion. framer-motion
      // is the same code with plain re-exports, so unused bits shake out
      'motion/react': 'framer-motion',
    },
  },
}

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: env.ANALYZE === 'true',
})

const mdxPlugin = createMDX()

export default withBotId(mdxPlugin(bundleAnalyzerPlugin(nextConfig)))
