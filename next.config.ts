import bundleAnalyzer from '@next/bundle-analyzer'
import { withBotId } from 'botid/next/config'
import { createMDX } from 'fumadocs-mdx/next'
import type { NextConfig } from 'next'
import './src/env'

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
  // TODO(slopradar): env-rule: `process.env.SOURCE_MAPS` and `process.env.ANALYZE` (below) are read outside src/env.ts and are declared nowhere, add them as optional vars to the env schema (or drop the toggles) and read them from `env`
  productionBrowserSourceMaps: process.env.SOURCE_MAPS === 'true',
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
  turbopack: {
    resolveAlias: {
      // motion/react reads `motion` off a namespace import of framer-motion,
      // which keeps the full motion component (drag, pan, layout) in every
      // page even though we only render `m` under LazyMotion. framer-motion
      // is the same code with plain re-exports, so unused bits shake out
      'motion/react': 'framer-motion',
    },
  },
  // TODO(slopradar): swallowed-errors: `next build` never type-checks, so only CI's `bun typecheck` catches errors; owner decision, drop this
  // or keep it and say why in one line
  typescript: {
    ignoreBuildErrors: true,
  },
}

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const mdxPlugin = createMDX()

export default withBotId(mdxPlugin(bundleAnalyzerPlugin(nextConfig)))
