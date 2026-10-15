import type { PoseName } from '@/components/features/assistant/mascot/constants'
import { SimbaRig } from '@/components/features/assistant/mascot/rig'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

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
    snapshots: true,
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

const snapshots: { caption: string; pose: PoseName; tilt: string }[] = [
  { caption: 'Curious', pose: 'curious', tilt: '-rotate-3' },
  { caption: 'Treats?', pose: 'pleased', tilt: 'rotate-2' },
  { caption: 'Full speed', pose: 'playful', tilt: '-rotate-2' },
]

const Snapshots = () => (
  <div className='grid grid-cols-3 gap-3 py-2 sm:gap-6'>
    {snapshots.map(({ caption, pose, tilt }) => (
      <figure
        className={cn(
          'flex flex-col items-center gap-2 border border-line bg-card p-2 pb-3 shadow-sm transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]',
          tilt
        )}
        key={caption}
      >
        <div className='flex aspect-square w-full items-end justify-center overflow-hidden bg-background'>
          <SimbaRig className='h-[90%] w-auto' pose={pose} />
        </div>
        <figcaption className='font-mono text-muted-foreground text-xs'>
          {caption}
        </figcaption>
      </figure>
    ))}
  </div>
)

export default function Story(): React.ReactElement {
  return (
    <Section>
      <SectionHeader
        description='A quick intro about me and what I love to do.'
        title='Story'
      />
      <div className='mx-auto flex max-w-2xl flex-col gap-12 px-4 py-10'>
        {chapters.map((chapter) => (
          <ViewAnimation key={chapter.title}>
            <h3 className='border-line border-b pb-3 font-medium text-foreground text-lg tracking-tight'>
              {chapter.title}
            </h3>
            <div className='mt-4 space-y-4 text-base/7 text-muted-foreground'>
              {chapter.body.map((paragraph) => (
                <p className='text-pretty' key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {chapter.snapshots ? <Snapshots /> : null}
            </div>
          </ViewAnimation>
        ))}
      </div>
    </Section>
  )
}
