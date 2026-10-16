import type React from 'react'
import { Section } from '@/components/layout/sections'
import { ViewAnimation } from '@/components/view-animation'

// Title on top, the one line intro under a dashed rule, like the home hero
// without the extras
export default function Hero(): React.ReactElement {
  return (
    <Section>
      <ViewAnimation className='px-6 pt-16 pb-8 sm:pt-20'>
        <h1 className='text-balance font-medium text-[2.4rem] leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]'>
          About<span className='text-primary'>.</span>
        </h1>
      </ViewAnimation>
      <ViewAnimation className='divider-top-dashed px-6 py-8' delay={0.1}>
        <p className='max-w-[60ch] text-pretty text-base text-foreground/85 leading-relaxed sm:text-[1.09rem]'>
          I'm Anirudh, a design engineer and full-stack developer. I design
          websites and write the code behind them, and lately that means AI
          products built with Next.js, React and TypeScript.
        </p>
      </ViewAnimation>
    </Section>
  )
}
