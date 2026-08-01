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

export const blog = defineCollections({
  dir: 'content/blog',
  postprocess: {
    extractLinkReferences: true,
    includeProcessedMarkdown: true,
  },
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((value, context) => {
        try {
          return new Date(value)
        } catch {
          context.issues.push({
            code: 'custom',
            input: value,
            message: 'The value could not be transformed to Date type.',
          })
          return z.NEVER
        }
      }),
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
    date: z
      .string()
      .or(z.date())
      .transform((value, context) => {
        try {
          return new Date(value)
        } catch {
          context.issues.push({
            code: 'custom',
            input: value,
            message: 'The value could not be transformed to Date type.',
          })
          return z.NEVER
        }
      }),
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
    const { rehypeCodeDefaultOptions } = await import(
      'fumadocs-core/mdx-plugins/rehype-code'
    )
    const { remarkSteps } = await import(
      'fumadocs-core/mdx-plugins/remark-steps'
    )
    const { default: remarkMath } = await import('remark-math')
    const { default: rehypeKatex } = await import('rehype-katex')
    const { remarkAutoTypeTable } = await import('fumadocs-typescript')

    return {
      rehypeCodeOptions: {
        inline: 'tailing-curly-colon',
        themes: {
          dark: 'catppuccin-mocha',
          light: 'catppuccin-latte',
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
