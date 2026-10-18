import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { ElementContent, Root, RootContent } from 'hast'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
  Suspense,
  use,
  useDeferredValue,
} from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { visit } from 'unist-util-visit'

const WHITESPACE_LOOKAHEAD = /(?=\s)/

// TODO(slopradar): over-abstraction: Processor plus createProcessor wrap one remark pipeline, and this is a third markdown stack beside fumadocs createMarkdownRenderer (features/search/results.tsx) and react-markdown (experience-timeline.tsx), keep one
interface Processor {
  process: (content: string) => Promise<ReactNode>
}

function rehypeWrapWords() {
  return (tree: Root) => {
    visit(tree, ['text', 'element'], (node, index, parent) => {
      if (node.type === 'element' && node.tagName === 'pre') {
        return 'skip'
      }
      if (node.type !== 'text' || !parent || index === undefined) {
        return
      }

      const words = node.value.split(WHITESPACE_LOOKAHEAD)

      const newNodes: ElementContent[] = words.flatMap((word) => {
        if (word.length === 0) {
          return []
        }

        return {
          children: [{ type: 'text', value: word }],
          properties: {
            class: 'animate-fd-fade-in',
          },
          tagName: 'span',
          type: 'element',
        }
      })

      Object.assign(node, {
        children: newNodes,
        properties: {},
        tagName: 'span',
        type: 'element',
      } satisfies RootContent)
      return 'skip'
    })
  }
}

function createProcessor(): Processor {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeWrapWords)

  return {
    async process(content) {
      const nodes = processor.parse({ value: content })
      const hast = await processor.run(nodes)

      return toJsxRuntime(hast, {
        components: {
          ...defaultMdxComponents,
          img: undefined,
          pre: Pre,
        },
        development: false,
        Fragment,
        jsx,
        jsxs,
      })
    },
  }
}

function Pre(props: ComponentProps<'pre'>) {
  const code = Children.only(props.children)
  if (!isValidElement<ComponentProps<'code'>>(code)) {
    return null
  }
  const codeProps = code.props
  const content = codeProps.children
  if (typeof content !== 'string') {
    return null
  }

  let lang =
    codeProps.className
      ?.split(' ')
      .find((value) => value.startsWith('language-'))
      ?.slice('language-'.length) ?? 'text'

  if (lang === 'mdx') {
    lang = 'md'
  }

  return <DynamicCodeBlock code={content.trimEnd()} lang={lang} />
}

const processor = createProcessor()
const CACHE_LIMIT = 200
const cache = new Map<string, Promise<ReactNode>>()

export function Markdown({ text }: { text: string }) {
  const deferredText = useDeferredValue(text)

  return (
    <Suspense fallback={<p className='invisible'>{text}</p>}>
      <Renderer text={deferredText} />
    </Suspense>
  )
}

const processCached = (text: string) => {
  const result = cache.get(text) ?? processor.process(text)
  cache.delete(text)
  cache.set(text, result)
  const oldest = cache.keys().next()
  if (cache.size > CACHE_LIMIT && !oldest.done) {
    cache.delete(oldest.value)
  }
  return result
}

function Renderer({ text }: { text: string }) {
  return use(processCached(text))
}
