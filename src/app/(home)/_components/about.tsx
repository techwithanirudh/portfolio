import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { AskDog } from './ask-dog'

export default function About() {
  return (
    <Section id='about'>
      <SectionHeader title='About' />
      <div className='space-y-3 text-pretty p-4 text-muted-foreground leading-relaxed'>
        <p>
          I design websites and write the code behind them. Self-taught, I
          started with Lego, moved to robots, and now ship AI products with
          Next.js, React, and TypeScript.
        </p>
        <p>
          The dog in the corner is Simba. He has read everything on this site,
          so you can <AskDog /> anything about me.
        </p>
      </div>
    </Section>
  )
}
