import { defineCatalog, type Spec } from '@json-render/core'
import { schema } from '@json-render/react/schema'
import { z } from 'zod'
import { experiences } from '@/constants/portfolio/experiences'
import type { ExperienceItemType } from '@/types/experience'

/**
 * The json-render catalog Simba draws replies with: a few of the site's own
 * components, picked by slug or id. No prop carries content. The
 * `renderPortfolio` tool looks every slug up in the site's sources and ships
 * the real data in the spec's state, so a card can only show a project, post
 * or role that exists.
 */
export const portfolioCatalog = defineCatalog(schema, {
  actions: {},
  components: {
    Experience: {
      description:
        "A stretch of anirudh's experience timeline, one row per company with dates, role and logo, in timeline order.",
      props: z.object({
        ids: z
          .array(z.string())
          .min(1)
          .describe(
            `Company ids from the experience list: ${experiences.map((item) => item.id).join(', ')}.`
          ),
      }),
      slots: [],
    },
    MoreLink: {
      description:
        'A full width link to a page on this site, like "/projects" or "/about#experience". Put it last, after the items it expands on.',
      props: z.object({
        href: z.string().describe('A site path from the site map.'),
        label: z.string().describe('A short label, like "view all projects".'),
      }),
      slots: [],
    },
    Post: {
      description:
        'A blog post row with its date, title and description, linking to the post.',
      props: z.object({
        slug: z
          .string()
          .describe('The post slug from its url, like "hello-world".'),
      }),
      slots: [],
    },
    Project: {
      description:
        'A project card with its cover, title and description, linking to the case study.',
      props: z.object({
        slug: z
          .string()
          .describe('The project slug from its url, like "ai_tutor".'),
      }),
      slots: [],
    },
    Stack: {
      description:
        'Groups items under an optional short title, divided by dashed lines. Use it as the root when showing more than one item.',
      props: z.object({
        title: z
          .string()
          .nullable()
          .describe('A short lowercase title, like "projects", or null.'),
      }),
      slots: ['default'],
    },
  },
})

export type PortfolioComponent = keyof typeof portfolioCatalog.data.components

export interface ProjectItem {
  description: string
  image: string | null
  slugs: string[]
  title: string
  url: string
}

export interface PostItem {
  author: string
  /** ISO date, since the spec travels as JSON */
  date: string
  description?: string
  tags?: string[]
  title: string
  url: string
}

/**
 * The site data a spec renders from, keyed by the slugs and ids its elements
 * name. Extends json-render's own state shape so it drops into a spec
 */
export interface PortfolioState extends Record<string, unknown> {
  experience: Record<string, ExperienceItemType>
  posts: Record<string, PostItem>
  projects: Record<string, ProjectItem>
}

export type PortfolioSpec = Spec & { state: PortfolioState }

const escapePointer = (token: string) =>
  token.replaceAll('~', '~0').replaceAll('/', '~1')

/** The JSON Pointer json-render reads one item of the state at */
export const statePath = (
  collection: 'experience' | 'posts' | 'projects',
  key: string
) => `/${collection}/${escapePointer(key)}`
