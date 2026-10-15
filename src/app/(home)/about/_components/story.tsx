import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { ViewAnimation } from '@/components/view-animation'

const chapters = [
  {
    body: [
      'It started with Lego. I built, broke and rebuilt whatever I could think of, and the rebuilding was always the fun part.',
    ],
    title: 'Lego first',
  },
  {
    body: [
      "Lego turned into code. I moved from robots and gadgets to websites and apps, and I'm self-taught the whole way, mostly by shipping things and fixing the bugs that taught me more than any tutorial did.",
    ],
    title: 'Then code',
  },
  {
    body: [
      "These days I'm a student, a design engineer, and an intern at QuiverAI, where we turn prompts into SVGs you can actually edit and animate. I care about the small details most people never notice but always feel.",
    ],
    title: 'These days',
  },
  {
    body: [
      "Away from the keyboard there's Simba, a very good dog and the one answering questions in the corner of this site.",
    ],
    title: 'Off the keyboard',
  },
]

export default function Story(): React.ReactElement {
  return (
    <SplitSection>
      <SplitSectionSidebar>
        <SplitSectionHeader
          description='How I got here, and what I do when I am not here.'
          sticky
          title='Story'
        />
      </SplitSectionSidebar>
      <SplitSectionContent>
        <div className='divide-y divide-line'>
          {chapters.map((chapter, index) => (
            <ViewAnimation
              className='space-y-2 p-4'
              delay={0.05 * index}
              key={chapter.title}
            >
              <h3 className='font-medium font-mono text-sm tracking-tight'>
                {chapter.title}
              </h3>
              {chapter.body.map((paragraph) => (
                <p
                  className='text-pretty text-lg text-muted-foreground'
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </ViewAnimation>
          ))}
        </div>
      </SplitSectionContent>
    </SplitSection>
  )
}
