import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { transformerRemoveNotationEscape } from '@shikijs/transformers'
import {
  defineCollections,
  defineConfig,
  frontmatterSchema,
} from 'fumadocs-mdx/config'
import jsonSchema from 'fumadocs-mdx/plugins/json-schema'
import lastModified from 'fumadocs-mdx/plugins/last-modified'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { createFileSystemTypesCache } from 'fumadocs-twoslash/cache-fs'
import { z } from 'zod'

const dateSchema = z.union([z.string(), z.date()]).pipe(z.coerce.date())

export const blog = defineCollections({
  dir: 'content/blog',
  postprocess: {
    extractLinkReferences: true,
    includeProcessedMarkdown: true,
  },
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: dateSchema,
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  type: 'doc',
})

export const projects = defineCollections({
  dir: 'content/projects',
  // The newest commit that changed the file's lines, followed across renames,
  // so moving content/work to content/projects (zero lines changed) doesn't
  // reset every project's last updated date the way the plugin's git log would
  lastModified: async (file) => {
    const { stdout } = await promisify(execFile)('git', [
      'log',
      '--follow',
      '--format=%aI',
      '--numstat',
      '--',
      file,
    ]).catch(() => ({ stdout: '' }))
    let date: string | undefined
    for (const line of stdout.split('\n')) {
      const [added, deleted] = line.split('\t')
      if (deleted === undefined) {
        date = line || date
      } else if (date && (added !== '0' || deleted !== '0')) {
        return new Date(date)
      }
    }
  },
  postprocess: {
    extractLinkReferences: true,
    includeProcessedMarkdown: true,
  },
  schema: frontmatterSchema.extend({
    date: dateSchema,
    github: z.url().optional(),
    image: z.string().optional(),
    /** Zooms the cover onto a readable detail: focus point in percent, then the zoom factor */
    imageCrop: z
      .object({ x: z.number(), y: z.number(), zoom: z.number() })
      .optional(),
    /**
     * Pins a project to the front of the project list, lowest first. Anything
     * without it falls in behind, newest first.
     */
    order: z.number().optional(),
    /** Where it runs, such as "iOS and Android" */
    platform: z.string().optional(),
    /** Where it stands, such as "Live" or "Archived" */
    status: z.string().optional(),
    tags: z.array(z.string()).optional(),
    website: z.url().optional(),
  }),
  type: 'doc',
})

export default defineConfig({
  mdxOptions: async () => {
    const [
      { rehypeCodeDefaultOptions },
      { remarkSteps },
      { default: remarkMath },
      { default: rehypeKatex },
      { remarkAutoTypeTable },
    ] = await Promise.all([
      import('fumadocs-core/mdx-plugins/rehype-code'),
      import('fumadocs-core/mdx-plugins/remark-steps'),
      import('remark-math'),
      import('rehype-katex'),
      import('fumadocs-typescript'),
    ])

    return {
      rehypeCodeOptions: {
        inline: 'tailing-curly-colon',
        themes: {
          // A matched pair, so a snippet keeps its colors and upright keywords
          // when the theme flips (Catppuccin Latte's greens and yellows fail
          // contrast on white, which ruled out the Catppuccin pair)
          dark: 'github-dark',
          light: 'github-light',
        },
        transformers: [
          ...(rehypeCodeDefaultOptions.transformers ?? []),
          transformerTwoslash({
            typesCache: createFileSystemTypesCache(),
          }),
          transformerRemoveNotationEscape(),
        ],
      },
      rehypePlugins: (v) => [rehypeKatex, ...v],
      remarkCodeTabOptions: {
        parseMdx: true,
      },
      remarkNpmOptions: {
        persist: {
          id: 'package-manager',
        },
      },
      remarkPlugins: [remarkSteps, remarkMath, remarkAutoTypeTable],
    }
  },
  plugins: [
    // TODO(slopradar): dead-config: both collections are `doc`, and `insert` only stamps `$schema` into new meta JSON files, so this only writes `.source/json-schema/*.json`, which nothing references; drop the plugin and its import
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
})
