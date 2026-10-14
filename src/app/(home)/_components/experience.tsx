import Link from 'next/link'
import { WorkExperience } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import {
  Panel,
  PanelAction,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from '@/components/layout/panel'
import { experiences } from '@/constants/portfolio/experiences'

const previewCount = 3

export default function ExperiencePreview() {
  return (
    <Panel id='experience'>
      <PanelHeader>
        <PanelTitle>experience</PanelTitle>
        <PanelTitleSup>({experiences.length})</PanelTitleSup>
        <PanelAction>
          <Link
            className='transition-colors hover:text-foreground'
            href='/about#experience'
          >
            view_all
            <Icons.arrowRight className='icon-arrow-button ml-1 inline size-3' />
          </Link>
        </PanelAction>
      </PanelHeader>
      <WorkExperience experiences={experiences.slice(0, previewCount)} />
    </Panel>
  )
}
