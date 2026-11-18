import type { UIElement } from '@json-render/core'
import { tool } from 'ai'
import { z } from 'zod'
import { parseSitePath, resolveNavigation } from '@/app/(llms)/utils/site-path'
import { experiences } from '@/constants/portfolio/experiences'
import { testimonials } from '@/constants/portfolio/testimonials'
import {
  type PortfolioComponent,
  type PortfolioSpec,
  type PortfolioState,
  portfolioCatalog,
} from '@/lib/ai/chat/catalog'
import { getGitHubContributions } from '@/lib/github-contributions'
import { getPost, getProject } from '@/lib/source'

const { components } = portfolioCatalog.data

const element = <T extends PortfolioComponent, P extends z.ZodType>(
  type: T,
  { description, props }: { description: string; props: P }
) =>
  z
    .object({
      children: z
        .array(z.string())
        .optional()
        .describe('Keys of the child elements, for a Stack.'),
      props,
      type: z.literal(type),
    })
    .describe(description)

const elementSchema = z.discriminatedUnion('type', [
  element('Contributions', components.Contributions),
  element('Experience', components.Experience),
  element('MoreLink', components.MoreLink),
  element('Post', components.Post),
  element('Project', components.Project),
  element('Stack', components.Stack),
  element('Testimonials', components.Testimonials),
])

const inputSchema = z.object({
  elements: z
    .record(z.string(), elementSchema)
    .describe('Every element by a short key you pick, like "projects".'),
  root: z.string().describe('The key of the element to render at the top.'),
})

type RenderPortfolioInput = z.infer<typeof inputSchema>
type InputElement = z.infer<typeof elementSchema>

type RenderPortfolioOutput =
  | { missing: string[]; spec: PortfolioSpec; success: true }
  | { missing: string[]; reason: string; success: false }

const toSlugs = (value: string, section: string) => {
  const segments = parseSitePath(value)?.segments ?? []
  return segments[0] === section ? segments.slice(1) : segments
}

const findProject = (slug: string) => {
  const slugs = toSlugs(slug, 'projects')
  return slugs.length > 0 ? getProject(slugs) : undefined
}

const findPost = (slug: string) => {
  const slugs = toSlugs(slug, 'blog')
  return slugs.length > 0 ? getPost(slugs) : undefined
}

const findExperience = (id: string) => {
  const needle = id.trim().toLowerCase()
  return experiences.find(
    (item) => item.id === needle || item.companyName.toLowerCase() === needle
  )
}

const findTestimonial = (id: string) => {
  const needle = id.trim().toLowerCase()
  return testimonials.find(
    (item) =>
      item.id === needle ||
      (needle !== '' && item.author.name.toLowerCase().startsWith(needle))
  )
}

const pickTestimonials = (
  ids: string[],
  state: PortfolioState,
  missing: string[]
) => {
  const picked = new Set<string>()
  for (const id of ids) {
    const found = findTestimonial(id)
    if (!found) {
      missing.push(`testimonial "${id}"`)
    } else if (picked.size < 3) {
      picked.add(found.id)
      state.testimonials[found.id] = found
    }
  }
  return [...picked]
}

const buildSpec = async (
  input: RenderPortfolioInput
): Promise<RenderPortfolioOutput> => {
  const state: PortfolioState = {
    contributions: [],
    experience: {},
    posts: {},
    projects: {},
    testimonials: {},
  }
  let showsContributions = false
  const elements: Record<string, UIElement> = {}
  const missing: string[] = []
  const visited = new Set<string>()

  const resolve = (item: InputElement): UIElement | null => {
    switch (item.type) {
      case 'Stack': {
        const children = (item.children ?? []).filter(visit)
        return children.length > 0
          ? { children, props: { title: item.props.title }, type: item.type }
          : null
      }
      case 'Project': {
        const page = findProject(item.props.slug)
        if (!page) {
          missing.push(`project "${item.props.slug}"`)
          return null
        }
        const slug = page.slugs.join('/')
        state.projects[slug] = {
          date: page.data.date.toISOString(),
          description: page.data.description ?? '',
          image: page.data.image ?? null,
          title: page.data.title,
          url: page.url,
        }
        return { children: [], props: { slug }, type: item.type }
      }
      case 'Post': {
        const page = findPost(item.props.slug)
        if (!page) {
          missing.push(`post "${item.props.slug}"`)
          return null
        }
        const slug = page.slugs.join('/')
        state.posts[slug] = {
          date: page.data.date.toISOString(),
          description: page.data.description,
          tags: page.data.tags,
          title: page.data.title,
          url: page.url,
        }
        return { children: [], props: { slug }, type: item.type }
      }
      case 'Experience': {
        const ids = new Set<string>()
        for (const id of item.props.ids) {
          const found = findExperience(id)
          if (found) {
            ids.add(found.id)
            state.experience[found.id] = found
          } else {
            missing.push(`experience "${id}"`)
          }
        }
        const ordered = experiences
          .map((entry) => entry.id)
          .filter((id) => ids.has(id))
        return ordered.length > 0
          ? { children: [], props: { ids: ordered }, type: item.type }
          : null
      }
      case 'Testimonials': {
        const ids = pickTestimonials(item.props.ids, state, missing)
        return ids.length > 0
          ? { children: [], props: { ids }, type: item.type }
          : null
      }
      case 'Contributions':
        showsContributions = true
        return { children: [], props: {}, type: item.type }
      case 'MoreLink': {
        const target = resolveNavigation(item.props.href)
        if (!target.success) {
          missing.push(`link "${item.props.href}"`)
          return null
        }
        return {
          children: [],
          props: { href: target.href, label: item.props.label },
          type: item.type,
        }
      }
      default:
        return null
    }
  }

  function visit(key: string): boolean {
    const item = input.elements[key]
    if (!item || visited.has(key) || visited.size >= 24) {
      return false
    }
    visited.add(key)
    const resolved = resolve(item)
    if (resolved) {
      elements[key] = resolved
    }
    return Boolean(resolved)
  }

  if (!visit(input.root)) {
    return {
      missing,
      reason: input.elements[input.root]
        ? 'None of those items exist on the site.'
        : `There is no element "${input.root}".`,
      success: false,
    }
  }

  if (showsContributions) {
    state.contributions = await getGitHubContributions()
  }

  return { missing, spec: { elements, root: input.root, state }, success: true }
}

const summarize = (output: RenderPortfolioOutput) => {
  if (!output.success) {
    return output
  }
  const { contributions, experience, posts, projects, testimonials } =
    output.spec.state
  const showsContributions = Object.values(output.spec.elements).some(
    (element) => element.type === 'Contributions'
  )
  const total = contributions.reduce((sum, day) => sum + day.count, 0)
  return {
    missing: output.missing,
    shown: [
      ...Object.values(projects).map((item) => `project: ${item.title}`),
      ...Object.values(posts).map((item) => `post: ${item.title}`),
      ...Object.values(experience).map(
        (item) => `experience: ${item.companyName}`
      ),
      ...Object.values(testimonials).map(
        (item) => `testimonial: ${item.title}, by ${item.author.name}`
      ),
      ...(showsContributions
        ? [
            contributions.length > 0
              ? `contributions: ${total} in the past 365 days`
              : 'contributions: unavailable, github could not be reached',
          ]
        : []),
    ],
    success: true,
  }
}

export const renderPortfolioTool = tool({
  description:
    "Show the site's own project cards, blog post rows, experience timeline, testimonials and GitHub contributions graph in the chat, as a json-render spec. Name items by slug or id only; their content comes from the site.",
  execute: buildSpec,
  inputSchema,
  toModelOutput: ({ output }) => ({ type: 'json', value: summarize(output) }),
})
