import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier'
import { visit } from 'unist-util-visit'
import { readerLadderText } from '../../components/content/mdx/reader-ladder/data'

// Live demos (DemoCard, Compare, ReaderLadder, ZenixDemo) are pure UI, so the processed Markdown that
// feeds llms.txt, the .md routes and Simba would otherwise get their raw JSX.
// This swaps each one for plain Markdown saying what the demo shows. A <Term>
// (a word with a definition card) reads as just its word, like on the page.

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
      } else if (element.name === 'ReaderLadder') {
        replaceSource(file, node, readerLadderText())
      } else if (element.name === 'ZenixDemo') {
        replaceSource(
          file,
          node,
          paragraphs(
            'An interactive demo of Zenix in a mock Discord channel. Send a message and his reply arrives as a few short messages, each after a random 5 to 15 second pause and a typing indicator, with the full stop at the end dropped. A second tab shows that pings, DMs and keywords always get a reply, while anything else only does when a small model rates it above 50%.',
            stringAttributes(element).caption
          )
        )
      } else if (element.name === 'DemoCard') {
        // Whatever the card wraps keeps its own text, the caption follows it
        const { caption } = stringAttributes(element)
        replaceSource(file, node, (s) => paragraphs(s.inner(node), caption))
      }
    })

    visit(tree, 'mdxJsxTextElement', (node: Node) => {
      if ((node as unknown as JsxElement).name === 'Term') {
        replaceSource(file, node, (s) => s.inner(node))
      }
    })
  }
}
