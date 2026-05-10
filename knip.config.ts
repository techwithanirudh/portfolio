import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [
    'src/**/*.{ts,tsx}',
    'scripts/**/*.ts',
    'emails/**/*.tsx',
    'source.config.ts',
    'next-sitemap.config.ts',
  ],
  project: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts', 'emails/**/*.tsx'],
  ignore: ['content/**', '.source/**', 'src/components/ui/**'],
  ignoreExportsUsedInFile: true,
}

export default config
