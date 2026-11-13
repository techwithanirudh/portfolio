'use client'

import { useId, useState } from 'react'
import { InlineMarkdown } from '@/components/inline-markdown'
import { heroIntro, heroIntroShort } from '@/constants/portfolio/intro'

/** Phones open on the short intro with a "More" toggle; `sm` and up always read the full one */
export const HeroIntro = () => {
  const [expanded, setExpanded] = useState(false)
  const id = useId()

  return (
    <>
      <p
        className='max-w-[52ch] text-pretty text-base text-foreground/85 leading-relaxed sm:text-[1.09rem]'
        id={id}
      >
        {expanded ? (
          <InlineMarkdown linkClassName='link-underline' text={heroIntro} />
        ) : (
          <>
            {/* Collapsed, phones get the short copy and `sm` and up the full one; display: none keeps the other out of the accessibility tree */}
            <span className='sm:hidden'>
              <InlineMarkdown
                linkClassName='link-underline'
                text={heroIntroShort}
              />
            </span>
            <span className='max-sm:hidden'>
              <InlineMarkdown linkClassName='link-underline' text={heroIntro} />
            </span>
          </>
        )}
      </p>
      <button
        aria-controls={id}
        aria-expanded={expanded}
        className='-my-1 -ml-2 h-10 rounded-md px-2 text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground active:text-foreground sm:hidden'
        onClick={() => setExpanded((open) => !open)}
        type='button'
      >
        {expanded ? 'Show less' : 'More'}
      </button>
    </>
  )
}
