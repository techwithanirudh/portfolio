import { Icons } from '@/components/icons/icons'
import type { ExperienceItemType } from '@/types/experience'

export const experiences: ExperienceItemType[] = [
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
          'Built [Transcript Seeker](/work/transcript_seeker) and [Speaking Meeting Bot](/work/speaking_meeting_bot), plus the AI chat and MCP tooling around the MeetingBaaS meeting APIs.',
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
          'Co-authored a research paper on privacy challenges for autonomous vehicles.',
        employmentPeriod: { end: '05.2022', start: '04.2022' },
        employmentType: 'Contract',
        icon: <Icons.flask />,
        id: '1',
        skills: ['Research', 'Autonomous Vehicles', 'Privacy Engineering'],
        title: 'Research Collaboration',
      },
    ],
  },
  {
    companyName: 'Personal Projects',
    id: 'personal',
    isCurrentEmployer: true,
    positions: [
      {
        description:
          'Built Coolify Tweaks, Shadcn SaaS Landing, and various open-source projects.',
        employmentPeriod: { start: '2021' },
        employmentType: 'Part-time',
        icon: <Icons.globe />,
        id: '4',
        isExpanded: true,
        skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL'],
        title: 'Full Stack Developer',
      },
      {
        description:
          'Shipped a Product Hunt launch, built PowerApps solutions, and published Maskio on GitHub Game Jam.',
        employmentPeriod: { end: '2021', start: '2020' },
        employmentType: 'Part-time',
        icon: <Icons.codeXml />,
        id: '3',
        skills: ['PowerApps', 'JavaScript', 'React', 'SharePoint'],
        title: 'Web / PowerApps Developer',
      },
      {
        description:
          'Built early AI experiments with Keras, OpenCV, and TensorFlow.',
        employmentPeriod: { end: '2020', start: '2019' },
        employmentType: 'Part-time',
        icon: <Icons.bot />,
        id: '2',
        skills: ['Python', 'Keras', 'OpenCV', 'TensorFlow'],
        title: 'Python & AI Developer',
      },
      {
        description:
          'Created robotics experiments including Snake, Vernie, Humanoid Robot, and Gripper using Mindstorms / Lego Boost.',
        employmentPeriod: { end: '2019', start: '2018' },
        employmentType: 'Part-time',
        icon: <Icons.cpu />,
        id: '1',
        skills: ['Mindstorms', 'Lego Boost', 'Python'],
        title: 'Robotics Programmer',
      },
    ],
  },
]
