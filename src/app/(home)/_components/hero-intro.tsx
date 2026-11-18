import { InlineMarkdown } from '@/components/inline-markdown'
import { heroIntro, heroIntroShort } from '@/constants/portfolio/intro'

/** Phones read the short intro and `sm` and up the full one. `display: none` keeps the other out of the accessibility tree */
export const HeroIntro = () => (
  <p className='max-w-[52ch] text-pretty text-base text-foreground/85 leading-relaxed sm:text-[1.09rem]'>
    <span className='sm:hidden'>
      <InlineMarkdown linkClassName='link-underline' text={heroIntroShort} />
    </span>
    <span className='max-sm:hidden'>
      <InlineMarkdown linkClassName='link-underline' text={heroIntro} />
    </span>
  </p>
)
