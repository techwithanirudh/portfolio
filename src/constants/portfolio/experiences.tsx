import { Icons } from '@/components/icons/icons'
import type { ExperienceItemType } from '@/types/experience'

export const experiences: ExperienceItemType[] = [
  {
    id: 'energent',
    companyName: 'Energent.ai',
    companyWebsite: 'https://energent.ai',
    companyLogo: '/images/companies/energent.png',
    positions: [
      {
        id: '1',
        title: 'Software Engineering Intern',
        employmentPeriod: { start: '09.2025', end: '12.2025' },
        employmentType: 'Internship',
        icon: <Icons.codeXml />,
        description:
          "Worked on the frontend and microservices of Energent.ai's AI data analysis platform.",
        skills: ['TypeScript', 'React', 'Next.js', 'Node.js'],
        isExpanded: true,
      },
    ],
  },
  {
    id: 'meetingbaas',
    companyName: 'MeetingBaaS',
    companyWebsite: 'https://www.meetingbaas.com/en',
    companyLogo: '/images/companies/meetingbaas.png',
    positions: [
      {
        id: '1',
        title: 'Full Stack Developer',
        employmentPeriod: { start: '10.2024', end: '05.2025' },
        employmentType: 'Freelance',
        icon: <Icons.codeXml />,
        description:
          'Built [Transcript Seeker](/work/transcript_seeker) and [Speaking Meeting Bot](/work/speaking_meeting_bot), plus the AI chat and MCP tooling around the MeetingBaaS meeting APIs.',
        skills: ['TypeScript', 'React', 'Next.js', 'Python', 'Drizzle', 'MCP'],
        isExpanded: true,
      },
    ],
  },
  {
    id: 'bosch',
    companyLogo: '/images/companies/bosch.png',
    companyName: 'Bosch',
    companyWebsite: 'https://www.bosch-softwaretechnologies.com/en/',
    positions: [
      {
        id: '1',
        title: 'Research Collaboration',
        employmentPeriod: { start: '04.2022', end: '05.2022' },
        employmentType: 'Contract',
        icon: <Icons.flask />,
        description:
          'Co-authored a research paper on privacy challenges for autonomous vehicles.',
        skills: ['Research', 'Autonomous Vehicles', 'Privacy Engineering'],
      },
    ],
  },
  {
    id: 'personal',
    companyName: 'Personal Projects',
    positions: [
      {
        id: '4',
        title: 'Full Stack Developer',
        employmentPeriod: { start: '2021' },
        employmentType: 'Part-time',
        icon: <Icons.globe />,
        description:
          'Built Coolify Tweaks, Shadcn SaaS Landing, and various open-source projects.',
        skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL'],
        isExpanded: true,
      },
      {
        id: '3',
        title: 'Web / PowerApps Developer',
        employmentPeriod: { start: '2020', end: '2021' },
        employmentType: 'Part-time',
        icon: <Icons.codeXml />,
        description:
          'Shipped a Product Hunt launch, built PowerApps solutions, and published Maskio on GitHub Game Jam.',
        skills: ['PowerApps', 'JavaScript', 'React', 'SharePoint'],
      },
      {
        id: '2',
        title: 'Python & AI Developer',
        employmentPeriod: { start: '2019', end: '2020' },
        employmentType: 'Part-time',
        icon: <Icons.bot />,
        description:
          'Built early AI experiments with Keras, OpenCV, and TensorFlow.',
        skills: ['Python', 'Keras', 'OpenCV', 'TensorFlow'],
      },
      {
        id: '1',
        title: 'Robotics Programmer',
        employmentPeriod: { start: '2018', end: '2019' },
        employmentType: 'Part-time',
        icon: <Icons.cpu />,
        description:
          'Created robotics experiments including Snake, Vernie, Humanoid Robot, and Gripper using Mindstorms / Lego Boost.',
        skills: ['Mindstorms', 'Lego Boost', 'Python'],
      },
    ],
    isCurrentEmployer: true,
  },
]
