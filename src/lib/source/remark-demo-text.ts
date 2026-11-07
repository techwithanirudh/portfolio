import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier'
import { visit } from 'unist-util-visit'

// Live demos (DemoCard, Compare) are pure UI, so the processed Markdown that
// feeds llms.txt, the .md routes and Simba would otherwise get their raw JSX.
// This swaps each one for plain Markdown saying what the demo shows.

// Borrowed from fumadocs' own signature, so we don't pull in mdast and vfile
// just for their types
type File = Parameters<typeof replaceSource>[0]
type Node = Parameters<typeof replaceSource>[1]

interface JsxElement {
  attributes: { name?: string; type: string; value?: unknown }[]
  name: string | null
}

const stringAttributes = ({ attributes }: JsxElement) =>
  Object.fromEntries(
    attributes.flatMap((attribute) =>
      attribute.type === 'mdxJsxAttribute' &&
      attribute.name &&
      typeof attribute.value === 'string'
        ? [[attribute.name, attribute.value]]
        : []
    )
  ) as Record<string, string | undefined>

const image = (alt = '', src = '') => `![${alt}](${src})`

const paragraphs = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).join('\n\n')

export function remarkDemoText() {
  return (tree: Node, file: File) => {
    visit(tree, 'mdxJsxFlowElement', (node: Node) => {
      const element = node as unknown as JsxElement

      if (element.name === 'Compare') {
        const a = stringAttributes(element)
        replaceSource(
          file,
          node,
          paragraphs(
            `Before and after screenshots of ${a.label ?? 'the same page'}:`,
            `- ${a.beforeLabel ?? 'Before'}: ${image(a.beforeAlt, a.beforeSrc)}\n- ${a.afterLabel ?? 'After'}: ${image(a.afterAlt, a.afterSrc)}`,
            a.caption
          )
        )
      } else if (element.name === 'DemoCard') {
        // Whatever the card wraps keeps its own text, the caption follows it
        const { caption } = stringAttributes(element)
        replaceSource(file, node, (s) => paragraphs(s.inner(node), caption))
      }
    })
  }
}
