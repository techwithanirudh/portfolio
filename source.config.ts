import {
  defineCollections,
  defineConfig,
  frontmatterSchema,
} from 'fumadocs-mdx/config'
import jsonSchema from 'fumadocs-mdx/plugins/json-schema'
import lastModified from 'fumadocs-mdx/plugins/last-modified'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { createFileSystemTypesCache } from 'fumadocs-twoslash/cache-fs'
import type { ElementContent } from 'hast'
import type { ShikiTransformer } from 'shiki'
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

export const work = defineCollections({
  dir: 'content/work',
  postprocess: {
    extractLinkReferences: true,
    includeProcessedMarkdown: true,
  },
  schema: frontmatterSchema.extend({
    date: dateSchema,
    github: z.string().optional(),
    image: z.string().optional(),
    /**
     * Pins a project to the front of the work list, lowest first. Anything
     * without it falls in behind, newest first.
     */
    order: z.number().optional(),
    website: z.string().optional(),
  }),
  type: 'doc',
})

function transformerEscape(): ShikiTransformer {
  return {
    code(hast) {
      function replace(node: ElementContent) {
        if (node.type === 'text') {
          node.value = node.value.replace('[\\!code', '[!code')
        } else if ('children' in node) {
          for (const child of node.children) {
            replace(child)
          }
        }
      }

      replace(hast)
      return hast
    },
    name: '@shikijs/transformers:remove-notation-escape',
  }
}

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
          transformerEscape(),
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
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
})
