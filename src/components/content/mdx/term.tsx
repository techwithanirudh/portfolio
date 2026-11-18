import { Children, isValidElement, type ReactNode } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  type GlossaryEntry,
  getGlossaryEntry,
  toGlossaryId,
} from '@/constants/glossary'

interface TermProps {
  children: ReactNode
  /** Overrides the glossary, or stands in when the word isn't in it */
  def?: string
  /** Glossary key, worked out from the word itself when left out */
  id?: string
}

// MDX hands us the word as a string most of the time, but `<Term>**MCP**</Term>`
// would wrap it in an element, so dig the text out of either
const textOf = (node: ReactNode): string =>
  Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child)
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textOf(child.props.children)
      }
      return ''
    })
    .join('')

/**
 * A dictionary-style word: dotted underline in the prose, and a small card
 * with the definition on hover (mouse) or tap (touch).
 */
export function Term({ children, def, id }: TermProps) {
  const word = textOf(children)
  const key = id ?? toGlossaryId(word)
  const entry = getGlossaryEntry(key)
  const definition = def ?? entry?.definition

  // Better to break the build than ship an underline that opens nothing
  if (!definition) {
    throw new Error(
      `<Term> "${word}" has no glossary entry for "${key}" and no def`
    )
  }

  return (
    <Popover>
      <PopoverTrigger
        className='cursor-help rounded-[3px] py-1 underline decoration-from-font decoration-muted-foreground/70 decoration-dotted underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-offset-1 data-popup-open:decoration-foreground'
        closeDelay={120}
        delay={150}
        nativeButton={false}
        openOnHover
        render={<span />}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className='not-prose w-max max-w-[min(18rem,calc(100vw-2rem))] gap-1 p-3'
        sideOffset={6}
      >
        <PopoverTitle className='font-semibold text-sm'>
          {entry?.term ?? word}
        </PopoverTitle>
        <Details entry={entry} />
        <PopoverDescription className='text-foreground/80 text-sm leading-snug'>
          {definition}
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}

// The small "noun · dee-mun · short for ..." line under the word
function Details({ entry }: { entry?: GlossaryEntry }) {
  const parts = [
    entry?.kind,
    entry?.pronunciation && `/${entry.pronunciation}/`,
    entry?.expansion && `short for ${entry.expansion}`,
  ].filter(Boolean)

  if (parts.length === 0) {
    return null
  }

  return (
    <p className='text-muted-foreground text-xs italic'>{parts.join(' · ')}</p>
  )
}
