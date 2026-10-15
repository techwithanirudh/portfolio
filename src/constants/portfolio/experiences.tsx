import { Icons } from '@/components/icons/icons'
import type { ExperienceItemType } from '@/types/experience'

export const experiences: ExperienceItemType[] = [
  {
    companyLogo: '/images/companies/quiverai.png',
    companyName: 'QuiverAI',
    companyWebsite: 'https://quiver.ai',
    id: 'quiverai',
    isCurrentEmployer: true,
    positions: [
      {
        description:
          'Working at QuiverAI, a platform for generating, editing, and animating SVG graphics with AI.',
        employmentPeriod: { start: '08.2026' },
        employmentType: 'Internship',
        icon: <Icons.codeXml />,
        id: '1',
        isExpanded: true,
        skills: ['TypeScript', 'React', 'Next.js', 'Node.js'],
        title: 'Software Engineering Intern',
      },
    ],
  },
  {
    companyLogo: '/images/companies/energent.png',
    companyName: 'Energent.ai',
    companyWebsite: 'https://energent.ai',
    id: 'energent',
    positions: [
      {
        description:
          "Worked on the frontend and microservices of Energent.ai's AI data analysis platform.",
        employmentPeriod: { end: '12.2025', start: '09.2025' },
        employmentType: 'Internship',
        icon: <Icons.codeXml />,
        id: '1',
        isExpanded: true,
        skills: ['TypeScript', 'React', 'Next.js', 'Node.js'],
        title: 'Software Engineering Intern',
      },
    ],
  },
  {
    companyLogo: '/images/companies/meetingbaas.png',
    companyName: 'MeetingBaaS',
    companyWebsite: 'https://www.meetingbaas.com/en',
    id: 'meetingbaas',
    positions: [
      {
        description:
          'Built [Transcript Seeker](/projects/transcript_seeker) and [Speaking Meeting Bot](/projects/speaking_meeting_bot), plus the AI chat and MCP tooling around the MeetingBaaS meeting APIs.',
        employmentPeriod: { end: '05.2025', start: '10.2024' },
        employmentType: 'Freelance',
        icon: <Icons.codeXml />,
        id: '1',
        isExpanded: true,
        skills: ['TypeScript', 'React', 'Next.js', 'Python', 'Drizzle', 'MCP'],
        title: 'Full Stack Developer',
      },
    ],
  },
  {
    companyLogo: '/images/companies/bosch.png',
    companyName: 'Bosch',
    companyWebsite: 'https://www.bosch-softwaretechnologies.com/en/',
    id: 'bosch',
    positions: [
      {
        description:
          'Co-authored a research paper on [privacy challenges for autonomous vehicles](https://osf.io/preprints/osf/mtfpy_v1).',
        employmentPeriod: { end: '05.2022', start: '04.2022' },
        icon: <Icons.flask />,
        id: '1',
        isExpanded: true,
        skills: ['Research', 'Autonomous Vehicles', 'Privacy Engineering'],
        title: 'Research Collaboration',
      },
    ],
  },
]
