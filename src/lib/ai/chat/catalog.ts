import { defineCatalog, type Spec } from '@json-render/core'
import { schema } from '@json-render/react/schema'
import { z } from 'zod'
import type { Activity } from '@/components/features/contributions'
import { experiences } from '@/constants/portfolio/experiences'
import { testimonials } from '@/constants/portfolio/testimonials'
import type { BlogPage, ProjectPage } from '@/lib/source'
import type { Testimonial } from '@/types'
import type { ExperienceItemType } from '@/types/experience'

/** Props name items by slug or id only; no prop carries content */
export const portfolioCatalog = defineCatalog(schema, {
  actions: {},
  components: {
    Contributions: {
      description:
        "anirudh's GitHub contributions graph with his total for the past year, fetched from GitHub.",
      props: z.object({}),
      slots: [],
    },
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
        'A slim link row to a page on this site, like "/projects" or "/about#experience". Put it last, after the items it expands on.',
      props: z.object({
        href: z.string().describe('A site path from the site map.'),
        label: z.string().describe('A short label, like "view all projects".'),
      }),
      slots: [],
    },
    Post: {
      description:
        'A compact blog post row with its title, date and one line of description, linking to the post.',
      props: z.object({
        slug: z
          .string()
          .describe('The post slug from its url, like "hello-world".'),
      }),
      slots: [],
    },
    Project: {
      description:
        'A compact project row with a small cover thumbnail, its title and one line of description, linking to the case study.',
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
    Testimonials: {
      description:
        'Quotes from people anirudh has worked with, each with its headline, the quote and who said it, in the order given.',
      props: z.object({
        ids: z
          .array(z.string())
          .min(1)
          .describe(
            `One to three testimonial ids: ${testimonials.map((item) => item.id).join(', ')}.`
          ),
      }),
      slots: [],
    },
  },
})

export type PortfolioComponent = keyof typeof portfolioCatalog.data.components

type ProjectItem = Pick<ProjectPage, 'url'> &
  Pick<ProjectPage['data'], 'title'> & {
    /** ISO date, since the spec travels as JSON */
    date: string
    description: string
    image: string | null
  }

type PostItem = Pick<BlogPage, 'url'> &
  Pick<BlogPage['data'], 'description' | 'tags' | 'title'> & {
    /** ISO date, since the spec travels as JSON */
    date: string
  }

/**
 * The site data a spec renders from, keyed by the slugs and ids its elements
 * name. Extends json-render's own state shape so it drops into a spec
 */
export interface PortfolioState extends Record<string, unknown> {
  /** The past year by day, empty when GitHub couldn't be reached */
  contributions: Activity[]
  experience: Record<string, ExperienceItemType>
  posts: Record<string, PostItem>
  projects: Record<string, ProjectItem>
  testimonials: Record<string, Testimonial>
}

export type PortfolioSpec = Spec & { state: PortfolioState }

const escapePointer = (token: string) =>
  token.replaceAll('~', '~0').replaceAll('/', '~1')

/** The JSON Pointer json-render reads one item of the state at */
export const statePath = (
  collection: 'experience' | 'posts' | 'projects' | 'testimonials',
  key: string
) => `/${collection}/${escapePointer(key)}`
