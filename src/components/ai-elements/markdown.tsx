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

const processor = remark().use(remarkGfm).use(remarkRehype).use(rehypeWrapWords)

async function processMarkdown(content: string): Promise<ReactNode> {
  const hast = await processor.run(processor.parse({ value: content }))

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

const cache = new Map<string, Promise<ReactNode>>()

export function Markdown({ text }: { text: string }) {
  const deferredText = useDeferredValue(text)

  return (
    <Suspense
      fallback={<p className='invisible whitespace-pre-line'>{text}</p>}
    >
      <Renderer text={deferredText} />
    </Suspense>
  )
}

const processCached = (text: string) => {
  const result = cache.get(text) ?? processMarkdown(text)
  cache.delete(text)
  cache.set(text, result)
  const oldest = cache.keys().next()
  if (cache.size > 200 && !oldest.done) {
    cache.delete(oldest.value)
  }
  return result
}

function Renderer({ text }: { text: string }) {
  return use(processCached(text))
}
