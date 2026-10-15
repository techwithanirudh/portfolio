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
      'It started with tinkering. Arduino sketches, the Atal Tinkering Lab at school, and competitions like ATL Tinkerpreneur, Bosch and HCL Jigsaw. I also ran a game server, which taught me more about keeping things alive than any class did.',
    ],
    title: 'Tinkering first',
  },
  {
    body: [
      'My oldest repo is Gork, a Discord bot from August 2022 that tries a little too hard to talk like a human. It grew up into Gorkie for Slack, sandboxes and all, and somewhere along the way I stopped calling it a hobby.',
    ],
    title: 'Then code',
  },
  {
    body: [
      "Lately that's Depensa, a finance app I've pushed around 1,500 commits into since March. In between I take side quests, like a Swift app that bridges my TV remote over HDMI-CEC, or restyling Proxmox because the default UI bugged me.",
    ],
    title: 'Shipping things',
  },
  {
    body: [
      "These days I'm a student, a design engineer, and an intern at QuiverAI, where we turn prompts into SVGs you can actually edit and animate. I care about the small details most people never notice but always feel.",
    ],
    title: 'These days',
  },
  {
    body: [
      "Away from the keyboard there's Simba, a very good dog and the one answering questions in the corner of this site. There's also a home lab that's always half rebuilt, a 3D printer, and a microwave mug cake recipe I will defend.",
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
