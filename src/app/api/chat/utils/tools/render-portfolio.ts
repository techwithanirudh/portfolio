import type { UIElement } from '@json-render/core'
import { tool } from 'ai'
import { z } from 'zod'
import { experiences } from '@/constants/portfolio/experiences'
import {
  type PortfolioComponent,
  type PortfolioSpec,
  type PortfolioState,
  portfolioCatalog,
} from '@/lib/ai/chat/catalog'
import { getPost, getWork } from '@/lib/source'
import { parseSitePath, resolveNavigation } from './navigate'

const MAX_ELEMENTS = 24

const { components } = portfolioCatalog.data

// Each element is checked against its own component's props, so the model
// sees the exact shape of every prop in the tool's schema
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
  element('Experience', components.Experience),
  element('MoreLink', components.MoreLink),
  element('Post', components.Post),
  element('Project', components.Project),
  element('Stack', components.Stack),
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

// Accepts a bare slug or the page's path, like "ai_tutor" or "/projects/ai_tutor"
const toSlugs = (value: string, section: string) => {
  const segments = parseSitePath(value)?.path.split('/').filter(Boolean) ?? []
  return segments[0] === section ? segments.slice(1) : segments
}

const findWork = (slug: string) => {
  const slugs = toSlugs(slug, 'projects')
  return slugs.length > 0 ? getWork(slugs) : undefined
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

/**
 * Rebuilds the model's spec from the site's own data: every slug and id is
 * looked up, its content goes into the state, and anything that doesn't
 * exist is dropped and reported back. Only `type`, `props` and `children`
 * survive, so a spec can't carry its own state, bindings or actions.
 */
const buildSpec = (input: RenderPortfolioInput): RenderPortfolioOutput => {
  const state: PortfolioState = { experience: {}, posts: {}, projects: {} }
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
        const page = findWork(item.props.slug)
        if (!page) {
          missing.push(`project "${item.props.slug}"`)
          return null
        }
        const slug = page.slugs.join('/')
        state.projects[slug] = {
          date: page.data.date.toISOString(),
          description: page.data.description ?? '',
          image: page.data.image ?? null,
          // TODO(slopradar): dead-field: no client reads `slugs` since WorkCard takes transitionName, stop writing it here so the Pick in lib/ai/chat/catalog.ts (its own annotation) can drop it
          slugs: page.slugs,
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
        // Timeline order, whatever order the model listed them in
        const ordered = experiences
          .map((entry) => entry.id)
          .filter((id) => ids.has(id))
        return ordered.length > 0
          ? { children: [], props: { ids: ordered }, type: item.type }
          : null
      }
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
        // The input schema only lets catalog components through
        return null
    }
  }

  // Each element renders once, which also breaks any cycle in `children`
  function visit(key: string): boolean {
    const item = input.elements[key]
    if (!item || visited.has(key) || visited.size >= MAX_ELEMENTS) {
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

  return { missing, spec: { elements, root: input.root, state }, success: true }
}

// What the model reads back: what the visitor now sees, not the whole spec
const summarize = (output: RenderPortfolioOutput) => {
  if (!output.success) {
    return output
  }
  const { experience, posts, projects } = output.spec.state
  return {
    missing: output.missing,
    shown: [
      ...Object.values(projects).map((item) => `project: ${item.title}`),
      ...Object.values(posts).map((item) => `post: ${item.title}`),
      ...Object.values(experience).map(
        (item) => `experience: ${item.companyName}`
      ),
    ],
    success: true,
  }
}

export const renderPortfolioTool = tool({
  description:
    "Show the site's own project cards, blog post rows and experience timeline in the chat, as a json-render spec. Name items by slug or id only; their content comes from the site.",
  execute: buildSpec,
  inputSchema,
  toModelOutput: ({ output }) => ({ type: 'json', value: summarize(output) }),
})
