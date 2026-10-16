import { Fragment } from 'react'
import { RuledGrid } from '@/components/layout/ruled-grid'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'

const chapters = [
  {
    body: [
      'It started with Lego. I built, broke and rebuilt whatever I could think of, and the rebuilding was always the fun part.',
      'Somewhere along the way the bricks turned into code, and I never really stopped taking things apart to see how they work.',
    ],
    title: 'Where it started',
  },
  {
    body: [
      "I'm self-taught the whole way. Websites came first, then apps, bots and whatever tool I wished existed that week.",
      'Most of what I know came from shipping things and fixing the bugs they shipped with. Those taught me more than any tutorial did.',
    ],
    title: 'Finding my way to the web',
  },
  {
    body: [
      "Away from the keyboard there's Simba, a very good dog and the one answering questions in the corner of this site.",
    ],
    title: 'Life beyond code',
  },
  {
    body: [
      "These days I'm a student, a design engineer, and an intern at QuiverAI, where we turn prompts into SVGs you can actually edit and animate.",
      'I care about the small details most people never notice but always feel.',
    ],
    title: 'These days',
  },
]

export default function Story(): React.ReactElement {
  return (
    <Section>
      <SectionHeader
        description='A quick intro about me and what I love to do.'
        title='Story'
      />
      <RuledGrid className='grid-cols-1 sm:grid-cols-[13rem_1fr]'>
        {chapters.map((chapter, index) => (
          <Fragment key={chapter.title}>
            <div className='bg-background px-4 pt-4 pb-2 max-sm:border-b-0! sm:pb-4'>
              <div className='flex gap-3 sm:sticky sm:top-20 sm:flex-col sm:gap-1'>
                <span className='font-mono text-muted-foreground text-xs tabular-nums'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className='font-medium text-sm tracking-tight'>
                  {chapter.title}
                </h3>
              </div>
            </div>
            <ViewAnimation
              className='space-y-3 text-pretty bg-background px-4 pt-2 pb-4 text-muted-foreground sm:pt-4'
              delay={0.05 * index}
            >
              {chapter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </ViewAnimation>
          </Fragment>
        ))}
      </RuledGrid>
    </Section>
  )
}
